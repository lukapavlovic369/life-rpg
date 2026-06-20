"use client";

import StaticHtmlScreen from "./StaticHtmlScreen";

const html = "<main class=\"status-screen status-design-v3 shared-status-frame scroll\"><div class=\"status-content shared-status-content\"><div class=\"ui\"><header><div class=\"title-row\"><div class=\"alert\">!</div><div class=\"title\">DAILY QUEST</div></div><div class=\"subtitle\">[SIDE HUSTLE]</div><div class=\"goal\">GOAL</div></header><section class=\"section list\"><div class=\"tag\">SIDE HUSTLE QUESTS</div><div id=\"workDaily\"></div></section><section class=\"section list side-bonus-wrap\" id=\"sideBonusSection\" style=\"display:none\"><div class=\"tag\">BONUS OBJECTIVES</div><div id=\"sideBonusObjectives\"></div></section><div class=\"side-capsule-bottom\"><div class=\"capsule-slot\" id=\"sideHustleCapsule\"></div></div></div></div></main>";

export default function SideHustleScreen() {
  return <StaticHtmlScreen html={html} />;
}
