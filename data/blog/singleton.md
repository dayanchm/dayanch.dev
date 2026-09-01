---
title: "singleton"
author: "dayanch"
createdAt: "2026-07-17T00:00:00.000Z"
description: "Learn Laravel's singleton method through a practical PaymentMethod example."
category: "laravel"
---

Laravel's `singleton` method tells the service container to create a service only once and return the same object every time that service is requested during the application's lifecycle.

We can understand `singleton` through a payment example. Our checkout system depends on a `PaymentMethod` interface, and Laravel provides the same `StripePaymentMethod` object whenever that interface is requested.

---

### Create the PaymentMethod Interface

First, create a contract for the payment method.

```php
<?php

namespace App\Contracts;

interface PaymentMethod
{
    public function pay(int $amount): string;
}
```

Every payment method must implement the `pay` method.

---

### Create the Stripe Payment Method

Now create a Stripe implementation of the interface.

```php
<?php

namespace App\Services\Payments;

use App\Contracts\PaymentMethod;

class StripePaymentMethod implements PaymentMethod
{
    public function pay(int $amount): string
    {
        return "Payment of {$amount} cents completed with Stripe.";
    }
}
```

`StripePaymentMethod` follows the rules defined by the `PaymentMethod` interface.

---

### Register PaymentMethod as a Singleton

Laravel cannot automatically know which class should be used for the `PaymentMethod` interface. Register it with `singleton` inside `AppServiceProvider`.

```php
<?php

namespace App\Providers;

use App\Contracts\PaymentMethod;
use App\Services\Payments\StripePaymentMethod;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(
            PaymentMethod::class,
            StripePaymentMethod::class,
        );
    }
}
```

The first time `PaymentMethod` is requested, Laravel creates a `StripePaymentMethod` object. Every request for `PaymentMethod` after that returns the same object.

---

### Inject PaymentMethod into the Controller

The controller can depend directly on the interface.

```php
<?php

namespace App\Http\Controllers;

use App\Contracts\PaymentMethod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function __construct(
        private readonly PaymentMethod $paymentMethod,
    ) {}

    public function store(Request $request): JsonResponse
    {
        $message = $this->paymentMethod->pay(
            amount: (int) $request->integer('amount'),
        );

        return response()->json([
            'message' => $message,
        ]);
    }
}
```

When Laravel creates `CheckoutController`, it resolves `PaymentMethod` and injects the shared `StripePaymentMethod` object.

---

### The Same Object Is Returned

We can resolve `PaymentMethod` twice to see how `singleton` behaves.

```php
$firstPaymentMethod = app(PaymentMethod::class);
$secondPaymentMethod = app(PaymentMethod::class);

dump($firstPaymentMethod === $secondPaymentMethod); // true
```

Both variables reference the same `StripePaymentMethod` object because the service was registered with `singleton`.

The flow is:

```text
First PaymentMethod request
        ↓ creates
StripePaymentMethod object
        ↓ reused for
Every next PaymentMethod request
```

Use `singleton` when one shared instance of a service should be reused throughout the application's lifecycle.
