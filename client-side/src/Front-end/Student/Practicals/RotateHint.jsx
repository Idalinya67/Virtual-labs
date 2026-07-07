export default function RotateHint({ children }) {
  return (
    <div className="rotate-hint items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg p-3 mb-4 w-full max-w-3xl">
      <span className="text-xl">📱↻</span>
      <span>{children || 'Rotate your device to landscape for the best experience with this practical.'}</span>
    </div>
  )
}
