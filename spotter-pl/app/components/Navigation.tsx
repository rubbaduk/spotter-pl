'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-base-100/80 backdrop-blur-sm border-b border-base-300">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              Spotter
            </Link>
            <div className="tabs tabs-boxed">
              <Link 
                href="/" 
                className={`tab ${pathname === '/' ? 'tab-active' : ''}`}
              >
                Spot Me
              </Link>
              <Link 
                href="/compare" 
                className={`tab ${pathname === '/compare' ? 'tab-active' : ''}`}
              >
                1v1
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
