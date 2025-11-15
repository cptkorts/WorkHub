import { BarChart3, Calendar1, Dot, FileText, Users } from "lucide-react";

export default function Features() {
  return (
    <section className="min-h-screen w-full p-12 border-b border-border">
      <p className="text-success font-medium uppercase tracking-wide mb-2 text-center">
        The Solution
      </p>
      <h2 className="text-4xl md:text-5xl font-bold text-text-default mb-4 text-center">
        Everything you need - all in one dashboard.
      </h2>
      <p className="text-text-muted max-w-2xl mx-auto mb-10 text-center">
        From clients to cash flow, WorkHub keeps your freelance business running
        smoothly in one place.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 xl:gap-10 max-w-5xl mx-auto">
        {[
          {
            icon: (
              <Users className="w-8 h-8 text-default group-hover:text-white" />
            ),
            title: "Know your clients by heart.",
            desc: "Store contact info, track preferences, and keep notes — all in one organized client hub.",
            bullets: ["Smart search", "Notes history"],
          },
          {
            icon: (
              <Calendar1 className="w-8 h-8 text-default group-hover:text-white" />
            ),
            title: "Never miss a booking again.",
            desc: "Schedule sessions, send reminders, and manage your calendar effortlessly from any device.",
            bullets: ["Daily/weekly view", "Auto reminders"],
          },
          {
            icon: (
              <FileText className="w-8 h-8 text-default group-hover:text-white" />
            ),
            title: "Get paid faster, stress-free.",
            desc: "Create and send invoices in seconds, track payments, and connect with Stripe for instant transactions.",
            bullets: ["PDF export", "Payment tracking"],
          },
          {
            icon: (
              <BarChart3 className="w-8 h-8 text-default group-hover:text-white" />
            ),
            title: "See your business at a glance.",
            desc: "Visualize revenue trends, monitor performance, and stay on top of your growth.",
            bullets: ["Revenue charts", "Monthly insights"],
          },
        ].map((card, i) => (
          <div
            key={i}
            className="group flex flex-col bg-white border border-border rounded-xl p-6 xl:p-8 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 duration-200"
          >
            <div className="w-12 h-12 bg-opacity-0 group-hover:bg-linear-to-br group-hover:from-money group-hover:to-success/80  group-hover:scale-105 transition-all duration-200 rounded-xl flex items-center justify-center mb-5 self-center">
              {card.icon}
            </div>
            <h3 className="text-xl font-semibold text-hover mb-3 self-center">
              {card.title}
            </h3>
            <p className="text-text-muted mb-3">{card.desc}</p>
            <ul className=" text-sm text-text-muted/80 space-y-1 group-hover:text-default transition-all duration-200">
              {card.bullets.map((b, j) => (
                <li key={j} className="flex items-center gap-1.5">
                  <Dot className="w-6 h-6" /> {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
