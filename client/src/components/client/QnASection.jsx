import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div
      className={`border rounded-[var(--radius-xl)] mt-24 transition-all duration-300 overflow-hidden ${
        isOpen
          ? "border-[var(--color-primary-600)] bg-[var(--color-primary-50)]/30"
          : "border-[var(--color-border-default)] bg-[var(--color-surface-card)]"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left outline-none group"
      >
        <span
          className={`text-sm font-bold tracking-tight transition-colors ${
            isOpen
              ? "text-[var(--color-primary-700)]"
              : "text-[var(--color-content-primary)]"
          }`}
        >
          {question}
        </span>
        <ChevronDown
          size={18}
          className={`text-[var(--color-content-muted)] transition-transform duration-300 ${
            isOpen
              ? "rotate-180 text-[var(--color-primary-600)]"
              : "group-hover:text-[var(--color-content-primary)]"
          }`}
        />
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-5 pb-5 text-[13px] leading-relaxed text-[var(--color-content-muted)]">
          {answer}
        </p>
      </div>
    </div>
  );
};

const QnASection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Who is eligible to donate blood?",
      answer:
        "Generally, donors must be aged between 18-65, weigh at least 50kg, and be in good health. Specific health conditions and recent travel may affect eligibility.",
    },
    {
      question: "How often can I donate blood?",
      answer:
        "For whole blood donation, a minimum interval of 90 days (3 months) is required between donations to ensure your body fully replenishes its iron stores.",
    },
    {
      question: "Is it safe to donate blood during a pandemic?",
      answer:
        "Yes. We follow strict medical protocols, including sterilized equipment and social distancing, to ensure the safety of both donors and recipients.",
    },
    {
      question: "How long does the donation process take?",
      answer:
        "The actual blood extraction takes only 8-10 minutes. However, the entire process including registration and brief recovery takes about 45 minutes.",
    },
  ];

  return (
    <section className="py-12 space-y-10">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="p-2 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-600)]">
            <HelpCircle size={20} />
          </div>
        </div>
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-600)]">
          Common Questions
        </h2>
        <p className="text-3xl font-bold text-[var(--color-content-primary)]">
          Everything you need to know
        </p>
      </div>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
          />
        ))}
      </div>
    </section>
  );
};

export default QnASection;
