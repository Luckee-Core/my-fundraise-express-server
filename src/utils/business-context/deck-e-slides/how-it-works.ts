import { lightSlideBaseStyles, lightSlideBrandingStyles, luckeeMarkJsx } from './shared';

export const howItWorksTsx = `export default function Slide() {
  return (
    <div className={styles.root}>
      <p className={styles.slideTag}>How it works</p>
      <main className={styles.main}>
        <div className={styles.stack}>
          <h1 className={styles.headline}>Pick modules. Luckee installs your brain. You approve every action.</h1>
          <p className={styles.subhead}>
            Short AI exchanges write facts into Postgres. You define the menu of next steps; AI ranks options;{' '}
            <span className={styles.emphasis}>you approve</span>.
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>
                <span className={styles.emphasis}>AI Processes (AIP):</span> scheduled, bounded jobs — digests,
                categorization, research queues — not 24/7 chat bots.
              </span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>
                <span className={styles.emphasis}>Next Best Actions (NBA):</span> operator-defined action menu; AI
                recommends order; human approves before anything customer-facing ships.
              </span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>
                <span className={styles.emphasis}>Less GPU:</span> segmented studios and fact-backed memory — not
                megacontext agent hubs sized for inference duty cycle.
              </span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>
                <span className={styles.emphasis}>Pro Cloud:</span> same modules, Luckee-hosted, for buyers who want the
                product without owning the box.
              </span>
            </li>
          </ul>
        </div>
      </main>
      <div className={styles.branding} aria-hidden>${luckeeMarkJsx}
      </div>
    </div>
  );
}

const styles = {${lightSlideBaseStyles}
  headline: \`
    m-0 max-w-[1100px] text-balance text-[38px] font-semibold leading-[1.2] tracking-[-0.02em] text-gray-900
  \`,
  subhead: \`
    m-0 max-w-[1100px] text-balance text-[26px] font-normal leading-[1.45] tracking-[-0.01em] text-gray-700
  \`,
  list: \`
    m-0 flex max-w-[1100px] list-none flex-col gap-5 p-0
  \`,
  listItem: \`
    flex gap-4 text-[28px] font-normal leading-[1.45] tracking-[-0.01em] text-gray-800
  \`,
  bullet: \`
    mt-1 shrink-0 text-[28px] font-bold leading-none text-[#FF7C1E]
  \`,${lightSlideBrandingStyles}
};
`;
