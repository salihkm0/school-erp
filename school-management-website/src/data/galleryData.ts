export interface GalleryItem {
  id: string;
  title: string;
  route: string;
  category: 'students' | 'staff' | 'exams' | 'reports' | 'attendance' | 'administration' | 'mobile';
  badge: string;
  image: string;
  summary: string;
  highlights: string[];
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "student-edit-form",
    title: "Comprehensive Student Information & Profile Editor",
    route: "/students/:id/edit",
    category: "students",
    badge: "Student Editor",
    image: "/gallery/student-edit-form.png",
    summary: "Multi-section modular form for editing student records. Covers personal demographics, birth place, religion/caste category, dual identification marks, language subject electives, and bank disbursement info.",
    highlights: [
      "Collapsible accordion sections for Basic, Address, Guardian, Academic & Bank info",
      "Elective language selection (First Language Paper 1 & 2, Third Language)",
      "Permanent physical identification marks registry (e.g. mole, scar)",
      "Real-time validation preventing duplicate student codes or admission numbers"
    ]
  },
  {
    id: "staff-management-directory",
    title: "Institutional Faculty & Staff Directory",
    route: "/staff",
    category: "staff",
    badge: "Staff Directory",
    image: "/gallery/staff-management-directory.png",
    summary: "Master roster displaying all 120+ active faculty members, administrative staff, and department heads with unique 3-letter timetable initials (e.g. AKA, AVP, ANP), employee codes, and active roles.",
    highlights: [
      "Search across 120+ staff members by name, initials code, or email",
      "Short name initials tracking (e.g. AKA, AVP) for timetable scheduling",
      "Employee categorization (Permanent, Temporary, Guest Lecturer)",
      "Direct shortcuts to onboard new faculty and assign subject duties"
    ]
  },
  {
    id: "staff-profile-dossier",
    title: "Faculty 360° Professional Dossier",
    route: "/staff/:id",
    category: "staff",
    badge: "Staff Dossier",
    image: "/gallery/staff-profile-dossier.png",
    summary: "Centralized faculty dossier detailing personal credentials, contact numbers, emergency guardians, subject expertise, teaching experience, and salary bank account details.",
    highlights: [
      "Institutional staff code assignment (e.g. STF260005) & system role",
      "Subject specializations, previous teaching experience, and remarks",
      "Confidential banking details for payroll and government honorariums",
      "One-click profile editing and duty schedule linking"
    ]
  },
  {
    id: "staff-add-form",
    title: "New Faculty Onboarding & Registration Hub",
    route: "/staff/new",
    category: "staff",
    badge: "Staff Onboarding",
    image: "/gallery/staff-add-form.png",
    summary: "Streamlined onboarding wizard for new teachers and administrative staff. Captures qualifications, employment type, auto-generates 3-letter timetable initials, and creates secure system login credentials.",
    highlights: [
      "Auto-generation of 3-letter staff initials (e.g. JD for John Doe)",
      "Role-based privilege assignment (Teacher, Office Admin, Principal)",
      "Secure initial password generation with encrypted credentials storage",
      "Address, qualifications, and direct bank account mapping"
    ]
  },
  {
    id: "staff-edit-form",
    title: "Faculty Profile & Credentials Editor",
    route: "/staff/:id/edit",
    category: "staff",
    badge: "Staff Editor",
    image: "/gallery/staff-edit-form.png",
    summary: "Administrative editor to update faculty qualifications, change designated contact numbers, adjust employment tenure, or update payroll bank details without disrupting teaching assignments.",
    highlights: [
      "Update full name, initials, and email login credentials",
      "Modify employment status (Permanent, Contract, Probationary)",
      "Password reset override with secure preview toggle",
      "Salary account and IFSC bank details updating"
    ]
  },
  {
    id: "student-profile-360",
    title: "Student 360° Comprehensive Profile & Dossier",
    route: "/students/:id/info",
    category: "students",
    badge: "Student Dossier",
    image: "/gallery/student-profile-360.png",
    summary: "Unified 360-degree student record consolidating demographics, religion and caste categorization, verified parent contacts, permanent address, and active academic enrollment credentials.",
    highlights: [
      "Complete demographic & socio-economic classification (Religion, Caste, Category)",
      "Verified guardian phone contacts, occupation, and family relations",
      "Admission number, enrollment date, division, and roll assignment",
      "Direct profile editing with secure administrative audit tracking"
    ]
  },
  {
    id: "student-marks-performance",
    title: "Student Exam Performance & Subject Analytics",
    route: "/students/:id/marks",
    category: "students",
    badge: "Marks & Analytics",
    image: "/gallery/student-marks-performance.png",
    summary: "Longitudinal exam performance dossier for individual students. Displays overall GPA grade calculations, subject-by-subject score matrix, visual progress bars across all 12 subjects, and automated performance insights.",
    highlights: [
      "Terminal Evaluation (TE) and Continuous Evaluation (CE) score tables",
      "Visual percentage performance bars across all 12 curriculum subjects",
      "Automated AI-driven performance tips highlighting weaker subject areas",
      "One-click print and PDF export ready for parent-teacher conferences"
    ]
  },
  {
    id: "student-attendance-history",
    title: "Student Monthly Attendance Ledger & Working Days",
    route: "/students/:id/attendance",
    category: "students",
    badge: "Attendance Dossier",
    image: "/gallery/student-attendance-history.png",
    summary: "Granular month-by-month attendance history showing total school working days, days present, absences, monthly percentage ratings, and cumulative annual attendance health (87.3% Good).",
    highlights: [
      "Month-by-month historical breakdown (June, July, August, etc.)",
      "Color-coded present, absent, and percentage progress indicators",
      "Annual cumulative working days vs attendance percentage calculation",
      "Academic session filter tied to the active school calendar"
    ]
  },
  {
    id: "student-roster-register",
    title: "Division Student Directory & Profile Ledger",
    route: "/students/8-a",
    category: "students",
    badge: "Student Roster",
    image: "/gallery/student-roster-register.png",
    summary: "Comprehensive division-level student directory displaying roll numbers, unique student codes, gender, and live enrollment statuses. Equipped with instant student search, promotion registers, and Excel export.",
    highlights: [
      "Search by student name, admission number, or unique student code",
      "One-click Excel export for administrative roll registers",
      "Instant access to promotion lists and student profile cards",
      "Direct student record editing and credential management"
    ]
  },
  {
    id: "divisions-directory",
    title: "Standard Divisions & Assigned Class Teachers",
    route: "/students/standard-8/divisions",
    category: "students",
    badge: "Divisions & Mentors",
    image: "/gallery/divisions-directory.png",
    summary: "Section-by-section breakdown for each academic standard (e.g. Division A through Division F, AA, AB, AC). Displays active Class Teacher (CT) mentor designations with direct drill-down into division student registers.",
    highlights: [
      "Visual division grid supporting high-capacity mega-schools (25+ sections)",
      "Class Teacher (CT) assignment pills for faculty accountability",
      "Instant division-level student count and navigation shortcuts",
      "Session-aware filtering tied to the active academic year"
    ]
  },
  {
    id: "academic-standards",
    title: "Academic Standards & Grade Hierarchy",
    route: "/students/standards",
    category: "students",
    badge: "Grade Hierarchy",
    image: "/gallery/academic-standards.png",
    summary: "Macro-level grade cockpit displaying active standards (Standard 8, 9, 10, Plus One, Plus Two) with live total division counts per standard for streamlined administrative navigation across huge student cohorts.",
    highlights: [
      "Organized hierarchical navigation from standard down to individual student",
      "Real-time division counts per grade (up to 29 divisions per standard)",
      "Active academic year tag ensuring accurate curriculum scoping",
      "Intuitive card-based UI designed for high-resolution displays"
    ]
  },
  {
    id: "student-bulk-import",
    title: "Bulk Student Ingestion & Samboorna Import Engine",
    route: "/students/import",
    category: "students",
    badge: "Data Ingestion",
    image: "/gallery/student-bulk-import.png",
    summary: "Dual-mode bulk onboarding engine supporting standard Excel/CSV uploads and direct Kerala Samboorna school database imports. Features automated class creation and intelligent duplicate record resolution.",
    highlights: [
      "Native Samboorna state portal file format compatibility",
      "Auto-creates classes and divisions if not already present",
      "Smart duplicate student code resolution and record updating",
      "Downloadable pre-formatted template spreadsheets for error-free data entry"
    ]
  },
  {
    id: "academic-years-archival",
    title: "Multi-Year Academic Session Archival & Management",
    route: "/students/academic-years",
    category: "students",
    badge: "Session Control",
    image: "/gallery/academic-years-archival.png",
    summary: "Centralized academic year controller allowing institutional administrators to toggle between historical academic sessions, manage active school years, and initiate new student admissions or bulk imports.",
    highlights: [
      "Historical student archive access across multiple past school years",
      "Clear 'Current' session tagging for operational clarity",
      "Direct shortcut to bulk student imports for the new academic calendar",
      "Seamless academic rollover without data overwrite"
    ]
  },
  {
    id: "report-card",
    title: "Official Board-Compliant PDF Report Card",
    route: "/reports/student-report-card",
    category: "reports",
    badge: "Student Evaluation",
    image: "/gallery/report-card.png",
    summary: "Complete printable progress report featuring official school insignia, attendance statistics, Continuous Evaluation (CE) + Terminal Evaluation (TE) score tables, and signature blocks.",
    highlights: [
      "CBSE, Kerala SSLC, and State Board grading formulas",
      "Official school crest, student credentials & seal endorsement blocks",
      "CE (Continuous Evaluation) + TE (Terminal Evaluation) breakdown",
      "Automated teacher remarks, GPA calculations, and class ranks"
    ]
  },
  {
    id: "class-marks-overview",
    title: "Class Consolidated Marks & Result Ledger",
    route: "/admin/class-marks",
    category: "exams",
    badge: "Marks Overview",
    image: "/gallery/class-marks-overview.png",
    summary: "A unified master spreadsheet displaying all enrolled students in a class with roll numbers and mark breakdowns across every subject, facilitating instant class teacher audits before report card printing.",
    highlights: [
      "Subject-by-subject score matrix for the entire division",
      "Terminal Evaluation (TE) and Continuous Evaluation (CE) split",
      "Instant missing mark flags for absent or unscored students",
      "One-click export to official Education Department Excel registers"
    ]
  },
  {
    id: "exam-status-control",
    title: "Exam Submission Status & Single-Subject Revert",
    route: "/exams/:id",
    category: "exams",
    badge: "Core Workflow",
    image: "/gallery/exam-status-control.png",
    summary: "Administrative command center for ongoing exams. Track submission status across all classes and faculty contributors. Revert individual subjects to draft without affecting the rest of the class.",
    highlights: [
      "Single-subject revert to Draft safeguard for mark corrections",
      "Live percentage bar of marks entered per class and subject",
      "Complete audit trail showing which teacher entered each score",
      "One-click 'Mark Reviewed' and final exam publication gates"
    ]
  },
  {
    id: "teacher-marks-entry",
    title: "Fast Teacher Marks Entry Grid",
    route: "/staff/marks-entry/:examId",
    category: "exams",
    badge: "Teacher Workspace",
    image: "/gallery/teacher-marks-entry.png",
    summary: "Clean, distraction-free score entry interface for subject teachers with keyboard navigation, live auto-save, max score boundary validation, and real-time completion tracking.",
    highlights: [
      "Keyboard-friendly tabular input (Tab / Enter auto-advance)",
      "Instant ceiling validation preventing marks exceeding maximum",
      "Absentee toggle and medical exemption notes",
      "Submit for Admin Review button enabled only when 100% entered"
    ]
  },
  {
    id: "attendance-analytics",
    title: "Student Attendance Distribution & Cohort Analytics",
    route: "/attendance/analytics",
    category: "attendance",
    badge: "Attendance Engine",
    image: "/gallery/attendance-analytics.png",
    summary: "Visual analytics dashboard grouping students into attendance health brackets (90%+, 75-89%, and <75% critical cutoff) to proactively identify chronic absenteeism before board exams.",
    highlights: [
      "Proactive early warning system for students below 75% cutoff",
      "Instant parent SMS alert triggers for daily roll call absences",
      "Gender, division, and category-wise attendance comparisons",
      "Government-compliant monthly attendance register PDF exports"
    ]
  },
  {
    id: "class-teacher-allocation",
    title: "Faculty Directory & Class Teacher Allocations",
    route: "/staff/assignments",
    category: "staff",
    badge: "Faculty Management",
    image: "/gallery/class-teacher-allocation.png",
    summary: "Institutional roster mapping each teacher to their assigned classes, divisions, and subjects. Simplifies academic year rollovers and ensures clear accountability for every division.",
    highlights: [
      "Class teacher and secondary mentor assignments per section",
      "Subject teacher mappings across standards (5th to 12th)",
      "Staff unique ID codes and department classifications",
      "Automated permission syncing based on active teaching assignments"
    ]
  },
  {
    id: "admin-dashboard",
    title: "Institutional Administrative Command Dashboard",
    route: "/dashboard",
    category: "administration",
    badge: "Executive Overview",
    image: "/gallery/admin-dashboard.png",
    summary: "Central executive cockpit for Principals, Headmasters, and Trustees providing real-time metrics on total student enrollment, daily faculty attendance, ongoing exams, and urgent school notices.",
    highlights: [
      "Real-time campus enrollment counts across standards and divisions",
      "Active exam season progress and pending review alerts",
      "Daily student attendance percentage across the entire school",
      "Quick shortcuts to fee collections, staff rosters, and broadcasts"
    ]
  },
  {
    id: "mobile-app-notifications",
    title: "Mobile App Notification & Broadcast Center",
    route: "/notifications/broadcast",
    category: "mobile",
    badge: "Parent & Teacher App",
    image: "/gallery/mobile-app-notifications.png",
    summary: "Native Android and iOS mobile app notification center. Send targeted circulars, emergency holiday alerts, and academic updates directly to parents' and teachers' smartphones.",
    highlights: [
      "Targeted broadcasts by standard, division, bus route, or entire campus",
      "Real-time push notifications for daily student attendance",
      "Digital circulars with PDF and image attachments",
      "Read receipts and SMS fallback for parents without smartphones"
    ]
  },
  {
    id: "reports-export-center",
    title: "Government Register & Bulk Data Export Hub",
    route: "/reports/export",
    category: "reports",
    badge: "Compliance & Archive",
    image: "/gallery/reports-export-center.png",
    summary: "One-click export center for generating all official state education department registers, exam marksheets, Transfer Certificates (TC), and student conduct archives in Excel and PDF.",
    highlights: [
      "Pre-formatted Excel downloads ready for direct upload to Govt portals",
      "Batch PDF generation for entire grades (up to 1,500+ students)",
      "Historical student archive with multi-year search",
      "Automated Transfer Certificate (TC) & Conduct Certificate templates"
    ]
  },
  {
    id: "login-portal",
    title: "Unified Multi-Role Authentication Portal",
    route: "/login",
    category: "administration",
    badge: "Enterprise Security",
    image: "/gallery/login-portal.png",
    summary: "Secure, role-based single sign-on entry point for Principals, Office Administrators, Teachers, and Parents, protected with 256-bit encryption and session timeouts.",
    highlights: [
      "Role-based automatic redirection to dedicated user workspaces",
      "Self-service password recovery with OTP verification",
      "Granular access control preventing unauthorized data exposure",
      "Audit logging of all administrative logins and data modifications"
    ]
  }
];
