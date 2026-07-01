import { lightSlideBaseStyles, lightSlideBrandingStyles, luckeeMarkJsx } from './shared';

export const businessModelTsx = `export default function Slide() {
  return (
    <div className={styles.root}>
      <p className={styles.slideTag}>Business model</p>
      <main className={styles.main}>
        <div className={styles.stack}>
          <h1 className={styles.headline}>Install once. Luckee Care keeps it running.</h1>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>
                <span className={styles.emphasis}>~$1,500–$2,500</span> year-one install — box, modules, and setup on
                your LAN
              </span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>
                <span className={styles.emphasis}>Warranty + two semiannual check-ups</span> bundled with install —
                HVAC-style
              </span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>
                <span className={styles.emphasis}>Luckee Care</span> from year two — ~$250–$450/yr maintenance contract
              </span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>
                Module upgrades and custom builds over time →{' '}
                <span className={styles.emphasis}>~$5k customer lifetime value</span>
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
  main: \`
    flex min-h-0 w-full flex-1 flex-col justify-center px-20 pb-24 pt-28 text-left
  \`,
  stack: \`
    flex w-full max-w-[1280px] flex-col gap-8
  \`,
  headline: \`
    m-0 max-w-[1200px] text-balance text-[48px] font-semibold leading-[1.14] tracking-[-0.02em] text-gray-900
  \`,
  list: \`
    m-0 flex list-none flex-col gap-5 p-0
  \`,
  listItem: \`
    flex gap-4 text-[28px] font-normal leading-[1.45] tracking-[-0.01em] text-gray-800
  \`,
  bullet: \`
    mt-1 shrink-0 text-[28px] font-bold leading-none text-[#FF7C1E]
  \`,${lightSlideBrandingStyles}
};
`;
