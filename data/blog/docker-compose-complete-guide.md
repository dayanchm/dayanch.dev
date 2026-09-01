---
title: "Docker Compose Explained: From One Container to a Complete Development Stack"
author: "dayanch"
createdAt: "2026-08-17T14:00:00.000Z"
description: "Learn Docker Compose from first principles by running a multi-container application with services, networks, volumes, health checks, environment variables, profiles, and production-ready practices."
category: "devops"
---

Running one container with `docker run` is simple. A real application, however, usually needs more than one process: a web application, a database, a cache, perhaps a background worker, and sometimes a local mail or object-storage service. Starting every container with a long command, remembering the correct ports, and manually connecting networks quickly becomes difficult.

Docker Compose solves this problem by describing the entire application stack in one YAML file. With a single command, you can build images, create networks and volumes, start every service, inspect logs, and stop the complete environment.

This guide explains Docker Compose from first principles and builds a practical stack with a Node.js application and PostgreSQL. The same concepts apply to Next.js, Laravel, Go, Python, Java, and most other containerized applications.

---

## What is Docker Compose?

Docker Compose is a tool for defining and running multi-container applications. You describe the desired services and their configuration in a Compose file, usually named `compose.yaml`, and Docker turns that declaration into running containers and related resources.

A Compose application can define:

- services such as an API, database, cache, or worker,
- container images or local build instructions,
- published ports,
- environment variables,
- persistent volumes,
- private or shared networks,
- health checks and startup dependencies,
- secrets and configuration files, and
- optional services enabled through profiles.

Modern Docker uses the command with a space:

```bash
docker compose up
```

You may still see the old standalone `docker-compose` command in older tutorials. Current projects should normally use the Compose plugin integrated into the Docker CLI.

The current format is the **Compose Specification**. You do not need a top-level `version: '3'` field. That property exists only for backward compatibility and is considered obsolete by modern Compose.

---

## Compose versus Dockerfile

A Dockerfile and a Compose file solve different problems.

A **Dockerfile** explains how to build one image:

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "start"]
```

A **Compose file** explains how one or more containers should run together:

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
```

The Dockerfile creates the application image. Compose builds that image, starts a container from it, publishes a port, connects it to other services, and manages the surrounding environment. Most multi-container projects use both files.

---

## Our example project

We will use a small Node.js application connected to PostgreSQL. The project structure looks like this:

```text
my-app/
├── compose.yaml
├── Dockerfile
├── .dockerignore
├── .env
├── package.json
├── package-lock.json
└── src/
    └── server.js
```

The important part of this tutorial is `compose.yaml`, but the Dockerfile gives Compose an application image to build.

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
```

Add a `.dockerignore` file so unnecessary local files are not sent into the build context:

```text
node_modules
npm-debug.log
.git
.env
coverage
```

Excluding `.env` also helps prevent local secrets from being copied into an image layer.

---

## Building the first Compose file

Create `compose.yaml` in the project root:

```yaml
name: demo-stack

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "${APP_PORT:-3000}:3000"
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s
    restart: unless-stopped

volumes:
  postgres-data:
```

Create a local `.env` file beside it:

```dotenv
APP_PORT=3000
POSTGRES_DB=app
POSTGRES_USER=app
POSTGRES_PASSWORD=local-development-password
```

Do not commit real credentials. A repository can include `.env.example` with safe placeholders so other developers know which values are required.

Start the application:

```bash
docker compose up --build
```

Compose builds the `app` image, downloads PostgreSQL if necessary, creates a project network and named volume, starts both containers, and attaches their logs to the terminal.

Press `Ctrl+C` to stop the foreground process, or start everything in detached mode:

```bash
docker compose up -d --build
```

---

## Understanding the Compose file

### Project name

```yaml
name: demo-stack
```

The project name groups the containers, networks, and volumes created by Compose. It also helps avoid naming collisions when several projects use common service names such as `app` and `db`.

You can override it from the command line:

```bash
docker compose -p feature-123 up -d
```

This is useful for running isolated copies of the same stack.

### Services

```yaml
services:
  app:
    # ...
  db:
    # ...
```

A service describes a type of container in the application. In this stack, `app` is built from local source code and `db` uses an existing PostgreSQL image. A service is not necessarily limited to one container; some environments can scale stateless services to multiple replicas.

### Build versus image

The application uses `build`:

```yaml
app:
  build:
    context: .
    dockerfile: Dockerfile
```

`context` defines the files available during the image build. `dockerfile` selects the Dockerfile relative to that context.

PostgreSQL uses `image`:

```yaml
db:
  image: postgres:17-alpine
```

Pinning a meaningful version is safer than relying on `latest`, which can change unexpectedly. For stricter reproducibility, production systems may pin an immutable image digest.

### Port mapping

```yaml
ports:
  - "${APP_PORT:-3000}:3000"
```

The left side is the host port; the right side is the container port. If `APP_PORT` is not set, Compose uses the default value `3000`. A request to `localhost:3000` is forwarded to port `3000` inside the application container.

The database has no `ports` section. The application can still reach it through the internal Compose network, but PostgreSQL is not unnecessarily exposed on the host. Add a host port only when a local database tool genuinely needs direct access:

```yaml
ports:
  - "127.0.0.1:5432:5432"
```

Binding to `127.0.0.1` limits access to the local machine.

---

## Service discovery and networking

Compose creates a default network for the project. Every service on that network can reach another service by its service name. That is why the application connects to this hostname:

```text
db:5432
```

Inside the `app` container, `localhost` refers to the application container itself—not the host machine and not PostgreSQL. Using `localhost:5432` would therefore fail. The correct database host is `db`, because that is the Compose service name.

You can declare custom networks when isolation is useful:

```yaml
services:
  proxy:
    image: nginx:alpine
    networks:
      - public
      - private

  app:
    build: .
    networks:
      - private

  db:
    image: postgres:17-alpine
    networks:
      - private

networks:
  public:
  private:
```

Here, only the proxy joins the public-facing network, while application and database communication remains on the private network. A custom network is not automatically a complete security boundary, but it reduces accidental connectivity and documents the intended architecture.

---

## Persisting data with named volumes

Containers are disposable. When a database container is removed, data written only to its writable container layer disappears with it. The named volume solves that problem:

```yaml
services:
  db:
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

Docker manages `postgres-data` separately from the container lifecycle. The database can be recreated while its files remain available.

Stop and remove the containers and network:

```bash
docker compose down
```

The named volume remains. Start the stack again and the database data is still there.

To remove the volume as well:

```bash
docker compose down --volumes
```

This permanently deletes the Compose-managed database data. Use it deliberately, especially outside a disposable development environment.

### Named volumes versus bind mounts

A named volume is managed by Docker:

```yaml
volumes:
  - postgres-data:/var/lib/postgresql/data
```

A bind mount maps a specific host path into a container:

```yaml
volumes:
  - ./src:/app/src
```

Bind mounts are useful for live development because source changes appear immediately inside the container. Named volumes are generally a better fit for database data because Docker manages their location and lifecycle.

---

## Startup order is not readiness

A common mistake is assuming that `depends_on` means a database is ready to accept connections. Starting a container only means its process has begun; PostgreSQL may still be initializing.

The database health check tests readiness:

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
  interval: 5s
  timeout: 3s
  retries: 10
  start_period: 10s
```

The application then waits for the healthy state:

```yaml
depends_on:
  db:
    condition: service_healthy
```

The double dollar signs in `$${POSTGRES_USER}` are intentional. They pass a literal dollar sign through Compose so the variable is expanded inside the container when the health-check command runs.

Health checks improve startup coordination, but resilient applications should still retry temporary database failures. Dependencies can restart or become unavailable after the initial startup sequence has completed.

---

## Environment variables and interpolation

Compose supports variable interpolation in YAML values:

```yaml
ports:
  - "${APP_PORT:-3000}:3000"
```

Useful forms include:

```text
${VARIABLE}             Use the value directly
${VARIABLE:-default}    Use a default when missing or empty
${VARIABLE:?message}    Fail with a message when missing or empty
```

For a value that must be provided, fail early:

```yaml
environment:
  API_KEY: ${API_KEY:?API_KEY must be set}
```

You can inspect the fully resolved configuration before starting containers:

```bash
docker compose config
```

This command is one of the best ways to find YAML merge errors, missing variables, incorrect interpolation, and unexpected final values. Be careful when sharing its output because resolved configuration may contain sensitive values.

An `.env` file used for interpolation is not the same as an `env_file` passed into a container. You can explicitly load container variables like this:

```yaml
services:
  app:
    env_file:
      - .env.app
```

Regardless of the mechanism, do not treat plain environment variables as a perfect secret-management system. Production deployments should use the secret facility provided by the target platform whenever possible.

---

## Development with bind mounts

For a fast edit-refresh cycle, add source code as a bind mount and run the development command:

```yaml
services:
  app:
    build: .
    command: npm run dev
    ports:
      - "${APP_PORT:-3000}:3000"
    volumes:
      - .:/app
      - app-node-modules:/app/node_modules
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}

volumes:
  app-node-modules:
  postgres-data:
```

The project directory is mounted at `/app`, so local edits are immediately visible. A separate named volume protects the Linux dependencies installed inside the container from being replaced by a host `node_modules` directory.

For Next.js, the development server may need to listen on all interfaces inside the container:

```json
{
  "scripts": {
    "dev": "next dev --hostname 0.0.0.0"
  }
}
```

Compose also supports a watch-based development workflow, which can synchronize files or rebuild a service when selected paths change. Whether bind mounts or Compose Watch feels better depends on the operating system and project size.

---

## Essential Docker Compose commands

Start services and attach to their logs:

```bash
docker compose up
```

Build images before starting:

```bash
docker compose up --build
```

Run in the background:

```bash
docker compose up -d
```

List service status:

```bash
docker compose ps
```

Follow logs from every service:

```bash
docker compose logs -f
```

Follow one service and show its last 100 lines:

```bash
docker compose logs -f --tail=100 app
```

Execute a command in an already running container:

```bash
docker compose exec app npm test
```

Open a shell:

```bash
docker compose exec app sh
```

Run a temporary one-off container:

```bash
docker compose run --rm app npm run migrate
```

Restart a service:

```bash
docker compose restart app
```

Stop containers without removing them:

```bash
docker compose stop
```

Stop and remove the application containers and network:

```bash
docker compose down
```

Also remove named volumes:

```bash
docker compose down --volumes
```

Pull newer versions of referenced images:

```bash
docker compose pull
```

See the final normalized configuration:

```bash
docker compose config
```

---

## Optional services with profiles

Some tools are useful only in specific situations. Profiles let you keep them in the Compose model without starting them every time.

```yaml
services:
  app:
    build: .

  db:
    image: postgres:17-alpine

  adminer:
    image: adminer:latest
    profiles: [tools]
    ports:
      - "127.0.0.1:8080:8080"
```

A normal start ignores Adminer:

```bash
docker compose up -d
```

Enable the tools profile when needed:

```bash
docker compose --profile tools up -d
```

Profiles work well for debugging tools, local mail servers, database dashboards, and optional observability services. Core dependencies should not usually be hidden behind a profile.

---

## Multiple Compose files

Development and production often need different settings. Instead of duplicating the entire stack, you can merge files:

```text
compose.yaml
compose.production.yaml
```

The base file contains shared configuration. The production file overrides selected values:

```yaml
services:
  app:
    image: registry.example.com/my-app:${APP_VERSION}
    restart: always
```

Run both files in order:

```bash
docker compose \
  -f compose.yaml \
  -f compose.production.yaml \
  up -d
```

Later files add to or override earlier files. Always inspect the result:

```bash
docker compose \
  -f compose.yaml \
  -f compose.production.yaml \
  config
```

For larger systems, modern Compose also supports `include`, which can import separately maintained Compose models. Keep the structure as simple as the team can understand; modularity is helpful only when it reduces ownership and maintenance problems.

---

## Production considerations

Docker Compose is excellent for development, testing, demos, CI jobs, and many single-server deployments. A production Compose file still needs deliberate operational choices.

### Build immutable images in CI

Build and test the application image once, publish it to a registry, and deploy that exact tag or digest. Rebuilding source code directly on the production server can produce a different artifact from the one tested in CI.

### Do not publish unnecessary ports

Only the reverse proxy or public application normally needs a host port. Databases and caches can remain on internal networks.

### Use production secret management

Do not commit passwords or place long-lived credentials in image layers. Use restricted environment files, Docker secrets where appropriate, or the secret manager supplied by the hosting platform.

### Set restart behavior and health checks

A restart policy can recover from process failures, while health checks provide visibility into whether a service is actually usable. Neither replaces monitoring, alerting, backups, or application-level retry logic.

### Protect persistent data

A volume is not a backup. Test database backups and restoration. Know exactly what `docker compose down --volumes` would delete before using it on a production host.

### Add resource and log controls

A runaway process should not consume the entire server. Configure appropriate resource constraints for the environment and ensure logs are rotated or exported to a log system.

### Plan zero-downtime requirements

Plain Compose replaces containers but does not automatically provide every orchestration feature. Applications requiring multi-host scheduling, advanced rolling deployments, automatic failover, or complex autoscaling may need a managed container platform or another orchestrator. Choose based on operational needs, not fashion.

---

## Common mistakes

### Using `localhost` between containers

Inside a container, `localhost` means that same container. Use the target service name, such as `db` or `redis`, for communication over a Compose network.

### Assuming `depends_on` means ready

Startup order and application readiness are different. Add a meaningful health check and make dependent applications resilient with retry logic.

### Storing database data only inside the container

Use a named volume for state that must survive container replacement, and maintain separate backups.

### Committing secrets

Keep `.env` out of Git, publish a safe `.env.example`, and use a proper secret-management mechanism in production.

### Using `latest` everywhere

An unpinned image can change without a code change. Pin versions, test updates, and use digests where immutable deployment is required.

### Adding the obsolete `version` key

Modern Compose follows the current Compose Specification. The top-level `version` field is no longer needed and may produce an obsolete-field warning.

### Confusing `down` with `down --volumes`

The first removes containers and networks while preserving named volumes. The second also deletes those volumes and their data.

### Treating Compose as a security system

Networks, environment variables, and container boundaries help organize an application, but secure deployment also requires patched images, limited privileges, protected credentials, controlled host access, and monitoring.

---

## A practical debugging checklist

When the stack does not work, inspect it systematically:

1. Validate the resolved file with `docker compose config`.
2. Check service state with `docker compose ps`.
3. Read logs with `docker compose logs --tail=200 service-name`.
4. Inspect health-check output with `docker inspect`.
5. Verify that the application uses service names instead of `localhost`.
6. Confirm that required variables are present.
7. Test DNS and connectivity from inside the container.
8. Rebuild the image if source or dependencies changed.

Useful commands include:

```bash
docker compose exec app sh
docker compose exec app getent hosts db
docker compose exec db pg_isready -U app -d app
docker compose build --no-cache app
```

Avoid immediately deleting every volume or pruning all Docker data. Destructive cleanup can erase the evidence needed to understand the problem—and may delete valuable local databases.

---

## Final thoughts

Docker Compose turns a collection of container commands into a versioned application model. Anyone with Docker and the repository can start the same services, networks, ports, and volumes with one command. That consistency is valuable in local development, onboarding, automated tests, CI pipelines, demos, and smaller production environments.

The most important ideas are straightforward:

1. A Dockerfile builds an image; Compose runs the complete application.
2. Services communicate through Compose networks using service names.
3. Named volumes preserve state beyond a container's lifetime.
4. Health checks distinguish a running process from a ready service.
5. Environment interpolation makes configuration flexible, but secrets still require protection.
6. `docker compose config`, `ps`, and `logs` are the first debugging tools to reach for.
7. Production use requires immutable images, backups, limited exposure, monitoring, and deliberate deployment design.

Start with two services, keep the Compose model readable, and add complexity only when the architecture truly needs it. A clear `compose.yaml` should be executable documentation for how the application fits together.

### Further reading

- [Docker Compose overview](https://docs.docker.com/compose/)
- [Compose file reference](https://docs.docker.com/reference/compose-file/)
- [Docker Compose CLI reference](https://docs.docker.com/reference/cli/docker/compose/)
- [Control startup order](https://docs.docker.com/compose/how-tos/startup-order/)
