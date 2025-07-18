import React from 'react';

const ReturnRefund = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-700">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">Return & Refund Policy</h1>

      <div className="space-y-4 text-sm md:text-base">
        <p>We aim to deliver fresh and quality products to your doorstep. If you're not satisfied with a purchase, our policy outlines your options below.</p>

        <h2 className="text-xl font-semibold mt-6 text-primary"> Return Eligibility</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li> Packaged items can be returned within <strong>30 days</strong> of delivery.</li>
          <li> Fresh items like fruits and vegetables are <strong>non-returnable</strong> due to their perishable nature.</li>
          <li> Items must be unused, undamaged, and in original packaging to be eligible for return.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 text-primary"> Refunds</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li> Refunds are initiated once we receive and inspect the returned product.</li>
          <li> Amount will be refunded to your original payment method within 5–7 business days.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 text-primary"> Exchanges</h2>
        <p>We only replace items if they are defective or damaged. If you need an exchange, contact our support team with your order number.</p>

        <p className="mt-8 text-sm text-gray-500">For any questions, reach out to <a href="mailto:support@zesty.com" className="text-primary-dull underline">support@zesty.com</a>.</p>
      </div>
    </div>
  );
};

export default ReturnRefund;
