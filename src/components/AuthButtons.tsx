// src/components/AuthButtons.tsx
import { Authenticated, Unauthenticated } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "./ui/button";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function AuthButtons() {
  const { signIn, signOut } = useAuthActions();
  const user = useQuery(api.auth.loggedInUser);

  return (
    <div style={{ position: "fixed", top: "1rem", right: "6rem", zIndex: 100 }}>
      <Unauthenticated>
        <Button onClick={() => void signIn("google")}>Sign In with Google</Button>
      </Unauthenticated>

      <Authenticated>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Avatar style={{ width: "2rem", height: "2rem" }}>
                {user.image && <AvatarImage src={user.image} alt={user.name} />}
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{user.name}</span>
            </div>
          )}
          <Button onClick={() => void signOut()}>Sign Out</Button>
        </div>
      </Authenticated>
    </div>
  );
}