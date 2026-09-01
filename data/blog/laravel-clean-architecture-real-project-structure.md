---
title: "Laravel Clean Architecture (Real Project Structure)"
author: "dayanch"
createdAt: "2026-05-07T16:29:00.000Z"
description: "A practical guide to applying Clean Architecture in Laravel with a real-world project structure teams can scale and maintain."
category: "laravel"
---

Most Laravel tutorials stop at controllers, models, and views. That is fine for small demos, but real products need a stronger structure.

Clean Architecture helps you separate business rules from framework details, so your application remains testable, scalable, and easy to maintain.

In this guide, we will build a practical Laravel Clean Architecture mindset for real projects.

---

### Why Clean Architecture in Laravel?

Laravel is powerful, but it is easy to place too much logic inside controllers or Eloquent models. Over time this creates:
- Fat controllers
- Mixed responsibilities
- Difficult testing
- Hard refactoring

Clean Architecture solves this by organizing code around business rules first.

---

### Core Principle

Dependencies must point inward.

- Outer layers (HTTP, DB, framework) can depend on inner layers
- Inner layers (domain rules) must never depend on outer layers

Your business logic should work even if the web framework changes.

---

### Recommended Real Project Structure

A practical Laravel structure can look like this:

```text
app/
  Domain/
    Post/
      Entities/
      ValueObjects/
      Repositories/
      Services/

  Application/
    Post/
      UseCases/
      DTOs/

  Infrastructure/
    Persistence/
      Eloquent/
        Repositories/
    Services/

  Interfaces/
    Http/
      Controllers/
      Requests/
      Resources/
```

This keeps framework concerns separate from domain logic.

---

### Layer Responsibilities

### 1) Domain Layer

Contains pure business rules.
- Entities (core business objects)
- Value Objects (validated immutable values)
- Repository Contracts (interfaces)
- Domain Services (business operations)

No Laravel-specific code should exist here.

### 2) Application Layer

Contains use cases that orchestrate domain logic.
- `CreatePostUseCase`
- `PublishPostUseCase`
- Input/Output DTOs

Application layer coordinates work but does not know HTTP or database details.

### 3) Infrastructure Layer

Contains technical implementations.
- Eloquent repository implementations
- External API clients
- Queue integrations
- Cache adapters

This is where Laravel and third-party tools live.

### 4) Interface Layer

Contains delivery mechanisms.
- Controllers
- Form Requests
- API Resources

Controllers should be thin: validate input, call use case, return response.

---

### Example Flow: Publish Post

1. Controller receives request
2. FormRequest validates data
3. Controller calls `PublishPostUseCase`
4. Use case uses `PostRepository` interface
5. Infrastructure repository updates via Eloquent
6. Resource returns response shape

This flow keeps business decisions in the center and framework at the edges.

---

### Repository Pattern (Practical Use)

In Domain:

```php
interface PostRepository
{
    public function findById(int $id): ?Post;
    public function save(Post $post): void;
}
```

In Infrastructure:

```php
class EloquentPostRepository implements PostRepository
{
    public function findById(int $id): ?PostModel
    {
        return PostModel::find($id);
    }

    public function save(PostModel $post): void
    {
        $post->save();
    }
}
```

Bind interface to implementation in a service provider.

---

### Keep Controllers Thin (Always)

Good controller style:

```php
public function publish(PublishPostRequest $request, PublishPostUseCase $useCase)
{
    $output = $useCase->execute($request->validated());
    return new PostResource($output->post);
}
```

No business rules. No heavy query logic. No side-effect chaos.

---

### Where Validation, Authorization, and Mapping Belong

- Validation: Form Requests
- Authorization: Policies
- Response Mapping: API Resources
- Business Decisions: Use Cases + Domain

This separation makes code predictable for teams.

---

### Testing Strategy in Clean Laravel Projects

1. Unit tests for Domain and Use Cases (fast and isolated)
2. Feature tests for HTTP layer
3. Integration tests for Infrastructure adapters when needed

Because logic is separated, tests are easier to write and maintain.

---

### Common Mistakes to Avoid

- Putting business rules directly in controllers
- Treating Eloquent models as the full domain layer
- Skipping interfaces for critical dependencies
- Returning raw models from API endpoints
- Mixing external service calls inside core use cases without abstraction

---

### Incremental Adoption (No Big Bang Refactor)

You do not need to rewrite everything.

Start with one feature:
1. Create a Use Case
2. Move business logic from controller
3. Add repository contract
4. Implement contract in infrastructure
5. Keep controller as orchestration only

Repeat feature by feature.

---

### Final Thoughts

Laravel and Clean Architecture work very well together when applied pragmatically.

You are not trying to add complexity. You are building clear boundaries so your team can ship faster today and refactor safely tomorrow.

If your project is growing, this structure is one of the best investments you can make.
