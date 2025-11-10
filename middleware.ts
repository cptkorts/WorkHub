export { default } from "next-auth/middleware";

// Protect these routes - user must be authenticated
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clients/:path*",
    "/appointments/:path*",
    "/invoices/:path*",
    "/api/clients/:path*",
    "/api/appointments/:path*",
    "/api/invoices/:path*",
  ],
};
