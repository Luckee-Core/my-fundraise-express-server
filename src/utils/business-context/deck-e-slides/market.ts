import { lightSlideBaseStyles, lightSlideBrandingStyles, luckeeMarkJsx } from './shared';

export const marketTsx = `export default function Slide() {
  return (
    <div className={styles.root}>
      <p className={styles.slideTag}>Market</p>
      <main className={styles.main}>
        <div className={styles.stack}>
          <h1 className={styles.headline}>
            America has ~35M small businesses; ~18M households earn $200k–$1M.
          </h1>
          <div className={styles.columns}>
            <div className={styles.column}>
              <p className={styles.columnLabel}>Small businesses</p>
              <p className={styles.columnValue}>$175B</p>
            </div>
            <div className={styles.column}>
              <p className={styles.columnLabel}>Households</p>
              <p className={styles.columnValue}>$180B</p>
            </div>
          </div>
          <div className={styles.regionBlock}>
            <p className={styles.regionHeadline}>
              Starting in Philadelphia · Northeast (DC and up): ~7M small businesses; ~3.5M households earn
              $200k–$1M.
            </p>
            <div className={styles.regionColumns}>
              <div className={styles.column}>
                <p className={styles.regionLabel}>Small businesses</p>
                <p className={styles.regionValue}>$35B</p>
              </div>
              <div className={styles.column}>
                <p className={styles.regionLabel}>Households</p>
                <p className={styles.regionValue}>$35B</p>
              </div>
            </div>
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
    flex min-h-0 w-full flex-1 flex-col justify-center px-20 pb-20 pt-24 text-left
  \`,
  stack: \`
    flex w-full flex-col gap-8
  \`,
  headline: \`
    m-0 w-full whitespace-nowrap text-[40px] font-semibold leading-[1.12] tracking-[-0.02em] text-gray-900
  \`,
  columns: \`
    grid w-full grid-cols-2 gap-16
  \`,
  column: \`
    flex min-w-0 flex-col gap-2
  \`,
  columnLabel: \`
    m-0 text-[24px] font-medium leading-[1.3] tracking-[-0.01em] text-gray-700
  \`,
  columnValue: \`
    m-0 text-[80px] font-semibold leading-none tracking-[-0.03em] text-[#FF7C1E]
  \`,
  regionBlock: \`
    flex w-full flex-col gap-5 border-t border-solid border-gray-200 pt-8
  \`,
  regionHeadline: \`
    m-0 w-full whitespace-nowrap text-[28px] font-semibold leading-[1.2] tracking-[-0.015em] text-gray-800
  \`,
  regionColumns: \`
    grid w-full grid-cols-2 gap-16
  \`,
  regionLabel: \`
    m-0 text-[20px] font-medium leading-[1.3] tracking-[-0.01em] text-gray-600
  \`,
  regionValue: \`
    m-0 text-[56px] font-semibold leading-none tracking-[-0.03em] text-[#FF7C1E]
  \`,${lightSlideBrandingStyles}
};
`;
