"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  db,
} from "@/modules/invitation/lib/firebase";

export default function DashboardInvitationDetail({
  slug,
}:{
  slug:string;
}){

  const [loading,setLoading] =
    useState(true);

  const [invitation,setInvitation] =
    useState<any>(null);

  useEffect(()=>{

    const load = async()=>{

      const snap =
        await getDoc(
          doc(
            db,
            "invitations",
            slug
          )
        );

      if(snap.exists()){

        setInvitation({

          id:snap.id,

          ...snap.data(),

        });

      }

      setLoading(false);

    };

    load();

  },[slug]);

  if(loading){

    return (

      <div className="p-10">

        Loading...

      </div>

    );

  }

  if(!invitation){

    return (

      <div className="p-10">

        Undangan tidak ditemukan.

      </div>

    );

  }

  return(

    <div className="space-y-8">

      <div>

        <h1
          className="
          text-4xl
          font-bold
          "
        >
          {invitation.groom}
          {" & "}
          {invitation.bride}
        </h1>

        <p
          className="
          mt-3
          text-zinc-500
          "
        >
          Tema :
          {" "}
          {invitation.theme}
        </p>

      </div>

      <div
        className="
        bg-white
        rounded-3xl
        p-8
        shadow
        "
      >

        <h2
          className="
          text-2xl
          font-semibold
          mb-6
          "
        >
          Aksi Cepat
        </h2>

        <div
          className="
          flex
          flex-wrap
          gap-4
          "
        >

          <Link
            href={`/undangan/${slug}?preview=1`}
            className="
            px-5
            py-3
            rounded-xl
            border
            "
          >
            Preview
          </Link>

          <Link
            href={`/invitation/${slug}/edit`}
            className="
            px-5
            py-3
            rounded-xl
            bg-black
            text-white
            "
          >
            Edit
          </Link>

        </div>

      </div>

    </div>

  );

}
