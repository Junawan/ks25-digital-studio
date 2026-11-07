$ErrorActionPreference = "Stop"

$bucket = "ks25-digital-studio.firebasestorage.app"
$lifecycleFile = Join-Path $PSScriptRoot "..\storage-lifecycle.json"

if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
  throw "Google Cloud CLI (gcloud) belum terpasang. Pasang dan login terlebih dahulu, lalu jalankan ulang skrip ini."
}

gcloud storage buckets update "gs://$bucket" --lifecycle-file="$lifecycleFile"
if ($LASTEXITCODE -ne 0) {
  throw "Gagal menerapkan kebijakan penghapusan otomatis ke bucket $bucket."
}

Write-Host "Kebijakan aktif: file di attendance/ dihapus setelah berumur 30 hari."
