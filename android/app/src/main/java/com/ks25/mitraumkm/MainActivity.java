package com.ks25.mitraumkm;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.ks25.mitraumkm.plugins.ScreenPlugin;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ScreenPlugin.class);
        super.onCreate(savedInstanceState);
    }

}