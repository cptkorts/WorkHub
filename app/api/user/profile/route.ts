import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { fullName, phone, businessName, address, website } = body;

    // Prepare update data - only include defined fields
    const updateData: Record<string, string | undefined> = {
      name: fullName,
    };

    if (phone !== undefined) updateData.phone = phone;
    if (businessName !== undefined) updateData.businessName = businessName;
    if (address !== undefined) updateData.address = address;
    if (website !== undefined) updateData.website = website;

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        businessName: updatedUser.businessName,
        address: updatedUser.address,
        website: updatedUser.website,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const response = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        businessName: user.businessName || "",
        address: user.address || "",
        website: user.website || "",
        logo: user.logo || "",
        provider: user.provider,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
