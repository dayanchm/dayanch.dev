---
title: "Events"
author: "dayanch"
createdAt: "2026-07-17T00:00:00.000Z"
description: "Understand Laravel events and listeners step by step through a practical payment completion example, with links to the official sources."
category: "laravel"
---

Laravel Events allow one part of an application to announce that something happened without deciding everything that should happen next.

For example, when a payment is completed, the payment service should not also be responsible for sending an email, writing an audit log, updating statistics, and notifying an administrator. It should announce one fact: **the payment was completed**. Other classes can listen for that announcement and perform their own tasks.

Laravel implements this idea with two main pieces:

- **Event:** describes what happened and carries the related data
- **Listener:** performs an action after that event occurs

---

### Why Use Events?

Without events, a checkout service may look like this:

```php
public function complete(Payment $payment): void
{
    $payment->update(['status' => 'completed']);

    Mail::to($payment->user)->send(new PaymentReceipt($payment));
    Log::info('Payment completed', ['payment_id' => $payment->id]);
    $this->statistics->recordPayment($payment);
}
```

This method has several responsibilities. Every new action makes the payment service larger and more difficult to change.

With events, the payment service only completes the payment and dispatches an event:

```php
public function complete(Payment $payment): void
{
    $payment->update(['status' => 'completed']);

    PaymentCompleted::dispatch($payment);
}
```

Email, logging, and statistics can now be handled by separate listeners. The payment service no longer needs to know those classes exist.

---

### The Event Flow

The complete flow looks like this:

```text
Payment is completed
        ↓
PaymentCompleted event is dispatched
        ↓
Laravel finds the listeners
        ↓
SendPaymentReceipt listener runs
        ↓
The customer receives an email
```

One event may have multiple independent listeners:

```text
PaymentCompleted
    ├── SendPaymentReceipt
    ├── WritePaymentAuditLog
    └── UpdatePaymentStatistics
```

Adding another listener does not require changing the event or the payment service.

---

### Generate the Event and Listener

Laravel can create both classes with Artisan commands:

```bash
php artisan make:event PaymentCompleted
php artisan make:listener SendPaymentReceipt --event=PaymentCompleted
```

The event is created in `app/Events`, and the listener is created in `app/Listeners`.

---

### Create the PaymentCompleted Event

An event class is mainly a data container. It carries the information listeners need.

```php
<?php

namespace App\Events;

use App\Models\Payment;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaymentCompleted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Payment $payment,
    ) {}
}
```

The event does not send an email or update another record. It only says that a payment was completed and exposes the related `Payment` model through `$payment`.

The `Dispatchable` trait allows the event to be dispatched with `PaymentCompleted::dispatch(...)`. The `SerializesModels` trait helps Laravel serialize Eloquent models when the event is used with queued listeners.

---

### Create the SendPaymentReceipt Listener

The listener receives the event in its `handle` method and performs one clear action.

```php
<?php

namespace App\Listeners;

use App\Events\PaymentCompleted;
use App\Mail\PaymentReceipt;
use Illuminate\Support\Facades\Mail;

class SendPaymentReceipt
{
    public function handle(PaymentCompleted $event): void
    {
        Mail::to($event->payment->user->email)->send(
            new PaymentReceipt($event->payment),
        );
    }
}
```

Laravel sees the `PaymentCompleted` type in the `handle` method and knows that this listener belongs to that event. Current Laravel applications automatically discover listeners inside the `app/Listeners` directory by default.

You can inspect all registered events and listeners with:

```bash
php artisan event:list
```

---

### Dispatch the Event

Dispatch the event only after the payment has successfully completed.

```php
<?php

namespace App\Services\Payments;

use App\Events\PaymentCompleted;
use App\Models\Payment;

class CompletePayment
{
    public function handle(Payment $payment): void
    {
        $payment->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        PaymentCompleted::dispatch($payment);
    }
}
```

Laravel creates the event object and sends it to every registered listener. The service does not call `SendPaymentReceipt` directly.

You can also dispatch an event with the `event` helper:

```php
event(new PaymentCompleted($payment));
```

Both approaches dispatch the same event.

---

### Run Slow Listeners in a Queue

Sending email or calling an external API may slow down the HTTP response. A listener can implement `ShouldQueue` so Laravel processes it through the queue.

```php
<?php

namespace App\Listeners;

use App\Events\PaymentCompleted;
use App\Mail\PaymentReceipt;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendPaymentReceipt implements ShouldQueue
{
    public function handle(PaymentCompleted $event): void
    {
        Mail::to($event->payment->user->email)->send(
            new PaymentReceipt($event->payment),
        );
    }
}
```

Laravel now places this listener on the configured queue instead of making the customer wait for the email to be sent. A queue worker must be running to process it:

```bash
php artisan queue:work
```

Use queued listeners for slow side effects. Logic required to finish the payment successfully should remain in the main payment flow.

---

### Events and Database Transactions

A listener should not run for data that may still be rolled back. If the event is dispatched inside a database transaction, the event can implement `ShouldDispatchAfterCommit`.

```php
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

class PaymentCompleted implements ShouldDispatchAfterCommit
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Payment $payment,
    ) {}
}
```

Laravel will wait until the active transaction commits before dispatching the event. If the transaction fails and rolls back, the event is discarded. This prevents a receipt from being sent for a payment that was not actually saved.

---

### Test That the Event Was Dispatched

`Event::fake()` prevents listeners from running during the test and lets us verify that the expected event was dispatched.

```php
<?php

use App\Events\PaymentCompleted;
use App\Models\Payment;
use App\Services\Payments\CompletePayment;
use Illuminate\Support\Facades\Event;

test('it dispatches an event after completing a payment', function () {
    Event::fake([PaymentCompleted::class]);

    $payment = Payment::factory()->create([
        'status' => 'pending',
    ]);

    app(CompletePayment::class)->handle($payment);

    Event::assertDispatched(
        PaymentCompleted::class,
        fn (PaymentCompleted $event) =>
            $event->payment->is($payment),
    );
});
```

This test checks the responsibility of `CompletePayment`: after completing the payment, it must announce `PaymentCompleted`. The email listener can be tested separately.

---

### When Should You Use an Event?

An event is a good choice when:

- Something meaningful has already happened
- Multiple independent actions may respond to it
- The main service should not know about every side effect
- A slow action should run through a queued listener

Useful event names describe facts in the past tense:

- `PaymentCompleted`
- `OrderShipped`
- `UserRegistered`
- `InvoiceGenerated`

Avoid using an event to hide the main business operation. If an action must succeed before a payment is considered complete, call that action explicitly. Events are most useful for reactions and side effects that follow a completed operation.

---

### Summary

Laravel Events separate an important occurrence from the actions that respond to it. The event carries data, listeners react to it, and the dispatcher connects them.

For our payment example:

1. `CompletePayment` changes the payment status
2. `PaymentCompleted` announces what happened
3. `SendPaymentReceipt` receives the event
4. The listener sends the email, optionally through a queue

This structure keeps the payment workflow focused and makes new reactions easier to add without changing the original service.

---

### Sources

This article was prepared using Laravel's official documentation:

- [Laravel 13.x Events documentation](https://laravel.com/docs/13.x/events)
- [Defining events and listeners](https://laravel.com/docs/13.x/events#defining-events)
- [Queued event listeners](https://laravel.com/docs/13.x/events#queued-event-listeners)
- [Dispatching events after database transactions](https://laravel.com/docs/13.x/events#dispatching-events-after-database-transactions)
- [Testing events](https://laravel.com/docs/13.x/events#testing)
- [Laravel 13.x Queues documentation](https://laravel.com/docs/13.x/queues)
