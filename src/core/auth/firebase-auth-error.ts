import { FirebaseError } from "firebase/app";

export function getFirebaseAuthErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return "Terjadi kesalahan. Silakan coba lagi.";
  }

  switch (error.code) {
    case "auth/invalid-email":
      return "Format email tidak valid.";

    case "auth/user-not-found":
      return "Jika email terdaftar, link reset password akan dikirim ke email tersebut.";

    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Email atau password salah.";

    case "auth/email-already-in-use":
      return "Email sudah digunakan.";

    case "auth/weak-password":
      return "Password minimal 6 karakter.";

    case "auth/too-many-requests":
      return "Terlalu banyak percobaan. Silakan coba beberapa saat lagi.";

    case "auth/network-request-failed":
      return "Tidak dapat terhubung ke internet.";

    case "auth/user-disabled":
      return "Akun ini telah dinonaktifkan.";

    default:
      return "Terjadi kesalahan. Silakan coba lagi.";
  }
}