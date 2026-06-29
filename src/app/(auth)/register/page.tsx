"use client";

import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";

import { useRegister } from "@/core/auth/use-register";

export default function RegisterPage() {
  const { form, loading, error, onSubmit } = useRegister();

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>KS25 Digital Studio</CardTitle>
          <CardDescription>
            Buat akun baru
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Nama Lengkap
              </Label>

              <Input
                id="fullName"
                {...form.register("fullName")}
              />

              <p className="text-sm text-red-500">
                {
                  form.formState.errors.fullName
                    ?.message
                }
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">
                Nama Perusahaan
              </Label>

              <Input
                id="companyName"
                {...form.register("companyName")}
              />

              <p className="text-sm text-red-500">
                {
                  form.formState.errors.companyName
                    ?.message
                }
              </p>
            </div>

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
                {
                  form.formState.errors.email
                    ?.message
                }
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
                {
                  form.formState.errors.password
                    ?.message
                }
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Konfirmasi Password
              </Label>

              <Input
                id="confirmPassword"
                type="password"
                {...form.register("confirmPassword")}
              />

              <p className="text-sm text-red-500">
                {
                  form.formState.errors
                    .confirmPassword?.message
                }
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
              {loading
                ? "Memproses..."
                : "Daftar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}