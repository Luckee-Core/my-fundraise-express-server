import { lightSlideBaseStyles, lightSlideBrandingStyles, luckeeMarkJsx } from './shared';

export const competitionTsx = `export default function Slide() {
  return (
    <div className={styles.root}>
      <p className={styles.slideTag}>Competition</p>
      <main className={styles.main}>
        <h1 className={styles.headline}>Less GPU. More software. AI where it helps.</h1>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thCorner} scope="col" />
                <th className={styles.thLuckee} scope="col">
                  Luckee
                </th>
                <th className={styles.th} scope="col">
                  Cloud AI / Big SaaS
                </th>
                <th className={styles.th} scope="col">
                  GPU on-prem appliances
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className={styles.rowHead} scope="row">
                  Software + Postgres run the workflow loop
                </th>
                <td className={styles.cell}>✓</td>
                <td className={styles.cell}>—</td>
                <td className={styles.cell}>—</td>
              </tr>
              <tr>
                <th className={styles.rowHead} scope="row">
                  AIP + NBA — staged AI; operator approves
                </th>
                <td className={styles.cell}>✓</td>
                <td className={styles.cell}>~</td>
                <td className={styles.cell}>—</td>
              </tr>
              <tr>
                <th className={styles.rowHead} scope="row">
                  Data and workflows stay on your LAN
                </th>
                <td className={styles.cell}>✓</td>
                <td className={styles.cell}>—</td>
                <td className={styles.cell}>✓</td>
              </tr>
              <tr>
                <th className={styles.rowHead} scope="row">
                  Installed and maintained like traditional software
                </th>
                <td className={styles.cell}>✓</td>
                <td className={styles.cell}>—</td>
                <td className={styles.cell}>~</td>
              </tr>
              <tr>
                <th className={styles.rowHead} scope="row">
                  Accessible brain box — minimal GPU, retail-class desktop
                </th>
                <td className={styles.cell}>✓</td>
                <td className={styles.cell}>~</td>
                <td className={styles.cell}>—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className={styles.close}>
          Low GPU need = an AI brain anyone can afford to install.
        </p>
      </main>
      <div className={styles.branding} aria-hidden>${luckeeMarkJsx}
      </div>
    </div>
  );
}

const styles = {${lightSlideBaseStyles}
  main: \`
    mx-auto flex min-h-0 w-full max-w-[1680px] flex-1 flex-col justify-center gap-7 px-24 pb-20 pt-28 text-left
  \`,
  headline: \`
    m-0 text-[36px] font-semibold leading-[1.2] tracking-[-0.02em] text-gray-900
  \`,
  tableWrap: \`
    w-full min-w-0 max-w-[1680px] overflow-x-auto
  \`,
  table: \`
    w-full border-collapse text-left text-[18px] text-gray-800
  \`,
  thCorner: \`
    w-[32%] border-b border-r border-gray-200 bg-white p-0
  \`,
  thLuckee: \`
    border-b border-gray-200 bg-white px-4 py-3.5 text-left text-[16px] font-semibold uppercase tracking-[0.14em] text-[#FF7C1E]
  \`,
  th: \`
    border-b border-gray-200 bg-white px-4 py-3.5 text-left text-[16px] font-semibold uppercase tracking-[0.14em] text-gray-700
  \`,
  rowHead: \`
    border-b border-r border-gray-200 bg-white px-4 py-3 text-left text-[17px] font-medium leading-snug text-gray-800
  \`,
  cell: \`
    border-b border-gray-200 px-4 py-3 text-center text-[26px] font-semibold text-gray-900
  \`,
  close: \`
    m-0 border-t border-solid border-gray-200 pt-6 text-[26px] font-semibold leading-[1.35] tracking-[-0.01em] text-gray-900
  \`,${lightSlideBrandingStyles}
};
`;
