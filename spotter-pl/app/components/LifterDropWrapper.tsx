'use client';

import LifterDropdown from '@/app/components/LifterDropdown';

type Props = {
  setFederation: (value: string) => void;
  setCountry: (value: string) => void;
  setWeightClass: (value: string) => void;
  setAgeDivision: (value: string) => void;
  setTested: (value: string | null) => void;
  setEquipment: (value: string) => void;
};

export default function LifterSearchBar({
  setFederation,
  setCountry,
  setWeightClass,
  setAgeDivision,
  setTested,
  setEquipment,
}: Props) {
  const handleLifterSelect = async (lifter: { name: string }) => {
    try {
      // fetch most recent comp
      const res = await fetch(`/api/lifter-details?name=${encodeURIComponent(lifter.name)}`);
      if (!res.ok) {
        console.error('Failed to fetch lifter details:', res.status);
        return;
      }

      const data = await res.json();

      // preset filters based off recent comp
      if (data.federation) {
        setFederation(data.federation);
      }

      if (data.country) {
        setCountry(data.country);
      }

      if (data.weightClass) {
        setWeightClass(data.weightClass);
      }

      if (data.division) {
        setAgeDivision(data.division);
      }

      if (data.equipment) {
        setEquipment(data.equipment);
      }

      setTested(null);

    } catch (error) {
      console.error('Failed to fetch lifter details:', error);
    }
  };

  return (
    <LifterDropdown
      placeholder="Enter Lifter Name"
      limit={10}
      onSelect={handleLifterSelect}
    />
  );
}
