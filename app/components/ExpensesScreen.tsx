"use client";

import StaticHtmlScreen from "./StaticHtmlScreen";

const html = "<main class=\"status-screen status-design-v3 shared-status-frame scroll\"><div class=\"status-content shared-status-content\"><div class=\"ui\"><header><div class=\"title-row\"><div class=\"alert\">$</div><div class=\"title\">EXPENSES</div></div><div class=\"subtitle\">[Bills / costs / tracking]</div></header><section class=\"section\"><div class=\"tag\">EXPENSE LOG</div><div class=\"notice\" id=\"expenseWalletHint\" style=\"font-size:12px;margin-bottom:10px\">Reward Inventory unlocks at Level 7. Expenses unlock at Level 9.</div><button class=\"add-btn\" onclick=\"openAdd('expense')\">+</button><div class=\"custom-list\" id=\"expenseList\"></div></section></div></div></main>";

export default function ExpensesScreen() {
  return <StaticHtmlScreen html={html} />;
}
