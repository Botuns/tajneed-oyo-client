"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Please enter the access code.");
      return;
    }

    setIsLoading(true);

    // Small delay for UX feedback
    setTimeout(() => {
      const success = login(code);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Invalid access code. Please try again.");
        setCode("");
        inputRef.current?.focus();
      }
      setIsLoading(false);
    }, 400);
  };

  // Don't flash login page if already authenticated
  if (isAuthenticated) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo / Branding */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <LayoutDashboard className="size-7" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              MKA Oyo State
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Tajneed Attendance System
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center gap-2">
            <Lock className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">
              Enter Access Code
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                ref={inputRef}
                type="password"
                placeholder="Enter code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (error) setError("");
                }}
                className="h-11 bg-muted text-center text-base tracking-widest"
                autoComplete="off"
                disabled={isLoading}
              />
              {error && (
                <div className="flex items-center gap-1.5 text-sm text-destructive">
                  <AlertCircle className="size-3.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !code.trim()}
            >
              {isLoading ? (
                "Verifying..."
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Contact the State Qaid&apos;s office if you need access.
        </p>
      </div>
    </div>
  );
}
