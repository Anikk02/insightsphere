import React from 'react';
import Link from 'next/link';

export default function ResponsiveMenu({ links, toggleMenu }) {
  return (
    <div className="md:hidden bg-primary text-white text-center">
      <ul className="flex flex-col py-3 space-y-2">
        {links.map((link, i) => (
          <li key={i}>
            <Link href={link.href} onClick={toggleMenu}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
