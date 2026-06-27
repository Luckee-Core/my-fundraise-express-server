import { lightSlideBaseStyles, lightSlideBrandingStyles, luckeeMarkJsx } from './shared';

export const competitionTsx = `export default function Slide() {
  return (
    <div className={styles.root}>
      <p className={styles.slideTag}>Competition</p>
      <main className={styles.main}>
        <div className={styles.stack}>
          <h1 className={styles.headline}>Cloud sprawl vs GPU-heavy on-prem vs Luckee.</h1>
          <div className={styles.table}>
            <div className={styles.row}>
              <p className={styles.colLabel}>Cloud AI / Big SaaS</p>
              <p className={styles.colBody}>Vendor-owned memory; bolt-on AI. No install — SaaS only.</p>
            </div>
            <div className={styles.row}>
              <p className={styles.colLabel}>DevXT-class on-prem</p>
              <p className={styles.colBody}>Larger GPUs; always-on agents; appliance drop-ship.</p>
            </div>
            <div className={styles.rowHighlight}>
              <p className={styles.colLabel}>Luckee</p>
              <p className={styles.colBody}>
                Module menu; AIP/NBA; less GPU. Luckee installs and maintains. Your data; you approve actions.
              </p>
            </div>
          </div>
          <p className={styles.close}>
            DevXT-class appliances compete on <span className={styles.emphasis}>inference duty cycle</span>. Luckee
            competes on <span className={styles.emphasis}>workflows you own</span>.
          </p>
        </div>
      </main>
      <div className={styles.branding} aria-hidden>${luckeeMarkJsx}
      </div>
    </div>
  );
}

const styles = {${lightSlideBaseStyles}
  main: \`
    mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col justify-center px-20 pb-24 pt-28 text-left
  \`,
  headline: \`
    m-0 max-w-[1400px] text-balance text-[36px] font-semibold leading-[1.2] tracking-[-0.02em] text-gray-900
  \`,
  table: \`
    flex w-full max-w-[1400px] flex-col gap-4
  \`,
  row: \`
    grid grid-cols-[minmax(0,14rem)_minmax(0,1fr)] gap-6 rounded-xl border border-solid border-gray-200 bg-zinc-50 px-8 py-6
  \`,
  rowHighlight: \`
    grid grid-cols-[minmax(0,14rem)_minmax(0,1fr)] gap-6 rounded-xl border border-solid border-[#FF7C1E] bg-orange-50/40 px-8 py-6
  \`,
  colLabel: \`
    m-0 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#FF7C1E]
  \`,
  colBody: \`
    m-0 text-[22px] font-normal leading-[1.45] text-gray-800
  \`,
  close: \`
    m-0 max-w-[1400px] text-[24px] font-normal leading-[1.4] text-gray-700
  \`,${lightSlideBrandingStyles}
};
`;
