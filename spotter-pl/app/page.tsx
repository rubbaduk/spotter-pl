'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LifterDropWrapper from "@/app/components/LifterDropWrapper";

import {
  federationGroups,
  federationTopOptions,
} from "@/data/federations";

// IMPORT OPTIONS FROM OPENPL - CSV OR MANUALLY ENTER
// - store all new instances from csv into object

const countries = [
  "International","USA", "UK", "Algeria", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Belarus", "Belgium",
  "Belize", "Bolivia", "Bosnia and Herzegovina", "Brazil", "Brunei", "Bulgaria", "Canada", "Chile", "China", "Colombia",
  "Costa Rica", "Croatia", "Cyprus", "Czechia", "Denmark", "Dominican Republic", "Ecuador", "Egypt", "Estonia", "Finland",
  "France", "Georgia", "Germany", "Greece", "Guatemala", "Guyana", "Honduras", "Hong Kong", "Hungary", "Iceland",
  "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Kazakhstan",
  "Kuwait", "Kyrgyzstan", "Latvia", "Lebanon", "Libya", "Lithuania", "Luxembourg", "Malaysia", "Malta", "Mexico",
  "Moldova", "Mongolia", "Morocco", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niue", "Norway",
  "Oman", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Saudi Arabia", "Serbia", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka",
  "Sweden", "Switzerland", "Syria", "Taiwan", "Trinidad and Tobago", "Thailand", "Türkiye", "UAE", "Uganda", "Ukraine",
  "Uruguay", "US Virgin Islands", "Venezuela", "Vietnam"
];

const weightClasses = [
  "All classes",
  // women's classes
  "43 kg", "44 kg", "47 kg", "48 kg", "52 kg", "56 kg", "57 kg", "60 kg", "63 kg", "67.5 kg", "72 kg", "75 kg", "82.5 kg", "84 kg", "84+ kg", "90 kg", "90+ kg",
  // men's classes  
  "53 kg", "59 kg", "66 kg", "74 kg", "83 kg", "93 kg", "100 kg", "105 kg", "110 kg", "120 kg", "120+ kg", "125 kg", "140 kg", "140+ kg",
];
const divisions = [
  "All Divisions",
  "Open",
  "Junior",
  "Sub-Junior",
  "Masters 1",
  "Masters 2",
  "Masters 3",
  "Masters 4",
  "Special Olympics"
];

const liftCategories = {
  lifts: ["Total", "Squat", "Bench", "Deadlift"],
  points: ["GL Points", "Dots", "Glossbrenner", "McCulloch", "Wilks"]
};

// type for committed results state
type ResultsState = {
  lifterName: string;
  federation: string;
  country: string;
  weightClass: string;
  division: string;
  equipment: string;
  liftCategory: string;
};

// type for athlete bests data
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
  recentCompetitions: Array<{
    date: string;
    meetName: string;
    federation: string;
    equipment: string;
    weightClass: string;
    division: string;
    bodyweight: string;
    squat: string;
    bench: string;
    deadlift: string;
    total: string;
    dots: string;
  }>;
};

type AthleteRanking = {
  name: string;
  currentRank: number | null;
  allTimeRank: number | null;
  totalCurrent: number;
  totalAllTime: number;
  liftCategory: string;
  athleteBest: number;
  isPoints?: boolean;
};

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultsRef = useRef<HTMLElement>(null);

  // form state - before clicking 'Spot me!'
  const [lifterName, setLifterName] = useState("");
  const [federation, setFederation] = useState(federationTopOptions[0]?.value ?? "all");
  const [country, setCountry] = useState("International");
  const [weightClass, setWeightClass] = useState("All classes");
  const [ageDivision, setAgeDivision] = useState("All Divisions");
  const [tested, setTested] = useState<string | null>(null);
  const [equipment, setEquipment] = useState("all");
  const [liftCategory, setLiftCategory] = useState("Total");

  // results state - only loads when 'Spot me!' is clicked
  const [results, setResults] = useState<ResultsState | null>(null);
  
  // athlete data state
  const [athleteData, setAthleteData] = useState<AthleteBests | null>(null);
  const [rankingData, setRankingData] = useState<AthleteRanking | null>(null);
  const [loading, setLoading] = useState(false);

  // fetch athlete data when results change
  useEffect(() => {
    if (!results?.lifterName) {
      setAthleteData(null);
      setRankingData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('name', results.lifterName);
        if (results.federation !== 'all') params.set('federation', results.federation);
        if (results.equipment !== 'all') params.set('equipment', results.equipment);
        if (results.weightClass !== 'All classes') params.set('weightClass', results.weightClass);
        if (results.division !== 'All Divisions') params.set('division', results.division);
        params.set('lift', results.liftCategory);

        // fetch both bests and ranking in parallel
        const [bestsRes, rankingRes] = await Promise.all([
          fetch(`/api/athlete-bests?${params}`),
          fetch(`/api/athlete-ranking?${params}`),
        ]);

        if (bestsRes.ok) {
          const data = await bestsRes.json();
          setAthleteData(data);
        }

        if (rankingRes.ok) {
          const ranking = await rankingRes.json();
          setRankingData(ranking);
        }
      } catch (error) {
        console.error('Failed to fetch athlete data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [results]);

  // url parameters load
  useEffect(() => {
    const name = searchParams.get('name');
    const fed = searchParams.get('federation');
    const ctry = searchParams.get('country');
    const wc = searchParams.get('weightClass');
    const div = searchParams.get('division');
    const eq = searchParams.get('equipment');
    const lift = searchParams.get('lift');

    // set form state
    if (name) setLifterName(name);
    if (fed) setFederation(fed);
    if (ctry) setCountry(ctry);
    if (wc) setWeightClass(wc);
    if (div) setAgeDivision(div);
    if (eq) setEquipment(eq);
    if (lift) setLiftCategory(lift);

    // if we have URL params, commit to results state and scroll
    if (name || fed || ctry || wc || div) {
      setResults({
        lifterName: name || "",
        federation: fed || "all",
        country: ctry || "International",
        weightClass: wc || "All classes",
        division: div || "All Divisions",
        equipment: eq || "all",
        liftCategory: lift || "Total",
      });
      // delay scroll to allow render
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [searchParams]);

  // clicking "Spot me!" 
  const handleSpotMe = () => {
    // build URL params
    const params = new URLSearchParams();
    if (lifterName) params.set('name', lifterName);
    if (federation && federation !== 'all') params.set('federation', federation);
    if (country && country !== 'International') params.set('country', country);
    if (weightClass && weightClass !== 'All classes') params.set('weightClass', weightClass);
    if (ageDivision && ageDivision !== 'All Divisions') params.set('division', ageDivision);
    if (equipment && equipment !== 'all') params.set('equipment', equipment);
    if (liftCategory && liftCategory !== 'Total') params.set('lift', liftCategory);

    // update URL without full reload
    const newUrl = params.toString() ? `?${params.toString()}` : '/';
    router.push(newUrl, { scroll: false });

    // commit current form state to results state
    setResults({
      lifterName,
      federation,
      country,
      weightClass,
      division: ageDivision,
      equipment,
      liftCategory,
    });

    // scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="min-h-dvh bg-base-100 text-base-content">
      {/* search section - full viewport height */}
      <main className="min-h-dvh mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-30">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 min-h-28 sm:min-h-0">
          <h1 className="text-4xl font-bold sm:text-5xl whitespace-nowrap">
            Let's spot
          </h1>
          <div className="form-control flex-1 h-12 mt-2">
            <LifterDropWrapper
              setFederation={setFederation}
              setCountry={setCountry}
              setWeightClass={setWeightClass}
              setAgeDivision={setAgeDivision}
              setTested={setTested}
              setEquipment={setEquipment}
              setLifterName={setLifterName}
            />
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text uppercase text-xs font-semibold tracking-wider">
                Federation
              </span>
            </label>
            <select
              className="select select-bordered w-full outline-none focus:outline-none focus:ring-0"
              value={federation}
              onChange={(e) => setFederation(e.target.value)}
            >
              {federationTopOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              {federationGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text uppercase text-xs font-semibold tracking-wider">
                Country
              </span>
            </label>
            <select
              className="select select-bordered w-full outline-none focus:outline-none focus:ring-0"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {countries.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text uppercase text-xs font-semibold tracking-wider">
                Weight class
              </span>
            </label>
            <select
              className="select select-bordered w-full outline-none focus:outline-none focus:ring-0"
              value={weightClass}
              onChange={(e) => setWeightClass(e.target.value)}
            >
              {weightClasses.map((klass) => (
                <option key={klass}>{klass}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text uppercase text-xs font-semibold tracking-wider">
                Division
              </span>
            </label>
            <select
              className="select select-bordered w-full outline-none focus:outline-none focus:ring-0"
              value={ageDivision}
              onChange={(e) => setAgeDivision(e.target.value)}
            >
              {divisions.map((division) => (
                <option key={division}>{division}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text uppercase text-xs font-semibold tracking-wider">
                Lift / Points
              </span>
            </label>
            <select 
              className="select select-bordered w-full outline-none focus:outline-none focus:ring-0"
              value={liftCategory}
              onChange={(e) => setLiftCategory(e.target.value)}
            >
              <optgroup label="Lift">
                {liftCategories.lifts.map((lift) => (
                  <option key={lift}>{lift}</option>
                ))}
              </optgroup>
              <optgroup label="Points">
                {liftCategories.points.map((point) => (
                  <option key={point}>{point}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        <button 
          type="button" 
          className="btn btn-primary w-full sm:w-auto"
          onClick={handleSpotMe}
          disabled={!lifterName.trim()}
        >
          Spot me!
        </button>
      </main>

      {/* results section */}
      <section 
        ref={resultsRef}
        className={`min-h-dvh bg-base-200 transition-opacity duration-500 ${
          results ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {results && (
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {results.lifterName ? `Results for ${results.lifterName}` : 'Rankings'}
              </h2>
              <p className="text-sm opacity-70">
                {[
                  results.federation !== 'all' && results.federation?.toUpperCase(),
                  results.country !== 'International' && results.country,
                  results.weightClass !== 'All classes' && results.weightClass,
                  results.division !== 'All Divisions' && results.division,
                  results.equipment !== "all" &&
                    (results.equipment?.charAt(0).toUpperCase() + results.equipment?.slice(1)),
                  results.liftCategory,
                ].filter(Boolean).join(' • ')}
              </p>
              {athleteData && (
                <p className="text-xs opacity-50 mt-1">
                  {athleteData.totalMeets} competition{athleteData.totalMeets !== 1 ? 's' : ''} on record
                </p>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <>
                {/* best lifts */}
                <div className="grid gap-4 md:grid-cols-4 mb-8">
                  {/* squat */}
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body p-5">
                      <h3 className="text-xs uppercase tracking-wider opacity-60 font-semibold">Squat</h3>
                      {athleteData?.bestSquat ? (
                        <>
                          <p className="text-3xl font-bold">{athleteData.bestSquat.value} kg</p>
                          <p className="text-xs opacity-50">{athleteData.bestSquat.date}</p>
                        </>
                      ) : (
                        <p className="text-lg opacity-40">—</p>
                      )}
                    </div>
                  </div>

                  {/* bench */}
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body p-5">
                      <h3 className="text-xs uppercase tracking-wider opacity-60 font-semibold">Bench</h3>
                      {athleteData?.bestBench ? (
                        <>
                          <p className="text-3xl font-bold">{athleteData.bestBench.value} kg</p>
                          <p className="text-xs opacity-50">{athleteData.bestBench.date}</p>
                        </>
                      ) : (
                        <p className="text-lg opacity-40">—</p>
                      )}
                    </div>
                  </div>

                  {/* deadlift */}
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body p-5">
                      <h3 className="text-xs uppercase tracking-wider opacity-60 font-semibold">Deadlift</h3>
                      {athleteData?.bestDeadlift ? (
                        <>
                          <p className="text-3xl font-bold">{athleteData.bestDeadlift.value} kg</p>
                          <p className="text-xs opacity-50">{athleteData.bestDeadlift.date}</p>
                        </>
                      ) : (
                        <p className="text-lg opacity-40">—</p>
                      )}
                    </div>
                  </div>

                  {/* total */}
                  <div className="card bg-primary text-primary-content shadow-lg">
                    <div className="card-body p-5">
                      <h3 className="text-xs uppercase tracking-wider opacity-80 font-semibold">Total</h3>
                      {athleteData?.bestTotal ? (
                        <>
                          <p className="text-3xl font-bold">{athleteData.bestTotal.value} kg</p>
                          <p className="text-xs opacity-70">{athleteData.bestTotal.date}</p>
                        </>
                      ) : (
                        <p className="text-lg opacity-40">—</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* points */}
                {(athleteData?.bestGoodlift || athleteData?.bestDots) && (
                  <div className="grid gap-4 md:grid-cols-2 mb-8">
                    {athleteData.bestGoodlift && (
                      <div className="card bg-base-100 shadow-lg">
                        <div className="card-body p-5">
                          <h3 className="text-xs uppercase tracking-wider opacity-60 font-semibold">Best Goodlift</h3>
                          <p className="text-2xl font-bold">{athleteData.bestGoodlift.toFixed(2)}</p>
                        </div>
                      </div>
                    )}
                    {athleteData.bestDots && (
                      <div className="card bg-base-100 shadow-lg">
                        <div className="card-body p-5">
                          <h3 className="text-xs uppercase tracking-wider opacity-60 font-semibold">Best Dots</h3>
                          <p className="text-2xl font-bold">{athleteData.bestDots.toFixed(2)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ranking and comparison blocks */}
                {rankingData && (
                  <div className="grid gap-6 md:grid-cols-2 mb-8">
                    {/* current rankings */}
                    <div className="card bg-base-100 shadow-lg">
                      <div className="card-body">
                        <h3 className="card-title text-lg">Current Rankings</h3>
                        {rankingData.currentRank ? (
                          <div className="space-y-2">
                            <p className="text-3xl font-bold">
                              {rankingData.currentRank}
                              <span className="text-lg font-normal opacity-60">
                                {rankingData.currentRank === 1 ? 'st' : 
                                 rankingData.currentRank === 2 ? 'nd' : 
                                 rankingData.currentRank === 3 ? 'rd' : 'th'}
                              </span>
                            </p>
                            <p className="text-sm opacity-70">
                              out of {rankingData.totalCurrent} lifters
                            </p>
                            <p className="text-xs opacity-50 mt-2">
                              {results.weightClass !== 'All classes' && results.weightClass} 
                              {results.division !== 'All Divisions' && ` • ${results.division}`}
                              {results.federation !== 'all' && ` • ${results.federation.toUpperCase()}`}
                            </p>
                            <p className="text-xs opacity-50">
                              Best {results.liftCategory}: {rankingData.athleteBest.toFixed(2)}{rankingData.isPoints ? ' pts' : ' kg'}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm opacity-60">No current rankings available</p>
                        )}
                      </div>
                    </div>

                    {/* all-time rankings */}
                    <div className="card bg-base-100 shadow-lg">
                      <div className="card-body">
                        <h3 className="card-title text-lg">All-Time Rankings</h3>
                        {rankingData.allTimeRank ? (
                          <div className="space-y-2">
                            <p className="text-3xl font-bold">
                              {rankingData.allTimeRank}
                              <span className="text-lg font-normal opacity-60">
                                {rankingData.allTimeRank === 1 ? 'st' : 
                                 rankingData.allTimeRank === 2 ? 'nd' : 
                                 rankingData.allTimeRank === 3 ? 'rd' : 'th'}
                              </span>
                            </p>
                            <p className="text-sm opacity-70">
                              out of {rankingData.totalAllTime} lifters
                            </p>
                            <p className="text-xs opacity-50 mt-2">
                              {results.weightClass !== 'All classes' && results.weightClass} 
                              {results.division !== 'All Divisions' && ` • ${results.division}`}
                              {results.federation !== 'all' && ` • ${results.federation.toUpperCase()}`}
                            </p>
                            <p className="text-xs opacity-50">
                              Best {results.liftCategory}: {rankingData.athleteBest.toFixed(2)}{rankingData.isPoints ? ' pts' : ' kg'}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm opacity-60">No all-time rankings available</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* recent competitions */}
                {athleteData?.recentCompetitions && athleteData.recentCompetitions.length > 0 && (
                  <div className="card bg-base-100 shadow-lg mb-8">
                    <div className="card-body">
                      <h3 className="card-title text-lg">Recent Competitions</h3>
                      <div className="overflow-x-auto">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Meet</th>
                              <th>Division</th>
                              <th className="text-right">SQ</th>
                              <th className="text-right">BP</th>
                              <th className="text-right">DL</th>
                              <th className="text-right">Total</th>
                              <th className="text-right">Dots</th>
                            </tr>
                          </thead>
                          <tbody>
                            {athleteData.recentCompetitions.map((comp, idx) => (
                              <tr key={idx}>
                                <td className="whitespace-nowrap">{comp.date}</td>
                                <td className="max-w-48 truncate" title={comp.meetName}>{comp.meetName}</td>
                                <td>{comp.division || '—'}</td>
                                <td className="text-right">{comp.squat || '—'}</td>
                                <td className="text-right">{comp.bench || '—'}</td>
                                <td className="text-right">{comp.deadlift || '—'}</td>
                                <td className="text-right font-semibold">{comp.total || '—'}</td>
                                <td className="text-right">{comp.dots ? parseFloat(comp.dots).toFixed(1) : '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* placeholder cards */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                      <h3 className="card-title">Rankings</h3>
                      <p className="text-sm opacity-60">Position in division/weight class coming soon</p>
                    </div>
                  </div>

                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                      <h3 className="card-title">Comparison</h3>
                      <p className="text-sm opacity-60">Compare with other lifters coming soon</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* share button */}
            <div className="mt-8 flex gap-4">
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
              >
                Share this view
              </button>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                ↑ Back to search
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
