import { useState } from 'react'
import FAQItem from './FAQItem'

const faqs = [
  {
    question: 'What is your return policy?',
    answer: 'You can return any item within 30 days of purchase for a full refund.',
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Yes, we ship to over 50 countries worldwide.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order ships, you\'ll receive a tracking link via email.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and Apple Pay.',
  },
  {
    question: 'Can I change my subscription plan?',
    answer: 'Yes, you can upgrade or downgrade your plan anytime from account settings.',
  },
  {
    question: 'Is customer support available 24/7?',
    answer: 'Our support team is available around the clock via chat and email.',
  },
];

function App() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Frequently Asked Questions
        </h1>
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onClick={() => handleToggle(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;