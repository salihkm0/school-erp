export interface Testimonial {
  id: string;
  name: string;
  role: string;
  school: string;
  location: string;
  quote: string;
  rating: number;
  highlight: string;
  avatarText: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Dr. K. Narayanan",
    role: "Principal",
    school: "St. Thomas Higher Secondary School",
    location: "Kerala",
    quote: "Generating report cards for 2,400 students used to take our entire faculty two full weeks of stressful paperwork. With KlassDesk, all teachers entered marks smoothly, administrators verified progress with live audits, and we generated all 2,400 board-compliant PDF report cards in less than 30 minutes!",
    rating: 5,
    highlight: "Saved 2 full weeks of faculty paperwork",
    avatarText: "KN"
  },
  {
    id: "2",
    name: "Fathima Suhra",
    role: "Vice Principal & Exam Controller",
    school: "Crescent Public School",
    location: "Malappuram",
    quote: "The dual submission and review workflow with individual subject draft reversion is pure genius. If a teacher needs to edit one subject's marks, we don't have to unlock the whole class marksheet! The missing marks audit safeguard alone has eliminated 100% of mark entry errors.",
    rating: 5,
    highlight: "100% elimination of mark entry errors",
    avatarText: "FS"
  },
  {
    id: "3",
    name: "Thomas Abraham",
    role: "Senior Academic Coordinator",
    school: "Hillview International Academy",
    location: "Kochi",
    quote: "Parents love the instant SMS alerts whenever their child is marked absent. Morning roll call is done by teachers in under a minute, and parent engagement during parent-teacher meetings has never been higher.",
    rating: 5,
    highlight: "Daily attendance done in under 1 minute",
    avatarText: "TA"
  }
];

export const TRUST_METRICS = [
  { value: "50,000+", label: "Report Cards Generated", sub: "100% print & board-ready" },
  { value: "99.9%", label: "Uptime SLA", sub: "Bank-grade cloud reliability" },
  { value: "45 mins", label: "Average Setup Time", sub: "Fast 1-click Excel roster import" },
  { value: "98%", label: "Faculty Satisfaction", sub: "Rated by teachers & principals" }
];
