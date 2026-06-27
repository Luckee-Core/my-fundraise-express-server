import { lightSlideBaseStyles, lightSlideBrandingStyles, luckeeMarkJsx } from './shared';

export const problemTsx = `export default function Slide() {
  return (
    <div className={styles.root}>
      <p className={styles.slideTag}>Opportunity</p>
      <main className={styles.main}>
        <div className={styles.stack}>
          <h1 className={styles.headline}>
            GPU boxes never really stop inferencing;
            <br />
            everyday people need AI on a schedule and a short list of what to do next.
          </h1>
          <p className={styles.subhead}>Your network. Your privacy.</p>
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
  \`,${lightSlideBrandingStyles}
};
`;
