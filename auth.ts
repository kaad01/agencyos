import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const githubAuthEnabled = Boolean(
  process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET,
);

const credentialsProvider = Credentials({
  name: "Demo credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(rawCredentials) {
    const parsed = credentialsSchema.safeParse(rawCredentials);
    if (!parsed.success) return null;

    const email = parsed.data.email.trim().toLowerCase();
    const localPart = email.split("@")[0] ?? "agency teammate";
    const readableName = localPart
      .split(/[._-]/g)
      .filter(Boolean)
      .map((chunk) => chunk[0]?.toUpperCase() + chunk.slice(1))
      .join(" ");

    return {
      id: email,
      email,
      name: readableName || "Agency Teammate",
    };
  },
});

const githubProviders = githubAuthEnabled
  ? [
      GitHub({
        clientId: process.env.AUTH_GITHUB_ID!,
        clientSecret: process.env.AUTH_GITHUB_SECRET!,
      }),
    ]
  : [];

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [credentialsProvider, ...githubProviders],
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  trustHost: true,
});
