import { Link } from 'react-router-dom'

const practicals = [
  {
    title: 'Separating Mixtures',
    tag: 'Strand: Mixtures, Elements & Compounds',
    desc: 'Choose the right technique - evaporation, distillation, sublimation and more - for each mixture.',
    emoji: '🧪',
  },
  {
    title: 'Acids, Bases & Indicators',
    tag: 'Strand: Mixtures, Elements & Compounds',
    desc: 'Test substances with litmus paper, make your own plant-extract indicator, and read the pH scale.',
    emoji: '🌈',
  },
  {
    title: 'Magnetism',
    tag: 'Strand: Force and Energy',
    desc: 'Test materials with a magnet, explore poles, and see how magnets are used every day.',
    emoji: '🧲',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 blueprint-grid">
      <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="text-xl font-bold text-brand-700">Vatual Labs</div>
        <Link
          to="/signin"
          className="bg-brand-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-brand-700 transition"
        >
          Sign in
        </Link>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 text-center">
        <span className="inline-block bg-brand-100 text-brand-700 text-sm font-medium px-4 py-1 rounded-full mb-6">
          Built for Kenya's CBE Junior Secondary curriculum
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight max-w-3xl mx-auto">
          Science practicals for students without a physical lab
        </h1>
        <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto">
          Vatual Labs turns Integrated Science practicals from the KICD Grade 7-9 curriculum
          into interactive simulations students can run on a phone - no equipment,
          no lab room, no reliable internet required.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            to="/signin"
            className="bg-brand-600 text-white px-7 py-3 rounded-lg font-medium hover:bg-brand-700 transition"
          >
            Try a practical
          </Link>
          <a
            href="#how-it-works"
            className="px-7 py-3 rounded-lg font-medium border border-slate-300 hover:bg-slate-50 transition"
          >
            How it works
          </a>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">The problem</h2>
            <p className="text-slate-600 leading-relaxed">
              Most junior secondary schools in Kenya don't have a fully equipped science
              lab, and CBE is competency-based - students are expected to actually
              <em> do </em> the practical, not just read about it. That gap holds back
              exactly the skills the new curriculum is trying to build.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">The solution</h2>
            <p className="text-slate-600 leading-relaxed">
              Each lesson mirrors the official KICD scheme of work: a learning outcome,
              a guided virtual practical the student interacts with directly, and a
              short reflection - so it fits into how teachers already plan lessons,
              on devices students already have.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Sample Grade 7 practicals</h2>
        <p className="text-slate-500 text-center mb-10">Three lessons from the current sample set</p>
        <div className="grid md:grid-cols-3 gap-6">
          {practicals.map((p) => (
            <div key={p.title} className="border border-slate-200 bg-brand-50 p-6 hover:shadow-md transition">
              <div className="text-3xl mb-3">{p.emoji}</div>
              <div className="text-xs font-medium text-brand-600 mb-2">{p.tag}</div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">{p.title}</h3>
              <p className="text-slate-500 text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-700 text-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">See it in a real lesson flow</h2>
          <p className="text-brand-100 mb-8">
            Learning outcome → guided practical → reflection, matching how CBE is assessed.
          </p>
          <Link
            to="/signin"
            className="inline-block bg-white text-brand-700 px-7 py-3 rounded-lg font-medium hover:bg-brand-50 transition"
          >
            Sign in with Google
          </Link>
        </div>
      </section>

      <footer className="text-center text-slate-400 text-sm py-8">
        © {new Date().getFullYear()} Vatual Labs · Nairobi, Kenya
      </footer>
    </div>
  )
}
