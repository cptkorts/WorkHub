import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please provide both email and password");
          }

          await connectDB();

          // Find user by email (case-insensitive)
          const user = await User.findOne({
            email: credentials.email.toLowerCase(),
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          // Check if user signed up with credentials
          if (!user.password) {
            throw new Error(
              "Please sign in with the provider you used to sign up"
            );
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            businessName: user.businessName,
            logo: user.logo,
            phone: user.phone,
            provider: "credentials",
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await connectDB();

          // Check if user exists
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user for Google sign-in
            await User.create({
              email: user.email,
              name: user.name || profile?.name,
              provider: "google",
              emailVerified: new Date(),
            });
          } else if (existingUser.provider !== "google") {
            // User exists but signed up with different provider
            return false;
          }

          return true;
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.businessName = user.businessName;
        token.logo = user.logo;
        token.phone = user.phone;
        token.provider = user.provider || account?.provider;
      }

      // Fetch fresh user data from database
      if (token.email) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.name = dbUser.name;
            token.businessName = dbUser.businessName;
            token.logo = dbUser.logo;
            token.phone = dbUser.phone;
          }
        } catch (error) {
          console.error("Error fetching user in JWT callback:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.businessName = token.businessName;
        session.user.logo = token.logo;
        session.user.phone = token.phone;
        session.user.provider = token.provider;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
