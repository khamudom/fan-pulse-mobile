"use client";

import ReactMarkdown from "react-markdown";
import styles from "./BriefingContent.module.css";

interface BriefingContentProps {
  content: string;
}

export function BriefingContent({ content }: BriefingContentProps) {
  return (
    <article className={styles.article}>
      <div className={styles.body}>
        <ReactMarkdown
          components={{
            a: ({ ...props }) => (
              <a {...props} target="_blank" rel="noopener noreferrer" />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
