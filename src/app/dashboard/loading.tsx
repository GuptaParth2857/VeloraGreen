export default function DashboardLoading() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="h-8 w-48 bg-white/5 rounded-sm mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white/5 rounded-sm animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-white/5 rounded-sm animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="h-48 bg-white/5 rounded-sm animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
