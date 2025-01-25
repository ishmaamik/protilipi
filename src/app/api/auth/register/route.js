import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    const { name, email, password } = await request.json();

    // Connect to the database
    await connect();

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new NextResponse("Email already in use", { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isPro: false, // Default role for new users
      isBlocked: false, // Default status for new users
    });

    await newUser.save();

    return new NextResponse("User has been created", {
      status: 201,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    return new NextResponse(err.message || "Internal server error", {
      status: 500,
    });
  }
};
