import {
  addDoc, collection, doc, getDoc, getDocs, orderBy, query, runTransaction, updateDoc, where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/core/firebase";
import type { AttendanceArticle, AttendanceEmployee, AttendancePunch, AttendanceRecord, LeaveRequest, LeaveStatus } from "./attendance.types";

const COLLECTIONS = { records: "attendance_records", articles: "attendance_articles", leave: "attendance_leave_requests", employees: "company_employee_profiles", admin: "attendance_admin_pin" } as const;
const fromSnapshot = <T extends { id: string }>(snapshots: { docs: Array<{ id: string; data(): Record<string, unknown> }> }): T[] => snapshots.docs.map((entry) => ({ ...entry.data(), id: entry.id, createdAt: dateValue(entry.data().createdAt), updatedAt: dateValue(entry.data().updatedAt) } as unknown as T));
const dateValue = (value: unknown) => value && typeof (value as { toDate?: () => Date }).toDate === "function" ? (value as { toDate: () => Date }).toDate() : value instanceof Date ? value : new Date(typeof value === "string" || typeof value === "number" ? value : Date.now());
const normalized = (value: string) => value.trim().toLocaleUpperCase("id-ID");
const recordId = (companyId: string, date: string, nik: string) => encodeURIComponent(`${companyId}:${date}:${normalized(nik)}`);
const profileId = (companyId: string, nik: string) => encodeURIComponent(`${companyId}:${normalized(nik)}`);
const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const attendanceRepository = {
  async employee(companyId: string, nik: string): Promise<AttendanceEmployee | null> {
    const snapshot = await getDoc(doc(db, COLLECTIONS.employees, profileId(companyId, nik)));
    if (!snapshot.exists()) return null;
    const data = snapshot.data();
    return { fullName: String(data.fullName ?? "Karyawan"), nik: String(data.nik ?? normalized(nik)), hireDate: typeof data.hireDate === "string" ? data.hireDate : "" };
  },
  async employees(companyId: string): Promise<AttendanceEmployee[]> {
    const snapshot = await getDocs(query(collection(db, COLLECTIONS.employees), where("companyId", "==", companyId)));
    return snapshot.docs.map((entry) => ({ fullName: String(entry.data().fullName ?? "Karyawan"), nik: String(entry.data().nik ?? ""), hireDate: typeof entry.data().hireDate === "string" ? entry.data().hireDate : "" }));
  },
  async today(companyId: string, date = localDate()): Promise<AttendanceRecord[]> {
    try {
      const snapshot = await getDocs(query(collection(db, COLLECTIONS.records), where("companyId", "==", companyId), where("date", "==", date)));
      return fromSnapshot<AttendanceRecord>(snapshot);
    } catch {
      const snapshot = await getDocs(query(collection(db, COLLECTIONS.records), where("companyId", "==", companyId)));
      return fromSnapshot<AttendanceRecord>(snapshot).filter((record) => record.date === date);
    }
  },
  async history(companyId: string, nik: string, start: string, end: string): Promise<AttendanceRecord[]> {
    try {
      const snapshot = await getDocs(query(collection(db, COLLECTIONS.records), where("companyId", "==", companyId), where("employeeNik", "==", normalized(nik)), where("date", ">=", start), where("date", "<=", end), orderBy("date", "desc")));
      return fromSnapshot<AttendanceRecord>(snapshot);
    } catch {
      const snapshot = await getDocs(query(collection(db, COLLECTIONS.records), where("companyId", "==", companyId)));
      return fromSnapshot<AttendanceRecord>(snapshot)
        .filter((record) => record.employeeNik === normalized(nik) && record.date >= start && record.date <= end)
        .sort((a, b) => b.date.localeCompare(a.date));
    }
  },
  async punch(companyId: string, employee: AttendanceEmployee, date: string, punch: AttendancePunch) {
    const ref = doc(db, COLLECTIONS.records, recordId(companyId, date, employee.nik));
    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(ref);
      const current = snapshot.exists() ? (snapshot.data().punches as AttendancePunch[] ?? []) : [];
      if (current.some((entry) => entry.stage === punch.stage)) throw new Error("Tahap absensi ini sudah tercatat hari ini.");
      const expected: AttendancePunch["stage"] = current.length === 0 ? "checkIn" : current.at(-1)?.stage === "checkIn" ? "breakOut" : current.at(-1)?.stage === "breakOut" ? "breakIn" : current.at(-1)?.stage === "breakIn" ? "checkOut" : "checkOut";
      if (punch.stage !== expected) throw new Error("Lanjutkan absensi sesuai urutan yang tersedia.");
      const now = new Date();
      transaction.set(ref, { companyId, employeeNik: normalized(employee.nik), employeeName: employee.fullName, date, punches: [...current, punch], createdAt: snapshot.exists() ? snapshot.data().createdAt : now, updatedAt: now });
    });
  },
  async uploadSelfie(companyId: string, date: string, nik: string, stage: string, file: Blob) {
    const target = ref(storage, `attendance/${companyId}/${date}/${encodeURIComponent(nik)}_${stage}_${Date.now()}.jpg`);
    await uploadBytes(target, file, { contentType: "image/jpeg" });
    return getDownloadURL(target);
  },
  async articles(companyId: string): Promise<AttendanceArticle[]> {
    try {
      const snapshot = await getDocs(query(collection(db, COLLECTIONS.articles), where("companyId", "==", companyId), orderBy("createdAt", "desc")));
      return fromSnapshot<AttendanceArticle>(snapshot);
    } catch {
      const snapshot = await getDocs(query(collection(db, COLLECTIONS.articles), where("companyId", "==", companyId)));
      return fromSnapshot<AttendanceArticle>(snapshot).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  },
  addArticle: (companyId: string, title: string, body: string, author: string) => addDoc(collection(db, COLLECTIONS.articles), { companyId, title, body, author, createdAt: new Date() }),
  async leaveRequests(companyId: string, employeeNik?: string): Promise<LeaveRequest[]> {
    try {
      const constraints = employeeNik ? [where("companyId", "==", companyId), where("employeeNik", "==", normalized(employeeNik))] : [where("companyId", "==", companyId)];
      const snapshot = await getDocs(query(collection(db, COLLECTIONS.leave), ...constraints, orderBy("createdAt", "desc")));
      return fromSnapshot<LeaveRequest>(snapshot);
    } catch {
      const snapshot = await getDocs(query(collection(db, COLLECTIONS.leave), where("companyId", "==", companyId)));
      return fromSnapshot<LeaveRequest>(snapshot)
        .filter((request) => !employeeNik || request.employeeNik === normalized(employeeNik))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  },
  addLeave: (data: Omit<LeaveRequest, "id" | "createdAt">) => addDoc(collection(db, COLLECTIONS.leave), { ...data, employeeNik: normalized(data.employeeNik), createdAt: new Date() }),
  updateLeaveStatus: (id: string, status: LeaveStatus) => updateDoc(doc(db, COLLECTIONS.leave, id), { status, updatedAt: new Date() }),
  updateEmployeeHireDate: async (companyId: string, nik: string, hireDate: string) => {
    const profile = doc(db, COLLECTIONS.employees, profileId(companyId, nik));
    await updateDoc(profile, { hireDate, updatedAt: new Date() });
  },
  adminPin: (companyId: string) => getDoc(doc(db, COLLECTIONS.admin, encodeURIComponent(companyId))),
  saveAdminPin: async (companyId: string, hash: string, salt: string, createdBy: string) => {
    const ref = doc(db, COLLECTIONS.admin, encodeURIComponent(companyId));
    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(ref);
      if (snapshot.exists()) throw new Error("PIN admin sudah dibuat.");
      transaction.set(ref, { companyId, hash, salt, createdBy, createdAt: new Date() });
    });
  },
};
