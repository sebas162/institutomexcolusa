"use client";

import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "h2",
  "h3",
  "h4",
  "a",
  "table",
  "thead",
  "tbody",
  "tr",
  "td",
  "th",
  "blockquote",
];

interface PostBodyProps {
  html: string;
}

export default function PostBody({ html }: PostBodyProps) {
  const sanitizedHtml = DOMPurify.sanitize(html, { ALLOWED_TAGS });

  return (
    <div
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
