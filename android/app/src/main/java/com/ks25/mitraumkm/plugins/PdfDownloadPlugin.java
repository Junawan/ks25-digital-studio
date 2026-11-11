package com.ks25.mitraumkm.plugins;

import android.content.Context;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.print.PrintAttributes;
import android.print.PrintJob;
import android.print.PrintManager;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.util.concurrent.atomic.AtomicBoolean;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "PdfDownload")
public class PdfDownloadPlugin extends Plugin {
    private static final long LOAD_TIMEOUT_MS = 60_000;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    @PluginMethod
    public void save(PluginCall call) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.KITKAT) {
            call.reject("Fitur cetak PDF memerlukan Android 4.4 atau lebih baru.");
            return;
        }

        String html = call.getString("html");
        String requestedName = call.getString("fileName");
        if (html == null || html.isEmpty()) {
            call.reject("Isi dokumen PDF tidak tersedia.");
            return;
        }

        String fileName = requestedName == null || requestedName.isEmpty() ? "Invoice.pdf" : requestedName;
        fileName = fileName.replaceAll("[/\\\\\\r\\n]", "_");
        if (!fileName.toLowerCase().endsWith(".pdf")) fileName += ".pdf";
        final String jobName = fileName.substring(0, fileName.length() - 4);

        getActivity().runOnUiThread(() -> {
            WebView webView = new WebView(getContext());
            AtomicBoolean completed = new AtomicBoolean(false);
            Runnable timeout = () -> {
                if (!completed.compareAndSet(false, true)) return;
                webView.stopLoading();
                webView.destroy();
                call.reject("Invoice tidak selesai dimuat untuk dicetak. Periksa koneksi lalu coba lagi.");
            };

            mainHandler.postDelayed(timeout, LOAD_TIMEOUT_MS);
            try {
                webView.setBackgroundColor(android.graphics.Color.WHITE);
                webView.getSettings().setJavaScriptEnabled(true);
                webView.getSettings().setDomStorageEnabled(true);
                webView.getSettings().setLoadsImagesAutomatically(true);
                webView.setWebViewClient(new WebViewClient() {
                    @Override
                    public void onPageFinished(WebView view, String url) {
                        if (!completed.compareAndSet(false, true)) return;
                        mainHandler.removeCallbacks(timeout);
                        try {
                            PrintManager printManager = (PrintManager) getContext().getSystemService(Context.PRINT_SERVICE);
                            if (printManager == null) throw new IllegalStateException("Layanan cetak Android tidak tersedia.");

                            PrintAttributes attributes = new PrintAttributes.Builder()
                                .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                                .setResolution(new PrintAttributes.Resolution("ks25_pdf", "PDF", 300, 300))
                                .setMinMargins(PrintAttributes.Margins.NO_MARGINS)
                                .setColorMode(PrintAttributes.COLOR_MODE_COLOR)
                                .build();

                            PrintJob printJob = printManager.print(jobName, view.createPrintDocumentAdapter(jobName), attributes);
                            call.resolve();
                            releaseWebViewWhenFinished(printJob, view);
                        } catch (Exception error) {
                            view.destroy();
                            call.reject("Dialog cetak PDF Android tidak dapat dibuka.", error);
                        }
                    }

                    @Override
                    public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                        if (request.isForMainFrame() && completed.compareAndSet(false, true)) {
                            mainHandler.removeCallbacks(timeout);
                            view.destroy();
                            call.reject("Invoice gagal dimuat sebelum dicetak.");
                        }
                    }
                });
                webView.loadDataWithBaseURL("https://www.ks25studio.web.id/", html, "text/html", "UTF-8", null);
            } catch (Exception error) {
                mainHandler.removeCallbacks(timeout);
                if (completed.compareAndSet(false, true)) {
                    webView.destroy();
                    call.reject("Invoice gagal disiapkan untuk dicetak.", error);
                }
            }
        });
    }

    private void releaseWebViewWhenFinished(PrintJob printJob, WebView webView) {
        mainHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                if (printJob.isCompleted() || printJob.isCancelled() || printJob.isFailed()) {
                    webView.destroy();
                    return;
                }
                mainHandler.postDelayed(this, 1000);
            }
        }, 1000);
    }
}
