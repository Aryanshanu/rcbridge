# Master Admin Credentials

## Default Login Details

**Access the admin dashboard at:** `/admin-login`

**Default Credentials:**
- **Username:** `master_admin`
- **Password:** `Admin@2025`

⚠️ **IMPORTANT SECURITY NOTICE:**
- These are the default credentials created during initial setup
- You should change these credentials immediately after first login
- To change credentials, update the password hash in the `master_admin` table using bcrypt

## How to Change Password

1. Generate a new bcrypt hash for your desired password:
   ```bash
   # Using Node.js
   npm install bcryptjs
   node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YourNewPassword', 10));"
   ```

2. Update the database:
   ```sql
   UPDATE master_admin 
   SET password_hash = 'your_new_bcrypt_hash_here'
   WHERE username = 'master_admin';
   ```

## Admin Dashboard Features

✅ **Analytics Tab** - Platform overview with user, conversation, and property counts
✅ **Chat Conversations** - View all chatbot conversations with users  
✅ **Properties** - Manage all property listings
✅ **Contact Messages** - View all contact form submissions
✅ **Assistance Requests** - View property assistance inquiries

## Security Features

- Master admin authentication is separate from regular Supabase Auth
- Session tokens expire after 24 hours
- All admin routes are protected by the MasterAdminContext
- Session validation on every page load

## Notes

- The master admin system bypasses Supabase Auth for admin access
- Regular users cannot access admin routes even if authenticated
- Only users with valid session tokens in the `master_admin` table can access the dashboard
