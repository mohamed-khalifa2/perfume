"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = String((error as { message: string }).message);

    if (message.toLowerCase().includes("invalid login credentials")) {
      return "The email or password you entered is incorrect.";
    }
    if (message.toLowerCase().includes("email not confirmed")) {
      return "Please verify your email address before signing in.";
    }
    if (message.toLowerCase().includes("too many requests")) {
      return "Too many sign-in attempts. Please try again in a moment.";
    }
    if (message.toLowerCase().includes("network")) {
      return "Network error. Please check your connection and try again.";
    }

    return message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Something went wrong while signing in. Please try again.";
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) {
          setError(getErrorMessage(signInError));
          return;
        }

        router.replace("/admin");
        router.refresh();
      } catch (err) {
        setError(getErrorMessage(err));
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-md border border-paper/15 p-10">
        <p className="text-xs uppercase tracking-label text-gold">Admin</p>
        <h1 className="mt-4 font-display text-3xl text-paper">Sign in</h1>
        <p className="mt-3 text-sm text-paper/60">
          Access the Maison Noir control panel
        </p>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="email"
              className="text-xs uppercase tracking-label text-paper/70"
            >
              Email address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isPending}
              className="mt-3 border-paper/20 bg-transparent text-paper placeholder:text-paper/40 focus-visible:border-gold focus-visible:ring-0"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-xs uppercase tracking-label text-paper/70"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isPending}
              className="mt-3 border-paper/20 bg-transparent text-paper placeholder:text-paper/40 focus-visible:border-gold focus-visible:ring-0"
            />
          </div>

          {error ? (
            <div
              role="alert"
              aria-live="polite"
              className="border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-paper"
            >
              {error}
            </div>
          ) : null}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-paper text-ink transition-colors hover:bg-gold hover:text-paper"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
