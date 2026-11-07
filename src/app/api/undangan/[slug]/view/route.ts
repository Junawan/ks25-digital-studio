import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/core/firebase/admin";

export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ref = getAdminDb().collection("invitations").doc(slug);
  const snap = await ref.get();
  if (!snap.exists || snap.data()?.status !== "active") return NextResponse.json({ error: "Undangan tidak ditemukan." }, { status: 404 });
  await ref.update({ views: FieldValue.increment(1) });
  return NextResponse.json({ ok: true });
}
