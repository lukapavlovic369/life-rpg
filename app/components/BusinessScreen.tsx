"use client";

export const BUSINESS_SECTION_HTML = '<section class="page" id="business"><main class="status-screen status-design-v3 shared-status-frame scroll"><div class="status-content shared-status-content"><div class="ui"><header><div class="title-row"><div class="alert">!</div><div class="title">BUSINESS QUEST</div></div><div class="subtitle">[SMMA / SALES QUEST]</div><div class="goal">GOAL</div></header><section class="section list"><div class="tag">PART 1 - SMMA QUESTS</div><div id="businessSmma"></div></section><section class="section list"><div class="tag">PART 2 - SALES QUEST</div><div id="businessDropship"></div></section><section class="section"><div class="tag">PART 3 - PROGRESS TRACKER</div><div class="tracker"><span>Current Streak: [ <b class="streak">0</b> ] Days</span><span>|</span><span>Level: [ <b class="levelSmall">01</b> ]</span><span>|</span><span>EXP: [ <b class="xpSmall">0 / 1000</b> ]</span></div></section></div></div></main></section>';

export default function BusinessScreen() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: BUSINESS_SECTION_HTML,
      }}
    />
  );
}
