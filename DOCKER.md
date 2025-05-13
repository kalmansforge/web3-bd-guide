# Docker Implementation Guide

This document provides detailed information about the Docker implementation for the Web3 Business Development Guide application.

## Docker Configuration

The application uses a multi-stage Docker build to create a lightweight and secure container:

### Dockerfile Structure

```dockerfile
# Build stage
FROM oven/bun:1.2 as build

WORKDIR /app
COPY . .
RUN bun install
RUN bun run build

# Production stage
FROM oven/bun:1.2-slim as production

WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/src/templates /app/dist/templates

# Run as non-root user for security
USER 1000

# Expose the Vite preview port
EXPOSE 4173

# Start the application
CMD ["bun", "--bun", "run", "preview", "--host"]
```

### Docker Compose Configuration

The application is configured using Docker Compose for easy deployment:

```yaml
version: '3.8'

services:
  typescript-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "4173:4173"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4173"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 5s
```

## Port Configuration

The application uses the following port configuration:

- **4173**: Vite preview server port (production build)
- **5173**: Vite development server port (when running in development mode)

Note: The Docker container exposes port 4173, which should be used when accessing the application via Docker.

## Data Storage

The application uses the browser's localStorage for data storage:

- No external database is required
- All data is stored locally in the user's browser
- Data persists across browser sessions but not across different browsers or devices
- Data can be exported and imported manually through the application's built-in functionality

## Performance Optimization

The Docker implementation includes several optimizations:

1. **Multi-stage build**: Reduces the final image size by excluding build dependencies
2. **Bun runtime**: Uses Bun 1.2 for improved JavaScript performance
3. **Non-root user**: Runs as a non-privileged user for enhanced security
4. **Health checks**: Ensures the application is running properly before considering it ready

## Template System

The Docker implementation includes special handling for templates:

1. **Template copying**: Templates are copied from `/app/src/templates` to `/app/dist/templates` during the build process
2. **Dynamic loading**: The application automatically loads templates from the templates directory at runtime
3. **Auto-refresh**: The application checks for new templates periodically

## Troubleshooting

### Common Issues

1. **Port conflicts**: If port 4173 is already in use on your host system, modify the port mapping in the `docker-compose.yml` file:
   ```yaml
   ports:
     - "8080:4173"  # Maps host port 8080 to container port 4173
   ```

2. **Container not starting**: Check Docker logs for error messages:
   ```sh
   docker compose logs
   ```

3. **Application not accessible**: Verify that the container is running and healthy:
   ```sh
   docker compose ps
   ```

4. **Template changes not reflecting**: Templates are bundled during build time. Rebuild the container to include new templates:
   ```sh
   docker compose up --build
   ``` 