import React from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';

function Contact() {
  return (
    <div className="min-h-screen bg-white px-4 py-12 flex flex-col items-center text-gray-800">
      <h1 className="text-3xl font-bold text-primary mb-6">Contact Us</h1>

      <div className="w-full max-w-3xl bg-gray-50 shadow-sm rounded-md p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Customer Support</h2>
          <p className="mt-2 text-gray-600">
            For any questions, concerns, or feedback, feel free to reach out to our customer support team.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <FiPhone className="text-primary mt-1" />
          <div>
            <h3 className="font-medium text-gray-700">Phone:</h3>
            <p className="text-gray-600">+1 (234) 567-8901</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FiMail className="text-primary mt-1" />
          <div>
            <h3 className="font-medium text-gray-700">Email:</h3>
            <p className="text-gray-600">support@zestygroceries.com</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FiMapPin className="text-primary mt-1" />
          <div>
            <h3 className="font-medium text-gray-700">Address:</h3>
            <p className="text-gray-600">123 Zesty Lane, Freshville, USA</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FiClock className="text-primary mt-1" />
          <div>
            <h3 className="font-medium text-gray-700">Support Hours:</h3>
            <p className="text-gray-600">Mon – Sat: 9:00 AM – 8:00 PM</p>
            <p className="text-gray-600">Sunday: Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
