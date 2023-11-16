import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        const callbackUrl = nextUrl.pathname;
        // Redirect unauthenticated users to login page with callbackUrl
        return Response.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl));
      }
      
      if (isLoggedIn) {
        if (nextUrl.href.includes('callbackUrl')) {
          const callbackUrl = decodeURIComponent(nextUrl.href.split('?callbackUrl=')[1]);
          return Response.redirect(new URL(callbackUrl, nextUrl));
        }
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;