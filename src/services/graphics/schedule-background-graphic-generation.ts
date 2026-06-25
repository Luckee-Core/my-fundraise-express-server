/**
 * Runs a long-running generation task without blocking the HTTP response.
 */
export const scheduleBackgroundGraphicGeneration = (
  label: string,
  work: () => Promise<void>,
): void => {
  void work().catch((error: unknown) => {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`❌ ${label} background generation failed:`, msg);
  });
};
