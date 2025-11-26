// src/components/AuthButtons.tsx
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Button } from "./ui/button";

export function AuthButtons() {
  return (
    <div className="fixed top-5 right-24 z-50">
      <SignedOut>
        <SignInButton mode="modal">
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
}