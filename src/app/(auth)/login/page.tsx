"use client";

import Link from "next/link";

import { useLogin } from "@/core/auth/use-login";

import { Button } from "@/shared/components/ui/button";
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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>KS25 Digital Studio</CardTitle>
          <CardDescription>
            Masuk ke akun Anda
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                {...form.register("email")}
              />

              <p className="text-sm text-red-500">
                {form.formState.errors.email?.message}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                {...form.register("password")}
              />

              <p className="text-sm text-red-500">
                {form.formState.errors.password?.message}
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Masuk"}
            </Button>

            <div className="flex justify-between text-sm">
              <Link
                href="/register"
                className="text-primary hover:underline"
              >
                Daftar
              </Link>

              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                Lupa Password?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}