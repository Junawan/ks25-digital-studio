package com.ks25.mitraumkm.plugins;

import android.content.ContentValues;
import android.net.Uri;
import android.os.Build;
import android.os.CancellationSignal;
import android.os.Environment;
import android.os.ParcelFileDescriptor;
import android.print.PageRange;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintDocumentInfo;
import android.provider.MediaStore;
import android.webkit.WebView;
import android.view.View;
import android.view.ViewGroup;

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
            webView.setLayoutParams(new ViewGroup.LayoutParams(794, 1123));
            webView.getSettings().setJavaScriptEnabled(false);
            webView.setWebViewClient(new android.webkit.WebViewClient() {
                @Override
                public void onPageFinished(WebView view, String url) {
                    view.measure(View.MeasureSpec.makeMeasureSpec(794, View.MeasureSpec.EXACTLY), View.MeasureSpec.makeMeasureSpec(1123, View.MeasureSpec.AT_MOST));
                    view.layout(0, 0, 794, Math.max(1123, view.getMeasuredHeight()));
                    view.postDelayed(() -> writePdf(view, call, pdfName), 1000);
                }
            });
            webView.loadDataWithBaseURL("https://www.ks25studio.web.id/", html, "text/html", "UTF-8", null);
        });
    }

    private void writePdf(WebView webView, PluginCall call, String fileName) {
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
            Uri savedUri = uri;
            PrintDocumentAdapter adapter = webView.createPrintDocumentAdapter(fileName);
            PrintAttributes attributes = new PrintAttributes.Builder()
                    .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                    .setResolution(new PrintAttributes.Resolution("pdf", "PDF", 300, 300))
                    .setMinMargins(PrintAttributes.Margins.NO_MARGINS)
                    .build();
            adapter.onLayout(null, attributes, new CancellationSignal(), new PrintDocumentAdapter.LayoutResultCallback() {
                @Override
                public void onLayoutFinished(PrintDocumentInfo info, boolean changed) {
                    adapter.onWrite(new PageRange[]{PageRange.ALL_PAGES}, descriptor, new CancellationSignal(), new PrintDocumentAdapter.WriteResultCallback() {
                        @Override
                        public void onWriteFinished(PageRange[] pages) {
                            try {
                                descriptor.close();
                                ContentValues complete = new ContentValues();
                                complete.put(MediaStore.Downloads.IS_PENDING, 0);
                                getContext().getContentResolver().update(savedUri, complete, null, null);
                                webView.destroy();
                                call.resolve();
                            } catch (Exception error) {
                                fail(call, webView, savedUri, error);
                            }
                        }

                        @Override
                        public void onWriteFailed(CharSequence error) {
                            fail(call, webView, savedUri, new IllegalStateException(String.valueOf(error)));
                        }
                    });
                }

                @Override
                public void onLayoutFailed(CharSequence error) {
                    fail(call, webView, savedUri, new IllegalStateException(String.valueOf(error)));
                }
            }, null);
        } catch (Exception error) {
            if (uri != null) getContext().getContentResolver().delete(uri, null, null);
            webView.destroy();
            call.reject("PDF gagal disimpan ke Unduhan.", error);
        }
    }

    private void fail(PluginCall call, WebView webView, Uri uri, Exception error) {
        getContext().getContentResolver().delete(uri, null, null);
        webView.destroy();
        call.reject("PDF gagal disimpan ke Unduhan.", error);
    }
}
