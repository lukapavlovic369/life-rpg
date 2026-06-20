"use client";

import StaticHtmlScreen from "./StaticHtmlScreen";

const html = "<main class=\"status-screen status-design-v3 shared-status-frame scroll\"><div class=\"status-content shared-status-content\"><div class=\"ui\"><header><div class=\"title-row\"><div class=\"alert\">★</div><div class=\"title\">MONTHLY ACHIEVEMENT</div></div><div class=\"subtitle\">[ONE GOAL. ONE MONTH. NO SPAM.]</div></header><section class=\"section\"><div class=\"tag\">SYSTEM CONTRACT</div><div class=\"custom-list\" id=\"monthlyAchievementPanel\"></div></section><section class=\"section\"><div class=\"tag\">ARCHIVE</div><div class=\"custom-list\" id=\"achievementList\"></div></section></div></div></main>";

export default function AchievementsScreen() {
  return <StaticHtmlScreen html={html} />;
}
