"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { translations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CouponGenerator from "@/components/admin/CouponGenerator";
import CouponList from "@/components/admin/CouponList";
import BlogPanel from "@/components/admin/BlogPanel";
import NewsletterSubscribersList from "@/components/admin/NewsletterSubscribersList";

export default function AdminClient() {
  const { user, loading, logout } = useAuth();
  const { language } = useLanguage();
  const t = translations[language].adminPanel;
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold font-headline">{t.title}</h1>
        <Button
          variant="destructive"
          onClick={logout}
          className="border-none bg-red-600 hover:bg-red-700 text-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t.logout}
        </Button>
      </header>

      <Tabs defaultValue="coupons" className="w-full">
        <TabsList>
          <TabsTrigger value="coupons">{t.tabs.coupons}</TabsTrigger>
          <TabsTrigger value="blog">{t.tabs.blog}</TabsTrigger>
          <TabsTrigger value="newsletter">{t.tabs.newsletter}</TabsTrigger>
        </TabsList>

        <TabsContent value="coupons" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <CouponGenerator />
            </div>
            <div className="lg:col-span-2">
              <CouponList />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="blog" className="mt-6">
          <BlogPanel />
        </TabsContent>

        <TabsContent value="newsletter" className="mt-6">
          <NewsletterSubscribersList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
