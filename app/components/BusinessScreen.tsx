"use client";

import StaticHtmlScreen from "./StaticHtmlScreen";

const html = `<main class="status-screen status-design-v3 shared-status-frame scroll"><div class="status-content shared-status-content"><div class="ui"><header><div class="title-row"><div class="alert">$</div><div class="title">BUSINESS</div></div><div class="subtitle">[WORK / SIDE QUESTS]</div></header><section class="section"><div class="tag">BUSINESS QUESTS</div><div id="businessDaily" class="custom-list"></div></section></div></div></main>`;

export default function BusinessScreen() { return <StaticHtmlScreen html={html} />; }
