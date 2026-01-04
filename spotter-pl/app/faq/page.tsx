'use client';

import Navigation from "@/app/components/Navigation";

export default function FaqPage() {
  return (
    <div className="min-h-dvh bg-base-100 text-base-content">
      <Navigation />
      <main className="max-w-4xl mx-auto px-6 py-24">
        <div className="space-y-12">
          {/* FAQ */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="card bg-[#1C1C1C] shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-2">How does 'Spot Me' work?</h3>
                  <p className="opacity-80">
                    The 'Spot Me' feature works by grabbing the athlete's best total of all time.
                    <br></br>
                    
                    Federations and divisions are selected through the athlete's <a className="font-bold">most recent competition</a>
                    , 
                    <br></br>
                    hence initial pre-selected filters may be inaccurate to the athlete's main division.
                    <br></br>
                    <br></br>
                    Current rankings are based off athletes that have competed within the current year.
                    <br></br>
                    If there is no competition data for the current year, rankings will resort to the previous year.
                    <br></br>
                    <br></br>
                    If athletes are ranked based off total, equal totals will be tie-broken based off Dots
                  </p>
                </div>
              </div>
              <div className="card bg-[#1C1C1C] shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-2">Where does the data come from?</h3>
                  <p className="opacity-80">
                    Athlete data is extracted directly from
                    <a className="font-bold"href="https://openpowerlifting.gitlab.io/opl-csv/bulk-csv.html"
                    target="_blank"
                    rel="noopener noreferrer"> OpenPowerlifting's Data Service </a>
                    - updated weekly.
                    <br></br>
                    Note: OpenPowerlifting's site and their bulk data export may not update at the same moment.
                  </p>
                </div>
              </div>
              <div className="card bg-[#1C1C1C] shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-2">Why don't my rankings match OpenPowerlifting?</h3>
                  <p className="opacity-80">
                    SpotterPL extracts ALL athletes that contain necessary information.
                    OpenPowerlifting may exclude some athletes from rankings/competition lists due to legitimate reasons, or due to data/update issues.
                    <br></br>
                    <br></br>
                    Note: We're aware of cases where athlete data doesn't match up. The way we query data differs from how OpenPowerlifting
                    does and we're continuously trying to work on it.
                    <br></br>
                    <br></br>
                    Sometimes athletes don't have assigned age divisions, or 
                    regional/world competitions aren't included in federation/country rankings, etc. If you find a case yourself, 
                    feel free to let us know through Github or Email below.
                    <br></br>
                    <br></br>
                    Use these rankings as a reference only. For qualification or eligibility, always refer to your federation's official platform.
                  </p>
                </div>
              </div>
              <div className="card bg-[#1C1C1C] shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-2">How are point systems calculated?</h3>
                  <p className="opacity-80">
                    Point system calculations (Dots, Goodlift, etc.) can be found on
                    <a className="font-bold" href="https://openpowerlifting.gitlab.io/opl-csv/bulk-csv-docs.html#dots"
                    target="_blank"
                    rel="noopener noreferrer"> OpenPowerlifting's Data Service Documentation </a>
                  </p>
                </div>
              </div>
              <div className="card bg-[#1C1C1C] shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-2">Who runs this site?</h3>
                  <p className="opacity-80">
                    Currently, just a solo powerlifter/developer.

                    <br></br>
                    Note: This project is separate from the OpenPowerlifting team. We just use their data :)
                    <br></br>
                    However if you'd like to get involved, feel free to submit an
                    <a className="font-bold" href="https://github.com/rubbaduk/spotter-pl"
                    target="_blank"
                    rel="noopener noreferrer"> issue or pull request on Github!</a>
                  </p>
                </div>
              </div>
              <div className="card bg-[#1C1C1C] shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-2">Can I request corrections to athlete data?</h3>
                  <p className="opacity-80">
                    All athlete data is derived straight from OpenPowerlifting.
                    <br></br>
                    For corrections and other inquiries related to athlete/competition data, please refer to
                    <a className="font-bold" href="https://www.openpowerlifting.org/faq"
                    target="_blank"
                    rel="noopener noreferrer"> their FAQ</a>
                  </p>
                </div>
              </div>
              <div className="card bg-[#1C1C1C] shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-2 italic">____ feature isn't working... You should implement ____, etc.</h3>
                  <div className="opacity-80 space-y-4">
                    <p>For inquiries or suggestions, please reach out to:</p>
                    <a
                      href="mailto:spotterpowerlifting@gmail.com"
                      className="font-bold tracking-wide text-primary-content rounded-xl py-2"
                    >
                      spotterpowerlifting@gmail.com
                    </a>
                    <div className="flex gap-4 mt-5">

                      <a
                        href="https://github.com/rubbaduk/spotter-pl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        View on GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}