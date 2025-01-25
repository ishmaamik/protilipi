import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      return new Response(
        JSON.stringify({
          isLoggedIn: true,
          userId: session.user.id,
          username: session.user.name,
          isPro: session.user.isPro,
          isBlocked: session.user.isBlocked,
        }),
        { status: 200 }
      );
    }

    return new Response(JSON.stringify({ isLoggedIn: false }), { status: 200 });
  } catch (error) {
    console.error("Error fetching session:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch session" }),
      { status: 500 }
    );
  }
}
