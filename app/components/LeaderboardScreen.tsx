"use client";

export const LEADERBOARD_SECTION_HTML = '<section class="page" id="leaderboard"><main class="status-screen status-design-v3 shared-status-frame scroll"><div class="status-content shared-status-content"><div class="ui"><header><div class="title-row"><div class="alert">#</div><div class="title">LEADERBOARD</div></div><div class="subtitle">[PLAYER POWER RANKING]</div><div class="goal">WHO IS THE STRONGEST?</div></header><section class="section"><div class="tag">RANKED PLAYERS</div><div class="leaderboard-list" id="leaderboardList"></div><div class="leader-note">You are currently the only registered player. More players will appear once they join.</div></section></div></div></main></section>';

export default function LeaderboardScreen() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: LEADERBOARD_SECTION_HTML,
      }}
    />
  );
}
