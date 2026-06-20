export default function ChallengesLoading() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="h-8 w-56 bg-white/5 rounded-sm mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 bg-white/5 rounded-sm animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
