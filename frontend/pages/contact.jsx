import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-primary mb-4">Contact Us</h1>
        <p className="text-gray-700 mb-6">
          Have a story to share or feedback for us? Reach out anytime!
        </p>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 border rounded-lg"
          />
          <textarea
            placeholder="Your Message"
            rows="5"
            className="w-full p-3 border rounded-lg"
          />
          <button
            type="submit"
            className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-red-700 transition"
          >
            Send
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
