---
title: "bind"
author: "dayanch"
createdAt: "2026-07-17T00:00:00.000Z"
description: "Learn Laravel's bind method through a practical PaymentMethod example."
category: "laravel"
---

Laravel's `bind` method tells the service container which class it should create when an interface is requested. We can understand this clearly through a payment example.

Imagine that our checkout system depends on a `PaymentMethod` interface. The controller does not need to know which payment provider is used. Laravel chooses the correct class through the binding.

---

### Create the PaymentMethod Interface

First, create a contract for every payment method in the application.

```php
<?php

namespace App\Contracts;

interface PaymentMethod
{
    public function pay(int $amount): string;
}
```

Every payment class must implement the `pay` method.

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

### Bind PaymentMethod to StripePaymentMethod

Laravel cannot automatically know which class should be used for the `PaymentMethod` interface. We define that relationship with `bind` inside `AppServiceProvider`.

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
        $this->app->bind(
            PaymentMethod::class,
            StripePaymentMethod::class,
        );
    }
}
```

This binding means: whenever the application requests `PaymentMethod`, create and return a new `StripePaymentMethod`.

---

### Inject PaymentMethod into the Controller

The controller can now depend directly on the interface.

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

When Laravel creates `CheckoutController`, it sees the `PaymentMethod` dependency. It checks the binding and injects a new `StripePaymentMethod` object.

The flow is:

```text
CheckoutController
        ↓ requests
PaymentMethod
        ↓ bind resolves
StripePaymentMethod
```

The controller only knows the `PaymentMethod` contract. The relationship between the interface and the Stripe class is managed by Laravel's `bind` method.
