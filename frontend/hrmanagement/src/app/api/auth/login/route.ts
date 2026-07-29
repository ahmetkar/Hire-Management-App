import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const response = await fetch("https://api.ahmetkar.com/auth/user-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  const nextResponse = NextResponse.json(data, {
    status: response.status,
  });

  const cookies = response.headers.getSetCookie();

  for (const cookie of cookies) {
    const [nameValue] = cookie.split(";");
    const [name, value] = nameValue.split("=");

    if (name === "access_token") {
      nextResponse.cookies.set("access_token", value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 2,
      });
    }

    if (name === "refresh_token") {
      nextResponse.cookies.set("refresh_token", value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    }
  }

  return nextResponse;
}