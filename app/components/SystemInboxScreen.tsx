"use client";

export const SYSTEM_INBOX_SECTION_HTML = '<section class="page" id="systemInbox"><main class="status-screen status-design-v3 shared-status-frame scroll"><div class="status-content shared-status-content"><div class="ui"><header><div class="title-row"><div class="alert">✉</div><div class="title">SYSTEM INBOX</div></div><div class="subtitle">[ARCHITECT TRANSMISSIONS]</div><div class="goal">MESSAGES</div></header><section class="section"><div class="tag">INCOMING TRANSMISSIONS</div><div class="inbox-list" id="systemInboxList"></div><div class="inbox-controls"><button class="notify-btn" onclick="markSystemInboxRead()">MARK READ</button><button class="notify-btn danger" onclick="clearSystemInbox()">CLEAR</button></div></section></div></div></main></section>';

export default function SystemInboxScreen() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: SYSTEM_INBOX_SECTION_HTML,
      }}
    />
  );
}
