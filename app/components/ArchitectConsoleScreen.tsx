"use client";

import StaticHtmlScreen from "./StaticHtmlScreen";

const html = "<main class=\"status-screen status-design-v3 shared-status-frame scroll\"><div class=\"status-content shared-status-content\"><div class=\"ui\"><header><div class=\"title-row\"><div class=\"alert\">A</div><div class=\"title\">ARCHITECT</div></div><div class=\"subtitle\">[ADMIN TRANSMISSION CONSOLE]</div><div class=\"goal\">BROADCAST</div></header><section class=\"section\"><div class=\"tag\">SEND SYSTEM MESSAGE</div><div class=\"architect-console-grid\"><input class=\"field\" id=\"architectMsgTitle\" maxlength=\"50\" placeholder=\"Transmission title\" value=\"SYSTEM TRANSMISSION\"/><textarea class=\"field\" id=\"architectMsgBody\" maxlength=\"420\" placeholder=\"Write message to players...\"></textarea><button class=\"notify-btn\" onclick=\"sendArchitectMessageFromConsole()\">SEND TO PLAYERS</button><div class=\"architect-console-note\">Demo mode saves the message locally and shows how players will receive it. Production version will send this through Supabase/Firebase only if role = architect.</div></div></section></div></div></main>";

export default function ArchitectConsoleScreen() {
  return <StaticHtmlScreen html={html} />;
}
