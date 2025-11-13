"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah L.",
    role: "Wedding Photographer",
    quote: "Finally, everything's in one place.",
    testimonial:
      "I used to juggle spreadsheets, Google Calendar, and notes just to keep track of clients. WorkHub does it all for me — I can manage bookings, send invoices, and even track payments in minutes.",
  },
  {
    name: "Marcus D.",
    role: "Barber",
    quote: "Appointments made simple.",
    testimonial:
      "The calendar view is a game changer. I see my entire week at a glance, and my clients love getting automatic reminders. It's like having a personal assistant for my shop.",
  },
  {
    name: "Ava R.",
    role: "Freelance Designer",
    quote: "It's my whole business in a dashboard.",
    testimonial:
      "Invoices, clients, analytics — everything just works together. I can finally focus on design instead of paperwork. I'd recommend WorkHub to any freelancer.",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="min-h-screen w-full p-12 border-b border-border flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-bold text-text-default mb-4 text-center">
          Trusted by freelancers and creators everywhere.
        </h2>
        <p className="text-text-muted max-w-2xl mx-auto mb-16 text-center">
          WorkHub helps small teams, solo professionals, and local businesses
          stay organized and grow, without the overwhelm.
        </p>

        {/* Testimonial Card */}
        <div className="relative group bg-money/30 border border-border rounded-2xl p-8 md:p-12 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 min-h-[400px] flex flex-col justify-between">
          {/* Stars */}
          <div className="flex gap-1 mb-3 justify-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-6 h-6 fill-warning/70 text-warning/70 group-hover:fill-warning group-hover:text-warning group-hover:scale-110 transition-all duration-200"
              />
            ))}
          </div>

          {/* Quote */}
          <div className="mt-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-default mb-4">
              &quot;{testimonials[currentIndex].quote}&quot;
            </h3>
            <p className="text-text-default/70 text-lg leading-relaxed">
              {testimonials[currentIndex].testimonial}
            </p>
          </div>

          {/* Author */}
          <div className="mt-8 flex flex-col items-center md:items-end">
            <p className="text-accent font-semibold text-lg">
              - {testimonials[currentIndex].name}
            </p>
            <p className="text-default/80">{testimonials[currentIndex].role}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={handlePrevious}
            className="p-3 rounded-full  hover:bg-light/20 transition-all hover:scale-115 duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-default" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-accent w-8"
                    : "bg-border hover:bg-muted"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-3 rounded-full  hover:bg-light/20 transition-all hover:scale-115 duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-default" />
          </button>
        </div>
      </div>
    </section>
  );
}
