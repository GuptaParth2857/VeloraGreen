export default function CalculatorLoading() {
  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="text-center">
        <div
          className="w-12 h-12 mx-auto mb-4 rounded-sm animate-spin"
          style={{
            border: '2px solid rgba(6,182,212,0.15)',
            borderTopColor: '#06b6d4',
            background: 'rgba(3,7,18,0.3)',
          }}
        />
        <p
          className="text-[10px] tracking-[0.4em] text-cyan-400/60 uppercase"
          style={{ fontFamily: 'Orbitron, monospace' }}
        >
          Loading Calculator...
        </p>
      </div>
    </div>
  );
}
