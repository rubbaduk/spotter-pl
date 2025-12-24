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
                    Use these rankings as a reference only. For qualification or eligibility, always defer to your federation's official platform.
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
                    For corrections and other inquiries related to athlete data, please refer to
                    <a className="font-bold" href="https://www.openpowerlifting.org/faq"
                    target="_blank"
                    rel="noopener noreferrer"> their FAQ</a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <p className="text-lg opacity-80 mb-4">
                  Have questions, feedback, or found an error? We'd love to hear from you!
                </p>
                <div className="space-y-2">
                  <p className="opacity-80">
                    <strong>Email:</strong> [your-contact@email.com]
                  </p>
                  <p className="opacity-80">
                    <strong>Twitter:</strong> [@your-twitter-handle]
                  </p>
                  <p className="opacity-80">
                    <strong>GitHub:</strong> [github.com/your-repo]
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}