import { NextResponse } from "next/server";
import { getAdminDb } from "@/core/firebase/admin";
import { verifyFirebaseIdToken } from "@/core/firebase/verifyIdToken";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const snap = await getAdminDb().collection("invitations").doc(slug).get();
  const data = snap.data();
  const expires = data?.expiredAt?.toDate?.() ?? (data?.expiredAt ? new Date(data.expiredAt) : null);
  const preview = new URL(request.url).searchParams.get("preview") === "1";
  if (preview) {
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ error: "Akses pratinjau memerlukan login." }, { status: 401 });
    try {
      const user = await verifyFirebaseIdToken(token);
      if (!snap.exists || data?.ownerUid !== user.uid) return NextResponse.json({ error: "Undangan tidak ditemukan." }, { status: 404 });
    } catch {
      return NextResponse.json({ error: "Sesi login tidak valid." }, { status: 401 });
    }
  } else if (!snap.exists || data?.status !== "active" || (expires && expires.getTime() < Date.now())) {
    return NextResponse.json({ error: "Undangan tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json({ id: snap.id, ...data }, { headers: { "Cache-Control": "no-store" } });
}
