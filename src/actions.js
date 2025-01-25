import { getIronSession } from "iron-session";
import { sessionOptions, defaultSession } from "./lib";
import { cookies } from "next/headers";
import User from "./models/User";
import { redirect } from "next/navigation";


import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const getSession = async () => {
  return await getServerSession(authOptions);
};


export const getUser = async ({ req, res }) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { password, ...userData } = user.toObject();
        res.status(200).json(userData);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const login = async (prevState, formData) => {
    const session = await getSession();

    const formUsername = formData.get("username");
    const formPassword = formData.get("password");

    if (!formUsername || !formPassword) {
        return { error: "Both username and password are required!" };
    }

    const user = await User.findOne({ name: formUsername });

    if (!user || user.password !== formPassword) {
        return { error: "Wrong Credentials!" };
    }

    session.userId = user._id.toString();
    session.username = user.name;
    session.isPro = user.isPro;
    session.isBlocked = user.isBlocked;
    session.isLoggedIn = true;

    await session.save();
    redirect("/");
};


export const logout = async () => {
    const session = await getSession();
    session.destroy();
    redirect("/");
};

// Utility to toggle premium status
export const changePremium = async () => {
    const session = await getSession();

    session.isPro = !session.isPro;
    await session.save();
    redirect("/profile");
};


export const changeUsername = async (formData) => {
    const session = await getSession();

    const newUsername = formData.get("username");

    if (!newUsername) {
        throw new Error("Username is required");
    }

    const user = await User.findById(session.userId);
    if (!user) {
        throw new Error("User not found");
    }

    user.name = newUsername;
    await user.save();

    session.username = newUsername;
    await session.save();
    redirect("/profile");
};