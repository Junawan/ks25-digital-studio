package com.ks25.mitraumkm.plugins;

import android.content.pm.ApplicationInfo;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AdMobBuildInfo")
public class AdMobBuildInfoPlugin extends Plugin {
    @PluginMethod
    public void isDebugBuild(PluginCall call) {
        JSObject result = new JSObject();
        boolean debug = (getContext().getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0;
        result.put("debug", debug);
        call.resolve(result);
    }
}
