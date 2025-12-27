'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

type NearbyAthlete = {
  name: string;
  rank: number;
  value: number;
  isCurrentAthlete: boolean;
};

type RankingComparisonProps = {
  athleteName?: string;
  athleteValue?: number;
  currentRank: number | null;
  allTimeRank: number | null;
  isManualEntry?: boolean;
  manualData?: {
    squat: string;
    bench: string;
    deadlift: string;
    bodyweight: string;
    gender: 'male' | 'female';
  };
  filters: {
    federation: string;
    equipment: string;
    weightClass: string;
    division: string;
    liftCategory: string;
  };
};

export default function RankingComparison({ 
  athleteName, 
  athleteValue,
  currentRank, 
  allTimeRank,
  isManualEntry = false,
  manualData,
  filters 
}: RankingComparisonProps) {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [rankType, setRankType] = useState<'current' | 'allTime'>('current');
  const [athletes, setAthletes] = useState<NearbyAthlete[]>([]);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState('kg');

  useEffect(() => {
    const fetchNearbyAthletes = async () => {
      const rank = rankType === 'current' ? currentRank : allTimeRank;
      
      if (!rank) {
        setAthletes([]);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (athleteName) params.set('name', athleteName);
        params.set('rank', rank.toString());
        params.set('rankType', rankType);
        if (filters.federation !== 'all') params.set('federation', filters.federation);
        if (filters.equipment !== 'all') params.set('equipment', filters.equipment);
        if (filters.weightClass !== 'All classes') params.set('weightClass', filters.weightClass);
        if (filters.division !== 'All Divisions') params.set('division', filters.division);
        params.set('lift', filters.liftCategory);
        params.set('range', '5');

        const response = await fetch(`/api/nearby-athletes?${params}`);
        if (response.ok) {
          const data = await response.json();
          let athletesList = data.athletes || [];
          
          // If manual entry and not in list, insert it at the correct position
          if (isManualEntry && athleteValue !== undefined) {
            const manualEntryExists = athletesList.some((a: NearbyAthlete) => a.isCurrentAthlete);
            if (!manualEntryExists) {
              athletesList.push({
                name: 'Manual Entry',
                rank: rank,
                value: athleteValue,
                isCurrentAthlete: true
              });
              // Sort by rank
              athletesList.sort((a: NearbyAthlete, b: NearbyAthlete) => a.rank - b.rank);
            }
          }
          
          setAthletes(athletesList);
          setUnit(data.unit || 'kg');
          
          // Scroll to center the current athlete after data loads
          setTimeout(() => {
            if (scrollContainerRef.current) {
              const currentAthleteRow = scrollContainerRef.current.querySelector('.bg-primary\\/10');
              if (currentAthleteRow) {
                const container = scrollContainerRef.current;
                const containerHeight = container.clientHeight;
                const rowTop = (currentAthleteRow as HTMLElement).offsetTop;
                const rowHeight = (currentAthleteRow as HTMLElement).offsetHeight;
                
                // Calculate scroll position to center the row
                const scrollTo = rowTop - (containerHeight / 2) + (rowHeight / 2);
                
                container.scrollTop = scrollTo;
              }
            }
          }, 100);
        }
      } catch (error) {
        console.error('Failed to fetch nearby athletes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyAthletes();
  }, [rankType, currentRank, allTimeRank, athleteName, filters, athleteValue, isManualEntry]);

  const handleCompare = (opponentName: string) => {
    const params = new URLSearchParams();
    
    if (isManualEntry && manualData) {
      // pass manual entry data through URL params
      params.set('manual1_squat', manualData.squat);
      params.set('manual1_bench', manualData.bench);
      params.set('manual1_deadlift', manualData.deadlift);
      params.set('manual1_bodyweight', manualData.bodyweight);
      params.set('manual1_gender', manualData.gender);
      params.set('athlete2', opponentName);
    } else if (athleteName) {
      params.set('athlete1', athleteName);
      params.set('athlete2', opponentName);
    } else {
      params.set('athlete2', opponentName);
    }
    
    router.push(`/compare?${params.toString()}`);
  };

  if (!currentRank && !allTimeRank) {
    return null;
  }

  return (
    <div className="card bg-base-100 shadow-lg mb-8">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h3 className="card-title text-lg">Nearby Athletes</h3>
          <div className="tabs tabs-boxed tabs-sm">
            <button
              className={`tab ${rankType === 'current' ? 'tab-active' : ''}`}
              onClick={() => setRankType('current')}
              disabled={!currentRank}
            >
              Current
            </button>
            <button
              className={`tab ${rankType === 'allTime' ? 'tab-active' : ''}`}
              onClick={() => setRankType('allTime')}
              disabled={!allTimeRank}
            >
              All-Time
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : athletes.length > 0 ? (
          <div className="overflow-x-auto">
            <div ref={scrollContainerRef} className="max-h-64 overflow-y-auto">
              <table className="table table-sm table-pin-rows">
                <thead>
                  <tr>
                    <th className="w-12 text-xs">Rank</th>
                    <th className="text-xs">Athlete</th>
                    <th className="text-right text-xs">Best {filters.liftCategory}</th>
                    <th className="w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {athletes.map((athlete) => (
                    <tr 
                      key={`${athlete.rank}-${athlete.name}`}
                      className={athlete.isCurrentAthlete ? 'bg-primary/10' : ''}
                    >
                      <td className="font-semibold text-sm">
                        #{athlete.rank}
                      </td>
                      <td className="font-medium text-sm">
                        {athlete.name}
                        {athlete.isCurrentAthlete && (
                          <span className="ml-2 badge badge-primary badge-xs">You</span>
                        )}
                      </td>
                      <td className="text-right font-mono text-sm">
                        {athlete.value.toFixed(2)} {unit}
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() => handleCompare(athlete.name)}
                          disabled={athlete.isCurrentAthlete && !isManualEntry}
                        >
                          Compare
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 opacity-60">
            <p>No nearby athletes found</p>
          </div>
        )}
      </div>
    </div>
  );
}
