export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/message-curation/:path*', '/api/admin/:path*'],
};
