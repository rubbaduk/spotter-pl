'use client';

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LifterDropdown from "@/app/components/LifterDropdown";
import Navigation from "@/app/components/Navigation";

type LiftRecord = {
  value: number;
  date: string;
  meet: string;
  federation: string;
};

type AthleteBests = {
  name: string;
  totalMeets: number;
  bestSquat: LiftRecord | null;
  bestBench: LiftRecord | null;
  bestDeadlift: LiftRecord | null;
  bestTotal: LiftRecord | null;
  bestGoodlift: number | null;
  bestDots: number | null;
};

type ComparisonState = {
  athlete1Name: string;
  athlete2Name: string;
};

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultsRef = useRef<HTMLElement>(null);

  const [athlete1Name, setAthlete1Name] = useState("");
  const [athlete2Name, setAthlete2Name] = useState("");
  
  const [comparison, setComparison] = useState<ComparisonState | null>(null);
  const [athlete1Data, setAthlete1Data] = useState<AthleteBests | null>(null);
  const [athlete2Data, setAthlete2Data] = useState<AthleteBests | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!comparison) {
      setAthlete1Data(null);
      setAthlete2Data(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [athlete1Res, athlete2Res] = await Promise.all([
          fetch(`/api/athlete-bests?name=${encodeURIComponent(comparison.athlete1Name)}`),
          fetch(`/api/athlete-bests?name=${encodeURIComponent(comparison.athlete2Name)}`),
        ]);

        if (athlete1Res.ok) {
          const data = await athlete1Res.json();
          setAthlete1Data(data);
        }

        if (athlete2Res.ok) {
          const data = await athlete2Res.json();
          setAthlete2Data(data);
        }
      } catch (error) {
        console.error('Failed to fetch athlete data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [comparison]);

  useEffect(() => {
    const athlete1 = searchParams.get('athlete1');
    const athlete2 = searchParams.get('athlete2');

    if (athlete1) setAthlete1Name(athlete1);
    if (athlete2) setAthlete2Name(athlete2);

    if (athlete1 && athlete2) {
      setComparison({
        athlete1Name: athlete1,
        athlete2Name: athlete2,
      });
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [searchParams]);

  const handleCompare = () => {
    if (!athlete1Name || !athlete2Name) return;

    const params = new URLSearchParams();
    params.set('athlete1', athlete1Name);
    params.set('athlete2', athlete2Name);

    const newUrl = `/compare?${params.toString()}`;
    router.push(newUrl, { scroll: false });

    setComparison({
      athlete1Name,
      athlete2Name,
    });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="min-h-dvh bg-base-100 text-base-content">
      <Navigation />
      {/* search section - full viewport height */}
      <main className="min-h-dvh flex items-center justify-center px-6 pt-16">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">1v1 Comparison</h1>
            <p className="text-lg opacity-70">
              Compare two powerlifters side-by-side
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* athlete 1 */}
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-sm opacity-70 mb-4">Athlete 1</h3>
                <LifterDropdown
                  placeholder="Search first athlete..."
                  limit={10}
                  onSelect={(lifter) => setAthlete1Name(lifter.name)}
                />
              </div>
            </div>

            {/* athlete 2 */}
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-sm opacity-70 mb-4">Athlete 2</h3>
                <LifterDropdown
                  placeholder="Search second athlete..."
                  limit={10}
                  onSelect={(lifter) => setAthlete2Name(lifter.name)}
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleCompare}
              disabled={!athlete1Name || !athlete2Name}
              className="btn btn-primary btn-lg"
            >
              Compare Athletes
            </button>
          </div>
        </div>
      </main>

      {/* results section */}
      <section 
        ref={resultsRef}
        className={`min-h-dvh bg-base-200 transition-opacity duration-500 ${
          comparison ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {comparison && (
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-2">
                {comparison.athlete1Name} vs {comparison.athlete2Name}
              </h2>
              <p className="text-sm opacity-70">Head-to-head comparison</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <>
                {/* basketball-style comparison table */}
                <div className="card bg-base-100 shadow-lg mb-8">
                  <div className="card-body p-0">
                    <div className="overflow-x-auto">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="text-right w-1/3 text-lg font-bold">{athlete1Data?.name}</th>
                            <th className="text-center w-1/3"></th>
                            <th className="text-left w-1/3 text-lg font-bold">{athlete2Data?.name}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Squat */}
                          <tr className="hover">
                            <td className="text-right text-2xl font-bold">
                              {athlete1Data?.bestSquat ? `${athlete1Data.bestSquat.value} kg` : '—'}
                            </td>
                            <td className="text-center font-semibold uppercase text-sm opacity-60">Squat</td>
                            <td className="text-left text-2xl font-bold">
                              {athlete2Data?.bestSquat ? `${athlete2Data.bestSquat.value} kg` : '—'}
                            </td>
                          </tr>
                          
                          {/* Bench */}
                          <tr className="hover">
                            <td className="text-right text-2xl font-bold">
                              {athlete1Data?.bestBench ? `${athlete1Data.bestBench.value} kg` : '—'}
                            </td>
                            <td className="text-center font-semibold uppercase text-sm opacity-60">Bench</td>
                            <td className="text-left text-2xl font-bold">
                              {athlete2Data?.bestBench ? `${athlete2Data.bestBench.value} kg` : '—'}
                            </td>
                          </tr>
                          
                          {/* Deadlift */}
                          <tr className="hover">
                            <td className="text-right text-2xl font-bold">
                              {athlete1Data?.bestDeadlift ? `${athlete1Data.bestDeadlift.value} kg` : '—'}
                            </td>
                            <td className="text-center font-semibold uppercase text-sm opacity-60">Deadlift</td>
                            <td className="text-left text-2xl font-bold">
                              {athlete2Data?.bestDeadlift ? `${athlete2Data.bestDeadlift.value} kg` : '—'}
                            </td>
                          </tr>
                          
                          {/* Total */}
                          <tr className="hover bg-primary/10">
                            <td className="text-right text-3xl font-bold">
                              {athlete1Data?.bestTotal ? `${athlete1Data.bestTotal.value} kg` : '—'}
                            </td>
                            <td className="text-center font-bold uppercase text-sm">Total</td>
                            <td className="text-left text-3xl font-bold">
                              {athlete2Data?.bestTotal ? `${athlete2Data.bestTotal.value} kg` : '—'}
                            </td>
                          </tr>
                          
                          {/* Goodlift Points */}
                          {(athlete1Data?.bestGoodlift || athlete2Data?.bestGoodlift) && (
                            <tr className="hover">
                              <td className="text-right text-xl font-bold">
                                {athlete1Data?.bestGoodlift ? athlete1Data.bestGoodlift.toFixed(2) : '—'}
                              </td>
                              <td className="text-center font-semibold uppercase text-sm opacity-60">Goodlift</td>
                              <td className="text-left text-xl font-bold">
                                {athlete2Data?.bestGoodlift ? athlete2Data.bestGoodlift.toFixed(2) : '—'}
                              </td>
                            </tr>
                          )}
                          
                          {/* DOTS */}
                          {(athlete1Data?.bestDots || athlete2Data?.bestDots) && (
                            <tr className="hover">
                              <td className="text-right text-xl font-bold">
                                {athlete1Data?.bestDots ? athlete1Data.bestDots.toFixed(2) : '—'}
                              </td>
                              <td className="text-center font-semibold uppercase text-sm opacity-60">DOTS</td>
                              <td className="text-left text-xl font-bold">
                                {athlete2Data?.bestDots ? athlete2Data.bestDots.toFixed(2) : '—'}
                              </td>
                            </tr>
                          )}
                          
                          {/* Total Meets */}
                          <tr className="hover">
                            <td className="text-right text-lg">
                              {athlete1Data?.totalMeets || 0}
                            </td>
                            <td className="text-center font-semibold uppercase text-sm opacity-60">Total Meets</td>
                            <td className="text-left text-lg">
                              {athlete2Data?.totalMeets || 0}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-dvh flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>}>
      <CompareContent />
    </Suspense>
  );
}
