import { lightSlideBaseStyles, lightSlideBrandingStyles, luckeeMarkJsx } from './shared';

export const askTsx = `export default function Slide() {
  return (
    <div className={styles.root}>
      <p className={styles.slideTag}>Ask</p>
      <main className={styles.main}>
        <div className={styles.stack}>
          <h1 className={styles.headline}>
            <span className={styles.orange}>$500K</span>
            <span className={styles.headlineSep}> · </span>
            12 months
          </h1>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>Marketing and sales automation</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>Coding tokens and software subscriptions</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.bullet} aria-hidden>·</span>
              <span>
                <span className={styles.emphasis}>Field install:</span> one lead technician (electrician and
                carpenter), service truck, ethernet runs, device storage
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
    flex w-full flex-col gap-8
  \`,
  headline: \`
    m-0 whitespace-nowrap text-[72px] font-semibold leading-none tracking-[-0.03em] text-gray-900
  \`,
  headlineSep: \`
    font-normal text-gray-400
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
