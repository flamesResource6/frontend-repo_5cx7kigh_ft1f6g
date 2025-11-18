import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/1VHYoewWfi45VYZ5/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="backdrop-blur-sm bg-white/10 border border-white/10 rounded-3xl p-8 md:p-12 text-white max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">Igloo — Student housing made easy</h1>
          <p className="mt-4 text-white/80">Find vetted apartments around your campus, chat with trusted vendors, and book with confidence.</p>
          <div className="mt-6 flex gap-3 flex-wrap">
            <a href="#search" className="px-5 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:opacity-90 transition">Search apartments</a>
            <a href="#vendor" className="px-5 py-3 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition">Become a vendor</a>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
    </section>
  );
}
