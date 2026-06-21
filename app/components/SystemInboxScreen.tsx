"use client";

import StaticHtmlScreen from "./StaticHtmlScreen";

const html = `<main class="status-screen status-design-v3 shared-status-frame scroll"><div class="status-content shared-status-content"><div class="ui"><header><div class="title-row"><div class="alert">!</div><div class="title">SYSTEM INBOX</div></div><div class="subtitle">[TRANSMISSIONS]</div></header><section class="section"><div class="tag">MESSAGES</div><div id="systemInboxList" class="custom-list"></div></section></div></div></main>`;

export default function SystemInboxScreen() { return <StaticHtmlScreen html={html} />; }
