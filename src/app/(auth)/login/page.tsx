"use client";

import Link from "next/link";

import { useLogin } from "@/core/auth/use-login";

import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function LoginPage() {
  const { form, loading, error, onSubmit } = useLogin();

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">
            KS25 Digital Studio
          </CardTitle>

          <CardDescription>
            Masuk menggunakan email dan password Anda.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                autoFocus
                placeholder="nama@email.com"
                {...form.register("email")}
              />

              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">
                  Password
                </Label>

                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Lupa Password?
                </Link>
              </div>

              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Masukkan password"
                {...form.register("password")}
              />

              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
                <p className="text-sm text-destructive">
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Sedang Masuk..."
                : "Masuk"}
            </Button>

            <div className="border-t pt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Belum memiliki akun?
              </p>

              <Link
                href="/register"
                className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
              >
                Daftar Sekarang
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}