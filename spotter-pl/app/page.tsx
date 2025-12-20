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
            </div>

            {/* placeholder for actual results/visualizations */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title">Best Lifts</h3>
                  <p className="text-sm opacity-60">Squat, Bench, Deadlift PRs will appear here</p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title">Rankings</h3>
                  <p className="text-sm opacity-60">Position in division/weight class</p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title">Comparison</h3>
                  <p className="text-sm opacity-60">Compare with other lifters</p>
                </div>
              </div>
            </div>

            <div className="mt-8 card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title">Competition History</h3>
                <p className="text-sm opacity-60">Timeline of meets and progression will appear here</p>
              </div>
            </div>

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
