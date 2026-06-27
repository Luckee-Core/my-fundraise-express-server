import { lightSlideBaseStyles, lightSlideBrandingStyles, luckeeMarkJsx } from './shared';

export const teamTsx = `export default function Slide() {
  return (
    <div className={styles.root}>
      <p className={styles.slideTag}>Team</p>
      <main className={styles.main}>
        <div className={styles.stack}>
          <h1 className={styles.headline}>Matthew Ruiz · solo founder · Philadelphia</h1>
          <p className={styles.subhead}>Public school roots · building Luckee founder-led in Pennsylvania</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>
                <span className={styles.emphasis}>Revature — Salesforce trainer:</span> taught technical concepts at
                scale; maps to explaining complex systems to non-technical customers during install.
              </span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>
                <span className={styles.emphasis}>Six years agency owner:</span> scoping, shipping, integrations under
                deadline — custom module configuration per customer.
              </span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>
                <span className={styles.emphasis}>Gallen Restoration crew supervisor:</span> field and trades reality
                before full-time software — on-site install credibility.
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
    m-0 max-w-[1100px] text-[22px] font-medium leading-[1.4] text-gray-600
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
