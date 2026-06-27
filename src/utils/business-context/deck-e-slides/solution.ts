import { lightSlideBaseStyles, lightSlideBrandingStyles, luckeeMarkJsx } from './shared';

export const solutionTsx = `export default function Slide() {
  return (
    <div className={styles.root}>
      <p className={styles.slideTag}>Solution</p>
      <main className={styles.main}>
        <div className={styles.stack}>
          <h1 className={styles.headline}>
            Open-source modules on a menu.
            <br />
            Installed and maintained like traditional software.
          </h1>
          <p className={styles.subhead}>Mostly software. AI in bursts.</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>
                <span className={styles.emphasis}>AI Processes (AIP):</span> scheduled jobs with bounded scope.
              </span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>
                <span className={styles.emphasis}>Next Best Actions (NBA):</span> AI ranks your next steps; you approve.
              </span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>
                <span className={styles.emphasis}>Postgres and workflows:</span> tables and deterministic code run the
                day-to-day.
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
    m-0 text-balance text-[52px] font-semibold leading-[1.12] tracking-[-0.02em] text-gray-900
  \`,
  subhead: \`
    m-0 text-[30px] font-medium leading-[1.2] tracking-[-0.015em] text-gray-700
  \`,
  list: \`
    m-0 flex list-none flex-col gap-5 p-0
  \`,
  listItem: \`
    flex gap-4 text-[28px] font-normal leading-[1.45] tracking-[-0.01em] text-gray-800
  \`,
  bullet: \`
    mt-1 shrink-0 text-[28px] font-bold leading-none text-[#FF7C1E]
  \`,
  emphasis: \`
    font-semibold text-gray-950
  \`,${lightSlideBrandingStyles}
};
`;
