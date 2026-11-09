package com.ks25.mitraumkm.plugins;

import android.content.ContentValues;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.os.ParcelFileDescriptor;
import android.graphics.pdf.PdfDocument;
import android.provider.MediaStore;
import android.webkit.WebView;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.RequiresApi;

import java.io.FileOutputStream;
import java.util.concurrent.atomic.AtomicBoolean;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "PdfDownload")
public class PdfDownloadPlugin extends Plugin {
    @PluginMethod
    public void save(PluginCall call) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            call.reject("Simpan PDF memerlukan Android 10 atau lebih baru.");
            return;
        }
        String html = call.getString("html");
        String requestedName = call.getString("fileName");
        if (requestedName == null || requestedName.isEmpty()) requestedName = "Dokumen.pdf";
        if (html == null || html.isEmpty()) {
            call.reject("Isi dokumen PDF tidak tersedia.");
            return;
        }
        String fileName = requestedName.replaceAll("[/\\\\\\r\\n]", "_");
        if (!fileName.toLowerCase().endsWith(".pdf")) fileName += ".pdf";
        final String pdfName = fileName;

        getActivity().runOnUiThread(() -> {
            WebView webView = new WebView(getContext());
            Handler handler = new Handler(Looper.getMainLooper());
            AtomicBoolean settled = new AtomicBoolean(false);
            AtomicBoolean renderStarted = new AtomicBoolean(false);
            Runnable timeout = () -> {
                if (!settled.compareAndSet(false, true)) return;
                webView.stopLoading();
                webView.destroy();
                call.reject("Pembuatan PDF melewati batas waktu. Coba lagi.");
            };
            handler.postDelayed(timeout, 45000);
            handler.postDelayed(() -> startPdfRender(webView, call, pdfName, handler, timeout, settled, renderStarted), 5000);
            try {
                webView.setLayoutParams(new ViewGroup.LayoutParams(794, 1123));
                webView.getSettings().setJavaScriptEnabled(false);
                webView.setWebViewClient(new android.webkit.WebViewClient() {
                    @Override
                    public void onPageFinished(WebView view, String url) {
                        startPdfRender(view, call, pdfName, handler, timeout, settled, renderStarted);
                    }
                });
                webView.loadDataWithBaseURL("https://www.ks25studio.web.id/", html, "text/html", "UTF-8", null);
            } catch (Exception error) {
                fail(call, webView, null, error, handler, timeout, settled);
            }
        });
    }

    private void startPdfRender(WebView webView, PluginCall call, String fileName, Handler handler, Runnable timeout, AtomicBoolean settled, AtomicBoolean renderStarted) {
        if (settled.get() || !renderStarted.compareAndSet(false, true)) return;
        try {
            webView.measure(View.MeasureSpec.makeMeasureSpec(794, View.MeasureSpec.EXACTLY), View.MeasureSpec.makeMeasureSpec(1123, View.MeasureSpec.AT_MOST));
            webView.layout(0, 0, 794, Math.max(1123, webView.getMeasuredHeight()));
            // The temporary WebView is not attached to the activity view tree, so
            // View.postDelayed may never run. Schedule PDF generation on the main
            // looper directly instead.
            handler.postDelayed(() -> writePdf(webView, call, fileName, handler, timeout, settled), 700);
        } catch (Exception error) {
            fail(call, webView, null, error, handler, timeout, settled);
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    private void writePdf(WebView webView, PluginCall call, String fileName, Handler handler, Runnable timeout, AtomicBoolean settled) {
        if (settled.get()) return;
        ContentValues values = new ContentValues();
        values.put(MediaStore.Downloads.DISPLAY_NAME, fileName);
        values.put(MediaStore.Downloads.MIME_TYPE, "application/pdf");
        values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/KS25");
        values.put(MediaStore.Downloads.IS_PENDING, 1);
        Uri uri = null;
        try {
            uri = getContext().getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
            if (uri == null) throw new IllegalStateException("Android tidak dapat membuat file PDF.");
            ParcelFileDescriptor descriptor = getContext().getContentResolver().openFileDescriptor(uri, "w");
            if (descriptor == null) throw new IllegalStateException("File PDF tidak dapat ditulis.");

            PdfDocument document = new PdfDocument();
            try {
                    int pageWidth = 595;
                    int pageHeight = 842;
                    float pageScale = pageWidth / (float) webView.getWidth();
                    int viewportHeight = Math.max(1, Math.round(pageHeight / pageScale));
                    int contentHeight = Math.max(webView.getHeight(), Math.round(webView.getContentHeight() * webView.getScale()));
                    int pageCount = Math.max(1, (int) Math.ceil(contentHeight / (double) viewportHeight));

                    for (int pageNumber = 0; pageNumber < pageCount; pageNumber++) {
                        PdfDocument.PageInfo pageInfo = new PdfDocument.PageInfo.Builder(pageWidth, pageHeight, pageNumber + 1).create();
                        PdfDocument.Page page = document.startPage(pageInfo);
                        page.getCanvas().drawColor(android.graphics.Color.WHITE);
                        webView.scrollTo(0, pageNumber * viewportHeight);
                        page.getCanvas().scale(pageScale, pageScale);
                        webView.draw(page.getCanvas());
                        document.finishPage(page);
                    }

                    try (FileOutputStream output = new ParcelFileDescriptor.AutoCloseOutputStream(descriptor)) {
                        document.writeTo(output);
                        output.flush();
                    }
            } finally {
                document.close();
            }

            ContentValues complete = new ContentValues();
            complete.put(MediaStore.Downloads.IS_PENDING, 0);
            getContext().getContentResolver().update(uri, complete, null, null);
            handler.removeCallbacks(timeout);
            if (settled.compareAndSet(false, true)) {
                webView.destroy();
                call.resolve();
            }
        } catch (Exception error) {
            fail(call, webView, uri, error, handler, timeout, settled);
        }
    }

    private void fail(PluginCall call, WebView webView, Uri uri, Exception error, Handler handler, Runnable timeout, AtomicBoolean settled) {
        handler.removeCallbacks(timeout);
        if (uri != null) getContext().getContentResolver().delete(uri, null, null);
        if (!settled.compareAndSet(false, true)) return;
        webView.destroy();
        call.reject("PDF gagal disimpan ke Unduhan.", error);
    }

}
