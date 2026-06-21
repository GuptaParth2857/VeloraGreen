export default function RecommendationsLoading() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="w-48 h-6 bg-white/5 rounded-full animate-pulse mb-4" />
        <div className="w-72 h-12 bg-white/5 rounded-xl animate-pulse mb-8" />
        <div className="w-full h-32 bg-white/5 rounded-2xl animate-pulse mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-full h-28 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
