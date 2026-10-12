import {
  addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where, writeBatch,
  type DocumentData, type QuerySnapshot,
} from "firebase/firestore";
import { db } from "@/core/firebase";
import type { PackflowHistoryRecord, PackflowRecord, SupplyRequest } from "./packflow.types";

const COLLECTIONS = {
  items: "packflow_items",
  pending: "packflow_pending",
  history: "packflow_history",
  requests: "packflow_supply_requests",
} as const;

function fromSnapshot<T extends { id: string; companyId: string; createdAt: Date }>(snapshot: QuerySnapshot<DocumentData>): T[] {
  return snapshot.docs.map((entry) => {
    const data = entry.data();
    return { ...data, id: entry.id, createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt ?? Date.now()) } as T;
  });
}

async function list<T extends { id: string; companyId: string; createdAt: Date }>(name: string, companyId: string) {
  const result = await getDocs(query(collection(db, name), where("companyId", "==", companyId)));
  return fromSnapshot<T>(result).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export const packflowRepository = {
  items: (companyId: string) => list<PackflowRecord>(COLLECTIONS.items, companyId),
  pending: (companyId: string) => list<PackflowRecord>(COLLECTIONS.pending, companyId),
  history: (companyId: string) => list<PackflowHistoryRecord>(COLLECTIONS.history, companyId),
  requests: (companyId: string) => list<SupplyRequest>(COLLECTIONS.requests, companyId),
  addItem: (companyId: string, barcode: string) => addDoc(collection(db, COLLECTIONS.items), { companyId, barcode, timestamp: new Date().toLocaleString("id-ID"), createdAt: new Date() }),
  addPending: (companyId: string, barcode: string) => addDoc(collection(db, COLLECTIONS.pending), { companyId, barcode, timestamp: new Date().toLocaleString("id-ID"), createdAt: new Date() }),
  removeItem: (id: string) => deleteDoc(doc(db, COLLECTIONS.items, id)),
  processItem: (companyId: string, item: PackflowRecord) => moveToHistory(companyId, item, "items"),
  processPending: (companyId: string, item: PackflowRecord) => moveToHistory(companyId, item, "pending"),
  removePending: (id: string) => deleteDoc(doc(db, COLLECTIONS.pending, id)),
  addRequest: (data: Omit<SupplyRequest, "id" | "createdAt">) => addDoc(collection(db, COLLECTIONS.requests), { ...data, createdAt: new Date() }),
  updateRequestStatus: (id: string, status: SupplyRequest["status"]) => updateDoc(doc(db, COLLECTIONS.requests, id), { status }),
  removeRequest: (id: string) => deleteDoc(doc(db, COLLECTIONS.requests, id)),
};

async function moveToHistory(companyId: string, item: PackflowRecord, source: "items" | "pending") {
  const now = new Date();
  const historyRef = doc(collection(db, COLLECTIONS.history));
  const sourceRef = doc(db, COLLECTIONS[source], item.id);
  const batch = writeBatch(db);
  batch.set(historyRef, {
    companyId,
    barcode: item.barcode,
    date: now.toLocaleDateString("sv-SE"),
    time: now.toLocaleTimeString("id-ID"),
    createdAt: now,
  });
  batch.delete(sourceRef);
  await batch.commit();
}
