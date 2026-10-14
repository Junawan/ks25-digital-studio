package com.ks25.mitraumkm.plugins;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.JSObject;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.play.core.appupdate.AppUpdateInfo;
import com.google.android.play.core.appupdate.AppUpdateManager;
import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import com.google.android.play.core.appupdate.AppUpdateOptions;
import com.google.android.play.core.install.model.AppUpdateType;
import com.google.android.play.core.install.model.UpdateAvailability;

@CapacitorPlugin(name = "PlayStoreUpdate")
public class PlayStoreUpdatePlugin extends Plugin {
    private static final int UPDATE_REQUEST_CODE = 9401;

    @PluginMethod
    public void check(PluginCall call) {
        AppUpdateManager manager = AppUpdateManagerFactory.create(getContext());
        manager.getAppUpdateInfo()
            .addOnSuccessListener(info -> resolveUpdateStatus(call, info))
            .addOnFailureListener(error -> call.reject("Status pembaruan Play Store belum dapat diperiksa.", error));
    }

    @PluginMethod
    public void startImmediateUpdate(PluginCall call) {
        AppUpdateManager manager = AppUpdateManagerFactory.create(getContext());
        manager.getAppUpdateInfo().addOnSuccessListener(info -> {
            if (info.updateAvailability() != UpdateAvailability.UPDATE_AVAILABLE
                && info.updateAvailability() != UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS) {
                JSObject result = new JSObject();
                result.put("started", false);
                call.resolve(result);
                return;
            }
            AppUpdateOptions options = AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE).build();
            if (!info.isUpdateTypeAllowed(options)) {
                call.reject("Pembaruan saat ini belum dapat dipasang melalui Google Play.");
                return;
            }
            try {
                boolean started = manager.startUpdateFlowForResult(info, getActivity(), options, UPDATE_REQUEST_CODE);
                JSObject result = new JSObject();
                result.put("started", started);
                call.resolve(result);
            } catch (Exception error) {
                call.reject("Google Play gagal memulai pembaruan aplikasi.", error);
            }
        }).addOnFailureListener(error -> call.reject("Status pembaruan Play Store belum dapat diperiksa.", error));
    }

    private void resolveUpdateStatus(PluginCall call, AppUpdateInfo info) {
        boolean available = info.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE
            || info.updateAvailability() == UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS;
        JSObject result = new JSObject();
        result.put("available", available);
        result.put("versionCode", available ? info.availableVersionCode() : 0);
        call.resolve(result);
    }
}
