// convex/auth.ts
import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google"; 
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
});

// This query fetches the user document for the currently logged-in user.
export const loggedInUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    // 'users' is the table name @convex-dev/auth uses by default.
    return await ctx.db.get(userId);
  },
});