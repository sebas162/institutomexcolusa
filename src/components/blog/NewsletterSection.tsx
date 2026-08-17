"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bell, Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { translations } from "@/lib/i18n";
import { subscribeToNewsletter } from "@/lib/firestore/newsletter";

const newsletterSchema = z.object({
  email: z.string().email(),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

const PRIVACY_LINK_TEXT: Record<"es" | "en", string> = {
  es: "Aviso de Privacidad",
  en: "Privacy Notice",
};

export default function NewsletterSection() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language].blog.newsletter;

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: NewsletterFormValues) => {
    startTransition(async () => {
      const result = await subscribeToNewsletter(data.email, language);

      if (result.success) {
        toast({
          title: t.successTitle,
          description: t.successMessage,
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: t.errorTitle,
          description: t.errorMessage,
        });
      }
    });
  };

  const linkText = PRIVACY_LINK_TEXT[language];
  const [beforeLink, afterLink] = t.privacyNote.split(linkText);

  return (
    <Card>
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Bell className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-headline text-2xl font-bold">{t.title}</h3>
          <p className="text-muted-foreground max-w-xl">{t.description}</p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full max-w-md flex flex-col sm:flex-row gap-3"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1 text-left">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t.placeholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="btn-modern sm:w-auto"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.submitting}
                  </>
                ) : (
                  t.submitButton
                )}
              </Button>
            </form>
          </Form>

          <p className="text-xs text-muted-foreground max-w-md">
            {beforeLink}
            <Link href="/privacy" className="underline hover:text-primary">
              {linkText}
            </Link>
            {afterLink}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
