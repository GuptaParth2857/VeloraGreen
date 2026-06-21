export default function DashboardLoading() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="w-48 h-8 bg-white/5 rounded-full animate-pulse mb-4" />
        <div className="w-72 h-12 bg-white/5 rounded-xl animate-pulse mb-8" />
        <div className="space-y-8">
          <div className="w-full h-[300px] bg-white/5 rounded-2xl animate-pulse" />
          <div className="w-full h-[400px] bg-white/5 rounded-2xl animate-pulse" />
          <div className="w-full h-[200px] bg-white/5 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
