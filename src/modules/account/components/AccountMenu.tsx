"use client";

import { useRouter } from "next/navigation";

import { authService } from "@/core/auth/auth.service";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

import { Button } from "@/components/ui/button";
import { useActiveEmployee } from "@/modules/employee-profile/EmployeeIdentityProvider";
import { isProPlanActive } from "@/modules/subscription/subscription-policy";

import { ShieldCheck, UserRoundX, } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  mobile?: boolean;
}

export default function AccountMenu({
  open,
  onClose,
  mobile = false,
}: Props) {

  const router = useRouter();

  const { workspace } =
    useWorkspace();

  const { employee, switchEmployee } = useActiveEmployee();

  if (!open || !workspace) {
    return null;
  }

  const {
    company,
    user,
  } = workspace;
  const plan = isProPlanActive(company) ? "pro" : "starter";

  const content = (

    <>
      <div className="flex items-center gap-4">

        <div
          className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-violet-600
          text-lg
          font-bold
          text-white
          "
        >
          {(employee?.fullName || user.fullName)
            .charAt(0)
            .toUpperCase()}
        </div>

        <div>

          <div className="font-semibold">
            {employee?.fullName || user.fullName}
          </div>

          {employee?.nik && <div className="text-xs text-muted-foreground">NIK {employee.nik}</div>}

          <div className="text-sm text-muted-foreground">
            {company.name}
          </div>

        </div>

      </div>

      <div className="mt-5 rounded-xl border p-3">
        <p className="text-sm font-semibold">Profil karyawan aktif</p>
        <p className="mt-1 text-xs text-muted-foreground">Gunakan Ganti karyawan sebelum perangkat ini dipakai karyawan lain.</p>
        <Button type="button" variant="outline" className="mt-3 w-full" onClick={() => { switchEmployee(); onClose(); }}>Ganti karyawan</Button>
      </div>

      <div className="mt-6 space-y-3">

        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => {

            onClose();

            router.push(
              "/dashboard/subscription"
            );

          }}
        >

          <span>
            💳 Paket Langganan
          </span>

          <span className="capitalize font-semibold text-violet-600">

            {plan}

          </span>

        </Button>

        {plan === "starter" && (

          <Button
            className="w-full"
            onClick={() => {

              onClose();

              router.push(
                "/dashboard/subscription"
              );

            }}
          >

            🚀 Upgrade ke PRO

          </Button>

        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            window.open(
              "https://wa.me/6285710255464?text=Halo%20KS25%20Digital%20Studio",
              "_blank"
            )
          }
        >

          ❓ Bantuan

        </Button>

        <Button
  variant="outline"
  className="w-full justify-start"
  onClick={() => {
    onClose();

    router.push("/privacy-policy");
  }}
>
  <ShieldCheck className="mr-2 h-4 w-4" />

  Kebijakan Privasi
</Button>

<Button
  variant="outline"
  className="w-full justify-start"
  onClick={() => {
    onClose();

    router.push("/delete-account");
  }}
>
  <UserRoundX className="mr-2 h-4 w-4" />

  Hapus Akun
</Button>

        <Button
          variant="destructive"
          className="w-full"
          onClick={async () => {

            await authService.logout();

          }}
        >

          Logout

        </Button>

      </div>

    </>

  );

  return (

    <>

      <div
        className="
        fixed
        inset-0
        z-50
        bg-black/60
        "
        onClick={onClose}
      />

      {mobile ? (

        <div
          className="
          fixed
          bottom-0
          left-0
          right-0
          z-[60]
          max-h-[85dvh]
          overflow-y-auto
          rounded-t-3xl
          bg-background
          p-6
          "
        >

          <div
            className="
            mx-auto
            mb-5
            h-1.5
            w-14
            rounded-full
            bg-muted
            "
          />

          {content}

        </div>

      ) : (

        <div
          className="
          fixed
          right-6
          top-20
          z-[60]
          w-80
          max-h-[85dvh]
          overflow-y-auto
          rounded-2xl
          border
          bg-background
          p-6
          shadow-xl
          "
        >

          {content}

        </div>

      )}

    </>

  );

}
