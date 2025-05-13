# syntax=docker/dockerfile:1

ARG BUN_VERSION=1.2
FROM oven/bun:${BUN_VERSION}-alpine AS base

WORKDIR /app

# Only copy package.json and bun.lockb for dependency install
COPY --link package.json ./
COPY --link bun.lockb ./

# Set up Bun cache
ENV BUN_INSTALL_CACHE=/root/.bun/install/cache

# Install dependencies (including devDependencies for build)
RUN --mount=type=cache,target=${BUN_INSTALL_CACHE} \
    bun install --frozen-lockfile

# Copy the rest of the application source
COPY --link . ./

# Build the app (Vite build)
RUN --mount=type=cache,target=${BUN_INSTALL_CACHE} \
    bun run build

# --- Production image ---
FROM oven/bun:${BUN_VERSION}-alpine AS final
WORKDIR /app

# Copy only the built app and minimal files from builder
COPY --from=base /app/package.json ./
COPY --from=base /app/bun.lockb ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/index.html ./index.html
COPY --from=base /app/src/templates ./src/templates

# Create empty public directory if needed
RUN mkdir -p ./public

# Use a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Vite preview uses port 4173 by default
EXPOSE 4173

# Use Vite preview for production serving with host 0.0.0.0 to make it accessible externally
CMD ["bun", "run", "preview", "--host", "0.0.0.0"]
