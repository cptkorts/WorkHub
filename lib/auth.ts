"use server";

import bcrypt from "bcryptjs";
import { connectDB } from "./mongodb";
import User, { IUser } from "./models/User";

interface SignupResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
}

/**
 * Sign up a new user with email and password
 */
export async function signup(formData: FormData): Promise<SignupResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const businessName = formData.get("businessName") as string;

  const errors: Record<string, string> = {};

  // Validation
  if (!email || !email.includes("@")) {
    errors.email = "Please provide a valid email address";
  }

  if (!password || password.trim().length < 8) {
    errors.password = "Password must be at least 8 characters long";
  }

  if (!name || name.trim().length < 2) {
    errors.name = "Please provide your name";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  try {
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return {
        success: false,
        errors: { email: "An account with this email already exists" },
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
      businessName: businessName?.trim() || undefined,
      provider: "credentials",
    });

    return {
      success: true,
      message: "Account created successfully! Please sign in.",
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      errors: { general: "An error occurred during signup. Please try again." },
    };
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<IUser | null> {
  try {
    await connectDB();
    const user = await User.findById(userId).select("-password");
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: Partial<
    Pick<IUser, "name" | "businessName" | "phone" | "address" | "logo">
  >
): Promise<SignupResult> {
  try {
    await connectDB();

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!user) {
      return { success: false, errors: { general: "User not found" } };
    }

    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      errors: { general: "Failed to update profile. Please try again." },
    };
  }
}
