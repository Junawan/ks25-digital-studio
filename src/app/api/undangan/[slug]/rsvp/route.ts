import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/core/firebase/admin";

type Context = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { slug } = await params;
  const db = getAdminDb();
  const invitation = await db.collection("invitations").doc(slug).get();
  const data = invitation.data();
  const expires = data?.expiredAt?.toDate?.() ?? (data?.expiredAt ? new Date(data.expiredAt) : null);
  if (!invitation.exists || data?.status !== "active" || (expires && expires.getTime() < Date.now())) return NextResponse.json({ error: "Undangan tidak ditemukan." }, { status: 404 });
  const entries = await db.collection("invitations").doc(slug).collection("rsvps").orderBy("createdAt", "desc").limit(100).get();
  return NextResponse.json(entries.docs.map((entry) => ({ id: entry.id, ...entry.data(), createdAt: entry.data().createdAt?.toDate?.().toISOString() ?? null })), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request, { params }: Context) {
  const { slug } = await params;
  const body = await request.json().catch(() => null) as { name?: string; message?: string; attendance?: string; guestCount?: number } | null;
  const name = body?.name?.trim().slice(0, 100);
  if (!name || !["hadir", "tidak-hadir"].includes(body?.attendance ?? "") || !Number.isInteger(body?.guestCount) || (body?.guestCount ?? 0) < 1 || (body?.guestCount ?? 0) > 20) return NextResponse.json({ error: "Data RSVP tidak valid." }, { status: 400 });
  const db = getAdminDb();
  const ref = db.collection("invitations").doc(slug);
  const invitation = await ref.get();
  const data = invitation.data();
  const expires = data?.expiredAt?.toDate?.() ?? (data?.expiredAt ? new Date(data.expiredAt) : null);
  if (!invitation.exists || data?.status !== "active" || (expires && expires.getTime() < Date.now())) return NextResponse.json({ error: "Undangan tidak ditemukan." }, { status: 404 });
  await ref.collection("rsvps").add({ name, attendance: body!.attendance, guestCount: body!.guestCount, message: (body?.message ?? "").trim().slice(0, 1000), createdAt: FieldValue.serverTimestamp() });
  return NextResponse.json({ ok: true }, { status: 201 });
}
