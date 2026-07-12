"use client";

import Link from "next/link";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

import { MODULE_INFO } from "@/modules/module/module-info";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useRouter } from "next/navigation";
import { useAndroidBack } from "@/hooks/useAndroidBack";

export default function MyAppsPage() {
  const { workspace, loading } = useWorkspace();
  const router = useRouter();

  useAndroidBack(() => {
      router.back();
      return true;
    });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!workspace) {
    return <div>Workspace tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          My Apps
        </h1>

        <p className="text-muted-foreground">
          Semua aplikasi yang sudah diinstall.
        </p>
      </div>

      {workspace.modules.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Belum ada aplikasi
            </CardTitle>

            <CardDescription>
              Install aplikasi melalui Marketplace.
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Link href="/marketplace">
              <Button>
                Buka Marketplace
              </Button>
            </Link>
          </CardFooter>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

        {workspace.modules.map((item) => {
          const module =
            MODULE_INFO[item.moduleId];

          if (!module) return null;

          return (
            <Card key={item.moduleId}>

              <CardHeader>

                <CardTitle>
                  {module.name}
                </CardTitle>

                <CardDescription>
                  {module.description}
                </CardDescription>

              </CardHeader>

              <CardContent>

                <p className="text-sm text-green-600 font-medium">
                  ✓ Terpasang
                </p>

              </CardContent>

              <CardFooter>

                <Link
                  href={module.route}
                  className="w-full"
                >
                  <Button className="w-full">
                    Buka Aplikasi
                  </Button>
                </Link>

              </CardFooter>

            </Card>
          );
        })}

      </div>

    </div>
  );
}