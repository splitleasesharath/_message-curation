import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is a placeholder - in production, verify credentials against database
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findFirst({
            where: { email: credentials.email },
          });

          if (!user) {
            return null;
          }

          // In production, verify password hash here
          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        return token;
      }

      try {
        const dbUser = await prisma.user.findFirst({
          where: {
            email: token.email!,
          },
        });

        if (!dbUser) {
          return token;
        }

        return {
          id: dbUser.id,
          name: `${dbUser.firstName} ${dbUser.lastName}`,
          email: dbUser.email,
          role: dbUser.role,
          picture: dbUser.profilePhotoUrl,
        };
      } catch (error) {
        console.error('JWT callback error:', error);
        return token;
      }
    },
  },
};

export function requireAdmin(userRole: string): boolean {
  return userRole === 'ADMIN' || userRole === 'SUPPORT_STAFF';
}
