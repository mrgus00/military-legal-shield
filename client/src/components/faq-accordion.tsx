import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Is this service confidential?",
    answer: "Yes, absolutely. All communications with our attorneys are protected by attorney-client privilege. Your legal matters remain completely confidential and secure."
  },
  {
    question: "Can I access this from overseas?",
    answer: "Yes, Military Legal Shield is available worldwide. We have attorneys experienced in international military law and SOFA agreements for overseas deployments."
  },
  {
    question: "How fast can I speak to a lawyer?",
    answer: "Emergency cases are prioritized within 1 hour. Non-urgent matters are typically matched within 24 hours. Our platform operates 24/7 for critical situations."
  },
  {
    question: "What areas of law do you cover?",
    answer: "We cover all military legal matters including court-martial defense, administrative actions, family law, estate planning, DUI, security clearance issues, and VA disability claims."
  },
  {
    question: "How much does this service cost?",
    answer: "We offer both free consultations and paid representation. Emergency consultations are always free. Representation costs vary by case complexity and attorney experience."
  },
  {
    question: "Are the attorneys military law specialists?",
    answer: "Yes, all attorneys in our network specialize in military law and are experienced with UCMJ, military courts, and the unique challenges service members face."
  }
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-navy-900">{faq.question}</h3>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}