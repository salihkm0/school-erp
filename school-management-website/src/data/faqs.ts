export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const FAQS: FaqItem[] = [
  {
    id: "pricing-structure",
    question: "What is the pricing for the KlassDesk School ERP package?",
    answer: "Our complete institutional license starts at a special limited-time offer price of ₹1.75 Lakh (Actual Price: ₹2.05 Lakh, saving you ₹30,000). Please note: Hosting, domain registration, and database expenses are excluded and billed directly to the school at actual cloud provider rates without any markup.",
    category: "Pricing & Plans"
  },
  {
    id: "sports-arts-fest",
    question: "How does the software manage Sports Meets, Arts Fests (Kalolsavam), and Chest Numbers?",
    answer: "KlassDesk includes an end-to-end festival engine. You can create school houses (Red, Blue, Green, Yellow or Ruby, Sapphire, Emerald, Topaz) and automatically balance students across them. The system batch-generates unique chest numbers (bib numbers) with printable badge sheets, enforces admin-defined participation limits (e.g., max 3 individual + 2 group items per student), and tallies live points for the House Championship Leaderboard.",
    category: "Events & Fests"
  },
  {
    id: "report-cards",
    question: "Can the software generate our state-board and CBSE compliant PDF report cards?",
    answer: "Yes! Our Exam & Gradebook Engine is engineered specifically to handle complex grading rules including Continuous Evaluation (CE), practicals, and theory exams for Kerala State Board (SSLC/Higher Secondary), CBSE, and ICSE. Report cards include your official school logo, attendance stats, teacher remarks, grading scales, and official institutional seals.",
    category: "Academic & Exams"
  },
  {
    id: "mark-revert",
    question: "What if a teacher makes an error after submitting exam marks?",
    answer: "Our software features a granular subject-level review system. If a single subject teacher (e.g. Mathematics) made an error, the Administrator can revert only that specific subject back to 'Draft' with one click, while leaving all other submitted subjects in that class intact. Once corrected and verified that all student marks are entered, it can be re-submitted and published.",
    category: "Academic & Exams"
  },
  {
    id: "sms-attendance",
    question: "How does the automated parent attendance SMS and notification system work?",
    answer: "Teachers take morning or period roll call on the web or mobile app in under 60 seconds. The instant an absent student is marked, our cloud gateway automatically dispatches a branded SMS and mobile push notification directly to the registered parent's mobile number, drastically reducing unexcused absences.",
    category: "Attendance & Communication"
  },
  {
    id: "staff-supervision",
    question: "How does the software handle exam hall supervision and teacher duty scheduling?",
    answer: "Our automated Duty Planner distributes exam hall invigilation fairly across your entire teaching staff. It checks faculty availability, prevents scheduling conflicts, and prints out clear room-by-room duty rosters while broadcasting duty timetables directly to teachers' smartphones.",
    category: "Administration"
  },
  {
    id: "mobile-app",
    question: "Is there a mobile app available for teachers, parents, and students?",
    answer: "Yes, we provide dedicated mobile apps for iOS and Android. Parents can track daily attendance, view exam marks as soon as they are approved, view class timetables, and download PDF report cards directly on their phones.",
    category: "Mobile App"
  },
  {
    id: "data-migration",
    question: "How difficult is it to migrate our existing student and teacher data?",
    answer: "Seamless and fast. We provide pre-formatted Excel/CSV bulk import templates. Our dedicated onboarding engineering team will assist you in migrating your existing student rosters, staff profiles, and academic records in under 24 hours.",
    category: "Onboarding & Support"
  },
  {
    id: "security-privacy",
    question: "How secure is our school's confidential data?",
    answer: "Your data is hosted in high-security cloud infrastructure with 256-bit encryption in transit and at rest. Strict role-based permissions ensure that teachers only view their assigned classes, and parents can only see their own children's data. Automated daily backups ensure your records are never lost.",
    category: "Security"
  }
];
