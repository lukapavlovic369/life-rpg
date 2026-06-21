"use client";

import StaticHtmlScreen from "./StaticHtmlScreen";

const html = `<main class="status-screen status-design-v3 shared-status-frame scroll"><div class="status-content shared-status-content"><div class="ui"><header><div class="title-row"><div class="alert">★</div><div class="title">LEADERBOARD</div></div><div class="subtitle">[PLAYER RANKINGS]</div></header><section class="section"><div class="tag">RANKINGS</div><div id="leaderboardList" class="leaderboard-list"></div></section></div></div></main>`;

export default function LeaderboardScreen() { return <StaticHtmlScreen html={html} />; }
