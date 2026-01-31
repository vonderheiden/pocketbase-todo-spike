# PocketBase vs Supabase Todo App Spike

This is a simple todo list application built with PocketBase to understand its differences from Supabase.

## Features
- Email/Password authentication
- Create, read, update, and delete todos
- Mark todos as complete
- User-specific todo lists

## PocketBase Setup Required

Before running this app, you need to set up your PocketBase collections:

### 1. Users Collection
The default `users` collection should already exist in PocketBase with email/password auth enabled.

### 2. Todos Collection
Create a new collection called `todos` with the following fields:
- `text` (Plain text) - required
- `completed` (Boolean) - default: false
- `user` (Relation to users) - required, single relation

### 3. Collection Rules
Set the following API rules for the `todos` collection:
- **List/Search**: `@request.auth.id != "" && user = @request.auth.id`
- **View**: `@request.auth.id != "" && user = @request.auth.id`
- **Create**: `@request.auth.id != ""`
- **Update**: `@request.auth.id != "" && user = @request.auth.id`
- **Delete**: `@request.auth.id != "" && user = @request.auth.id`

## Running the App

Simply open `index.html` in a web browser. No build step required!

## MCP Server Configuration

The PocketBase MCP server has been configured in `.kiro/settings/mcp.json`. 

**Important**: Update the following values in the MCP configuration:
- `POCKETBASE_ADMIN_EMAIL`: Your PocketBase admin email
- `POCKETBASE_ADMIN_PASSWORD`: Your PocketBase admin password

After updating, restart Kiro or reconnect the MCP server from the MCP Server view.

## Key Differences to Explore (PocketBase vs Supabase)

### PocketBase:
- Single binary, self-hosted
- Built-in admin UI
- File-based SQLite database
- Real-time subscriptions via SSE
- Simple REST API
- No SQL queries needed (uses filter syntax)

### Supabase:
- Cloud-hosted (or self-hosted with Docker)
- PostgreSQL database
- More enterprise features (row-level security, functions, triggers)
- Real-time via WebSockets
- Auto-generated REST and GraphQL APIs
- Direct SQL access

## Next Steps

To compare with Supabase, you could:
1. Build the same app using Supabase
2. Compare authentication flows
3. Compare real-time capabilities
4. Compare query complexity
5. Compare deployment options
