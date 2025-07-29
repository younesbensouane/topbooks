export default function Hero() {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50 to-white -z-10" />
      <div className="container py-12 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Find Your Next Great Read
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Curated recommendations across genres — from timeless classics to modern gems.
        </p>
      </div>
    </section>
  );
}
