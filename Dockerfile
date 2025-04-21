# Load Bun
FROM oven/bun:1 AS base
WORKDIR /retrobot

# Installs all dependencies into temporary directory
# This caches them and speeds up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Installs dependencies used in prod
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy node_modules from temp
FROM base as prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Copy prod dependies and source into final imagae
FROM base as release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /retrobot/index.ts .
COPY --from=prerelease /retrobot .

# Run the app
USER bun
ENTRYPOINT ["bun", "run", "index.ts"]