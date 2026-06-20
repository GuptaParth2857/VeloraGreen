export default function BadgesLoading() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="h-8 w-48 bg-white/5 rounded-sm mb-8 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-40 bg-white/5 rounded-sm animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
