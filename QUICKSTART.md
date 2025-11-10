# 🚀 WorkHub Authentication - Quick Start Guide

## ✅ What's Been Configured

Your WorkHub application now has a **complete authentication system** with:

- ✅ **TypeScript** fully configured with NextAuth
- ✅ **Credentials login** (email/password)
- ✅ **Google OAuth** integration
- ✅ **MongoDB** user database
- ✅ **Password hashing** with bcryptjs
- ✅ **Route protection** middleware
- ✅ **Login & Signup pages** with beautiful UI
- ✅ **Session management** with JWT

---

## 📋 Next Steps to Get Running

### 1. Create `.env.local` file

Create a file named `.env.local` in your project root with these variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/workhub?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_secret_here

# Google OAuth (optional - for Google sign-in)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Generate NEXTAUTH_SECRET:

**Windows PowerShell:**

```powershell
$bytes = [System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32); [Convert]::ToBase64String($bytes)
```

Or visit: https://generate-secret.vercel.app/32

---

### 2. Set Up MongoDB (if you haven't)

**Option A: MongoDB Atlas (Free, Cloud-hosted)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new cluster (M0 Free tier)
4. Create a database user (Database Access)
5. Whitelist your IP (Network Access) - use `0.0.0.0/0` for development
6. Click "Connect" → "Connect your application"
7. Copy the connection string
8. Replace `<password>` with your database user password
9. Replace `myFirstDatabase` with `workhub`

---

### 3. Set Up Google OAuth (Optional)

If you want to enable "Sign in with Google":

1. Go to https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Enable **Google+ API**
4. Go to **APIs & Services** → **Credentials**
5. Create **OAuth 2.0 Client ID**
6. Set **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
7. Copy **Client ID** and **Client Secret** to `.env.local`

> **Note:** If you skip Google OAuth, users can still sign up with email/password!

---

### 4. Start the Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## 🧪 Test Your Authentication

### Test Flow 1: Email/Password Sign Up

1. Go to http://localhost:3000
2. Click **"Get Started"**
3. Fill in the signup form:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Business Name: John's Photography (optional)
4. Click **"Sign up"**
5. You should be automatically logged in and redirected to `/dashboard`

### Test Flow 2: Email/Password Sign In

1. Go to http://localhost:3000/login
2. Enter your email and password
3. Click **"Sign in"**
4. You should be redirected to `/dashboard`

### Test Flow 3: Google Sign In

1. Go to http://localhost:3000/login
2. Click **"Sign in with Google"**
3. Choose your Google account
4. You should be redirected to `/dashboard`

---

## 📁 Files Created/Modified

### Created Files:

```
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts          ← NextAuth configuration
│   ├── login/
│   │   └── page.tsx                  ← Login page
│   └── signup/
│       └── page.tsx                  ← Signup page
├── components/
│   └── Providers.tsx                 ← SessionProvider wrapper
├── lib/
│   ├── auth.ts                       ← Server actions (signup, etc.)
│   └── models/
│       └── User.ts                   ← MongoDB User schema
├── types/
│   └── next-auth.d.ts                ← TypeScript declarations
├── middleware.ts                     ← Route protection
├── .env.example                      ← Environment template
└── AUTHENTICATION_SETUP.md           ← Full documentation
```

### Modified Files:

- `app/layout.tsx` - Added SessionProvider
- `app/page.tsx` - Updated landing page
- `package.json` - Added bcryptjs

---

## 🔒 How Authentication Works

### Sign Up Flow:

1. User fills signup form
2. Server validates input (email format, password length)
3. Checks if email already exists
4. Hashes password with bcrypt
5. Creates user in MongoDB
6. Automatically signs in user
7. Redirects to dashboard

### Sign In Flow (Credentials):

1. User enters email/password
2. NextAuth calls the authorize function
3. Finds user in MongoDB by email
4. Compares password hash
5. Returns user object
6. Creates JWT session
7. Redirects to dashboard

### Sign In Flow (Google):

1. User clicks "Sign in with Google"
2. Redirects to Google OAuth
3. User authorizes the app
4. Google returns user profile
5. Checks if user exists in database
6. Creates user if new (or links if existing)
7. Creates JWT session
8. Redirects to dashboard

---

## 🛡️ Protected Routes

These routes require authentication (configured in `middleware.ts`):

- `/dashboard/*`
- `/clients/*`
- `/appointments/*`
- `/invoices/*`
- `/api/clients/*`
- `/api/appointments/*`
- `/api/invoices/*`

**Unauthenticated users** are automatically redirected to `/login`.

---

## 🎯 Using Authentication in Your App

### Get Current User (Client Component)

```tsx
"use client";
import { useSession } from "next-auth/react";

export default function MyComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not logged in</div>;

  return (
    <div>
      <h1>Hello, {session.user.name}!</h1>
      <p>Email: {session.user.email}</p>
      <p>User ID: {session.user.id}</p>
      <p>Business: {session.user.businessName}</p>
    </div>
  );
}
```

### Get Current User (Server Component)

```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function MyServerComponent() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <div>Welcome, {session.user.name}!</div>;
}
```

### Sign Out

```tsx
"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>
  );
}
```

---

## 📊 Next: Link Data to Users

Now that authentication is working, you can link all your data to the logged-in user:

### Example: Create Client for Current User

```typescript
// app/api/clients/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Client from "@/lib/models/Client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const body = await req.json();

  const client = await Client.create({
    userId: session.user.id, // ← Link to logged-in user!
    name: body.name,
    email: body.email,
    phone: body.phone,
  });

  return Response.json(client);
}
```

### Example: Get User's Clients

```typescript
// Fetch only clients belonging to the current user
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const clients = await Client.find({
    userId: session.user.id, // ← Filter by user!
  });

  return Response.json(clients);
}
```

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"

- Check your `MONGODB_URI` in `.env.local`
- Verify your database password
- Check IP whitelist in MongoDB Atlas

### "Google sign-in not working"

- Verify redirect URI matches exactly in Google Console
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Make sure Google+ API is enabled

### "Session is null"

- Make sure `NEXTAUTH_SECRET` is set
- Check that `Providers` component wraps your app in `layout.tsx`
- Clear cookies and try again

### "Page keeps redirecting"

- Check middleware.ts matcher patterns
- Verify you're logged in (check `/api/auth/session`)

---

## ✨ Your Authentication is Ready!

You can now:

1. ✅ Sign up new users
2. ✅ Sign in with email/password
3. ✅ Sign in with Google
4. ✅ Protect routes
5. ✅ Access user info in components
6. ✅ Link all data to logged-in users

**Next steps:**

- Build your dashboard page
- Create Client, Appointment, and Invoice models
- Add CRUD operations for each
- Build the UI components

Happy coding! 🚀
