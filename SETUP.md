# PocketBase Setup Guide

## Step 1: Access PocketBase Admin

1. Go to: https://training-pocketbase.g5amlv.easypanel.host/_/
2. Login with your admin credentials

## Step 2: Create the Todos Collection

### Option A: Using the Admin UI

1. Click on "Collections" in the left sidebar
2. Click "New collection"
3. Set collection name: `todos`
4. Add the following fields:

   **Field 1: text**
   - Type: Plain text
   - Required: ✓ (checked)
   
   **Field 2: completed**
   - Type: Boolean
   - Default value: false
   
   **Field 3: user**
   - Type: Relation
   - Collection: users
   - Max select: 1 (single)
   - Required: ✓ (checked)

5. Click "Create"

### Option B: Using the Import Feature

1. Click on "Collections" in the left sidebar
2. Click the "Import collections" button (top right)
3. Paste the JSON below:

```json
[
  {
    "name": "todos",
    "type": "base",
    "schema": [
      {
        "name": "text",
        "type": "text",
        "required": true
      },
      {
        "name": "completed",
        "type": "bool",
        "required": false
      },
      {
        "name": "user",
        "type": "relation",
        "required": true,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": ["email"]
        }
      }
    ]
  }
]
```

4. Click "Import"

## Step 3: Set API Rules for Todos Collection

1. Click on the `todos` collection
2. Click on the "API Rules" tab
3. Set the following rules:

   **List/Search rule:**
   ```
   @request.auth.id != "" && user = @request.auth.id
   ```
   
   **View rule:**
   ```
   @request.auth.id != "" && user = @request.auth.id
   ```
   
   **Create rule:**
   ```
   @request.auth.id != ""
   ```
   
   **Update rule:**
   ```
   @request.auth.id != "" && user = @request.auth.id
   ```
   
   **Delete rule:**
   ```
   @request.auth.id != "" && user = @request.auth.id
   ```

4. Click "Save changes"

## Step 4: Verify Users Collection Settings

1. Click on the "users" collection (or `_pb_users_auth_`)
2. Make sure the following settings are enabled:
   - Auth enabled: ✓
   - Email/Password auth: ✓
   - Allow registration: ✓ (if you want users to sign up)

## Step 5: Test the App

1. Open your deployed app
2. Sign up with a new account
3. Try adding a todo
4. Check the PocketBase admin to see the new user and todos

## Troubleshooting

### Issue: "Failed to add todo"
- Make sure the `todos` collection exists
- Verify the API rules are set correctly
- Check browser console for detailed error messages

### Issue: "User not showing up in PocketBase"
- Check if you're looking at the correct collection (`users` or `_pb_users_auth_`)
- Verify email/password auth is enabled
- Check browser console for signup errors

### Issue: CORS errors
- PocketBase should handle CORS automatically
- If issues persist, check PocketBase settings for allowed origins

## Testing with MCP

Once setup is complete, you can use the PocketBase MCP server in Kiro to:
- Query collections
- Create/update/delete records
- Test API rules
- Manage users

Make sure your `.kiro/settings/mcp.json` has the correct admin credentials.
