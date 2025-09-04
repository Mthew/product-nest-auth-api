```
# Run both API and web in parallel
pnpm run dev

# Run only web app
pnpm run dev:web

# Run only API
pnpm run dev:api

# Build both projects
pnpm run build

# Install dependencies for all workspaces
pnpm install
```

```
# Add a dependency to a specific workspace
pnpm add lodash --filter api

# Add a dev dependency to web app
pnpm add -D typescript --filter web

# Run a script in all workspaces
pnpm --recursive test

# Run commands in parallel for better performance
pnpm --parallel --recursive lint
```


pnpm approve-builds