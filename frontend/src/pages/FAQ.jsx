import React, { useState } from 'react';

const faqData = [
  {
    question: 'Can I return fresh fruits or vegetables?',
    answer: 'No, fresh produce like fruits and vegetables are not eligible for returns due to their perishable nature.',
  },
  {
    question: 'How do I initiate a return?',
    answer: 'Contact our support team with your order number. If the item is eligible, we will guide you through the return process.',
  },
  {
    question: 'When will I receive my refund?',
    answer: 'Refunds are processed within 5–7 business days after the returned product is received and verified.',
  },
  {
    question: 'Can I exchange a damaged product?',
    answer: 'Yes, if your item is defective or damaged, we offer exchanges. Please contact support for help.',
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-700">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">Frequently Asked Questions</h1>

      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full text-left px-4 py-3 bg-gray-100 border rounded-lg border-primary-dull hover:bg-primary-dull/10 text-black font-medium focus:outline-none cursor-pointer"
            >
              {faq.question}
            </button>
            {openIndex === index && (
              <div className="px-4 py-3 bg-white text-gray-600 text-sm md:text-base border rounded-lg border-primary-dull ">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
