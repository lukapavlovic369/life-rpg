"use client";

import StaticHtmlScreen from "./StaticHtmlScreen";

const html = "<main class=\"status-screen status-design-v3 shared-status-frame scroll\"><div class=\"status-content shared-status-content\"><div class=\"ui\"><header><div class=\"title-row\"><div class=\"alert\">?</div><div class=\"title\">TASK BOARD</div></div><div class=\"subtitle\">[2 SYSTEM TASKS]</div><div class=\"goal\">DAILY</div></header><section class=\"section\"><div class=\"tag\">DAILY TASK RULE</div><div class=\"notice\">Every day the system assigns <b>2 random objectives</b>. At midnight, unfinished tasks disappear.</div></section><section class=\"section\"><div class=\"tag\">TODAY'S OBJECTIVES</div><div class=\"custom-list\" id=\"taskList\"></div></section></div></div></main>";

export default function TaskBoardScreen() {
  return <StaticHtmlScreen html={html} />;
}
