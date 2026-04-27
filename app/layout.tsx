import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  title: "HWARE-X — God's-Eye View of AI Infrastructure",
  description: "An interactive map of every layer powering AI: semis, fabs, HBM, fiber, optics, cooling, power, hyperscalers, neoclouds, and the labs at the top.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('hx-theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`
        }} />
      </head>
      <body className="min-h-screen bg-bg text-ink antialiased">
        <div className="pointer-events-none fixed inset-0 z-50 scanlines" />
        <TopNav />
        <main className="relative z-10">{children}</main>
        <footer className="hairline-t mt-24 px-6 py-8 text-xs font-mono text-ink-mute">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <span>HWARE-X · AI INFRA INTELLIGENCE · v0.1</span>
            <span className="text-accent/60">// transmission stable</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
