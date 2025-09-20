export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-16 bg-gradient-to-b from-[#FF6B2C] via-[#FF8E53] to-[#592EDB]">
      {/* Navbar */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-12 py-6">
        <h1 className="text-white font-semibold text-xl tracking-tight">RightFit</h1>
        <nav className="hidden md:flex gap-10 text-white font-normal text-base">
          <a href="#" className="hover:opacity-80 transition">Home</a>
          <a href="#" className="hover:opacity-80 transition">Blogs</a>
        </nav>
        <button className="bg-white/15 text-white px-6 py-2.5 rounded-full border border-white/30 hover:bg-white/25 transition text-sm font-medium shadow-sm">
          Login →
        </button>
      </header>

      {/* Hero Content */}
      <div className="max-w-4xl mt-28 md:mt-40">
        <p className="text-white/70 text-sm mb-5 tracking-wide uppercase">
          2500+ already escaped the traditional job hunt
        </p>
        <h1 className="text-[44px] md:text-[64px] font-light text-white leading-[1.15] tracking-tight">
          Show your <span className="italic font-semibold">Skills</span>. Skip the <span className="italic font-semibold">Resumes</span> noise.
        </h1>
        <p className="mt-8 text-white/75 text-lg leading-relaxed max-w-2xl mx-auto">
          Join 2,500+ professionals and companies using Rightfit to hire and get hired — faster, smarter, and based on proof of work.
        </p>

        <div className="mt-10 flex flex-wrap gap-5 justify-center">
          <button className="px-8 py-3.5 bg-white text-[#592EDB] rounded-full font-semibold shadow-md hover:shadow-lg transition text-base">
            Get started →
          </button>
          <button className="px-8 py-3.5 bg-[#592EDB] text-white rounded-full font-semibold shadow-md hover:shadow-lg transition text-base">
            Hire talent
          </button>
        </div>
      </div>

      {/* Mockup */}
      <div className="mt-20 w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/20">
        <img
          src="/demo-profile.png"
          alt="Profile preview"
          className="w-full object-cover"
        />
      </div>
    </section>
  );
}

