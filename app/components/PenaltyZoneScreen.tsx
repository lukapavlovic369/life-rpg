"use client";

export const PENALTY_ZONE_SECTION_HTML = '<section class="page" id="habits"><main class="status-screen status-design-v3 shared-status-frame scroll"><div class="status-content shared-status-content"><div class="ui"><header><div class="title-row"><div class="alert">!</div><div class="title">PENALTY ZONE</div></div><div class="subtitle">[CONTROL YOURSELF. BREAK CHAINS.]</div><div class="motto">Please write down every bad addiction or every bad thing you do.</div></header><section class="section"><div class="tag">BAD HABITS / PENALTY CHECK</div><div class="penalty-notice">Please write down every bad addiction or every bad thing you do.</div><div id="habitsList"></div></section></div></div></main></section>';

export default function PenaltyZoneScreen() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: PENALTY_ZONE_SECTION_HTML,
      }}
    />
  );
}
