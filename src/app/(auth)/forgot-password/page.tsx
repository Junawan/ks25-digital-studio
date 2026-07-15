"use client";

import Link from "next/link";

import { useForgotPassword } from "@/core/auth/use-forgot-password";

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

export default function ForgotPasswordPage() {
  const {
    form,
    loading,
    error,
    success,
    onSubmit,
  } = useForgotPassword();

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">
            Lupa Password
          </CardTitle>

          <CardDescription>
            Masukkan email akun Anda. Kami akan mengirimkan tautan
            untuk mengatur ulang password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="space-y-6">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                <h3 className="mb-2 text-lg font-semibold text-green-700 dark:text-green-400">
                  ✓ Email Terkirim
                </h3>

                <p className="text-sm text-muted-foreground">
                  Jika email yang Anda masukkan terdaftar, kami telah
                  mengirimkan tautan untuk mengatur ulang password.
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                  Silakan periksa folder <strong>Inbox</strong>,
                  <strong> Spam</strong>, atau
                  <strong> Promosi</strong>.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={() =>
                    form.handleSubmit(onSubmit)()
                  }
                >
                  {loading
                    ? "Mengirim..."
                    : "Kirim Ulang Email"}
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                >
                  <Link href="/login">
                    Kembali ke Login
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
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
                  autoFocus
                  placeholder="nama@email.com"
                  {...form.register("email")}
                />

                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {
                      form.formState.errors.email
                        ?.message
                    }
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
                  ? "Mengirim Link..."
                  : "Kirim Link Reset Password"}
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-primary hover:underline"
                >
                  ← Kembali ke Login
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}