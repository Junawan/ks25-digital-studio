"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Keyboard,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";

export default function DebugRemotePage() {

  const [
    key,
    setKey,
  ] = useState("-");

  const [
    code,
    setCode,
  ] = useState("-");

  const [
    keyCode,
    setKeyCode,
  ] = useState(0);

  useEffect(() => {

    function handleKeyDown(
      event: KeyboardEvent
    ) {

      event.preventDefault();

      setKey(event.key);

      setCode(event.code);

      setKeyCode(event.keyCode);

    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

  }, []);

  return (

<div
className="
min-h-screen
bg-black
text-white
"
>

<div
className="
mx-auto
max-w-lg
space-y-8
p-6
"
>

<div className="text-center">

<Keyboard
className="
mx-auto
mb-4
h-14
w-14
text-violet-500
"
/>

<h1
className="
text-3xl
font-bold
"
>

Bluetooth Remote Test

</h1>

<p
className="
mt-2
text-zinc-400
"
>

Tekan tombol pada Bluetooth Remote.

</p>

</div>

<div
className="
space-y-4
rounded-2xl
bg-zinc-900
p-5
"
>

<Item
label="Key"
value={key}
/>

<Item
label="Code"
value={code}
/>

<Item
label="KeyCode"
value={
String(keyCode)
}
/>

</div>

<Button
className="w-full"
onClick={() => {

setKey("-");

setCode("-");

setKeyCode(0);

}}
>

Reset

</Button>

</div>

</div>

  );

}

interface ItemProps {

  label: string;

  value: string;

}

function Item({

  label,

  value,

}: ItemProps) {

  return (

<div
className="
flex
items-center
justify-between
rounded-xl
bg-zinc-800
p-4
"
>

<div
className="
text-zinc-400
"
>

{label}

</div>

<div
className="
font-mono
text-lg
font-bold
"
>

{value}

</div>

</div>

  );

}