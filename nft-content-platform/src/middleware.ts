import { NextRequest, NextResponse } from "next/server";

async function isWalletBanned(request: NextRequest) {
  let cookie = request.cookies.get("userId")?.value;
  if (cookie) {
    const req = await fetch("http://localhost:3010/user/status/" + cookie);
    const res = await req.json();
    if (res.status === false) {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const bannedWallet = await isWalletBanned(request);
  if (bannedWallet) {
    return NextResponse.redirect("http://localhost:3000/banned");
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*Match all request paths except for the ones starting with the following! */
    "/((?!api|_next/static|_next/image|favicon.ico|admin|banned).*)",
  ],
};
