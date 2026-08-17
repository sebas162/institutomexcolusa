"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { translations } from "@/lib/i18n";
import { getNewsletterSubscribers } from "@/lib/firestore/newsletter";
import type { NewsletterSubscriber } from "@/types/blog";

function toCsvValue(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export default function NewsletterSubscribersList() {
  const { language } = useLanguage();
  const t = translations[language].adminPanel.newsletter;

  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewsletterSubscribers().then((data) => {
      setSubscribers(data);
      setLoading(false);
    });
  }, []);

  const handleExportCsv = () => {
    const header = [t.emailHeader, t.languageHeader, t.dateHeader];
    const rows = subscribers.map((s) => [
      s.email,
      s.language,
      s.subscribedAt.toISOString(),
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map(toCsvValue).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "newsletter_subscribers.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4 flex justify-end">
          <Button
            onClick={handleExportCsv}
            disabled={loading || subscribers.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            {t.exportButton}
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.emailHeader}</TableHead>
              <TableHead>{t.languageHeader}</TableHead>
              <TableHead>{t.dateHeader}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                </TableRow>
              ))
            ) : subscribers.length > 0 ? (
              subscribers.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.language.toUpperCase()}</TableCell>
                  <TableCell>{s.subscribedAt.toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  {t.noSubscribers}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
