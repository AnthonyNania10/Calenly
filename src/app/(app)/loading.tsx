export default function AppLoading() {
  return (
    <div className="space-y-6" aria-label="Loading workspace">
      <div className="h-28 animate-pulse rounded-3xl bg-muted" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="h-80 animate-pulse rounded-2xl bg-muted lg:col-span-2" />
        <div className="h-80 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}
