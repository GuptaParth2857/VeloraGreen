export default function BadgesLoading() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="w-48 h-6 bg-white/5 rounded-full animate-pulse mb-4" />
        <div className="w-72 h-12 bg-white/5 rounded-xl animate-pulse mb-8" />
        <div className="w-full h-24 bg-white/5 rounded-2xl animate-pulse mb-8" />
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
