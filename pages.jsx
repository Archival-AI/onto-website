// Pages — Home + inner pages

const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ─────────────────── Morphing wordmark ─────────────────── */
// Letter-by-letter glyph morph: characters that survive between words
// translate/scale into place; new letters fade up; outgoing letters fade down.
// This reads as a glyph morph without needing a path-interpolation lib.

function MorphWord({ words, index, onClick }) {
  const word = words[index];
  const prev = useRef(words[index]);
  const [phase, setPhase] = useState('idle');

  useEffect(() => {
    if (prev.current === word) return;
    setPhase('out');
    const t1 = setTimeout(() => {
      prev.current = word;
      setPhase('in');
    }, 220);
    const t2 = setTimeout(() => setPhase('idle'), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [word]);

  // build letter list with stable keys per-position so adjacent letters
  // overlap visually during the swap = morph illusion
  const letters = word.split('');
  return (
    <span
      className="word"
      onClick={onClick}
      style={{ display: 'inline-block', position: 'relative' }}
    >
      {letters.map((ch, i) => (
        <span
          key={`${word}-${i}`}
          className={`glyph ${phase}`}
          style={{
            display: 'inline-block',
            transition: 'transform .42s cubic-bezier(.7,0,.2,1), opacity .32s ease, filter .32s',
            transitionDelay: `${i * 26}ms`,
            transformOrigin: 'center bottom',
            opacity: phase === 'out' ? 0 : 1,
            transform:
              phase === 'out'
                ? 'translateY(0.18em) scaleY(.62) scaleX(1.18) skewX(8deg)'
                : phase === 'in'
                ? 'translateY(0) scaleY(1) scaleX(1)'
                : 'none',
            filter: phase === 'out' ? 'blur(2px)' : 'blur(0)',
            willChange: 'transform, opacity, filter',
          }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

/* ─────────────────── Home ─────────────────── */

function Home({ tweaks }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const wrapRef = useRef(null);
  const slotRef = useRef(null);
  const ontoRef = useRef(null);
  const dotRef  = useRef(null);
  const lastSwap = useRef(0);
  const trigger = tweaks.trigger || 'hover';

  // Auto-cycle when configured
  useEffect(() => {
    if (trigger !== 'auto') return;
    const id = setInterval(() => {
      setWordIdx(i => (i + 1) % window.WORDS.length);
    }, 2400);
    return () => clearInterval(id);
  }, [trigger]);

  // Mouse tracking — squish toward cursor (Kai-style)
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top  + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const radius = Math.max(r.width, r.height) * 0.9;
      const strength = Math.max(0, 1 - dist / radius); // 0..1

      // Squish: scaleX/Y inversely correlated to direction. Logo gets pulled toward cursor.
      const ang = Math.atan2(dy, dx);
      const sx = 1 + Math.cos(ang) * 0.07 * strength;
      const sy = 1 + Math.sin(ang) * 0.07 * strength;
      const tx = Math.cos(ang) * 14 * strength;
      const ty = Math.sin(ang) * 14 * strength;

      if (ontoRef.current) {
        ontoRef.current.style.transform =
          `translate(${tx}px, ${ty}px) scale(${sx}, ${sy})`;
      }
      if (dotRef.current) {
        // dot lags + magnifies a bit
        dotRef.current.style.transform =
          `translate(${tx*1.6}px, calc(-.18em + ${ty*1.6}px)) scale(${1 + strength*.4})`;
      }

      // word morph trigger: hover → cycle as cursor passes near
      if (trigger === 'hover' && strength > 0.45) {
        const now = performance.now();
        if (now - lastSwap.current > 900) {
          lastSwap.current = now;
          setWordIdx(i => (i + 1) % window.WORDS.length);
        }
      }
    };
    const onLeave = () => {
      if (ontoRef.current) ontoRef.current.style.transform = '';
      if (dotRef.current)  dotRef.current.style.transform  = 'translateY(-.18em)';
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [trigger]);

  const variantClasses = [
    tweaks.typeScale === 'monumental' ? 'type-monumental'
      : tweaks.typeScale === 'quiet' ? 'type-quiet' : '',
    tweaks.logoTreatment === 'stacked' ? 'logo-stacked'
      : tweaks.logoTreatment === 'mark' ? 'logo-inline-mark' : '',
  ].join(' ');

  return (
    <div className={`page home in ${variantClasses}`} data-screen-label="01 Home">
      <div className="home-inner">
        <h1 className="hero">
          <span className="we">we are</span>
          <span className="onto-wrap" ref={wrapRef}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}>
            <span className="onto-text" ref={ontoRef}>onto</span>
            <span className="slot" ref={slotRef}>
              <span className="underscore" />
              <MorphWord
                words={window.WORDS}
                index={wordIdx}
                onClick={() => setWordIdx(i => (i + 1) % window.WORDS.length)}
              />
            </span>
            <span className="dot" ref={dotRef} />
          </span>
        </h1>

        <p className="hero-sub">
          A studio of artist–developers building AI tools and experiences for archives,
          accessibility, and the spaces between. From chaos to clarity with humans in
          the loop.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────── Inner pages ─────────────────── */

function ProductsBlock() {
  return (
    <div className="products">
      <a className="product-card" href="https://archivalai.onto.fi" target="_blank" rel="noreferrer">
        <div className="pname">Archival AI</div>
        <div className="pdesc">
          Intelligent metadata, consistent descriptions, and search optimisation for media archives.
          Auto-tags, transcripts and OCR from video, image, audio, text — schema-aligned
          (CDWA / CCO / Dublin Core or custom).
        </div>
        <div className="pmeta">
          <span>archivalai.onto.fi</span>
          <span className="arrow">↗</span>
        </div>
      </a>
      <a className="product-card" href="https://bel.onto.fi" target="_blank" rel="noreferrer">
        <div className="pname">Beyond Easy Language</div>
        <div className="pdesc">
          Accessible language tools that go beyond plain-text rewrites — honouring tone,
          context and the people who actually read.
        </div>
        <div className="pmeta">
          <span>bel.onto.fi</span>
          <span className="arrow">↗</span>
        </div>
      </a>
    </div>
  );
}

function Portfolio() {
  const [open, setOpen] = useState(null);
  return (
    <div className="page" data-screen-label="Portfolio">
      <div className="page-eyebrow">Portfolio</div>
      <h1 className="page-title">Selected Work</h1>
      <p className="page-lede">
        Projects we’ve built with partners across cultural heritage, media, research and
        public broadcasting. Click a row to read more.
      </p>
      <div className="portfolio-list">
        {window.PORTFOLIO.map((w, i) => (
          <div
            key={w.title}
            className={`work-row ${open === i ? 'open' : ''}`}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div className="wnum">{String(i + 1).padStart(2, '0')}</div>
            <div className="wtitle">{w.title}</div>
            <div className="wpartner">{w.partner}</div>
            <div className="wyear">{w.year}</div>
            <div className="wdesc">{w.desc}</div>
            <div className="wexp">{open === i ? '— close' : '— read'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Blog() {
  return (
    <div className="page" data-screen-label="Blog">
      <div className="page-eyebrow">05 · Blog</div>
      <h1 className="page-title">From the studio</h1>
      <p className="page-lede">
        Field notes, methods, and longer essays on archives, AI, and accessible language.
      </p>
      <div className="blog-grid">
        {window.BLOG.map((b, i) => (
          <div className="blog-card" key={i}>
            <div className="tag">{b.tag}</div>
            <div className="btitle">{b.title}</div>
            <div className="bmeta">
              <span>{b.date}</span>
              <span>{b.read}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Manifesto() {
  return (
    <div className="page" data-screen-label="06 Manifesto">
      <div className="page-eyebrow">Manifesto</div>
      <h1 className="page-title">Company values</h1>
      <div className="col-2">
        <div className="manifesto">
          {window.MANIFESTO.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div>
          <div className="principles">
            {window.PRINCIPLES.map(p => (
              <div className="p" key={p.num}>
                <div className="num">{p.num}</div>
                <div className="ph">{p.h}</div>
                <div className="pb">{p.b}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="page" data-screen-label="About Us">
      <div className="page-eyebrow">About Us</div>
      <h1 className="page-title">Our story</h1>
      <p className="page-lede">
        onto was founded by three artist–developers working at the intersection of media art, archiving, and artificial intelligence. Coming from both artistic and technical backgrounds, our team builds tools and experiences that connect creative practice with structured data.
        We work across commercial and artistic projects, from AI-driven archive systems to interactive installations. Having collaborated on numerous joint exhibitions and research projects, we bring an interdisciplinary mindset to every partnership.
        Thanks to this hybrid background,  onto can design and deliver projects that span technology, culture, and design.  We’re always open to new collaborations with brands, institutions, and studios that share a curiosity for meaningful, data-driven storytelling.
      </p>
      <div className="team">
        {window.TEAM.map(p => (
          <div className="person" key={p.name}>
            <div className="avatar" />
            <div className="pname2">{p.name}</div>
            <div className="prole">{p.role}</div>
            <div className="pbio">{p.bio}</div>
            <a className="plink" href={p.link} target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        ))}
      </div>
    </div>
  );
}

function Contact() {
  return (
    <div className="page" data-screen-label="08 Contact">
      <div className="page-eyebrow">08 · Contact</div>
      <h1 className="page-title">Reach us</h1>
      <p className="page-lede">
        For custom AI and data solutions, consultancy, research, curatorial projects or
        collaborations.
      </p>
      <div className="contact-grid">
        <div className="reach">
          <div className="item"><span>Custom AI & Data</span><span className="desc">Pipelines, schemas, governance</span></div>
          <div className="item"><span>Consultancy</span><span className="desc">Strategy, audits, roadmaps</span></div>
          <div className="item"><span>Research & Curatorial</span><span className="desc">Concept, exhibition production, interfaces</span></div>
          <div className="item"><span>Collaboration</span><span className="desc">Partnerships with brands, institutions, studios</span></div>
        </div>
        <div>
          <div className="reach">
            <div className="item"><span>hello@onto.fi</span><span className="desc">General</span></div>
            <div className="item"><span>work@onto.fi</span><span className="desc">New projects</span></div>
            <div className="item"><span>Helsinki</span><span className="desc">FI</span></div>
            <div className="item"><span>Istanbul</span><span className="desc">TR</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Home, Portfolio, Blog, Manifesto, About, Contact, ProductsBlock, MorphWord,
});
