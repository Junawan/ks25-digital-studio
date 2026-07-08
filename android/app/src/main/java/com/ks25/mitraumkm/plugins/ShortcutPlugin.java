package com.ks25.mitraumkm.plugins;

import android.content.Intent;
import android.content.pm.ShortcutInfo;
import android.content.pm.ShortcutManager;
import android.graphics.drawable.Icon;
import android.net.Uri;
import android.os.Build;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.ks25.mitraumkm.MainActivity;

import java.util.List;

@CapacitorPlugin(name = "Shortcut")
public class ShortcutPlugin extends Plugin {

    @PluginMethod
    public void pin(PluginCall call) {

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            call.reject("Shortcut hanya didukung Android 8+");
            return;
        }

        String id = call.getString("id");
        String title = call.getString("title");
        String route = call.getString("route");
        String icon = call.getString("icon");

        ShortcutManager manager =
                getContext().getSystemService(
                        ShortcutManager.class
                );

        int iconId =
                getContext()
                        .getResources()
                        .getIdentifier(
                                icon,
                                "drawable",
                                getContext().getPackageName()
                        );

        Intent intent =
        new Intent(
                getContext(),
                MainActivity.class
        );

intent.setAction(
        Intent.ACTION_VIEW
);

intent.setData(
        Uri.parse(
                "https://www.ks25studio.web.id" +
                        route
        )
);

intent.setFlags(
        Intent.FLAG_ACTIVITY_NEW_TASK |
        Intent.FLAG_ACTIVITY_CLEAR_TOP |
        Intent.FLAG_ACTIVITY_SINGLE_TOP
);

        ShortcutInfo shortcut =
                new ShortcutInfo.Builder(
                        getContext(),
                        id
                )
                        .setShortLabel(title)
                        .setLongLabel(title)
                        .setIcon(
                                Icon.createWithResource(
                                        getContext(),
                                        iconId
                                )
                        )
                        .setIntent(intent)
                        .build();

        boolean success =
                manager.requestPinShortcut(
                        shortcut,
                        null
                );

        JSObject result = new JSObject();
        result.put("success", success);

        call.resolve(result);
    }

    @PluginMethod
    public void isPinned(
            PluginCall call
    ) {

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            call.resolve(new JSObject());
            return;
        }

        String id =
                call.getString("id");

        ShortcutManager manager =
                getContext().getSystemService(
                        ShortcutManager.class
                );

        boolean pinned = false;

        List<ShortcutInfo> shortcuts =
                manager.getPinnedShortcuts();

        for (ShortcutInfo item : shortcuts) {

            if (item.getId().equals(id)) {

                pinned = true;

                break;

            }

        }

        JSObject result =
                new JSObject();

        result.put(
                "pinned",
                pinned
        );

        call.resolve(result);

    }

    @PluginMethod
    public void getPinned(
            PluginCall call
    ) {

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            call.resolve(new JSObject());
            return;
        }

        ShortcutManager manager =
                getContext().getSystemService(
                        ShortcutManager.class
                );

        JSArray array =
                new JSArray();

        for (
                ShortcutInfo item :
                manager.getPinnedShortcuts()
        ) {

            array.put(
                    item.getId()
            );

        }

        JSObject result =
                new JSObject();

        result.put(
                "shortcuts",
                array
        );

        call.resolve(result);

    }

}