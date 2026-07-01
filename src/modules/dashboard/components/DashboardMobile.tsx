"use client";

import {
    Package,
    ListMusic,
    Sparkles,
    PlayCircle,
} from "lucide-react";

import Link from "next/link";

const menus = [

    {
        title: "Products",
        icon: Package,
        href: "/live-assistant/products",
        color: "bg-blue-500",
    },

    {
        title: "Playlist",
        icon: ListMusic,
        href: "/live-assistant/playlists",
        color: "bg-violet-500",
    },

    {
        title: "Generate AI",
        icon: Sparkles,
        href: "/live-assistant/playlists",
        color: "bg-emerald-500",
    },

    {
        title: "Presenter",
        icon: PlayCircle,
        href: "/live-assistant",
        color: "bg-red-500",
    },

];

export default function DashboardMobile() {

    return (

        <div className="space-y-6">

            <div>

                <p className="text-zinc-400">

                    Selamat Datang 👋

                </p>

                <h1 className="mt-1 text-3xl font-bold">

                    Live Assistant

                </h1>

            </div>

            <div
                className="
                grid
                grid-cols-2
                gap-4
                "
            >

                {menus.map((menu)=>{

                    const Icon = menu.icon;

                    return (

                        <Link
                            key={menu.title}
                            href={menu.href}
                            className="
                            rounded-2xl
                            border
                            bg-zinc-900
                            p-5
                            transition
                            hover:scale-[1.03]
                            "
                        >

                            <div
                                className={`
                                ${menu.color}
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-xl
                                `}
                            >

                                <Icon
                                    className="
                                    h-7
                                    w-7
                                    text-white
                                    "
                                />

                            </div>

                            <h2
                                className="
                                mt-5
                                text-lg
                                font-semibold
                                "
                            >

                                {menu.title}

                            </h2>

                        </Link>

                    );

                })}

            </div>

        </div>

    );

}