package com.ks25.mitraumkm.plugins;

import android.content.ContentValues;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.OutputStream;

@CapacitorPlugin(name = "AttendanceDownload")
public class AttendanceDownloadPlugin extends Plugin {

    @PluginMethod
    public void save(PluginCall call) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            call.reject("Simpan langsung ke Unduhan memerlukan Android 10 atau lebih baru.");
            return;
        }

        String requestedName = call.getString("fileName");
        String mimeType = call.getString("mimeType", "application/octet-stream");
        String encodedData = call.getString("data");
        if (requestedName == null || encodedData == null) {
            call.reject("Nama atau isi file tidak tersedia.");
            return;
        }

        String fileName = requestedName.replaceAll("[/\\\\\\r\\n]", "_");
        ContentValues values = new ContentValues();
        values.put(MediaStore.Downloads.DISPLAY_NAME, fileName);
        values.put(MediaStore.Downloads.MIME_TYPE, mimeType);
        values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/KS25");
        values.put(MediaStore.Downloads.IS_PENDING, 1);

        Uri fileUri = null;
        try {
            fileUri = getContext().getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
            if (fileUri == null) throw new IllegalStateException("Android tidak dapat membuat file Unduhan.");

            byte[] fileData = Base64.decode(encodedData, Base64.DEFAULT);
            try (OutputStream output = getContext().getContentResolver().openOutputStream(fileUri)) {
                if (output == null) throw new IllegalStateException("File tidak dapat dibuka untuk ditulis.");
                output.write(fileData);
                output.flush();
            }

            ContentValues completed = new ContentValues();
            completed.put(MediaStore.Downloads.IS_PENDING, 0);
            getContext().getContentResolver().update(fileUri, completed, null, null);
            call.resolve();
        } catch (Exception error) {
            if (fileUri != null) getContext().getContentResolver().delete(fileUri, null, null);
            call.reject("File absensi gagal disimpan ke Unduhan.", error);
        }
    }
}
