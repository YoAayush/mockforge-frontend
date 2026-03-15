// import { createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";

// export const createClient = async () => {
//   const cookieStore = await cookies();

//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get: (name: string) => cookieStore.get(name)?.value,
//         set: (name: string, value: string, options) => {
//           cookieStore.set({ name, value, ...options });
//         },
//         remove: (name: string, options) => {
//           cookieStore.set({ name, value: "", ...options });
//         },
//       },
//     },
//   );
// };



// /src/proxy.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   console.log("Proxy running:", request.nextUrl.pathname);

//   // routes that require login
//   const protectedRoutes = ["/dashboard", "/profile", "/settings"];

//   // auth pages
//   const authRoutes = ["/auth/login", "/auth/signup"];

//   const sessionCookie = request.cookies
//     .getAll()
//     .find((cookie) => cookie.name.includes("auth-token"));

//   let accessToken: string | null = null;
//   let id: string | null = null;

//   // extract access_token if cookie exists
//   if (sessionCookie) {
//     try {
//       const session = JSON.parse(sessionCookie.value);
//       accessToken = session.access_token;
//       id = session.user.id;
//     } catch {
//       accessToken = null;
//     }
//   }

//   const isProtectedRoute = protectedRoutes.some((route) =>
//     pathname.startsWith(route),
//   );

//   const isAuthRoute = authRoutes.includes(pathname);

//   // not logged in → trying to access protected route
//   if (!accessToken && isProtectedRoute) {
//     return NextResponse.redirect(new URL("/auth/login", request.url));
//   }

//   // logged in → trying to access login/signup
//   if (accessToken && isAuthRoute) {
//     return NextResponse.redirect(new URL(`/dashboard/${id}`, request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/profile/:path*",
//     "/settings/:path*",
//     "/auth/:path*",
//   ],
// };

