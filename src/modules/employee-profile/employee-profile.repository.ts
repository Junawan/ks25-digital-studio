import { doc, getDoc, runTransaction } from "firebase/firestore";
import { db } from "@/core/firebase";
import type { EmployeeProfile, EmployeeProfileDocument } from "./employee-profile.types";

const COLLECTION = "company_employee_profiles";
const PIN_ITERATIONS = 120_000;
const PIN_LENGTH = 6;

function normalizeNik(nik: string) {
  return nik.trim().toLocaleUpperCase("id-ID");
}

function profileRef(companyId: string, nik: string) {
  const id = encodeURIComponent(`${companyId}:${normalizeNik(nik)}`);
  return doc(db, COLLECTION, id);
}

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashPin(pin: string, salt: Uint8Array<ArrayBuffer>, iterations: number) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveBits"]);
  const hash = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
  return toHex(new Uint8Array(hash));
}

function fromHex(value: string) {
  const bytes = value.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) ?? [];
  const result = new Uint8Array(new ArrayBuffer(bytes.length));
  result.set(bytes);
  return result;
}

function isValidPin(pin: string) {
  return new RegExp(`^\\d{${PIN_LENGTH}}$`).test(pin);
}

function employeeFromData(data: Record<string, unknown>): EmployeeProfile {
  return {
    fullName: typeof data.fullName === "string" ? data.fullName : "",
    nik: typeof data.nik === "string" ? data.nik : "",
    hireDate: typeof data.hireDate === "string" ? data.hireDate : "",
  };
}

export async function getEmployeeProfile(companyId: string, nik: string) {
  const snapshot = await getDoc(profileRef(companyId, nik));
  return snapshot.exists() ? employeeFromData(snapshot.data()) : null;
}

export async function registerEmployeeProfile(
  companyId: string,
  input: EmployeeProfile & { pin: string; hireDate: string },
): Promise<EmployeeProfile> {
  const normalizedNik = normalizeNik(input.nik);
  const normalizedName = input.fullName.trim().toLocaleUpperCase("id-ID");
  if (!normalizedName) throw new Error("Nama karyawan wajib diisi.");
  if (!normalizedNik) throw new Error("NIK wajib diisi.");
  if (!input.hireDate) throw new Error("Tanggal mulai bekerja wajib diisi.");
  if (!isValidPin(input.pin)) throw new Error("PIN harus terdiri dari 6 angka.");

  const salt = crypto.getRandomValues(new Uint8Array(new ArrayBuffer(16)));
  const saltHex = toHex(salt);
  const pinHash = await hashPin(input.pin, salt, PIN_ITERATIONS);
  const ref = profileRef(companyId, normalizedNik);

  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (snapshot.exists() && typeof snapshot.data().pinHash === "string") {
      throw new Error("NIK ini sudah memiliki PIN. Masuk dengan PIN yang terdaftar.");
    }

    const existing = snapshot.exists() ? employeeFromData(snapshot.data()) : null;
    const employee = existing?.fullName
      ? { fullName: existing.fullName.toLocaleUpperCase("id-ID"), nik: normalizedNik, hireDate: input.hireDate }
      : { fullName: normalizedName, nik: normalizedNik, hireDate: input.hireDate };
    const now = new Date();
    transaction.set(ref, {
      companyId,
      ...employee,
      hireDate: input.hireDate,
      pinHash,
      pinSalt: saltHex,
      pinIterations: PIN_ITERATIONS,
      createdAt: snapshot.exists() ? snapshot.data().createdAt ?? now : now,
      updatedAt: now,
    } satisfies EmployeeProfileDocument);
    return employee;
  });
}

export async function verifyEmployeePin(companyId: string, nik: string, pin: string) {
  const normalizedNik = normalizeNik(nik);
  if (!normalizedNik || !isValidPin(pin)) return null;

  const snapshot = await getDoc(profileRef(companyId, normalizedNik));
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  if (typeof data.pinHash !== "string" || typeof data.pinSalt !== "string") return null;
  const iterations = typeof data.pinIterations === "number" ? data.pinIterations : PIN_ITERATIONS;
  const candidate = await hashPin(pin, fromHex(data.pinSalt), iterations);
  if (candidate !== data.pinHash) return null;
  return employeeFromData(data);
}
