export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 w-full h-screen absolute top-0 left-0 z-50 backdrop-blur-3xl">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin backdrop-blur-lg" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  )
}
