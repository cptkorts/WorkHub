# 🔐 NextAuth Setup Guide - WorkHub

Your authentication is now configured with **TypeScript**, **Credentials**, and **Google OAuth**!

## ✅ What's Been Set Up

### 1. **User Model** (`lib/models/User.ts`)

- MongoDB schema with email, password, name, businessName, logo, phone, address
- Support for both credential and OAuth users
- Timestamps for createdAt and updatedAt

### 2. **NextAuth Configuration** (`app/api/auth/[...nextauth]/route.ts`)

- ✅ Credentials provider (email/password)
- ✅ Google OAuth provider
- ✅ TypeScript types fully configured
- ✅ JWT session strategy
- ✅ Database integration with MongoDB
- ✅ Automatic user creation for Google sign-ins
- ✅ Password verification with bcrypt

### 3. **Auth Helper Functions** (`lib/auth.ts`)

- `signup()` - Server action for user registration
- `getUserById()` - Fetch user by ID
- `updateUserProfile()` - Update user profile information

### 4. **TypeScript Types** (`types/next-auth.d.ts`)

- Extended NextAuth types for custom user properties
- Full TypeScript autocomplete support

---

## 🚀 Setup Instructions

### Step 1: Install Dependencies (Already Done ✅)

```bash
npm install bcryptjs @types/bcryptjs
```

### Step 2: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workhub?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Generate NEXTAUTH_SECRET:

```bash
# On Windows PowerShell:
$bytes = [System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32); [Convert]::ToBase64String($bytes)

# Or use this online generator:
# https://generate-secret.vercel.app/32
```

### Step 3: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the consent screen
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret** to your `.env.local`

### Step 4: Set Up MongoDB

If you don't have a MongoDB database yet:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and add it to `.env.local`

---

## 📝 Usage Examples

### Sign Up a New User

```typescript
// In your signup form component
"use server";
import { signup } from "@/lib/auth";

export async function handleSignup(formData: FormData) {
  const result = await signup(formData);

  if (result.success) {
    // Redirect to login
    redirect("/login");
  } else {
    // Show errors
    return result.errors;
  }
}
```

### Sign In with Credentials

```typescript
"use client";
import { signIn } from "next-auth/react";

const handleLogin = async (email: string, password: string) => {
  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    console.error(result.error);
  } else {
    // Success! Redirect to dashboard
    router.push("/dashboard");
  }
};
```

### Sign In with Google

```typescript
"use client";
import { signIn } from "next-auth/react";

const handleGoogleLogin = () => {
  signIn("google", { callbackUrl: "/dashboard" });
};
```

### Get Current User Session

```typescript
"use client";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <p>Email: {session.user.email}</p>
      <p>Business: {session.user.businessName}</p>
      <p>User ID: {session.user.id}</p>
    </div>
  );
}
```

### Get Session in Server Components

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ServerPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <div>Hello {session.user.name}</div>;
}
```

### Update User Profile

```typescript
import { updateUserProfile } from '@/lib/auth';

const result = await updateUserProfile(userId, {
  name: 'John Doe',
  businessName: 'John's Photography',
  phone: '+1234567890',
});
```

---

## 🔧 Next Steps

### 1. Wrap Your App with SessionProvider

Update your `app/layout.tsx`:

```typescript
"use client";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

### 2. Protect Routes with Middleware

Create `middleware.ts` in the root:

```typescript
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clients/:path*",
    "/appointments/:path*",
    "/invoices/:path*",
  ],
};
```

### 3. Build Your Login/Signup Pages

Now you can build your login and signup forms in:

- `app/login/page.tsx`
- `app/signup/page.tsx`

### 4. Link Everything to the Logged-in User

When creating clients, appointments, or invoices:

```typescript
const session = await getServerSession(authOptions);
const userId = session?.user.id;

// Create a client for this user
await Client.create({
  userId, // Link to the logged-in user
  name: "Client Name",
  email: "client@example.com",
  // ...
});
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'bcryptjs'"

- Make sure you installed: `npm install bcryptjs @types/bcryptjs`

### Error: "NEXTAUTH_SECRET is not defined"

- Add `NEXTAUTH_SECRET` to your `.env.local`

### Google OAuth not working

- Check your redirect URIs in Google Cloud Console
- Make sure they match exactly: `http://localhost:3000/api/auth/callback/google`

### Session returns null

- Make sure you wrapped your app with `SessionProvider`
- Check that `NEXTAUTH_URL` is set correctly

---

## 📚 Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Google Cloud Console](https://console.cloud.google.com/)

---

**Your authentication system is ready! 🎉**

You can now build your login/signup forms and start creating the rest of your WorkHub features (clients, appointments, invoices).
