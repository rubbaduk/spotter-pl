type AthletePageProps = {
  params: {
    userId: string;
  };
};

export default function AthletePage({ params }: AthletePageProps) {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">
            Athlete Overview
          </p>
          <h1 className="text-4xl font-semibold">
            Profile shell for <span className="text-emerald-300">{params.userId}</span>
          </h1>
          <p className="text-slate-300">
            This route will eventually summarize season bests, competition
            history, and single-lift trends once data is connected.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Snapshot</h2>
            <p className="mt-2 text-sm text-slate-400">
              Reserve space for bodyweight class, division, equipment, and
              federation tags.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Best lifts</h2>
            <p className="mt-2 text-sm text-slate-400">
              Placeholder cards for squat, bench, deadlift, and total PRs.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Competition timeline</h2>
          <p className="mt-2 text-sm text-slate-400">
            Timeline/table of meets will render here, grouped by season with
            quick links into specific meet breakdowns.
          </p>
        </div>
      </div>
    </div>
  );
}
