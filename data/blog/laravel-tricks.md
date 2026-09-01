---
title: "Laravel Tricks"
author: "dayanch"
createdAt: "2026-01-02T16:20:00.000Z"
description: "A practical guide to professional Laravel habits for clean architecture, better performance, and scalable code."
category: "laravel"
---

Laravel helps you move fast, but professional projects need more than speed. They need consistency, clean architecture, and habits that keep code maintainable as the app grows.

In this article, we will cover practical Laravel tricks used by experienced teams in real-world production apps.

---

### 1) Keep Controllers Thin

A controller should do three things only:
1. Accept the request
2. Call the business logic
3. Return the response

If validation, authorization, queries, and domain logic are all inside the controller, your code becomes hard to test and hard to maintain.

Move business logic into service classes or action classes.

---

### 2) Use Form Requests for Validation

Do not keep validation rules inside controller methods. Use Form Request classes to centralize and reuse validation.

```php
php artisan make:request StorePostRequest
```

```php
public function store(StorePostRequest $request)
{
    $post = Post::create($request->validated());
    return new PostResource($post);
}
```

This gives you cleaner controllers and a single source of truth for validation rules.

---

### 3) Use Policies for Authorization

Authorization logic should be centralized in Policies, not spread across controllers and Blade templates.

```php
php artisan make:policy PostPolicy --model=Post
```

```php
$this->authorize('update', $post);
```

Benefits:
- Security logic stays in one place
- Easier audits and permission updates
- Less code duplication

---

### 4) Use API Resources for Response Shape

Avoid returning raw Eloquent models directly in APIs. Use Resources to control exactly what is exposed.

```php
return new PostResource($post);
```

This protects sensitive fields and keeps your API format consistent.

---

### 5) Prevent N+1 Queries from Day One

N+1 is one of the most common Laravel performance problems. If you access relationships in loops without eager loading, query count explodes.

```php
$posts = Post::with(['author', 'comments'])->latest()->paginate(10);
```

Also use:
- `withCount()` for relationship counts
- DB indexes for frequently filtered columns
- selected columns when full model data is unnecessary

---

### 6) Add a Service Layer for Business Logic

When your app grows, services keep your domain logic organized.

Example use cases:
- Publish a post
- Process checkout
- Sync third-party data
- Apply discounts and rules

Controllers stay small, and business rules become reusable and testable.

---

### 7) Use Caching for Expensive Reads

Repeated read-heavy queries should be cached.

```php
$posts = Cache::remember('home.posts', 300, fn () => Post::latest()->take(10)->get());
```

Caching improves response time and reduces DB load with minimal complexity.

---

### 8) Wrap Critical Writes in Transactions

Whenever multiple DB operations must succeed together, use transactions.

```php
DB::transaction(function () {
    // multiple writes
});
```

If one step fails, everything is rolled back safely.

---

### 9) Use Observers for Side Effects

Notifications, cache clearing, and event dispatching should not live in controllers. Use model observers for cleaner separation.

This keeps your HTTP layer simple and your domain behavior consistent.

---

### 10) Maintain Logging and Error Standards

Use structured logs with useful context.

```php
Log::error('Post publish failed', [
    'post_id' => $post->id,
    'user_id' => auth()->id(),
]);
```

Clear logs reduce debugging time and improve incident response.

---

### Final Checklist

Before shipping a feature, ask:
- Is validation handled by a Form Request?
- Is authorization handled by a Policy?
- Is API output shaped by a Resource?
- Are queries optimized (`with`, `withCount`, indexes)?
- Is business logic outside the controller?
- Is caching applied where needed?
- Are critical writes inside a transaction?

If the answer is yes to most of these, your Laravel project is moving in a professional direction.
