"use client";

import StaticHtmlScreen from "./StaticHtmlScreen";

const html = "<main class=\"status-screen status-design-v3 shared-status-frame scroll\"><div class=\"status-content shared-status-content\"><div class=\"ui\"><header><div class=\"title-row\"><div class=\"alert\">Σ</div><div class=\"title\">WEEKLY STATS</div></div><div class=\"subtitle\">[7 DAY LOG]</div><div class=\"goal\">PROGRESS</div></header><section class=\"section\"><div class=\"tag\">THIS WEEK</div><div class=\"weekly-grid\" id=\"weeklySummary\"></div><div class=\"leader-note\">Weekly progress overview.</div></section></div></div></main>";

export default function WeeklyStatsScreen() {
  return <StaticHtmlScreen html={html} />;
}
