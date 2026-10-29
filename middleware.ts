import { withAuth } from "next-auth/middleware";

// Protect these routes - user must be authenticated
export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    "/clients/:path*",
    "/appointments/:path*",
    "/invoices/:path*",
    "/analytics/:path*",
    "/profile/:path*",
    "/api/clients/:path*",
    "/api/appointments/:path*",
    "/api/invoices/:path*",
    "/api/analytics/:path*",
    "/api/user/:path*",
  ],
};
