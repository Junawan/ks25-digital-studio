package com.ks25.mitraumkm;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.ks25.mitraumkm.plugins.ScreenPlugin;
import com.ks25.mitraumkm.plugins.ShortcutPlugin;
import android.content.Intent;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ScreenPlugin.class);
        registerPlugin(ShortcutPlugin.class);
        super.onCreate(savedInstanceState);
    }

    @Override
protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);

    setIntent(intent);
}

}