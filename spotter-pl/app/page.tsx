'use client';

import { useState } from "react";
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



export default function Home() {
  const [federation, setFederation] = useState(
    federationTopOptions[0]?.value ?? "all"
  );
  const [country, setCountry] = useState("International");
  const [weightClass, setWeightClass] = useState("All classes");
  const [ageDivision, setAgeDivision] = useState("All Divisions");
  const [tested, setTested] = useState<string | null>(null);
  const [equipment, setEquipment] = useState("all");

  return (
    <div className="min-h-dvh bg-base-100 text-base-content">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-30">
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
              {countries.map((fed) => (
                <option key={fed}>{fed}</option>
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
            <select className="select select-bordered w-full outline-none focus:outline-none focus:ring-0">
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

        <button type="button" className="btn btn-primary w-full sm:w-auto">
              Spot me!
        </button>


        <section className="card bg-base-200">
          <div className="card-body text-sm">
            <h3 className="card-title">Results area placeholder</h3>
            <p>info placeholder</p>
          </div>
        </section>
      </main>
    </div>
  );
}
