import { lightSlideBaseStyles, lightSlideBrandingStyles, luckeeMarkJsx } from './shared';

export const businessModelTsx = `export default function Slide() {
  return (
    <div className={styles.root}>
      <p className={styles.slideTag}>Business model</p>
      <main className={styles.main}>
        <div className={styles.stack}>
          <h1 className={styles.headline}>Two revenue streams. One module menu.</h1>
          <div className={styles.streams}>
            <div className={styles.streamCard}>
              <p className={styles.streamLabel}>Stream 1</p>
              <p className={styles.streamBody}>
                <span className={styles.emphasis}>Installation + maintenance</span> — hardware, Luckee modules on your
                LAN, ongoing support contract.
              </p>
            </div>
            <div className={styles.streamCard}>
              <p className={styles.streamLabel}>Stream 2</p>
              <p className={styles.streamBody}>
                <span className={styles.emphasis}>Pro Cloud</span> — same modules, hosted by Luckee.
              </p>
            </div>
          </div>
        </div>
      </main>
      <div className={styles.branding} aria-hidden>${luckeeMarkJsx}
      </div>
    </div>
  );
}

const styles = {${lightSlideBaseStyles}
  headline: \`
    m-0 max-w-[1100px] text-balance text-[40px] font-semibold leading-[1.18] tracking-[-0.02em] text-gray-900
  \`,
  streams: \`
    grid w-full max-w-[1100px] grid-cols-2 gap-8
  \`,
  streamCard: \`
    flex min-h-[180px] flex-col justify-start rounded-2xl border border-solid border-gray-200
    border-l-[4px] border-l-[#FF7C1E] bg-zinc-50 px-8 py-8
  \`,
  streamLabel: \`
    m-0 mb-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#FF7C1E]
  \`,
  streamBody: \`
    m-0 text-[24px] font-normal leading-[1.45] tracking-[-0.01em] text-gray-700
  \`,${lightSlideBrandingStyles}
};
`;
