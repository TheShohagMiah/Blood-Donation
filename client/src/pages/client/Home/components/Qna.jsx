import React, { useState } from "react";
import { HelpCircle, ChevronDown, Plus, Minus } from "lucide-react";

const QnASection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Who is eligible to donate blood?",
      answer:
        "Generally, donors must be aged between 18-65, weigh at least 50kg, and be in good health. Specific health conditions and recent travel may affect eligibility protocols.",
    },
    {
      question: "How often can I donate blood?",
      answer:
        "For whole blood donation, a minimum interval of 90 days (3 months) is required between donations to ensure your body fully replenishes its iron stores.",
    },
    {
      question: "Safety and sterilized equipment protocols?",
      answer:
        "We follow strict medical grade protocols, including single-use sterilized equipment and social distancing, to ensure the absolute safety of both donors and recipients.",
    },
    {
      question: "Operational timeframe for the process?",
      answer:
        "The extraction phase takes 8-10 minutes. However, the end-to-end process including registration and recovery telemetry takes approximately 45 minutes.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto py-24 px-6 animate-in fade-in duration-1000">
      <div className="flex flex-col lg:flex-row gap-20">
        {/* Sticky Information Header */}
        <div className="lg:w-1/3 lg:sticky lg:top-24 h-fit space-y-6">
          <div className="space-y-3">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--color-primary-600)]">
              Support Core
            </h2>
            <h3 className="text-4xl font-bold text-[var(--color-content-primary)] tracking-tight leading-[1.1]">
              Everything you <br /> need to know.
            </h3>
          </div>
          <div className="h-1 w-12 bg-[var(--color-primary-600)] rounded-full" />
          <p className="text-sm text-[var(--color-content-muted)] leading-relaxed max-w-xs">
            Detailed answers regarding eligibility, safety measures, and
            operational timeframes for blood donation.
          </p>
        </div>

        {/* Technical Accordion List */}
        <div className="lg:w-2/3 border-t border-[var(--color-border-default)]">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border-b border-[var(--color-border-default)] transition-colors duration-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full py-8 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black text-[var(--color-primary-600)] tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-lg lg:text-xl font-bold tracking-tight transition-colors ${isOpen ? "text-[var(--color-primary-600)]" : "text-[var(--color-content-primary)]"}`}
                    >
                      {faq.question}
                    </span>
                  </div>
                  <div
                    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  >
                    {isOpen ? (
                      <Minus
                        size={20}
                        className="text-[var(--color-primary-600)]"
                      />
                    ) : (
                      <Plus
                        size={20}
                        className="text-[var(--color-content-muted)]"
                      />
                    )}
                  </div>
                </button>

                {/* Answer Container */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-96 pb-10 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="pl-14 max-w-2xl">
                    <p className="text-sm lg:text-base text-[var(--color-content-muted)] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QnASection;
