export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}
