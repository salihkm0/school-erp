export interface Feature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'exams' | 'attendance' | 'administration' | 'communication' | 'security' | 'events' | 'finance';
  badge: string;
  highlights: string[];
  icon: string;
  stats?: { value: string; label: string };
}

// 9 Core Institutional Modules matching the modular architecture
export const CORE_MODULES = [
  {
    id: "access-control",
    title: "User & Access Control",
    description: "Easily manage roles and permissions for every user—from Super Admin to Parent—and streamline applicant journeys with an online admission portal alongside secure access.",
    icon: "ShieldCheck",
    color: "indigo",
    badge: "Security & RBAC",
    features: ["Role-based access (Principal, Teacher, Office, Parent)", "Online admission enquiry & student application workflow", "Single sign-on & granular section-level permissions"]
  },
  {
    id: "attendance-mgmt",
    title: "Attendance Management",
    description: "Mark and track attendance through the KlassDesk mobile app with real-time student tracking so teachers and parents stay informed the moment records change.",
    icon: "CalendarCheck",
    color: "emerald",
    badge: "Instant Parent SMS",
    features: ["Period-wise & morning/afternoon roll calls", "Automatic absentee SMS alerts sent instantly to parents", "Official monthly attendance register exports for Govt portals"]
  },
  {
    id: "academic-mgmt",
    title: "Academic Management",
    description: "Simplify grading, reports, and progress tracking with automated calculations aligned to leading board standards—ready to pair with digital report card outputs.",
    icon: "GraduationCap",
    color: "sky",
    badge: "Continuous Evaluation",
    features: ["CE + Theory grading formulas for State Board & CBSE", "Class rank, GPA, and subject average analytics", "Term-wise academic performance progression tracking"]
  },
  {
    id: "timetable-scheduling",
    title: "Timetable & Scheduling",
    description: "Smart institutional timetable cockpit: class schedules, teacher workload analyzer, real-time clash engine, and 1-click daily teacher substitution management.",
    icon: "Calendar",
    color: "blue",
    badge: "Clash & Substitution Engine",
    features: [
      "Real-time teacher & lab/room clash detection engine",
      "Daily teacher absence logger with free-teacher auto-suggester",
      "Teacher workload capacity tracker & high-DPI printable wall charts"
    ]
  },
  {
    id: "communication-hub",
    title: "Communication Hub",
    description: "Parent-teacher communication app with a school notification system—chat, announcements, and alerts so families never miss critical updates.",
    icon: "MessageSquare",
    color: "purple",
    badge: "Direct Messaging",
    features: ["Official school circulars and emergency notice broadcast", "Two-way teacher-parent messaging with quiet hours", "Multi-channel delivery: Push notification, SMS, and Email"]
  },
  {
    id: "exams-assessments",
    title: "Exams & Assessments",
    description: "Schedule exams, record grades, and use the digital report card generator to share outcomes clearly with parents and boards.",
    icon: "FileSpreadsheet",
    color: "indigo",
    badge: "Dual-Tier Verification",
    features: ["Subject-by-subject teacher submission & admin verification", "Single subject draft revert without affecting other subjects", "Print-ready PDF report cards with official institutional seals"]
  },
  {
    id: "finance-fees",
    title: "Finance & Fees",
    description: "Automated school fee management: invoices, reminders, collections, and financial summaries in one streamlined workflow.",
    icon: "Coins",
    color: "emerald",
    badge: "Fee Automation",
    features: ["Online fee collection via UPI, cards, and net banking", "Automated SMS fee reminders before due dates", "Instant digital fee receipts & daily collection audit ledger"]
  },
  {
    id: "transport-library",
    title: "Transport & Library Management",
    description: "School transport management, bus tracking, and library automation for catalog, circulation, and book availability.",
    icon: "Bus",
    color: "amber",
    badge: "Fleet & Library",
    features: ["Bus route planning, driver details, and student stop mapping", "Library barcode scanning, catalog search, and overdue fines", "Vehicle fitness, insurance, and road tax renewal alerts"]
  },
  {
    id: "events-sports-arts",
    title: "Sports Meet & Arts Fest (Kalolsavam)",
    description: "End-to-end festival management: create sports days and youth festivals, divide students into houses, generate chest numbers, set item participation caps, and track live house scores.",
    icon: "Trophy",
    color: "rose",
    badge: "Flagship Feature",
    features: ["House creation & automated student division (Red, Blue, Green, Yellow)", "Unique student chest/bib number generation with printable sheets", "Student item selection with admin limits (e.g. Max 3 individual + 2 group)", "Live house championship points table and winner certificates"]
  }
];

// In-depth details for the School Events & Fest Engine
export const EVENTS_MODULE_DETAILS = {
  title: "School Arts Fest & Annual Sports Meet Engine",
  tagline: "From House Division & Chest Numbers to Live Championship Points Table",
  description: "Conducting school youth festivals (Kalolsavam) and annual sports meets is one of the most hectic operations for physical education teachers and convenors. KlassDesk completely digitizes the entire event lifecycle.",
  capabilities: [
    {
      title: "House Division & Student Allocation",
      description: "Create custom school houses (e.g. Red, Blue, Green, Yellow or Ruby, Sapphire, Emerald, Diamond). Automatically divide thousands of students into houses with balanced gender and grade ratios, or manually adjust.",
      icon: "Users"
    },
    {
      title: "Automated Chest / Bib Number Generator",
      description: "Generate unique, tamper-proof chest numbers for all registered students across categories (Sub-Junior, Junior, Senior). Print official chest number bib sheets with student details and house color in one click.",
      icon: "Hash"
    },
    {
      title: "Item Catalog & Registration Limits",
      description: "Pre-loaded with 100+ standard sports and arts items (100m, 200m, Relay, Shot Put, Classical Dance, Light Music, Recitation, Painting, Mime). Admins configure strict rules (e.g. max 3 individual items and 2 group items per student).",
      icon: "CheckSquare"
    },
    {
      title: "Live Scoring & House Championship",
      description: "Judges and coordinators record event results directly on the portal. Live points automatically tally into the overall House Trophy Leaderboard (1st: 5 pts, 2nd: 3 pts, 3rd: 1 pt).",
      icon: "Trophy"
    },
    {
      title: "Printable Certificates & Scorecards",
      description: "Instantly generate and print board-formatted Certificates of Merit for winners and Certificates of Participation for all contestants with dynamic names, chest numbers, and event details.",
      icon: "Award"
    },
    {
      title: "Category & Stage Scheduling",
      description: "Assign items to multiple stages (Stage 1 Main Auditorium, Stage 2 Open Air, Ground Track A) with time slots to eliminate schedule clashes for students participating in multiple events.",
      icon: "Clock"
    }
  ]
};

export const ALL_FEATURES: Feature[] = [
  {
    id: "sports-arts-events",
    title: "School Sports & Arts Fest Management",
    subtitle: "House Division, Chest Numbers & Live Scoreboards",
    description: "Manage school annual sports days, youth festivals (Kalolsavam), and cultural meets. Automated student house allocation, unique chest number generation, item limits, and live house championship scoreboards.",
    category: "events",
    badge: "New & Popular",
    icon: "Trophy",
    highlights: [
      "House creation & automated student balancing across houses",
      "Automated Chest / Bib number generation with printable sheets",
      "Student item selection with admin rules (e.g. Max 3 individual + 2 group items)",
      "Live House Championship leaderboard (1st: 5 pts, 2nd: 3 pts, 3rd: 1 pt)"
    ],
    stats: { value: "100%", label: "Elimination of sports & arts scheduling confusion" }
  },
  {
    id: "pdf-report-cards",
    title: "Automated PDF Report Card Studio",
    subtitle: "Custom-Branded, Print-Ready & Board-Compliant",
    description: "Produce stunning, board-compliant report cards with high-resolution school crests, attendance records, CE + Theory breakdown, and official endorsement seals.",
    category: "exams",
    badge: "High Demand",
    icon: "FileText",
    highlights: [
      "CBSE, State Board (Kerala/SSLC), and ICSE grading schemes",
      "CE (Continuous Evaluation) + Theory score breakdown with automated grade calculation",
      "Batch print ready: generate 1,500+ student report cards in seconds",
      "Direct digital download portal for parents via mobile app"
    ],
    stats: { value: "98%", label: "Reduction in report card prep time" }
  },
  {
    id: "granular-mark-workflow",
    title: "Dual-Tier Marks Approval Workflow",
    subtitle: "Eliminate Marking Errors Before Publishing",
    description: "Teachers submit subject marks; Admins audit and verify. If an edit is needed, revert only that specific subject to draft while preserving all other submitted subjects across the class.",
    category: "exams",
    badge: "Proprietary",
    icon: "CheckSquare",
    highlights: [
      "Live percentage of marks entered tracking per subject and class",
      "Incomplete mark submission prevention: prevents submitting until all students scored",
      "Audit trail tracking who submitted and approved each subject",
      "One-click 'Mark Reviewed' and 'Publish Exam' safeguards"
    ]
  },
  {
    id: "attendance-analytics",
    title: "Attendance Distribution Engine",
    subtitle: "Spot Chronic Absenteeism Early",
    description: "Visual distribution charts group students by attendance brackets. Proactively identify at-risk students before final board eligibility cutoffs with automated warning letters.",
    category: "attendance",
    badge: "Compliance",
    icon: "BarChart3",
    highlights: [
      "Daily and period-by-period roll call logs",
      "Automated parent SMS trigger when student marked absent",
      "Monthly register generation compliant with education department norms",
      "Attendance percentage synced seamlessly into student report cards"
    ],
    stats: { value: "35%", label: "Improvement in student attendance tracking" }
  },
  {
    id: "timetable-scheduling",
    title: "Smart Drag-and-Drop Timetable Planner",
    subtitle: "Conflict-Free Class & Period Scheduling",
    description: "Build weekly master timetables for all classes with teacher clash detection. Easily swap periods and broadcast updated schedules straight to faculty and student phones.",
    category: "administration",
    badge: "Scheduler",
    icon: "Calendar",
    highlights: [
      "Visual grid with real-time teacher double-booking detection",
      "Assign subject teachers and room allocations effortlessly",
      "Emergency teacher absence substitution workflow",
      "Printable class-wise and teacher-wise timetable charts"
    ]
  },
  {
    id: "fees-management",
    title: "Automated Fee Invoicing & Online Collection",
    subtitle: "Zero Cash Leakage & Instant Digital Receipts",
    description: "Streamline tuition, transport, and term fee collections. Issue digital invoices, accept payments via UPI/cards, and send automated WhatsApp/SMS reminders to parents.",
    category: "finance",
    badge: "Finance",
    icon: "Coins",
    highlights: [
      "Automated fee breakdown by grade, category, and concession quota",
      "UPI & net banking integration with instant parent payment confirmation",
      "Automated WhatsApp & SMS reminders before due date",
      "Daily collection ledgers and outstanding fee audit summaries"
    ]
  },
  {
    id: "transport-management",
    title: "School Bus Transport & Route Management",
    subtitle: "Ensure Student Safety on Every Commute",
    description: "Map bus routes, designate student pickup/drop-off stops, track driver licenses, and send alerts to parents when school buses depart or arrive.",
    category: "administration",
    badge: "Logistics",
    icon: "Bus",
    highlights: [
      "Route optimization and student-to-stop allocation",
      "Driver and vehicle document compliance tracker (Insurance, Fitness, Poll)",
      "Instant SMS broadcast to specific bus routes for delays or changes",
      "Automated transport fee calculation based on distance/stops"
    ]
  },
  {
    id: "parent-mobile-app",
    title: "Parent & Student Mobile Experience",
    subtitle: "Real-Time School in the Palm of Their Hands",
    description: "Native mobile app (Android & iOS) enabling parents to monitor daily attendance, view exam marks the moment they are published, check homework, and receive emergency circulars.",
    category: "communication",
    badge: "Mobile App",
    icon: "Smartphone",
    highlights: [
      "Push notifications for attendance, fee deadlines, and exam timetables",
      "Download PDF report cards directly on smartphone",
      "Multi-child support for parents with siblings in the same school",
      "Secure PIN and biometric sign-in"
    ]
  },
  {
    id: "enterprise-security",
    title: "Bank-Grade Cloud Security & Backups",
    subtitle: "Your School's Data is Protected 24/7",
    description: "Encrypted data in transit and at rest. Role-based access control ensures teachers only access their assigned classes and subjects.",
    category: "security",
    badge: "Enterprise",
    icon: "Lock",
    highlights: [
      "JWT-based role-specific session authentication",
      "Granular permissions down to individual class-subject mappings",
      "Automated daily cloud database snapshots",
      "Full GDPR & data privacy compliance"
    ],
    stats: { value: "99.99%", label: "Guaranteed cloud platform uptime" }
  }
];
