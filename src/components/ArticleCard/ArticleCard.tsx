"use client";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@khamudom/lumen-ui-react";
import type { Article } from "@/types";
import styles from "./ArticleCard.module.css";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className={styles.card}>
      <CardHeader>
        <Badge variant="default" appearance="outline">{article.category}</Badge>
        <CardTitle as="h3" className={styles.title}>
          {article.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={styles.excerpt}>{article.excerpt}</p>
        <time className={styles.date} dateTime={article.publishedAt}>
          {new Date(article.publishedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </time>
      </CardContent>
    </Card>
  );
}
