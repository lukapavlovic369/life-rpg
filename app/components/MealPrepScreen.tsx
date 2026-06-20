"use client";

import StaticHtmlScreen from "./StaticHtmlScreen";

const html = "<main class=\"status-screen status-design-v3 shared-status-frame scroll\"><div class=\"status-content shared-status-content\"><div class=\"ui\"><header><div class=\"title-row\"><div class=\"alert\">🍽</div><div class=\"title\">MEAL PREP</div></div><div class=\"subtitle\">[Meals / recipes / macros]</div></header><section class=\"section\"><div class=\"tag\">MEAL VAULT</div><button class=\"add-btn\" onclick=\"openAdd('meal')\">+</button><div class=\"custom-list\" id=\"mealList\"></div></section></div></div></main>";

export default function MealPrepScreen() {
  return <StaticHtmlScreen html={html} />;
}
