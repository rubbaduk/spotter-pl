import LifterDropdown from '@/app/components/LifterDropdown' 

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

const weightClasses = ["All classes", "52 kg", "57 kg", "63 kg", "74 kg", "83 kg", "93 kg", "105 kg"];
const ageDivisions = {
  all: ["All Ages"],
  youth: ["Youth 5-12", "Teen 13-15", "Teen 16-17", "Teen 18-19"],
  adult: ["Juniors 20-23", "Seniors 24-34", "Submasters 35-39"],
  mastersByFives: ["Masters 40-44", "Masters 45-49", "Masters 50-54", "Masters 55-59", "Masters 60-64", "Masters 65-69", "Masters 70-74", "Masters 75-79", "Masters 80-84", "Masters 85-89"],
  mastersByTens: ["Masters 40-49", "Masters 50-59", "Masters 60-69", "Masters 70-79", "Masters 80+"]
};

const liftCategories = {
  lifts: ["Total", "Squat", "Bench", "Deadlift"],
  points: ["GL Points", "Dots", "Glossbrenner", "McCulloch", "Wilks"]
};

export default function Home() {
  return (
    <div className="min-h-dvh bg-base-100 text-base-content">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-30">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 min-h-28 sm:min-h-0">
          <h1 className="text-4xl font-extrabold sm:text-5xl whitespace-nowrap">
            Let's spot
          </h1>
          <div className="form-control flex-1 h-12 mt-2">
            <LifterDropdown />
            {/* <input
              id="u"
              name="user"
              type="text"
              placeholder=""
              className="w-full ml-1.4 sm:ml-0 outline-none focus:outline-none focus:ring-0 border-0 focus:border-0 text-4xl sm:text-5xl font-extrabold bg-transparent h-full leading-none overflow-hidden whitespace-nowrap"
            /> */}
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
              defaultValue={federationTopOptions[0]?.value ?? "all"}
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
            <select className="select select-bordered w-full outline-none focus:outline-none focus:ring-0">
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
            <select className="select select-bordered w-full outline-none focus:outline-none focus:ring-0">
              {weightClasses.map((klass) => (
                <option key={klass}>{klass}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text uppercase text-xs font-semibold tracking-wider">
                Age division
              </span>
            </label>
            <select className="select select-bordered w-full outline-none focus:outline-none focus:ring-0">
              {ageDivisions.all.map((division) => (
                <option key={division}>{division}</option>
              ))}
              {ageDivisions.youth.map((division) => (
                <option key={division}>{division}</option>
              ))}
              {ageDivisions.adult.map((division) => (
                <option key={division}>{division}</option>
              ))}
              <optgroup label="Masters by 5s">
                {ageDivisions.mastersByFives.map((division) => (
                  <option key={division}>{division}</option>
                ))}
              </optgroup>
              <optgroup label="Masters by 10s">
                {ageDivisions.mastersByTens.map((division) => (
                  <option key={division}>{division}</option>
                ))}
              </optgroup>
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
