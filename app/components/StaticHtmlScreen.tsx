"use client";

type StaticHtmlScreenProps = { html: string };

export default function StaticHtmlScreen({ html }: StaticHtmlScreenProps) {
  return <div className="beyond-react-screen" dangerouslySetInnerHTML={{ __html: html }} />;
}
