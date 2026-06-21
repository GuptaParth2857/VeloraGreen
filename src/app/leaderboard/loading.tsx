export default function LeaderboardLoading() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="w-48 h-6 bg-white/5 rounded-full animate-pulse mb-4" />
        <div className="w-72 h-12 bg-white/5 rounded-xl animate-pulse mb-8" />
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
