'use client';

import { useRouter } from 'next/navigation';
import LifterDropdown from '@/app/components/LifterDropdown';

export default function LifterSearchBar() {
  const router = useRouter();
  return (
    <LifterDropdown
      placeholder=""
      limit={10}
      onSelect={(lifter) => {
        // navigate to a lifter page
        router.push(`/u/${encodeURIComponent(lifter.name)}`);
      }}
    />
  );
}
