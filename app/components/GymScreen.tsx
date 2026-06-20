"use client";

export const GYM_SECTION_HTML = '<section class="page" id="gym"><main class="status-screen status-design-v3 shared-status-frame scroll"><div class="status-content shared-status-content"><div class="ui"><header><div class="title-row"><div class="alert">!</div><div class="title">DAILY QUEST</div></div><div class="subtitle">[Strenght training]</div><div class="goal">GOAL</div></header><section class="section"><div class="tag">PART 1 - FOUNDATION (DAILY)</div><div class="daily-list" id="gymFoundation"></div></section><section class="section gym-part2-section"><div class="tag">PART 2</div><div class="grid" id="gymGrid" style="display:none"></div></section></div><div class="gym-capsule-bottom"><div class="capsule-slot" id="gymRecovery"></div></div></div></main></section>';

export default function GymScreen() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: GYM_SECTION_HTML,
      }}
    />
  );
}
