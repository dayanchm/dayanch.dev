---
title: "AppServiceProvider"
author: "dayanch"
createdAt: "2026-07-17T00:00:00.000Z"
description: "Learn what Laravel's AppServiceProvider does and how to use its register and boot methods through a practical payment example."
category: "laravel"
---

`AppServiceProvider` is one of the central places where a Laravel application is configured. It is used to register services in the container and bootstrap application behavior.

The file is located at:

```text
app/Providers/AppServiceProvider.php
```

A standard `AppServiceProvider` contains two important methods:

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Register services in the container.
    }

    public function boot(): void
    {
        // Bootstrap application behavior.
    }
}
```

Although both methods run while Laravel starts the application, they have different responsibilities.

---

### The register Method

The `register` method is used for service container registrations. Interface bindings and shared services belong here.

Imagine that the checkout system depends on a `PaymentMethod` interface:

```php
<?php

namespace App\Contracts;

interface PaymentMethod
{
    public function pay(int $amount): string;
}
```

The Stripe implementation looks like this:

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

Laravel needs to know which class should be created when `PaymentMethod` is requested. Define this relationship in `register`:

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

The `$this->app` property gives the provider access to Laravel's service container. After this registration, Laravel can inject `StripePaymentMethod` wherever `PaymentMethod` is requested.

The `register` method should focus only on registering services. Routes, event listeners, and other application behavior should not be defined here.

---

### The boot Method

The `boot` method runs after all service providers have been registered. This means services registered by Laravel and other providers are available to use.

For example, a payment rate limiter can be configured in `boot`:

```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

public function boot(): void
{
    RateLimiter::for('payments', function (Request $request) {
        return Limit::perMinute(5)->by(
            $request->user()?->id ?? $request->ip(),
        );
    });
}
```

The limiter can then be applied to the checkout route:

```php
use App\Http\Controllers\CheckoutController;
use Illuminate\Support\Facades\Route;

Route::post('/checkout', [CheckoutController::class, 'store'])
    ->middleware('throttle:payments');
```

In this example, `register` tells Laravel how to create the payment service, while `boot` configures behavior used by the running application.

---

### Complete AppServiceProvider Example

The complete provider for the payment example looks like this:

```php
<?php

namespace App\Providers;

use App\Contracts\PaymentMethod;
use App\Services\Payments\StripePaymentMethod;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
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

    public function boot(): void
    {
        RateLimiter::for('payments', function (Request $request) {
            return Limit::perMinute(5)->by(
                $request->user()?->id ?? $request->ip(),
            );
        });
    }
}
```

---

### Using the Registered Service

The controller only needs to type-hint the interface:

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

Laravel reads the registration from `AppServiceProvider`, creates `StripePaymentMethod`, and injects it into the controller automatically.

---

### How AppServiceProvider Is Loaded

Application service providers are listed in `bootstrap/providers.php`:

```php
<?php

return [
    App\Providers\AppServiceProvider::class,
];
```

Laravel loads the provider during application startup, calls `register`, and then calls `boot` after all providers have been registered.

The flow is:

```text
Laravel starts
    ↓
AppServiceProvider::register()
    ↓
All providers are registered
    ↓
AppServiceProvider::boot()
    ↓
The application handles the request
```

Use `AppServiceProvider` to keep application-level service registrations and startup configuration in one clear place.
