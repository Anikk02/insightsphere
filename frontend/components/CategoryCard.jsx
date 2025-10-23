import React from 'react';
import Link from 'next/link';

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="block bg-accent rounded-lg shadow hover:shadow-lg p-6 text-center"
    >
      <h3 className="text-lg font-semibold text-primary">{category.name}</h3>
    </Link>
  );
}
