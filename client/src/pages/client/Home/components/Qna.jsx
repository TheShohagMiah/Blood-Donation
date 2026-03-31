import React, { useState } from "react";
import { HelpCircle } from "lucide-react";
import Faq from "./Faq";

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
    <section className="container-main section space-y-12 lg:space-y-12 animate-fade-in">
      {/* Section Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-2">
          <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 ring-4 ring-primary-50/50">
            <HelpCircle size={24} />
          </div>
        </div>
        <h2 className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] text-primary-600">
          Common Questions
        </h2>
        <p className="text-3xl lg:text-5xl font-bold text-content-primary tracking-tight text-balance">
          Everything you need to know
        </p>
      </div>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {faqs.map((faq, index) => (
          <Faq
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
