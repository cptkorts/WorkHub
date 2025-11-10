import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extends the built-in session.user properties
   */
  interface User {
    id: string;
    email: string;
    name: string;
    businessName?: string;
    logo?: string;
    phone?: string;
    provider?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      businessName?: string;
      logo?: string;
      phone?: string;
      provider?: string;
    };
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the built-in JWT properties
   */
  interface JWT {
    id: string;
    email: string;
    name: string;
    businessName?: string;
    logo?: string;
    phone?: string;
    provider?: string;
  }
}
