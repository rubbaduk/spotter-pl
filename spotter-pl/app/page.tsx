
// IMPORT OPTIONS FROM OPENPL - CSV OR MANUALLY ENTER
// - store all new instances from csv into object
const federations = ["Any federation", "IPF", "USAPL", "USPA", "WRPF"];
const weightClasses = ["Any class", "52 kg", "57 kg", "63 kg", "74 kg", "83 kg", "93 kg", "105 kg"];
const ageDivisions = ["Any age", "Teen", "Junior", "Open", "Masters 1", "Masters 2"];
const focusAreas = ["Totals", "Squat", "Bench", "Deadlift"];

export default function Home() {
  return (
    <div className="min-h-dvh bg-base-100 text-base-content">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-semibold sm:text-5xl whitespace-nowrap">
            Let's Spot
          </h1>
          <div className="form-control flex-1">
            <input
              id="u"
              name="user"
              type="text"
              placeholder=""
              className="input w-full outline-none focus:outline-none focus:ring-0 border-0 focus:border-0 text-4xl sm:text-5xl font-semibold "
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="form-control">
            <label className="label">
              <span className="label-text uppercase text-xs font-semibold tracking-wider">
                Federation (optional)
              </span>
            </label>
            <select className="select select-bordered w-full">
              {federations.map((fed) => (
                <option key={fed}>{fed}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text uppercase text-xs font-semibold tracking-wider">
                Weight class (optional)
              </span>
            </label>
            <select className="select select-bordered w-full">
              {weightClasses.map((klass) => (
                <option key={klass}>{klass}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text uppercase text-xs font-semibold tracking-wider">
                Age division (optional)
              </span>
            </label>
            <select className="select select-bordered w-full">
              {ageDivisions.map((division) => (
                <option key={division}>{division}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text uppercase text-xs font-semibold tracking-wider">
                Lift (optional)
              </span>
            </label>
            <select className="select select-bordered w-full">
              {focusAreas.map((area) => (
                <option key={area}>{area}</option>
              ))}
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
