import type { Metadata, Viewport } from "next";
import "./globals.css";
import JsonLd from "@/components/seo/JsonLd";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import GoogleAiAssistant from "@/components/GoogleAiAssistant";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://klassdesk.com";

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KlassDesk | Next-Gen School Management & Examination Platform",
    template: "%s | KlassDesk",
  },
  description:
    "The all-in-one operating system for modern schools. Continuous Evaluation (CE) + Theory Exam Engine, Automated Board-Ready PDF Report Cards, Smart SMS Attendance, Teacher Duty Allocations, and Dedicated Parent Mobile Apps.",
  keywords: [
    "school management software",
    "school ERP",
    "exam mark entry system",
    "student report card generator",
    "continuous evaluation CE software",
    "CBSE Kerala State Board report cards",
    "school attendance SMS software",
    "teacher duty supervision schedule",
    "school management mobile app",
    "student information system SIS",
    "KlassDesk school software"
  ],
  authors: [{ name: "KlassDesk Technologies" }],
  creator: "KlassDesk",
  publisher: "KlassDesk",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    title: "KlassDesk | The All-In-One Modern School Operating System",
    description:
      "Transform your school's academics, attendance, and administration. Automated board-compliant PDF report cards, CE exam workflows, instant parent SMS, and staff duty planning.",
    siteName: "KlassDesk",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "KlassDesk Dashboard & Report Card Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KlassDesk | Next-Gen School Management Software",
    description:
      "Automate exam marks, generate board-compliant PDF report cards, track attendance with parent SMS alerts, and empower teachers with our intuitive cloud ERP.",
    images: ["/og-preview.png"],
    creator: "@klassdesk",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <JsonLd />
      </head>
      <body className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
        {children}
        <FloatingWhatsAppButton />
        <GoogleAiAssistant />
      </body>
    </html>
  );
}
