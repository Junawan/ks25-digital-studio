"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Activity, ArrowDownToLine, ArrowLeft, CalendarOff, Camera, Check, ChevronRight, Clock3, ExternalLink, FileText, LayoutDashboard, MapPin, Settings, ShieldCheck, Users } from "lucide-react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import * as XLSX from "xlsx";
import { Capacitor, registerPlugin } from "@capacitor/core";
import { db } from "@/core/firebase";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { useActiveEmployee } from "@/modules/employee-profile/EmployeeIdentityProvider";
import { attendanceRepository } from "@/modules/attendance/attendance.repository";
import type { AttendanceArticle, AttendanceEmployee, AttendanceRecord, AttendanceStage, AttendanceWorkLocation, LeaveRequest } from "@/modules/attendance/attendance.types";
import { notificationService } from "@/modules/notification/notification.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";

type Section = "dashboard" | "absensi" | "riwayat" | "informasi" | "admin" | "cuti" | "pengaturan";
const AttendanceDownload = registerPlugin<{ save: (options: { fileName: string; mimeType: string; data: string }) => Promise<void> }>("AttendanceDownload");
const nav: { id: Section; label: string; Icon: typeof Activity }[] = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard }, { id: "absensi", label: "Absensi", Icon: Camera },
  { id: "riwayat", label: "Riwayat", Icon: Clock3 }, { id: "informasi", label: "Informasi", Icon: FileText },
  { id: "admin", label: "Admin", Icon: ShieldCheck }, { id: "cuti", label: "Cuti", Icon: CalendarOff },
  { id: "pengaturan", label: "Setelan", Icon: Settings },
];
const steps: { id: AttendanceStage; label: string }[] = [
  { id: "checkIn", label: "Absen masuk" }, { id: "breakOut", label: "Istirahat keluar" },
  { id: "breakIn", label: "Kembali masuk" }, { id: "checkOut", label: "Absen pulang" },
];
const nowDate = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
const normalized = (s: string) => s.trim().toLocaleUpperCase("id-ID");
const panel = "rounded-2xl border bg-card p-5 shadow-sm";
const prettyDate = (s: string) => s ? new Date(s + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "Belum diatur";
const eligible = (s?: string) => { if (!s) return false; const anniversary = new Date(s + "T00:00:00"); anniversary.setFullYear(anniversary.getFullYear() + 1); return new Date() >= anniversary; };
function toHex(bytes: Uint8Array) { return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(""); }
async function hashPin(pin: string, salt: Uint8Array) { const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveBits"]); const saltBuffer = new ArrayBuffer(salt.byteLength); new Uint8Array(saltBuffer).set(salt); const out = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: saltBuffer, iterations: 120000 }, key, 256); return toHex(new Uint8Array(out)); }

export default function AttendancePage() {
  const { workspace } = useWorkspace(); const { employee, switchEmployee } = useActiveEmployee(); const companyId = workspace?.company.id;
  const isOwnerAdmin = workspace?.user.role === "owner" || workspace?.user.role === "admin";
  const [section, setSection] = useState<Section>("dashboard"); const [records, setRecords] = useState<AttendanceRecord[]>([]); const [historyRows, setHistoryRows] = useState<AttendanceRecord[]>([]); const [reportRows, setReportRows] = useState<AttendanceRecord[]>([]);
  const [employeeInfo, setEmployeeInfo] = useState<AttendanceEmployee | null>(null); const [leaves, setLeaves] = useState<LeaveRequest[]>([]); const [articles, setArticles] = useState<AttendanceArticle[]>([]);
  const [locations, setLocations] = useState<AttendanceWorkLocation[]>([]); const [locationName, setLocationName] = useState(""); const [locationLat, setLocationLat] = useState(""); const [locationLng, setLocationLng] = useState(""); const [locationRadius, setLocationRadius] = useState("100");
  const [notice, setNotice] = useState(""); const [busy, setBusy] = useState(false); const [adminReady, setAdminReady] = useState<boolean | null>(null); const [admin, setAdmin] = useState(false);
  const [reportLoadedFor, setReportLoadedFor] = useState("");
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null);
  const [pin, setPin] = useState(""); const [pinConfirm, setPinConfirm] = useState(""); const [from, setFrom] = useState(nowDate()); const [to, setTo] = useState(nowDate()); const [reportFrom, setReportFrom] = useState(nowDate()); const [reportTo, setReportTo] = useState(nowDate());
  const [hireDate, setHireDate] = useState(""); const [camera, setCamera] = useState(false); const [photo, setPhoto] = useState<Blob | null>(null); const [photoUrl, setPhotoUrl] = useState(""); const [articleTitle, setArticleTitle] = useState(""); const [articleBody, setArticleBody] = useState("");
  const [leaveFrom, setLeaveFrom] = useState(nowDate()); const [leaveTo, setLeaveTo] = useState(nowDate()); const [reason, setReason] = useState(""); const video = useRef<HTMLVideoElement>(null); const canvas = useRef<HTMLCanvasElement>(null); const stream = useRef<MediaStream | null>(null);

  const refresh = useCallback(async () => {
    if (!companyId) return;
    try {
      const [daily, profile, requests, posts, workLocations] = await Promise.all([attendanceRepository.today(companyId), employee?.nik ? attendanceRepository.employee(companyId, employee.nik) : Promise.resolve(null), attendanceRepository.leaveRequests(companyId), attendanceRepository.articles(companyId), attendanceRepository.workLocations(companyId)]);
      setRecords(daily); setEmployeeInfo(profile); setHireDate(profile?.hireDate || ""); setLeaves(requests); setArticles(posts); setLocations(workLocations);
    } catch (error) { console.error("Attendance data failed to load:", error); setNotice("Data belum dapat dimuat. Periksa koneksi dan akses akun."); }
  }, [companyId, employee?.nik]);
  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => { if (section === "cuti" || section === "admin" || section === "dashboard") void refresh(); }, [section, refresh]);
  useEffect(() => {
    if (!camera || !video.current || !stream.current) return;
    video.current.srcObject = stream.current;
    void video.current.play().catch(() => setNotice("Kamera aktif, tetapi pratinjau belum dapat diputar. Coba buka kamera kembali."));
  }, [camera]);
  useEffect(() => { if (companyId) void attendanceRepository.adminPin(companyId).then((s) => setAdminReady(s.exists())); }, [companyId]);
  useEffect(() => { const f = (e: Event) => { const id = (e as CustomEvent<Section>).detail; if (nav.some((n) => n.id === id)) setSection(id); }; window.addEventListener("attendance:navigate", f); return () => window.removeEventListener("attendance:navigate", f); }, []);
  useEffect(() => () => stream.current?.getTracks().forEach((t) => t.stop()), []);

  const myRecord = records.find((r) => r.employeeNik === normalized(employee?.nik || ""));
  const myTodayRecords = records.filter((r) => r.employeeNik === normalized(employee?.nik || ""));
  const me = employeeInfo;
  const myLeaves = leaves.filter((r) => r.employeeNik === normalized(employee?.nik || ""));
  const remain = Math.max(0, 12 - myLeaves.filter((r) => r.status === "Disetujui").reduce((sum, r) => sum + r.dates.length, 0));
  const nextStep = steps[Math.min(myRecord?.punches.length || 0, 3)]!;

  async function openCamera() { try { if (!navigator.mediaDevices?.getUserMedia) throw new Error("Kamera tidak didukung pada halaman ini."); stream.current?.getTracks().forEach((track) => track.stop()); stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false }); setCamera(true); setNotice(""); } catch (error) { setNotice(error instanceof Error && error.message.includes("tidak didukung") ? error.message : "Kamera tidak dapat dibuka. Izinkan akses kamera dan pastikan halaman dibuka melalui HTTPS."); } }
  function takePhoto() { if (!video.current || !canvas.current) return; canvas.current.width = video.current.videoWidth; canvas.current.height = video.current.videoHeight; canvas.current.getContext("2d")?.drawImage(video.current, 0, 0); canvas.current.toBlob((blob) => { if (blob) { setPhoto(blob); setPhotoUrl(URL.createObjectURL(blob)); stream.current?.getTracks().forEach((t) => t.stop()); setCamera(false); } }, "image/jpeg", 0.82); }
  async function punch() {
    if (!companyId || !employee || !photo) return; setBusy(true);
    try {
      const assignedLocation = locations.find((location) => location.id === me?.workLocationId);
      if (me?.workLocationId && !assignedLocation) throw new Error("Lokasi kerja belum dapat dimuat. Periksa koneksi dan coba absensi kembali.");
      if (locations.length && !assignedLocation) throw new Error("Lokasi kerja belum dipilih. Pilih lokasi di menu Pengaturan terlebih dahulu.");
      if (assignedLocation) {
        if (!navigator.geolocation) throw new Error("Lokasi perangkat tidak tersedia. Izinkan akses lokasi untuk melakukan absensi.");
        const position = await new Promise<GeolocationPosition>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, () => reject(new Error("Lokasi tidak dapat dibaca. Aktifkan GPS dan izinkan akses lokasi.")), { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }));
        const radians = (degrees: number) => degrees * Math.PI / 180;
        const dLat = radians(position.coords.latitude - assignedLocation.latitude); const dLng = radians(position.coords.longitude - assignedLocation.longitude);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(radians(assignedLocation.latitude)) * Math.cos(radians(position.coords.latitude)) * Math.sin(dLng / 2) ** 2;
        const distance = 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        if (distance > assignedLocation.radiusMeters) throw new Error(`Absensi ditolak. Anda berjarak sekitar ${Math.round(distance)} m dari ${assignedLocation.name}; batas lokasi ${assignedLocation.radiusMeters} m.`);
        if (position.coords.accuracy > assignedLocation.radiusMeters) throw new Error(`Akurasi GPS saat ini ±${Math.round(position.coords.accuracy)} m. Pindah ke area terbuka dan coba lagi.`);
      }
      const date = nowDate(); const url = await attendanceRepository.uploadSelfie(companyId, date, employee.nik, nextStep.id, photo); await attendanceRepository.punch(companyId, employee, date, { stage: nextStep.id, time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }), photoUrl: url, ...(assignedLocation ? { workLocationId: assignedLocation.id, workLocationName: assignedLocation.name, workLocationSource: "recorded" as const } : {}) }); setPhoto(null); setPhotoUrl(""); await refresh(); setNotice("Absensi tersimpan dengan foto selfie dan validasi lokasi.");
    }
    catch (e) { setNotice(e instanceof Error ? e.message : "Absensi gagal disimpan."); } finally { setBusy(false); }
  }
  async function exportExcel(rows: AttendanceRecord[], name: string, periodStart?: string, periodEnd?: string) {
    setNotice("Menyiapkan file Excel…");
    if (!rows.length) { setNotice("Tidak ada data absensi pada rentang tanggal ini."); return; }
    try {
      const dates = periodStart && periodEnd
        ? Array.from({ length: Math.floor((new Date(periodEnd + "T00:00:00").getTime() - new Date(periodStart + "T00:00:00").getTime()) / 86400000) + 1 }, (_, i) => { const date = new Date(periodStart + "T00:00:00"); date.setDate(date.getDate() + i); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; })
        : [...new Set(rows.map((row) => row.date))].sort();
      const grouped = new Map<string, { nik: string; name: string; times: Map<string, string[]> }>();
      for (const row of rows) {
        const key = row.employeeNik;
        const item = grouped.get(key) || { nik: row.employeeNik, name: row.employeeName, times: new Map<string, string[]>() };
        const times = row.punches.map((p) => p.time).filter(Boolean);
        if (times.length) item.times.set(row.date, [...(item.times.get(row.date) || []), ...times]);
        grouped.set(key, item);
      }
      const data = [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name, "id"));
      const sheetRows: (string | number)[][] = [
        ["Data Absensi"],
        [`Periode: ${periodStart || dates[0] || "—"} – ${periodEnd || dates.at(-1) || "—"}`],
        ["No", "NIK", "Nama", ...dates],
        ...data.map((person, index) => [index + 1, person.nik, person.name, ...dates.map((date) => [...new Set(person.times.get(date) || [])].join("\n"))]),
      ];
      const sheet = XLSX.utils.aoa_to_sheet(sheetRows);
      sheet["!cols"] = [{ wch: 6 }, { wch: 18 }, { wch: 28 }, ...dates.map(() => ({ wch: 15 }))];
      const book = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(book, sheet, "Data Absensi");
      const output = XLSX.write(book, { bookType: "xlsx", type: "array" });
      const bytes = new Uint8Array(output);
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      if (Capacitor.getPlatform() === "android") {
        let binary = "";
        for (let offset = 0; offset < bytes.length; offset += 0x8000) binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
        await AttendanceDownload.save({ fileName: name, mimeType: blob.type, data: btoa(binary) });
        setNotice("File berhasil disimpan di folder Unduhan/KS25.");
        return;
      }
      const file = new File([blob], name, { type: blob.type });
      if ((navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches) && navigator.share && navigator.canShare?.({ files: [file] })) {
        void navigator.share({ files: [file], title: "Data Absensi" })
          .then(() => setNotice("File terbuka pada menu berbagi perangkat. Pilih Simpan atau Unduh untuk menyimpan."))
          .catch((error: unknown) => { if (error instanceof Error && error.name === "AbortError") setNotice("Penyimpanan file dibatalkan."); else { console.error("Attendance file sharing failed:", error); setNotice("Menu simpan perangkat tidak tersedia. Coba unduh file dari browser."); } });
        return;
      }
      const url = URL.createObjectURL(blob); const link = document.createElement("a");
      link.href = url; link.download = name; link.style.display = "none"; document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setNotice("File Data Absensi siap diunduh. Jika tidak tersimpan otomatis, periksa folder Unduhan browser.");
    } catch (error) { console.error("Attendance Excel export failed:", error); setNotice("File Excel gagal dibuat. Coba lagi atau periksa ruang penyimpanan perangkat."); }
  }
  async function history() { if (!companyId || !employee) return; if (from > to) { setNotice("Tanggal awal harus sebelum tanggal akhir."); return; } setBusy(true); try { setHistoryRows(await attendanceRepository.history(companyId, employee.nik, from, to)); setNotice(""); } catch { setNotice("Riwayat belum dapat dimuat."); } finally { setBusy(false); } }
  const fetchReportRows = useCallback(async (start: string, end: string): Promise<AttendanceRecord[]> => {
    if (!companyId) throw new Error("Perusahaan belum dipilih.");
    let rows: AttendanceRecord[];
    try {
      const snap = await getDocs(query(collection(db, "attendance_records"), where("companyId", "==", companyId), where("date", ">=", start), where("date", "<=", end), orderBy("date", "desc")));
      rows = snap.docs.map((d) => ({ ...d.data(), id: d.id, createdAt: new Date() } as AttendanceRecord));
    } catch {
      const snap = await getDocs(query(collection(db, "attendance_records"), where("companyId", "==", companyId)));
      rows = snap.docs.map((d) => ({ ...d.data(), id: d.id, createdAt: new Date() } as AttendanceRecord)).filter((row) => row.date >= start && row.date <= end).sort((a, b) => b.date.localeCompare(a.date));
    }
    const [employees, workLocations] = await Promise.all([attendanceRepository.employees(companyId).catch(() => []), attendanceRepository.workLocations(companyId).catch(() => [])]);
    const employeeLocation = new Map(employees.map((person) => [normalized(person.nik), person.workLocationId || ""]));
    const locationById = new Map(workLocations.map((location) => [location.id, location.name]));
    return rows.map((row) => {
      const currentLocationId = employeeLocation.get(normalized(row.employeeNik)) || "";
      return { ...row, punches: row.punches.map((punch) => {
        if (punch.workLocationName) return punch;
        const currentLocationName = locationById.get(currentLocationId);
        return currentLocationName ? { ...punch, workLocationId: currentLocationId, workLocationName: currentLocationName, workLocationSource: "current-assignment" as const } : punch;
      }) };
    });
  }, [companyId]);
  const loadReport = useCallback(async () => {
    setReportRows([]); setReportLoadedFor("");
    if (!companyId) return; const days = (new Date(toDate(reportTo)).getTime() - new Date(toDate(reportFrom)).getTime()) / 86400000;
    if (reportFrom > reportTo || days > 30) { setNotice("Rentang ekspor maksimal 31 hari."); return; }
    try {
      const rows = await fetchReportRows(reportFrom, reportTo);
      setReportRows(rows); setReportLoadedFor(reportFrom + ":" + reportTo); setNotice("");
    } catch { setNotice("Rekap gagal dimuat."); }
  }, [companyId, reportFrom, reportTo, fetchReportRows]);
  function exportReport() {
    if (!companyId) { setNotice("Perusahaan belum dipilih."); return; }
    const days = (new Date(toDate(reportTo)).getTime() - new Date(toDate(reportFrom)).getTime()) / 86400000;
    if (reportFrom > reportTo || days > 30) { setNotice("Rentang ekspor maksimal 31 hari."); return; }
    if (reportLoadedFor !== reportFrom + ":" + reportTo) { setNotice("Data pada rentang ini sedang dimuat. Coba lagi sebentar."); return; }
    if (!reportRows.length) { setNotice("Tidak ada data absensi pada rentang tanggal ini."); return; }
    exportExcel(reportRows, "Data-Absensi-" + reportFrom + "-" + reportTo + ".xlsx", reportFrom, reportTo);
  }
  function toDate(s: string) { return s + "T00:00:00"; }
  useEffect(() => { if (admin && section === "admin") void loadReport(); }, [admin, section, loadReport]);
  async function enterAdmin(e: FormEvent) {
    e.preventDefault(); if (!companyId) return; setBusy(true);
    try {
      const doc = await attendanceRepository.adminPin(companyId);
      if (!doc.exists()) { if (!isOwnerAdmin) { setNotice("Hanya akun owner/admin perusahaan yang dapat membuat PIN admin pertama."); return; } if (pin.length < 6 || pin !== pinConfirm) { setNotice("Buat PIN admin minimal 6 angka dan pastikan konfirmasinya sama."); return; } const salt = crypto.getRandomValues(new Uint8Array(16)); await attendanceRepository.saveAdminPin(companyId, await hashPin(pin, salt), toHex(salt), workspace?.user.userId || ""); setAdminReady(true); setAdmin(true); setNotice("PIN admin berhasil dibuat."); }
      else { const d = doc.data(); const salt = Uint8Array.from((String(d.salt).match(/.{1,2}/g) || []).map((x) => parseInt(x, 16))); if (await hashPin(pin, salt) !== d.hash) { setNotice("PIN admin tidak sesuai."); return; } setAdmin(true); setNotice(""); }
      setPin(""); setPinConfirm("");
    } catch (e) { setNotice(e instanceof Error ? e.message : "PIN admin gagal diproses."); } finally { setBusy(false); }
  }
  async function addArticle(e: FormEvent) { e.preventDefault(); if (!companyId) return; setBusy(true); try { await attendanceRepository.addArticle(companyId, articleTitle, articleBody, employee?.fullName || "Admin"); let notificationSent = true; try { await notificationService.broadcastCompany(companyId, { module: "attendance", type: "update", priority: "normal", title: "Informasi baru", message: articleTitle.trim(), actionUrl: "/attendance", sourceId: null }); } catch (error) { notificationSent = false; console.error("Attendance article notification failed:", error); } setArticleTitle(""); setArticleBody(""); await refresh(); setNotice(notificationSent ? "Informasi berhasil dipublikasikan dan pemberitahuan dikirim ke karyawan." : "Informasi dipublikasikan, tetapi pemberitahuan belum dapat dikirim."); } catch { setNotice("Informasi gagal disimpan."); } finally { setBusy(false); } }
  async function applyLeave(e: FormEvent) {
    e.preventDefault(); if (!companyId || !employee) return; if (!eligible(me?.hireDate)) { setNotice("Pengajuan cuti tersedia setelah masa kerja 1 tahun."); return; }
    const end = new Date(toDate(leaveTo)); const cursor = new Date(toDate(leaveFrom)); if (leaveFrom > leaveTo || (end.getTime() - cursor.getTime()) / 86400000 > 30) { setNotice("Rentang pengajuan maksimal 31 hari."); return; }
    const dates: string[] = []; while (cursor <= end) { dates.push(nowString(cursor)); cursor.setDate(cursor.getDate() + 1); }
    if (dates.length > remain) { setNotice("Jumlah hari pengajuan melebihi sisa kuota."); return; } setBusy(true);
    try { await attendanceRepository.addLeave({ companyId, employeeNik: employee.nik, employeeName: employee.fullName, dates, reason, status: "Menunggu" }); let receiver = workspace?.company.ownerId || ""; try { const pinDoc = await attendanceRepository.adminPin(companyId); receiver = String(pinDoc.data()?.createdBy || receiver); } catch (error) { console.warn("Admin PIN recipient unavailable, using company owner:", error); } if (receiver) { try { await notificationService.createForCompany(companyId, receiver, { module: "attendance", type: "update", priority: "high", title: "Pengajuan cuti baru", message: employee.fullName + " mengajukan cuti " + dates.length + " hari, " + prettyDate(leaveFrom) + " sampai " + prettyDate(leaveTo) + ".", actionUrl: "/attendance", sourceId: null }); } catch (notificationError) { console.error("Admin notification could not be created", notificationError); } } setReason(""); await refresh(); setNotice("Pengajuan cuti dikirim ke admin."); }
    catch { setNotice("Pengajuan cuti gagal dikirim."); } finally { setBusy(false); }
  }
  function nowString(d: Date) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  async function changeLeave(row: LeaveRequest, status: "Disetujui" | "Ditolak") { setBusy(true); try { if (status === "Disetujui") { const used = leaves.filter((request) => request.employeeNik === row.employeeNik && request.status === "Disetujui").reduce((sum, request) => sum + request.dates.length, 0); if (used + row.dates.length > 12) { setNotice("Kuota cuti karyawan tidak mencukupi untuk menyetujui pengajuan ini."); return; } } await attendanceRepository.updateLeaveStatus(row.id, status); await refresh(); setNotice("Pengajuan cuti " + status.toLowerCase() + "."); } catch { setNotice("Status cuti gagal diperbarui."); } finally { setBusy(false); } }
  async function saveHireDate() { if (!companyId || !employee) return; setBusy(true); try { await attendanceRepository.updateEmployeeHireDate(companyId, employee.nik, hireDate); await refresh(); setNotice("Tanggal mulai bekerja tersimpan."); } catch { setNotice("Tanggal mulai bekerja gagal disimpan."); } finally { setBusy(false); } }
  async function addLocation(event: FormEvent) { event.preventDefault(); if (!companyId) return; const latitude = Number(locationLat); const longitude = Number(locationLng); const radiusMeters = Number(locationRadius); if (!locationName.trim() || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180 || !Number.isFinite(radiusMeters) || radiusMeters < 20 || radiusMeters > 1000) { setNotice("Nama, koordinat Google Maps, dan radius 20–1.000 meter harus diisi dengan benar."); return; } setBusy(true); try { await attendanceRepository.addWorkLocation(companyId, { name: locationName.trim(), latitude, longitude, radiusMeters }); setLocationName(""); setLocationLat(""); setLocationLng(""); setLocationRadius("100"); await refresh(); setNotice("Lokasi kerja ditambahkan."); } catch { setNotice("Lokasi kerja gagal ditambahkan."); } finally { setBusy(false); } }
  async function saveWorkLocation(workLocationId: string) { if (!companyId || !employee) return; setBusy(true); try { await attendanceRepository.updateEmployeeLocation(companyId, employee.nik, workLocationId); await refresh(); setNotice("Lokasi kerja karyawan tersimpan."); } catch { setNotice("Lokasi kerja gagal disimpan."); } finally { setBusy(false); } }

  return <div className="mx-auto max-w-7xl space-y-5">
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-6 text-white shadow-lg sm:p-8"><div><p className="text-sm text-teal-200">{workspace?.company.name || "Perusahaan"} · Modul Karyawan</p><h1 className="mt-1 text-3xl font-bold">KS25 Absensi</h1><p className="mt-2 text-sm text-slate-300">Kehadiran, informasi, dan cuti dalam satu tempat.</p></div><div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3"><p className="text-xs text-slate-300">Hari ini</p><p className="mt-1 font-semibold">{new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}</p><p className="mt-1 text-sm text-teal-200">Halo, {employee?.fullName || "Karyawan"}</p></div></header>
    <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
      <nav className="hidden h-fit rounded-2xl border bg-card p-2 shadow-sm lg:block" aria-label="Menu Absensi">{nav.map(({ id, label, Icon }) => <button key={id} onClick={() => setSection(id)} className={"mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm " + (section === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}><Icon className="h-4 w-4"/>{label}{id === "admin" && admin && leaves.some((r) => r.status === "Menunggu") && <span className="ml-auto rounded-full bg-rose-500 px-2 text-white">{leaves.filter((r) => r.status === "Menunggu").length}</span>}</button>)}</nav>
      <main className="min-w-0 space-y-5">
        {notice && <div role="status" className="rounded-xl border bg-muted/60 px-4 py-3 text-sm">{notice}</div>}
        {section === "admin" && admin && selectedAttendance && <section className={panel}>
          <Button variant="outline" onClick={() => setSelectedAttendance(null)}><ArrowLeft className="mr-2 h-4 w-4"/>Kembali ke daftar absensi</Button>
          <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
            <div><p className="text-sm text-muted-foreground">Detail absensi karyawan</p><h2 className="mt-1 text-2xl font-bold">{selectedAttendance.employeeName}</h2><p className="mt-1 text-sm text-muted-foreground">NIK {selectedAttendance.employeeNik} · {prettyDate(selectedAttendance.date)}</p></div>
            <span className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">{selectedAttendance.punches.length} dari 4 tahap</span>
          </div>
          <div className="mt-6 space-y-4">
            {steps.map((step) => {
              const punch = selectedAttendance.punches.find((entry) => entry.stage === step.id);
              return <article key={step.id} className="grid gap-4 rounded-xl border p-4 sm:grid-cols-[minmax(0,1fr)_220px]">
                <div className="space-y-3">
                  <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">{punch ? <Check className="h-4 w-4"/> : <Clock3 className="h-4 w-4"/>}</span><div><h3 className="font-semibold">{step.label}</h3><p className="text-sm text-muted-foreground">{punch?.time || "Belum tercatat"}</p></div></div>
                  <div className="rounded-lg bg-muted/50 p-3"><div className="flex items-center gap-2 text-sm font-medium"><MapPin className="h-4 w-4 text-primary"/>Lokasi kerja</div><p className="mt-1 text-sm">{punch?.workLocationName || "Lokasi kerja tidak tersedia pada catatan ini"}</p>{punch?.workLocationSource === "current-assignment" && <p className="mt-1 text-xs text-muted-foreground">Lokasi dari penugasan karyawan saat ini; catatan lama tidak menyimpan lokasi saat absensi.</p>}</div>
                </div>
                {punch?.photoUrl ? <a href={punch.photoUrl} target="_blank" rel="noreferrer" className="group relative block overflow-hidden rounded-xl bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><img src={punch.photoUrl} alt={`Foto selfie ${step.label} ${selectedAttendance.employeeName}`} className="h-56 w-full object-cover transition-transform group-hover:scale-[1.02] sm:h-full sm:min-h-48"/><span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1.5 text-xs text-white"><ExternalLink className="h-3 w-3"/>Buka foto</span></a> : <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">Foto selfie belum tersedia</div>}
              </article>;
            })}
          </div>
        </section>}        {section === "dashboard" && <div className="space-y-5"><div className="grid gap-3 sm:grid-cols-3">{[{ label: "Hadir hari ini", value: myTodayRecords.length, Icon: Users }, { label: "Tahap tercatat", value: myRecord?.punches.length || 0, Icon: Check }, { label: "Pengajuan menunggu", value: myLeaves.filter((r) => r.status === "Menunggu").length, Icon: CalendarOff }].map(({ label, value, Icon }) => <section className={panel} key={label}><div className="flex justify-between text-sm text-muted-foreground">{label}<Icon className="h-4 w-4 text-primary"/></div><p className="mt-3 text-3xl font-bold">{value}</p></section>)}</div><section className={panel}><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">Absensi saya hari ini</h2><p className="text-sm text-muted-foreground">Selfie dan tahap absensi yang tercatat pada akun Anda.</p></div><Button onClick={() => setSection("absensi")}><Camera className="mr-2 h-4 w-4"/>Absen selfie</Button></div><div className="mt-4 grid gap-3 sm:grid-cols-2">{myTodayRecords.map((r) => <article key={r.id} className="rounded-xl border p-3"><p className="font-medium">{r.employeeName}</p><p className="text-xs text-muted-foreground">NIK {r.employeeNik} · {r.punches.length}/4 tahap</p><div className="mt-3 flex gap-2 overflow-x-auto">{r.punches.map((p) => <div key={p.stage}><img src={p.photoUrl} alt={"Selfie " + r.employeeName} className="h-20 w-20 rounded-lg object-cover"/><p className="mt-1 text-[10px]">{steps.find((s) => s.id === p.stage)?.label}</p><p className="text-xs text-muted-foreground">{p.time}</p></div>)}</div></article>)}{!myTodayRecords.length && <p className="col-span-full rounded-xl border border-dashed py-10 text-center text-sm text-muted-foreground">Belum ada absensi Anda hari ini.</p>}</div></section><section className={panel}><div className="flex items-center justify-between"><div><h2 className="font-semibold">Informasi perusahaan</h2><p className="text-sm text-muted-foreground">Pengumuman untuk semua karyawan.</p></div><Button variant="outline" onClick={() => setSection("informasi")}>Lihat semua</Button></div><div className="mt-3 divide-y">{articles.slice(0, 3).map((a) => <article className="py-3" key={a.id}><h3 className="font-medium">{a.title}</h3><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.body}</p></article>)}{!articles.length && <p className="py-5 text-sm text-muted-foreground">Belum ada informasi baru.</p>}</div></section></div>}
        {section === "absensi" && <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]"><section className={panel}><h2 className="text-lg font-semibold">Absen selfie</h2><p className="mt-1 text-sm text-muted-foreground">Ambil foto untuk tahap: <strong>{nextStep.label}</strong>.</p><div className="relative mx-auto mt-6 aspect-square w-72 max-w-full sm:w-96">{camera && <div className="absolute -inset-2 animate-spin rounded-full border-4 border-teal-500/20 border-t-teal-500"/>}<div className="absolute inset-0 overflow-hidden rounded-full border-4 border-white bg-slate-950 shadow-inner">{photoUrl ? <img src={photoUrl} alt="Pratinjau selfie" className="h-full w-full object-cover"/> : camera ? <video ref={video} autoPlay muted playsInline className="h-full w-full scale-x-[-1] object-cover"/> : <div className="flex h-full w-full flex-col items-center justify-center text-slate-300"><Camera className="h-10 w-10"/><p className="mt-2 text-sm">Kamera selfie siap digunakan</p></div>}</div>{camera && <span className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/60 px-3 py-1 text-xs text-white">Posisikan wajah dalam lingkaran</span>}</div><canvas ref={canvas} className="hidden"/><div className="mt-4 flex gap-2">{!camera && !photo && <Button onClick={() => void openCamera()}><Camera className="mr-2 h-4 w-4"/>Buka kamera</Button>}{camera && <Button onClick={takePhoto}>Ambil selfie</Button>}{photo && <><Button onClick={() => void punch()} disabled={busy}><Check className="mr-2 h-4 w-4"/>Simpan absensi</Button><Button variant="outline" onClick={() => { setPhoto(null); setPhotoUrl(""); void openCamera(); }}>Foto ulang</Button></>}</div></section><section className={panel}><h2 className="font-semibold">Tahap hari ini</h2><div className="mt-4 space-y-3">{steps.map((s) => { const p = myRecord?.punches.find((v) => v.stage === s.id); return <div className="flex items-center gap-3 rounded-xl border p-3" key={s.id}><span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-700">{p ? <Check className="h-4 w-4"/> : <Clock3 className="h-4 w-4"/>}</span><div className="flex-1"><p className="text-sm font-medium">{s.label}</p><p className="text-xs text-muted-foreground">{p?.time || "Belum tercatat"}</p></div>{p && <img src={p.photoUrl} alt="Selfie" className="h-10 w-10 rounded object-cover"/>}</div>; })}</div></section></div>}
        {section === "riwayat" && <section className={panel}><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">Riwayat absensi</h2><p className="text-sm text-muted-foreground">Filter tanggal dan ekspor Excel.</p></div><Button variant="outline" onClick={() => void exportExcel(historyRows, "Data-Absensi-" + from + "-" + to + ".xlsx", from, to)} disabled={!historyRows.length}><ArrowDownToLine className="mr-2 h-4 w-4"/>Ekspor Excel</Button></div><div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><label className="text-xs text-muted-foreground">Dari<Input type="date" value={from} onChange={(e) => setFrom(e.target.value)}/></label><label className="text-xs text-muted-foreground">Sampai<Input type="date" value={to} onChange={(e) => setTo(e.target.value)}/></label><Button className="self-end" onClick={() => void history()} disabled={busy}>Tampilkan</Button></div><div className="mt-4 divide-y">{historyRows.map((r) => <article className="py-3" key={r.id}><p className="font-medium">{prettyDate(r.date)} · {r.employeeName}</p><div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">{steps.map((s) => { const p = r.punches.find((v) => v.stage === s.id); return <div className="rounded-lg bg-muted/50 p-2" key={s.id}><p className="text-xs">{s.label}</p><p className="text-sm">{p?.time || "—"}</p>{p && <a target="_blank" rel="noreferrer" href={p.photoUrl} className="text-xs text-primary underline">Lihat selfie</a>}</div>; })}</div></article>)}{!historyRows.length && <p className="py-6 text-center text-sm text-muted-foreground">Pilih rentang tanggal lalu tampilkan riwayat.</p>}</div></section>}
        {section === "informasi" && <div className="space-y-4">{articles.map((a) => <article className={panel} key={a.id}><p className="text-xs text-primary">Informasi perusahaan</p><h2 className="mt-1 text-lg font-semibold">{a.title}</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{a.body}</p><p className="mt-3 text-xs text-muted-foreground">Oleh {a.author} · {a.createdAt.toLocaleDateString("id-ID")}</p></article>)}{!articles.length && <section className={panel}>Belum ada artikel informasi.</section>}{admin && <section className={panel}><h2 className="font-semibold">Tambah artikel</h2><form onSubmit={(e) => void addArticle(e)} className="mt-3 space-y-2"><Input value={articleTitle} onChange={(e) => setArticleTitle(e.target.value)} placeholder="Judul artikel" required/><textarea className="min-h-28 w-full rounded-lg border bg-transparent p-3 text-sm" value={articleBody} onChange={(e) => setArticleBody(e.target.value)} placeholder="Isi informasi yang dapat dibaca semua karyawan" required/><Button disabled={busy}>Publikasikan</Button></form></section>}</div>}
        {section === "admin" && !admin && <section className={panel + " mx-auto max-w-md"}><ShieldCheck className="h-10 w-10 text-primary"/><h2 className="mt-2 text-xl font-semibold">Akses admin</h2><p className="mt-1 text-sm text-muted-foreground">{adminReady === false ? "Buatlah pin pertama kali oleh owner/admin." : "Masukkan PIN admin untuk melihat rekap dan mengelola cuti."}</p>{adminReady === false && !isOwnerAdmin ? <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Hanya akun owner/admin perusahaan yang dapat membuat PIN admin pertama.</p> : <form onSubmit={(e) => void enterAdmin(e)} className="mt-4 space-y-3"><label className="block text-sm">PIN admin<Input type="password" inputMode="numeric" minLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 12))} required/></label>{adminReady === false && <label className="block text-sm">Ulangi PIN<Input type="password" inputMode="numeric" value={pinConfirm} onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 12))} required/></label>}<Button className="w-full" disabled={busy}>{adminReady === false ? "Buat PIN admin" : "Masuk admin"}</Button></form>}</section>}
        {section === "admin" && admin && <div className={selectedAttendance ? "hidden" : "space-y-5"}><section className={panel}><div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-semibold">Rekap semua absensi</h2><p className="text-sm text-muted-foreground">Maksimal rentang 31 hari per ekspor.</p></div><Button onClick={() => void exportReport()} disabled={busy}><ArrowDownToLine className="mr-2 h-4 w-4"/>{busy ? "Menyiapkan…" : "Ekspor Excel"}</Button></div><div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="text-xs text-muted-foreground">Dari<Input type="date" value={reportFrom} onChange={(e) => setReportFrom(e.target.value)}/></label><label className="text-xs text-muted-foreground">Sampai<Input type="date" value={reportTo} onChange={(e) => setReportTo(e.target.value)}/></label></div></section><section className={panel}><h2 className="font-semibold">Data Absensi</h2><div className="mt-3 divide-y">{reportRows.map((r) => <button type="button" key={r.id} onClick={() => setSelectedAttendance(r)} aria-label={`Lihat detail absensi ${r.employeeName} tanggal ${prettyDate(r.date)}`} className="flex w-full flex-wrap items-center justify-between gap-3 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><div><p className="font-medium">{r.employeeName}</p><p className="text-xs text-muted-foreground">NIK {r.employeeNik} · {prettyDate(r.date)}</p></div><span className="inline-flex items-center gap-2 text-sm">{r.punches.length}/4 tahap<ChevronRight className="h-4 w-4 text-muted-foreground"/></span></button>)}{!reportRows.length && <p className="py-5 text-sm text-muted-foreground">Tidak ada data absensi pada rentang tanggal ini.</p>}</div></section><section className={panel}><h2 className="font-semibold">Pengajuan cuti ({leaves.filter((r) => r.status === "Menunggu").length} menunggu)</h2><div className="mt-3 divide-y">{leaves.map((r) => <article className="flex flex-wrap items-center justify-between gap-3 py-4" key={r.id}><div><p className="font-medium">{r.employeeName} · {r.dates.length} hari</p><p className="text-sm text-muted-foreground">{prettyDate(r.dates[0] || "")} – {prettyDate(r.dates.at(-1) || "")} · {r.reason}</p><span className="text-xs">{r.status}{r.updatedAt ? " · diperbarui " + r.updatedAt.toLocaleDateString("id-ID") : ""}</span></div>{r.status === "Menunggu" && <div className="flex gap-2"><Button size="sm" disabled={busy} onClick={() => void changeLeave(r, "Disetujui")}>Setujui</Button><Button size="sm" variant="outline" disabled={busy} onClick={() => void changeLeave(r, "Ditolak")}>Tolak</Button></div>}</article>)}{!leaves.length && <p className="py-6 text-sm text-muted-foreground">Belum ada pengajuan cuti.</p>}</div></section><Button variant="outline" onClick={() => { setAdmin(false); setSelectedAttendance(null); }}>Keluar admin</Button></div>}
        {section === "cuti" && <div className="space-y-5"><section className="rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-600 p-5 text-white"><p className="text-sm text-teal-100">Sisa kuota tahunan</p><p className="mt-1 text-4xl font-bold">{remain}<span className="ml-2 text-base font-normal">dari 12 hari</span></p><p className="mt-2 text-xs text-teal-100">Mulai bekerja: {prettyDate(me?.hireDate || "")}</p></section><section className={panel}><h2 className="font-semibold">Ajukan cuti</h2>{!eligible(me?.hireDate) ? <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Cuti dapat diajukan setelah masa kerja 1 tahun. Lengkapi tanggal mulai bekerja di Pengaturan.</p> : <form onSubmit={(e) => void applyLeave(e)} className="mt-3 space-y-3"><div className="grid gap-3 sm:grid-cols-2"><label className="text-xs text-muted-foreground">Dari<Input type="date" min={nowDate()} value={leaveFrom} onChange={(e) => setLeaveFrom(e.target.value)}/></label><label className="text-xs text-muted-foreground">Sampai<Input type="date" min={leaveFrom} value={leaveTo} onChange={(e) => setLeaveTo(e.target.value)}/></label></div><textarea className="min-h-24 w-full rounded-lg border bg-transparent p-3 text-sm" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Alasan pengajuan" required/><Button disabled={busy || remain < 1}>Kirim pengajuan</Button></form>}</section><section className={panel}><h2 className="font-semibold">Riwayat pengajuan</h2><div className="mt-3 divide-y">{myLeaves.map((r) => <div className="flex flex-wrap items-center justify-between gap-3 py-3" key={r.id}><div><p className="font-medium">{r.dates.length} hari · {prettyDate(r.dates[0] || "")} – {prettyDate(r.dates.at(-1) || "")}</p><p className="text-sm text-muted-foreground">{r.reason}</p><p className="text-xs text-muted-foreground">Diajukan {r.createdAt.toLocaleDateString("id-ID")}{r.updatedAt ? " · Diperbarui " + r.updatedAt.toLocaleDateString("id-ID") : ""}</p></div><span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">{r.status}</span></div>)}{!myLeaves.length && <p className="py-5 text-sm text-muted-foreground">Belum ada pengajuan cuti.</p>}</div></section></div>}
        {section === "pengaturan" && <div className="space-y-5"><section className={panel}><div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-semibold">Profil karyawan aktif</h2><p className="text-sm text-muted-foreground">{employee?.fullName} · NIK {employee?.nik}</p><p className="mt-1 text-sm text-muted-foreground">Mulai bekerja: {prettyDate(me?.hireDate || "")}</p></div><Button variant="outline" onClick={switchEmployee}>Pilih / tambah karyawan</Button></div></section><section className={panel}><h2 className="font-semibold">Tanggal mulai bekerja</h2><p className="mt-1 text-sm text-muted-foreground">Data yang ditampilkan hanya milik karyawan yang sedang login di perangkat ini.</p><div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end"><div className="flex-1"><p className="font-medium">{employee?.fullName || "Karyawan"}</p><p className="text-xs text-muted-foreground">NIK {employee?.nik || "—"}</p></div><label className="text-xs text-muted-foreground">Mulai bekerja<Input type="date" value={hireDate} onChange={(e) => setHireDate(e.target.value)}/></label><Button size="sm" variant="outline" onClick={() => void saveHireDate()} disabled={busy || !employee}>Simpan</Button></div><p className="mt-3 border-t pt-3 text-xs text-muted-foreground">Untuk menambah karyawan pada perangkat ini, pilih Pilih / tambah karyawan.</p></section></div>}
        {section === "admin" && admin && <section className={panel}><div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/><h2 className="font-semibold">Lokasi kerja</h2></div><p className="mt-1 text-sm text-muted-foreground">Tambahkan kantor, pabrik, atau cabang. Titik Google Maps menjadi pusat validasi GPS.</p><form onSubmit={(e) => void addLocation(e)} className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-xs text-muted-foreground">Nama tempat / gedung<Input value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="Contoh: Pabrik Utama" required/></label><label className="text-xs text-muted-foreground">Radius absensi (meter)<Input type="number" min="20" max="1000" step="10" value={locationRadius} onChange={(e) => setLocationRadius(e.target.value)} required/><span className="mt-1 block">Saran: kantor 50–100 m, pabrik atau kompleks luas 150–300 m.</span></label><label className="text-xs text-muted-foreground">Latitude Google Maps<Input type="number" step="any" value={locationLat} onChange={(e) => setLocationLat(e.target.value)} placeholder="-6.200000" required/></label><label className="text-xs text-muted-foreground">Longitude Google Maps<Input type="number" step="any" value={locationLng} onChange={(e) => setLocationLng(e.target.value)} placeholder="106.816666" required/></label><Button className="sm:col-span-2" disabled={busy}>Tambah lokasi</Button></form><div className="mt-4 divide-y">{locations.map((location) => <div className="flex flex-wrap items-center justify-between gap-2 py-3" key={location.id}><div><p className="font-medium">{location.name}</p><p className="text-xs text-muted-foreground">{location.latitude}, {location.longitude} · radius {location.radiusMeters} m</p></div><a className="text-sm text-primary underline" target="_blank" rel="noreferrer" href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`}>Buka Maps</a></div>)}{!locations.length && <p className="py-4 text-sm text-muted-foreground">Belum ada lokasi yang terdaftar.</p>}</div></section>}
        {section === "pengaturan" && employee && <section className={panel}><div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/><h2 className="font-semibold">Lokasi kerja saya</h2></div><p className="mt-1 text-sm text-muted-foreground">Pilih lokasi yang ditentukan admin. Absensi hanya dapat dilakukan dalam radius lokasi tersebut.</p><select className="mt-3 w-full rounded-lg border bg-background px-3 py-2 text-sm" value={me?.workLocationId || ""} onChange={(event) => void saveWorkLocation(event.target.value)} disabled={busy || !locations.length}><option value="">{locations.length ? "Pilih lokasi kerja" : "Admin belum menambahkan lokasi"}</option>{locations.map((location) => <option value={location.id} key={location.id}>{location.name} · radius {location.radiusMeters} m</option>)}</select></section>}
      </main>
    </div>
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"><nav className="mx-auto grid max-w-screen-lg grid-cols-7" aria-label="Navigasi Absensi">{nav.map(({ id, label, Icon }) => <button key={id} onClick={() => setSection(id)} aria-current={section === id ? "page" : undefined} className="flex flex-col items-center py-1.5"><span className={"flex h-9 w-9 items-center justify-center rounded-full " + (section === id ? "bg-primary text-primary-foreground" : "text-muted-foreground")}><Icon className="h-4 w-4"/></span><span className="text-[9px] sm:text-[10px]">{label}</span></button>)}</nav></div>
  </div>;
}
