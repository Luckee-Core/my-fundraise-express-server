import { darkSlideBaseStyles, luckeeMarkJsx } from './shared';

export const coverTsx = `export default function Slide() {
  return (
    <div className={styles.root}>
      <div className={styles.missionBand}>
        <p className={styles.kicker}>On-premise AI infrastructure</p>
        <div className={styles.mission}>
          <p className={styles.missionLead}>Your data. Your workflows. Your brain.</p>
        </div>
      </div>
      <div className={styles.footerStrip}>
        <span className={styles.footerLink}>luckeeapp.com</span>
      </div>
      <div className={styles.branding} aria-hidden>${luckeeMarkJsx}
      </div>
    </div>
  );
}

const styles = {${darkSlideBaseStyles}
};
`;
