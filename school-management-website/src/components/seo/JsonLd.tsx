import React from 'react';
import { FAQS } from '@/data/faqs';

export default function JsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://klassdesk.com';

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'KlassDesk',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web, Android, iOS, Cloud',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      description: 'Custom school pricing based on student enrollment with free live pilot demo'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '128',
      bestRating: '5',
      worstRating: '1'
    },
    description: 'Enterprise School Management Operating System featuring Continuous Evaluation (CE) & Theory Exam Grading, Automated Board-Ready PDF Report Cards, Smart SMS Attendance, and Teacher Duty Scheduling.',
    featureList: [
      'Multi-Term Examination Engine with CE + Theory Grading',
      'One-Click Revert of Individual Subjects to Draft',
      'Automated High-Resolution PDF Report Card Generator with Institutional Seals',
      'Instant Parent SMS & Push Notification Attendance Roll Calls',
      'Fair Teacher Exam Hall Supervision Duty Planner',
      'Multi-Role Dashboards for Principal, Teachers, Staff, and Parents'
    ],
    screenshot: `${baseUrl}/preview-dashboard.png`
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'KlassDesk Technologies',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      'https://twitter.com/klassdesk',
      'https://linkedin.com/company/klassdesk'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-98765-43210',
      contactType: 'Sales & Customer Support',
      areaServed: 'IN',
      availableLanguage: ['English', 'Malayalam', 'Hindi']
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
