"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/components/auth-provider";
import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import WhatsAppFloatButton from "@/components/shared/WhatsAppFloatButton";
import { Toaster } from "@/components/ui/toaster";
import { inter } from "@/app/fonts";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/hooks/use-language";
import RouteProgress from "@/components/shared/RouteProgress";

// Inner component to access language context and render Open Graph
function RootLayoutContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <>
      {/* Preconnect to Firebase for faster loading */}
      <link rel="preconnect" href="https://mexcol.firebaseapp.com" />
      <link rel="dns-prefetch" href="https://mexcol.firebaseapp.com" />

      {/* Meta Pixel Code - deferred loading after interactive */}
      <Script
        id="meta-pixel"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '3322506657916381');
            fbq('track', 'PageView');
            console.log('[MetaPixel] Pixel script injected, fbq:', typeof window.fbq);
          `,
        }}
      />
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=3322506657916381&ev=PageView&noscript=1" />`,
        }}
      />
      <LanguageProvider>
        <AuthProvider>
          <div className={cn("flex min-h-screen flex-col", inter.variable)}>
            <RouteProgress />
            {!isAdminRoute && <Navbar />}
            <main className="flex-grow">{children}</main>
            {!isAdminRoute && <Footer />}
            {!isAdminRoute && <WhatsAppFloatButton />}
          </div>
          <Toaster />
        </AuthProvider>
      </LanguageProvider>
    </>
  );
}
