## Description
If you are using Supabase, use cli command to run the migrations.
The migrations can be run outside of supa environment. But the login implementation is not included.

- Schemas:
    - auth
    - public
- Tables:
    - Users
    - Ebills
    - Suppliers
    - Roles
    - Permissions
    - User-Roles
    - Roles-Permissions
- Functions:
    - modified_at Function
- Triggers on modified_at Function
    - Ebills
    - Suppliers
    - Roles
    - Permissions