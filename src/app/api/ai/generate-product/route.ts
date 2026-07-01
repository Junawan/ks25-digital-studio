import { NextResponse } from "next/server";

import { openai } from "@/lib/openai";

import { cleanProductInfo } from "@/lib/product/cleanProductInfo";
import { buildGenerateProductPrompt } from "@/modules/live-assistant/ai/prompts/generateProductPrompt";


export async function POST(req: Request) {
  try {
    const {
      title,
      productInfo,
    } = await req.json();

    const cleanDescription =
      cleanProductInfo(productInfo);

    const prompt =
      buildGenerateProductPrompt(
        title,
        cleanDescription
      );

    const response =
      await openai.responses.create({
        model: "gpt-5-nano",
        input: prompt,
      });

    const aiResult = JSON.parse(
      response.output_text
    );

    return NextResponse.json(aiResult);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Generate gagal",
      },
      {
        status: 500,
      }
    );
  }
}