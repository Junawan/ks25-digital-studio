package com.ks25.mitraumkm;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.ks25.mitraumkm.plugins.AttendanceDownloadPlugin;
import com.ks25.mitraumkm.plugins.AdMobBuildInfoPlugin;
import com.ks25.mitraumkm.plugins.PlayStoreUpdatePlugin;
import com.ks25.mitraumkm.plugins.ScreenPlugin;
import com.ks25.mitraumkm.plugins.ShortcutPlugin;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ScreenPlugin.class);
        registerPlugin(ShortcutPlugin.class);
        registerPlugin(AttendanceDownloadPlugin.class);
        registerPlugin(AdMobBuildInfoPlugin.class);
        registerPlugin(PlayStoreUpdatePlugin.class);
        super.onCreate(savedInstanceState);
    }

}
