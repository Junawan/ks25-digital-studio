"use client";

import { invitationThemes } from "@/modules/invitation/data/invitationThemes";

type Props = {

  open: boolean;

  current: string;

  onClose: () => void;

  onSelect: (
    themeId: string
  ) => void;

};

export default function ThemePickerModal({

  open,

  current,

  onClose,

  onSelect,

}: Props){

  if(!open) return null;

  return(

<div
className="
fixed
inset-0
bg-black/60
z-50
flex
items-center
justify-center
p-6
"
>

<div
className="
bg-white
rounded-3xl
max-w-6xl
w-full
max-h-[90vh]
overflow-y-auto
p-8
"
>

<h2
className="
text-3xl
font-bold
mb-8
"
>

Pilih Tema

</h2>

<div
className="
grid
md:grid-cols-2
gap-8
"
>

{invitationThemes.map((item)=>(

<div

key={item.id}

className={`
border
rounded-3xl
overflow-hidden
transition

${
current===item.id

?

"border-[#9A7B45] ring-2 ring-[#9A7B45]"

:

"border-zinc-200"

}
`}

>

<img

src={item.image}

alt={item.name}

className="
w-full
h-60
object-cover
"

/>

<div
className="
p-6
"
>

<div
className="
flex
justify-between
items-center
"
>

<h3
className="
text-2xl
font-bold
"
>

{item.name}

</h3>

{item.premium && (

<span
className="
bg-yellow-100
text-yellow-700
px-3
py-1
rounded-full
text-xs
font-semibold
"
>

Premium

</span>

)}

</div>

<p
className="
mt-3
text-zinc-500
"
>

{item.description}

</p>

<button

type="button"

onClick={()=>{

onSelect(item.id);

onClose();

}}

className="
mt-6
w-full
bg-[#9A7B45]
text-white
py-3
rounded-xl
"

>

Gunakan Tema

</button>

</div>

</div>

))}

</div>

<div
className="
flex
justify-end
mt-8
"
>

<button

onClick={onClose}

className="
px-6
py-3
border
rounded-xl
"

>

Tutup

</button>

</div>

</div>

</div>

);

}