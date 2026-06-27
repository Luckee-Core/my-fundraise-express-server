import { lightSlideBaseStyles, lightSlideBrandingStyles, luckeeMarkJsx } from './shared';

export const backCoverTsx = `export default function Slide() {
  return (
    <div className={styles.root}>
      <p className={styles.slideTag}>Contact</p>
      <main className={styles.main}>
        <div className={styles.stack}>
          <h1 className={styles.headline}>Matthew Ruiz</h1>
          <p className={styles.subhead}>Philadelphia · on-prem installs · open source at luckee-core</p>
          <div className={styles.links}>
            <a className={styles.link} href="mailto:matt@luckeeapp.com">
              matt@luckeeapp.com
            </a>
            <a className={styles.link} href="https://github.com/luckee-core" target="_blank" rel="noreferrer">
              github.com/luckee-core
            </a>
            <a className={styles.link} href="https://github.com/mzruiz" target="_blank" rel="noreferrer">
              github.com/mzruiz
            </a>
          </div>
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
    flex w-full max-w-[1280px] flex-col gap-6
  \`,
  headline: \`
    m-0 text-[72px] font-semibold leading-none tracking-[-0.03em] text-gray-900
  \`,
  subhead: \`
    m-0 text-[30px] font-medium leading-[1.2] tracking-[-0.015em] text-gray-700
  \`,
  links: \`
    flex flex-col gap-4 pt-2
  \`,
  link: \`
    text-[28px] font-normal leading-[1.45] tracking-[-0.01em] text-gray-800 underline-offset-[6px] hover:text-[#FF7C1E] hover:underline
  \`,${lightSlideBrandingStyles}
};
`;
