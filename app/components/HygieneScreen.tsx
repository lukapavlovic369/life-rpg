"use client";

import StaticHtmlScreen from "./StaticHtmlScreen";

const html = "<main class=\"status-screen status-design-v3 shared-status-frame scroll\"><div class=\"status-content shared-status-content\"><div class=\"ui\"><header><div class=\"title-row\"><div class=\"alert\">!</div><div class=\"title\">DAILY QUEST</div></div><div class=\"subtitle\">[HYGIENE &amp; CHORES]</div><div class=\"motto\">KEEP YOUR SPACE AND BODY CLEAN.</div></header><section class=\"section\"><div class=\"tag\">HYGIENE CHECK</div><div id=\"hygieneDaily\"></div></section><section class=\"section\"><div class=\"tag\">CHORES TASKS</div><div id=\"hygieneChores\"></div></section></div></div></main>";

export default function HygieneScreen() {
  return <StaticHtmlScreen html={html} />;
}
