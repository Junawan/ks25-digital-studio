"use client";

import { QRCodeSVG } from "qrcode.react";

import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogDescription,
} from "@/shared/components/ui/dialog";

interface Props {

open:boolean;

onOpenChange:(open:boolean)=>void;

companyId:string;

workstationId:string;

}

export default function ScannerPairingDialog({

open,

onOpenChange,

companyId,

workstationId,

}:Props){

const value=

`ks25://scanner?companyId=${companyId}&workstationId=${workstationId}`;

return(

<Dialog
open={open}
onOpenChange={onOpenChange}
>

<DialogContent
className="sm:max-w-md"
>

<DialogHeader>

<DialogTitle>

Hubungkan Scanner

</DialogTitle>

<DialogDescription>

Scan QR menggunakan
Aplikasi KS25 POS.
Atau tutup QRcode ini
jika sudah tersambung.

</DialogDescription>

</DialogHeader>

<div
className="
flex
justify-center
py-6
"
>

<div
className="
rounded-xl
bg-white
p-4
"
>

<QRCodeSVG
value={value}
size={220}
/>

</div>

</div>

</DialogContent>

</Dialog>

);

}