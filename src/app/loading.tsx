export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-5 py-6 sm:px-8">
      <div className="h-12 animate-pulse rounded-xl bg-muted" />
      <div className="grid flex-1 place-items-center">
        <div className="w-full max-w-2xl space-y-5 text-center">
          <div className="mx-auto h-5 w-36 animate-pulse rounded-full bg-muted" />
          <div className="mx-auto h-16 w-full animate-pulse rounded-2xl bg-muted" />
          <div className="mx-auto h-6 w-3/4 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </main>
  );
}
