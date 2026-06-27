import { lightSlideBaseStyles, lightSlideBrandingStyles, luckeeMarkJsx } from './shared';

export const tractionTsx = `export default function Slide() {
  return (
    <div className={styles.root}>
      <p className={styles.slideTag}>Traction</p>
      <main className={styles.main}>
        <div className={styles.stack}>
          <h1 className={styles.headline}>Module catalog built. Install economics modeled. First installs next.</h1>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>
                <span className={styles.orange}>15 studios</span> registered in Luckee Dev Hub; getting-started map
                documents self-host and install path.
              </span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>Lead Studio OSS shipping; My Fundraise and graphics studio in active use.</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>
                On-prem brain box economics modeled (~$3,360 platform anchor); pre-revenue, founder-led Philly pipeline.
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
