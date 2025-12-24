'use client';

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LifterDropdown from "@/app/components/LifterDropdown";
import Navigation from "@/app/components/Navigation";
import { calculateDots, calculateGoodlift } from '@/lib/points';

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

type ManualEntry = {
  squat: string;
  bench: string;
  deadlift: string;
  bodyweight: string;
  gender: "male" | "female";
};

type ComparisonState = {
  athlete1Name: string;
  athlete2Name: string;
};

type ManualComparisonState = {
  athlete1Manual: ManualEntry | null;
  athlete2Manual: ManualEntry | null;
};

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultsRef = useRef<HTMLElement>(null);

  const [athlete1Name, setAthlete1Name] = useState("");
  const [athlete2Name, setAthlete2Name] = useState("");
  
  const [isManualEntry1, setIsManualEntry1] = useState(false);
  const [isManualEntry2, setIsManualEntry2] = useState(false);
  
  const [manual1, setManual1] = useState<ManualEntry>({
    squat: "",
    bench: "",
    deadlift: "",
    bodyweight: "",
    gender: "male"
  });
  
  const [manual2, setManual2] = useState<ManualEntry>({
    squat: "",
    bench: "",
    deadlift: "",
    bodyweight: "",
    gender: "male"
  });
  
  const [comparison, setComparison] = useState<ComparisonState | null>(null);
  const [manualComparison, setManualComparison] = useState<ManualComparisonState | null>(null);
  const [athlete1Data, setAthlete1Data] = useState<AthleteBests | null>(null);
  const [athlete2Data, setAthlete2Data] = useState<AthleteBests | null>(null);
  const [loading, setLoading] = useState(false);

  // hide trailing hash suffix (e.g. "John Smith #2") in table headers
  const getDisplayName = (name?: string | null) => {
    if (!name) return '';
    return name.replace(/\s+#\d+$/, '');
  };

  useEffect(() => {
    if (!comparison && !manualComparison) {
      setAthlete1Data(null);
      setAthlete2Data(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // fetch athlete 1 data
        if (comparison?.athlete1Name) {
          const athlete1Res = await fetch(`/api/athlete-bests?name=${encodeURIComponent(comparison.athlete1Name)}`);
          if (athlete1Res.ok) {
            const data = await athlete1Res.json();
            setAthlete1Data(data);
          }
        } else if (manualComparison?.athlete1Manual) {
          // create manual data
          const manual = manualComparison.athlete1Manual;
          const squat = parseFloat(manual.squat);
          const bench = parseFloat(manual.bench);
          const deadlift = parseFloat(manual.deadlift);
          const bodyweight = parseFloat(manual.bodyweight);
          const total = squat + bench + deadlift;
          
          const dots = calculateDots(manual.gender, bodyweight, total);
          const goodlift = calculateGoodlift(manual.gender, 'Raw', false, bodyweight, total);
          
          setAthlete1Data({
            name: "Athlete 1",
            totalMeets: 0,
            bestSquat: squat ? { value: squat, date: "Manual", meet: "Manual", federation: "Manual" } : null,
            bestBench: bench ? { value: bench, date: "Manual", meet: "Manual", federation: "Manual" } : null,
            bestDeadlift: deadlift ? { value: deadlift, date: "Manual", meet: "Manual", federation: "Manual" } : null,
            bestTotal: total ? { value: total, date: "Manual", meet: "Manual", federation: "Manual" } : null,
            bestGoodlift: goodlift,
            bestDots: dots
          });
        }
        
        // fetch athlete 2 data
        if (comparison?.athlete2Name) {
          const athlete2Res = await fetch(`/api/athlete-bests?name=${encodeURIComponent(comparison.athlete2Name)}`);
          if (athlete2Res.ok) {
            const data = await athlete2Res.json();
            setAthlete2Data(data);
          }
        } else if (manualComparison?.athlete2Manual) {
          // create manual data
          const manual = manualComparison.athlete2Manual;
          const squat = parseFloat(manual.squat);
          const bench = parseFloat(manual.bench);
          const deadlift = parseFloat(manual.deadlift);
          const bodyweight = parseFloat(manual.bodyweight);
          const total = squat + bench + deadlift;
          
          const dots = calculateDots(manual.gender, bodyweight, total);
          const goodlift = calculateGoodlift(manual.gender, 'Raw', false, bodyweight, total);
          
          setAthlete2Data({
            name: "Athlete 2",
            totalMeets: 0,
            bestSquat: squat ? { value: squat, date: "Manual", meet: "Manual", federation: "Manual" } : null,
            bestBench: bench ? { value: bench, date: "Manual", meet: "Manual", federation: "Manual" } : null,
            bestDeadlift: deadlift ? { value: deadlift, date: "Manual", meet: "Manual", federation: "Manual" } : null,
            bestTotal: total ? { value: total, date: "Manual", meet: "Manual", federation: "Manual" } : null,
            bestGoodlift: goodlift,
            bestDots: dots
          });
        }
      } catch (error) {
        console.error('Failed to fetch athlete data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [comparison, manualComparison]);

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
    // check if we have valid inputs for both athletes
    const athlete1Valid = isManualEntry1 ? manual1.squat && manual1.bench && manual1.deadlift && manual1.bodyweight : athlete1Name;
    const athlete2Valid = isManualEntry2 ? manual2.squat && manual2.bench && manual2.deadlift && manual2.bodyweight : athlete2Name;
    
    if (!athlete1Valid || !athlete2Valid) return;

    // build URL params for searched athletes
    const params = new URLSearchParams();
    if (!isManualEntry1 && athlete1Name) params.set('athlete1', athlete1Name);
    if (!isManualEntry2 && athlete2Name) params.set('athlete2', athlete2Name);

    const newUrl = `/compare${params.toString() ? '?' + params.toString() : ''}`;
    router.push(newUrl, { scroll: false });

    // comparison state
    setComparison({
      athlete1Name: isManualEntry1 ? '' : athlete1Name,
      athlete2Name: isManualEntry2 ? '' : athlete2Name,
    });
    
    setManualComparison({
      athlete1Manual: isManualEntry1 ? manual1 : null,
      athlete2Manual: isManualEntry2 ? manual2 : null,
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
            <h1 className="text-5xl font-bold mb-4">1v1</h1>
            <p className="text-lg opacity-70">
              Compare two powerlifters side-by-side
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* athlete 1 */}
            <div className="card bg-[#1C1C1C] shadow-lg">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="card-title text-sm opacity-70">Athlete 1</h3>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <span className="label-text text-xs">Manual Entry</span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs"
                        checked={isManualEntry1}
                        onChange={(e) => {
                          setIsManualEntry1(e.target.checked);
                          setAthlete1Name('');
                          setManual1({
                            squat: '',
                            bench: '',
                            deadlift: '',
                            bodyweight: '',
                            gender: 'male'
                          });
                        }}
                      />
                    </label>
                  </div>
                </div>
                {!isManualEntry1 ? (
                  <LifterDropdown
                    placeholder="Search first athlete..."
                    limit={10}
                    onSelect={(lifter) => setAthlete1Name(lifter.name)}
                  />
                ) : (
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Squat (kg)"
                      className="input input-sm w-full"
                      value={manual1.squat}
                      onChange={(e) => setManual1({ ...manual1, squat: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Bench (kg)"
                      className="input input-sm w-full"
                      value={manual1.bench}
                      onChange={(e) => setManual1({ ...manual1, bench: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Deadlift (kg)"
                      className="input input-sm w-full"
                      value={manual1.deadlift}
                      onChange={(e) => setManual1({ ...manual1, deadlift: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Bodyweight (kg)"
                      className="input input-sm w-full"
                      value={manual1.bodyweight}
                      onChange={(e) => setManual1({ ...manual1, bodyweight: e.target.value })}
                    />
                    <select
                      className="select select-sm w-full"
                      value={manual1.gender}
                      onChange={(e) => setManual1({ ...manual1, gender: e.target.value as 'male' | 'female' })}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* athlete 2 */}
            <div className="card bg-[#1C1C1C] shadow-lg">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="card-title text-sm opacity-70">Athlete 2</h3>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <span className="label-text text-xs">Manual Entry</span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs"
                        checked={isManualEntry2}
                        onChange={(e) => {
                          setIsManualEntry2(e.target.checked);
                          setAthlete2Name('');
                          setManual2({
                            squat: '',
                            bench: '',
                            deadlift: '',
                            bodyweight: '',
                            gender: 'male'
                          });
                        }}
                      />
                    </label>
                  </div>
                </div>
                {!isManualEntry2 ? (
                  <LifterDropdown
                    placeholder="Search second athlete..."
                    limit={10}
                    onSelect={(lifter) => setAthlete2Name(lifter.name)}
                  />
                ) : (
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Squat (kg)"
                      className="input input-sm w-full"
                      value={manual2.squat}
                      onChange={(e) => setManual2({ ...manual2, squat: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Bench (kg)"
                      className="input input-sm w-full"
                      value={manual2.bench}
                      onChange={(e) => setManual2({ ...manual2, bench: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Deadlift (kg)"
                      className="input input-sm w-full"
                      value={manual2.deadlift}
                      onChange={(e) => setManual2({ ...manual2, deadlift: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Bodyweight (kg)"
                      className="input input-sm w-full"
                      value={manual2.bodyweight}
                      onChange={(e) => setManual2({ ...manual2, bodyweight: e.target.value })}
                    />
                    <select
                      className="select select-sm w-full"
                      value={manual2.gender}
                      onChange={(e) => setManual2({ ...manual2, gender: e.target.value as 'male' | 'female' })}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleCompare}
              disabled={
                (isManualEntry1 ? !manual1.squat || !manual1.bench || !manual1.deadlift || !manual1.bodyweight : !athlete1Name) ||
                (isManualEntry2 ? !manual2.squat || !manual2.bench || !manual2.deadlift || !manual2.bodyweight : !athlete2Name)
              }
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
          (comparison || manualComparison) ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {(comparison || manualComparison) && (
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-2">
                {athlete1Data?.name || 'Manual Entry'} vs {athlete2Data?.name || 'Manual Entry'}
              </h2>
              <p className="text-sm opacity-70">Head-to-head comparison</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <>
                {/* comparison table */}
                <div className="card bg-base-100 shadow-lg mb-8">
                  <div className="card-body p-0">
                    <div className="overflow-x-auto">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="text-right w-1/3 text-sm md:text-lg font-bold">{getDisplayName(athlete1Data?.name)}</th>
                            <th className="text-center w-1/3"></th>
                            <th className="text-left w-1/3 text-sm md:text-lg font-bold">{getDisplayName(athlete2Data?.name)}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Squat */}
                          <tr className="hover">
                            <td className="text-right text-lg md:text-2xl font-bold whitespace-nowrap">
                              {athlete1Data?.bestSquat ? `${athlete1Data.bestSquat.value} kg` : '—'}
                            </td>
                            <td className="text-center font-semibold uppercase text-xs md:text-sm opacity-60">Squat</td>
                            <td className="text-left text-lg md:text-2xl font-bold whitespace-nowrap">
                              {athlete2Data?.bestSquat ? `${athlete2Data.bestSquat.value} kg` : '—'}
                            </td>
                          </tr>
                          
                          {/* Bench */}
                          <tr className="hover">
                            <td className="text-right text-lg md:text-2xl font-bold whitespace-nowrap">
                              {athlete1Data?.bestBench ? `${athlete1Data.bestBench.value} kg` : '—'}
                            </td>
                            <td className="text-center font-semibold uppercase text-xs md:text-sm opacity-60">Bench</td>
                            <td className="text-left text-lg md:text-2xl font-bold whitespace-nowrap">
                              {athlete2Data?.bestBench ? `${athlete2Data.bestBench.value} kg` : '—'}
                            </td>
                          </tr>
                          
                          {/* Deadlift */}
                          <tr className="hover">
                            <td className="text-right text-lg md:text-2xl font-bold whitespace-nowrap">
                              {athlete1Data?.bestDeadlift ? `${athlete1Data.bestDeadlift.value} kg` : '—'}
                            </td>
                            <td className="text-center font-semibold uppercase text-xs md:text-sm opacity-60">Deadlift</td>
                            <td className="text-left text-lg md:text-2xl font-bold whitespace-nowrap">
                              {athlete2Data?.bestDeadlift ? `${athlete2Data.bestDeadlift.value} kg` : '—'}
                            </td>
                          </tr>
                          
                          {/* Total */}
                          <tr className="hover bg-primary/10">
                            <td className="text-right text-xl md:text-3xl font-bold whitespace-nowrap">
                              {athlete1Data?.bestTotal ? `${athlete1Data.bestTotal.value} kg` : '—'}
                            </td>
                            <td className="text-center font-bold uppercase text-xs md:text-sm">Total</td>
                            <td className="text-left text-xl md:text-3xl font-bold whitespace-nowrap">
                              {athlete2Data?.bestTotal ? `${athlete2Data.bestTotal.value} kg` : '—'}
                            </td>
                          </tr>
                          
                          {/* Goodlift Points */}
                          {(athlete1Data?.bestGoodlift || athlete2Data?.bestGoodlift) && (
                            <tr className="hover">
                              <td className="text-right text-base md:text-xl font-bold whitespace-nowrap">
                                {athlete1Data?.bestGoodlift ? athlete1Data.bestGoodlift.toFixed(2) : '—'}
                              </td>
                              <td className="text-center font-semibold uppercase text-xs md:text-sm opacity-60">Goodlift</td>
                              <td className="text-left text-base md:text-xl font-bold whitespace-nowrap">
                                {athlete2Data?.bestGoodlift ? athlete2Data.bestGoodlift.toFixed(2) : '—'}
                              </td>
                            </tr>
                          )}
                          
                          {/* DOTS */}
                          {(athlete1Data?.bestDots || athlete2Data?.bestDots) && (
                            <tr className="hover">
                              <td className="text-right text-base md:text-xl font-bold whitespace-nowrap">
                                {athlete1Data?.bestDots ? athlete1Data.bestDots.toFixed(2) : '—'}
                              </td>
                              <td className="text-center font-semibold uppercase text-xs md:text-sm opacity-60">DOTS</td>
                              <td className="text-left text-base md:text-xl font-bold whitespace-nowrap">
                                {athlete2Data?.bestDots ? athlete2Data.bestDots.toFixed(2) : '—'}
                              </td>
                            </tr>
                          )}
                          
                          {/* Total Meets */}
                          <tr className="hover">
                            <td className="text-right text-sm md:text-lg">
                              {athlete1Data?.totalMeets || 0}
                            </td>
                            <td className="text-center font-semibold uppercase text-xs md:text-sm opacity-60">Total Meets</td>
                            <td className="text-left text-sm md:text-lg">
                              {athlete2Data?.totalMeets || 0}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Comparative Insights */}
                {athlete1Data && athlete2Data && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-center mb-6">Comparative Insights</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Strength Advantages */}
                      <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                          <h4 className="card-title text-lg mb-4">Strength Advantages</h4>
                          <div className="space-y-3">
                            {/* Squat comparison */}
                            {athlete1Data.bestSquat && athlete2Data.bestSquat && (
                              <div>
                                <p className="text-sm font-semibold">Squat</p>
                                {athlete1Data.bestSquat.value > athlete2Data.bestSquat.value ? (
                                  <p className="text-sm opacity-70">
                                    {athlete1Data.name} leads by <span className="font-bold text-primary">{(athlete1Data.bestSquat.value - athlete2Data.bestSquat.value).toFixed(1)} kg</span>
                                  </p>
                                ) : athlete2Data.bestSquat.value > athlete1Data.bestSquat.value ? (
                                  <p className="text-sm opacity-70">
                                    {athlete2Data.name} leads by <span className="font-bold text-primary">{(athlete2Data.bestSquat.value - athlete1Data.bestSquat.value).toFixed(1)} kg</span>
                                  </p>
                                ) : (
                                  <p className="text-sm opacity-70">Tied</p>
                                )}
                              </div>
                            )}

                            {/* Bench comparison */}
                            {athlete1Data.bestBench && athlete2Data.bestBench && (
                              <div>
                                <p className="text-sm font-semibold">Bench</p>
                                {athlete1Data.bestBench.value > athlete2Data.bestBench.value ? (
                                  <p className="text-sm opacity-70">
                                    {athlete1Data.name} leads by <span className="font-bold text-primary">{(athlete1Data.bestBench.value - athlete2Data.bestBench.value).toFixed(1)} kg</span>
                                  </p>
                                ) : athlete2Data.bestBench.value > athlete1Data.bestBench.value ? (
                                  <p className="text-sm opacity-70">
                                    {athlete2Data.name} leads by <span className="font-bold text-primary">{(athlete2Data.bestBench.value - athlete1Data.bestBench.value).toFixed(1)} kg</span>
                                  </p>
                                ) : (
                                  <p className="text-sm opacity-70">Tied</p>
                                )}
                              </div>
                            )}

                            {/* Deadlift comparison */}
                            {athlete1Data.bestDeadlift && athlete2Data.bestDeadlift && (
                              <div>
                                <p className="text-sm font-semibold">Deadlift</p>
                                {athlete1Data.bestDeadlift.value > athlete2Data.bestDeadlift.value ? (
                                  <p className="text-sm opacity-70">
                                    {athlete1Data.name} leads by <span className="font-bold text-primary">{(athlete1Data.bestDeadlift.value - athlete2Data.bestDeadlift.value).toFixed(1)} kg</span>
                                  </p>
                                ) : athlete2Data.bestDeadlift.value > athlete1Data.bestDeadlift.value ? (
                                  <p className="text-sm opacity-70">
                                    {athlete2Data.name} leads by <span className="font-bold text-primary">{(athlete2Data.bestDeadlift.value - athlete1Data.bestDeadlift.value).toFixed(1)} kg</span>
                                  </p>
                                ) : (
                                  <p className="text-sm opacity-70">Tied</p>
                                )}
                              </div>
                            )}

                            {/* Total comparison */}
                            {athlete1Data.bestTotal && athlete2Data.bestTotal && (
                              <div className="pt-2 border-t border-base-300">
                                <p className="text-sm font-semibold">Total</p>
                                {athlete1Data.bestTotal.value > athlete2Data.bestTotal.value ? (
                                  <p className="text-sm opacity-70">
                                    {athlete1Data.name} leads by <span className="font-bold text-primary">{(athlete1Data.bestTotal.value - athlete2Data.bestTotal.value).toFixed(1)} kg</span>
                                  </p>
                                ) : athlete2Data.bestTotal.value > athlete1Data.bestTotal.value ? (
                                  <p className="text-sm opacity-70">
                                    {athlete2Data.name} leads by <span className="font-bold text-primary">{(athlete2Data.bestTotal.value - athlete1Data.bestTotal.value).toFixed(1)} kg</span>
                                  </p>
                                ) : (
                                  <p className="text-sm opacity-70">Tied</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Experience & Performance */}
                      <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                          <h4 className="card-title text-lg mb-4">Experience & Performance</h4>
                          <div className="space-y-3">
                            {/* Total meets */}
                            <div>
                              <p className="text-sm font-semibold">Competition Experience</p>
                              {athlete1Data.totalMeets > athlete2Data.totalMeets ? (
                                <p className="text-sm opacity-70">
                                  {athlete1Data.name} has competed in <span className="font-bold text-primary">{athlete1Data.totalMeets - athlete2Data.totalMeets} more meets</span>
                                </p>
                              ) : athlete2Data.totalMeets > athlete1Data.totalMeets ? (
                                <p className="text-sm opacity-70">
                                  {athlete2Data.name} has competed in <span className="font-bold text-primary">{athlete2Data.totalMeets - athlete1Data.totalMeets} more meets</span>
                                </p>
                              ) : (
                                <p className="text-sm opacity-70">Equal competition experience ({athlete1Data.totalMeets} meets each)</p>
                              )}
                            </div>

                            {/* DOTS comparison */}
                            {athlete1Data.bestDots && athlete2Data.bestDots && (
                              <div>
                                <p className="text-sm font-semibold">Relative Strength (DOTS)</p>
                                {athlete1Data.bestDots > athlete2Data.bestDots ? (
                                  <p className="text-sm opacity-70">
                                    {athlete1Data.name} has higher relative strength ({athlete1Data.bestDots.toFixed(1)} vs {athlete2Data.bestDots.toFixed(1)})
                                  </p>
                                ) : athlete2Data.bestDots > athlete1Data.bestDots ? (
                                  <p className="text-sm opacity-70">
                                    {athlete2Data.name} has higher relative strength ({athlete2Data.bestDots.toFixed(1)} vs {athlete1Data.bestDots.toFixed(1)})
                                  </p>
                                ) : (
                                  <p className="text-sm opacity-70">Equal relative strength</p>
                                )}
                              </div>
                            )}
                            {/* STRONGEST LIFT DOESNT REALLY MAKE SENSE - MOSTLY ALWAYS GONNA BE DEADLIFTS */}
                            {/* Lift balance
                            {athlete1Data.bestSquat && athlete1Data.bestBench && athlete1Data.bestDeadlift && 
                             athlete2Data.bestSquat && athlete2Data.bestBench && athlete2Data.bestDeadlift && (
                              <div>
                                <p className="text-sm font-semibold">Strongest Lift</p>
                                <div className="text-sm opacity-70">
                                  <p>{athlete1Data.name}: {
                                    athlete1Data.bestSquat.value > athlete1Data.bestBench.value && athlete1Data.bestSquat.value > athlete1Data.bestDeadlift.value ? 'Squat' :
                                    athlete1Data.bestDeadlift.value > athlete1Data.bestBench.value ? 'Deadlift' : 'Bench'
                                  }</p>
                                  <p>{athlete2Data.name}: {
                                    athlete2Data.bestSquat.value > athlete2Data.bestBench.value && athlete2Data.bestSquat.value > athlete2Data.bestDeadlift.value ? 'Squat' :
                                    athlete2Data.bestDeadlift.value > athlete2Data.bestBench.value ? 'Deadlift' : 'Bench'
                                  }</p>
                                </div>
                              </div>
                            )} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
