"use client";

import {
    useSortable,
} from "@dnd-kit/sortable";

import {
    CSS,
} from "@dnd-kit/utilities";

import PlaylistProductItem
from "./PlaylistProductItem";

export default function SortablePlaylistItem(
    props:any
){

    const {

        attributes,

        listeners,

        setNodeRef,

        transform,

        transition,

    } = useSortable({

        id: props.product.productId,

    });

    return(

<div

ref={setNodeRef}

style={{

transform:
CSS.Transform.toString(
transform
),

transition,

}}

>

<PlaylistProductItem

{...props}

dragAttributes={attributes}

dragListeners={listeners}

/>

</div>

    );

}