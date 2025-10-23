import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark text-accent py-8 mt-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h3 className="text-xl font-bold mb-4">InsightSphere</h3>
        <p className="text-gray-400 text-sm mb-4">
          Exploring politics, culture, travel, and global insights.
        </p>
        <div className="flex justify-center space-x-6">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <p className="text-gray-500 text-xs mt-5">
          © {new Date().getFullYear()} InsightSphere. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
