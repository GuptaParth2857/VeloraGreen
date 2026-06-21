export default function CalculatorLoading() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="w-32 h-6 bg-white/5 rounded-full animate-pulse mb-4" />
            <div className="w-64 h-12 bg-white/5 rounded-xl animate-pulse mb-6" />
            <div className="w-full h-24 bg-white/5 rounded-xl animate-pulse mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-full h-5 bg-white/5 rounded animate-pulse" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="w-full h-[500px] bg-white/5 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
