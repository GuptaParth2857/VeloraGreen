export default function LeaderboardLoading() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="h-8 w-48 bg-white/5 rounded-sm mb-8 animate-pulse" />
        <div className="h-24 bg-white/5 rounded-sm mb-6 animate-pulse" />
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 bg-white/5 rounded-sm mb-2 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
