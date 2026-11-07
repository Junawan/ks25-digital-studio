"use client";

import { useState } from "react";

import {
  openingTemplates,
} from "@/modules/invitation/data/openingTemplates";

type Props = {

  open: boolean;

  onClose: () => void;

  onSelect: (
    heading: string,
    content: string
  ) => void;

};

export default function OpeningTemplateModal({

  open,

  onClose,

  onSelect,

}: Props) {

  const [category, setCategory] =
    useState("Semua");

  const [selected, setSelected] =
    useState(openingTemplates[0]);

  if (!open) return null;

  const filtered =
    category === "Semua"

      ? openingTemplates

      : openingTemplates.filter(

          (item) =>

            item.category === category

        );

  return (

    <div
      className="
      fixed
      inset-0
      bg-black/50
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
        w-full
        max-w-6xl
        h-[80vh]
        flex
        overflow-hidden
        "
      >

        {/* LEFT */}

        <div
          className="
          w-80
          border-r
          p-6
          overflow-y-auto
          "
        >

          <h2
            className="
            text-2xl
            font-bold
            mb-6
            "
          >

            Template Opening

          </h2>

          <select

            value={category}

            onChange={(e)=>

              setCategory(
                e.target.value
              )

            }

            className="
            w-full
            border
            rounded-xl
            p-3
            mb-5
            "

          >

            <option>
              Semua
            </option>

            <option>
              Muslim
            </option>

            <option>
              Non Muslim
            </option>

            <option>
              Universal
            </option>

          </select>

          <div className="space-y-3">

            {filtered.map((item)=>(

              <button

                key={item.id}

                onClick={()=>

                  setSelected(item)

                }

                className={`
                w-full
                text-left
                p-4
                rounded-xl
                border

                ${
                  selected.id === item.id

                  ?

                  "border-[#9A7B45] bg-[#9A7B45]/10"

                  :

                  ""

                }

                `}

              >

                <div className="font-semibold">

                  {item.name}

                </div>

                <div className="text-sm text-zinc-500">

                  {item.category}

                </div>

              </button>

            ))}

          </div>

        </div>

        {/* RIGHT */}

        <div
          className="
          flex-1
          p-8
          overflow-y-auto
          "
        >

          <h2
            className="
            text-3xl
            font-bold
            "
          >

            Preview

          </h2>

          <div
            className="
            mt-8
            "
          >

            <h3
              className="
              text-2xl
              font-semibold
              text-center
              "
            >

              {selected.heading}

            </h3>

            <p
              className="
              mt-8
              whitespace-pre-line
              leading-8
              text-lg
              "
            >

              {selected.content}

            </p>

          </div>

          <div
            className="
            flex
            justify-end
            gap-4
            mt-10
            "
          >

            <button

              onClick={onClose}

              className="
              px-6
              py-3
              rounded-xl
              border
              "

            >

              Batal

            </button>

            <button

              onClick={() => {

                onSelect(

                  selected.heading,

                  selected.content

                );

                onClose();

              }}

              className="
              px-6
              py-3
              rounded-xl
              bg-[#9A7B45]
              text-white
              "

            >

              Gunakan

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}