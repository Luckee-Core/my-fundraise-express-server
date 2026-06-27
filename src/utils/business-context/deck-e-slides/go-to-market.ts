import { lightSlideBaseStyles, lightSlideBrandingStyles, luckeeMarkJsx } from './shared';

export const goToMarketTsx = `export default function Slide() {
  return (
    <div className={styles.root}>
      <p className={styles.slideTag}>Go to market</p>
      <main className={styles.main}>
        <div className={styles.stack}>
          <h1 className={styles.headline}>
            Founder-led installs in Philadelphia. Premier service for everyday businesses and households.
          </h1>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>
                <span className={styles.emphasis}>Matt / Luckee is the installer</span> — scoping, hardware, module
                configuration, and handoff.
              </span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>
                Start with Greater Philadelphia shops and suburban households in the{' '}
                <span className={styles.orange}>$200k–$1M</span> band.
              </span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>
                Open-source studios prove the module menu; Pro Cloud and on-prem installs monetize the same stack.
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
