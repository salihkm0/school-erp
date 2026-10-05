# KlassDesk - Marketing & Sales Landing Page

A high-converting, modern, and visually stunning product landing page built with **Next.js (App Router)** and a **Node.js backend** to showcase and sell the School Management Software.

---

## Key Highlights & Features Showcased

1. **Academic & Examination Engine**:
   - Continuous Evaluation (CE) + Theory Exam marks entry.
   - Dual-Tier submission & review workflow (Teacher draft -> Admin approval).
   - Single-subject revert to Draft without wiping out other submitted subjects in the class.
   - Live mark entry progress tracking (0% to 100%) with missing marks audit safeguards.

2. **Automated PDF Report Card Studio**:
   - Kerala State Board (SSLC/HSE) and CBSE compliant layouts.
   - Includes roll number, admission number, attendance percentage, class rank, total score, and teacher remarks.
   - Official school crest and institutional seal endorsement blocks.
   - 1-click batch generation and ZIP download for thousands of students.

3. **Smart Attendance & SMS Alerts**:
   - Quick 60-second morning & afternoon roll calls.
   - Automated parent SMS and push notifications sent the second a child is marked absent.
   - Attendance distribution brackets (>90%, 75-89%, <75% warnings).
   - Department-compliant monthly attendance registers.

4. **Staff Duty & Supervision Planner**:
   - Automated exam hall invigilation allocations without faculty scheduling conflicts.
   - Print-ready duty rosters for notice boards and instant WhatsApp dispatch.

5. **Multi-Role Portals & Native Mobile App**:
   - Dedicated dashboards for Super Admin, Principal, Class Teacher, Subject Teacher, and Parents.
   - iOS and Android mobile app for parent engagement.

---

## Technical Stack & Architecture

- **Frontend**: Next.js 16 (App Router, Turbopack, React 19)
- **Styling**: Tailwind CSS v4 + Custom Glassmorphism design tokens & micro-animations
- **Backend / API**: Node.js route handlers (`/api/demo-request`, `/api/contact`) with validation and lead recording in `data/leads.json`
- **SEO & Search Optimization**:
  - **Schema.org JSON-LD**: `SoftwareApplication`, `EducationalOrganization`, and `FAQPage`
  - **OpenGraph & Twitter Cards**: High-res preview cards, titles, and descriptions
  - **Dynamic Sitemap & Robots**: `sitemap.xml` and `robots.txt` automatically generated
  - **Semantic HTML5**: Clean single `<h1>`, accessible headings, mobile viewport optimization

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the sales page in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## API Endpoints

### `POST /api/demo-request`
Accepts a JSON payload from the lead capture modal:
```json
{
  "fullName": "Dr. K. Narayanan",
  "schoolName": "St. Thomas Higher Secondary School",
  "email": "principal@stthomas.edu.in",
  "phone": "+91 98471 23456",
  "role": "Principal / Head of School",
  "studentCount": "1500 - 3000 Students",
  "preferredDate": "Tomorrow 3 PM",
  "notes": "Interested in Kerala SSLC CE mark entry and report card generation"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Thank you, Dr. K. Narayanan! Your demo request for St. Thomas Higher Secondary School has been received.",
  "leadId": "LEAD-1788850588604-Z8871H"
}
```
Leads are stored in `data/leads.json` for immediate follow-up.
