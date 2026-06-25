export type GraphicsTsxPromptInput = {
  title: string;
  creativeBrief: string;
  canvasWidthPx: number;
  canvasHeightPx: number;
};

/** Builds the Cursor agent prompt for standalone graphics TSX generation. */
export const buildGraphicsTsxPrompt = (input: GraphicsTsxPromptInput): string => {
  return `Generate a single Next.js "use client" React component as a fixed-size marketing graphic.

Title: ${input.title}
Canvas width: ${input.canvasWidthPx}px
Canvas height: ${input.canvasHeightPx}px

Creative brief:
${input.creativeBrief}

Requirements:
1. export default a React component named GeneratedGraphic.
2. Root element MUST use exact dimensions: className="w-[${input.canvasWidthPx}px] h-[${input.canvasHeightPx}px]".
3. Use Tailwind CSS only with static className strings.
4. Do not use next/image or external fonts.
5. Return only the TSX source — no markdown fences.`;
};
