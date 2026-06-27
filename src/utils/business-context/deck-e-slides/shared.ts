/** Luckee mark SVG path (same as deck-d-business-plan-2026). */
export const LUCKEE_MARK_PATH =
  'M199.005 0.0665482C197.108 -0.183221 195.208 0.274403 193.665 1.3669L3.32023 129.596C0.904057 131.218 -0.349119 134.064 0.085027 136.94C0.51918 139.817 2.56374 142.176 5.32169 143.032L80.7433 166.434L8.03238 273.498C5.65471 276.487 5.90422 280.754 8.58061 283.464C11.257 286.173 15.5128 286.477 18.5477 284.154L208.443 155.785C210.859 154.163 212.112 151.317 211.678 148.441C211.244 145.564 209.199 143.205 206.441 142.349L133.721 119.785L204.025 11.7281C205.361 9.70909 205.661 7.15285 204.792 4.88107C203.924 2.60928 202.014 0.907865 199.681 0.276121C199.455 0.206262 199.23 0.136407 199.005 0.0665482ZM171.264 34.5851L115.457 119.786C114.129 121.777 113.847 124.277 114.64 126.494C115.452 128.749 117.288 130.489 119.576 131.168L186.893 152.055L42.493 249.936L99.233 166.503C100.56 164.512 100.842 162.012 100.05 159.795C99.2374 157.54 97.4017 155.8 95.1135 155.121L24.87 133.326L171.264 34.5851Z';

export const luckeeMarkJsx = `
        <svg className={styles.mark} viewBox="0 0 212 286" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="${LUCKEE_MARK_PATH}" fill="#FF7C1E" />
        </svg>`;

export const lightSlideBrandingStyles = `
  branding: \`
    pointer-events-none absolute bottom-10 right-10 z-10
  \`,
  mark: \`
    h-14 w-auto shrink-0
  \`,`;

export const lightSlideBaseStyles = `
  root: \`
    relative mx-auto flex h-full min-h-0 w-full max-w-[1920px] flex-col overflow-hidden
    aspect-video bg-white
  \`,
  slideTag: \`
    pointer-events-none absolute left-10 top-8 z-20 text-[16px] font-medium uppercase tracking-[0.2em] text-gray-500
  \`,
  main: \`
    mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 flex-col justify-center px-20 pb-24 pt-28 text-left
  \`,
  stack: \`
    flex w-full max-w-[1200px] flex-col gap-8
  \`,
  emphasis: \`
    font-semibold text-gray-950
  \`,
  orange: \`
    font-semibold text-[#FF7C1E]
  \`,`;

export const darkSlideBaseStyles = `
  root: \`
    relative mx-auto flex h-full min-h-0 w-full max-w-[1920px] flex-col overflow-hidden
    aspect-video bg-slate-950
  \`,
  missionBand: \`
    flex min-h-0 flex-1 flex-col justify-center px-20 pb-40 pt-28 text-left
  \`,
  kicker: \`
    mb-8 text-[15px] font-medium uppercase tracking-[0.22em] text-[#FF7C1E]
  \`,
  missionLead: \`
    m-0 max-w-[1280px] text-balance text-[52px] font-semibold leading-[1.12] tracking-[-0.02em] text-zinc-50
  \`,
  missionLine: \`
    m-0 max-w-[1100px] text-balance text-[30px] font-semibold leading-[1.2] tracking-[-0.015em] text-zinc-200
  \`,
  footerStrip: \`
    pointer-events-auto absolute inset-x-0 bottom-0 z-[15] flex w-full flex-row flex-wrap items-center gap-x-10 gap-y-3 px-20 py-10
  \`,
  footerLink: \`
    shrink-0 text-left text-[22px] font-semibold leading-none text-[#FF7C1E] underline-offset-[6px]
  \`,
  contactName: \`
    shrink-0 text-[22px] font-semibold leading-none text-zinc-300
  \`,
  branding: \`
    pointer-events-none absolute bottom-10 right-10 z-20
  \`,
  mark: \`
    h-14 w-auto shrink-0
  \`,`;
