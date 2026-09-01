// Pages — Home + inner pages
import React, { useState, useEffect, useRef } from 'react'
import { WORDS, PORTFOLIO, BLOG, BLOG_TAGS, MANIFESTO, PRINCIPLES, TEAM, SERVICES } from './data'
import ontoLogo from '../assets/onto-logo.png'

// Portfolio project images
import projNokia from '../assets/project_images/nokia_design_archive.png'
import projTeoman from '../assets/project_images/Light-Games-circa-the-1960s-CTeoman-Madra-Collection.png'
import projTuuma from '../assets/project_images/tuumalibotti.png'

const PROJECT_IMGS = {
  'nokia_design_archive.png': projNokia,
  'Light-Games-circa-the-1960s-CTeoman-Madra-Collection.png': projTeoman,
  'tuumalibotti.png': projTuuma,
}

// The 3 case studies below have been moved to the About Us page.
// Kept empty here so the Portfolio page shows a placeholder until new work is added.
const PORTFOLIO_PAGE_ITEMS = [];

/* "onto" rendered in Druk Wide Bold */
function Onto() {
  return <strong className="onto-brand">onto</strong>;
}

/* ─────────────────── Morphing wordmark ─────────────────── */
// True text morph: outgoing word slides up and fades while incoming word
// rises into place from below, both clipped within the same line.
function MorphWord({ words, index, onClick }) {
  const [shown, setShown] = useState(words[index]);
  const [incoming, setIncoming] = useState(null);

  useEffect(() => {
    if (words[index] === shown) return;
    setIncoming(words[index]);
    const t1 = setTimeout(() => {
      setShown(words[index]);
      setIncoming(null);
    }, 520);
    return () => clearTimeout(t1);
  }, [index, words, shown]);

  const widthSizer = incoming
    ? (shown.length > incoming.length ? shown : incoming)
    : shown;

  return (
    <span
      className="word"
      onClick={onClick}
      style={{ display:'inline-block', position:'relative', overflow:'hidden', verticalAlign:'baseline', color:'#111', fontWeight:600, fontSize: '0.32em' }}
    >
      {/* invisible sizer keeps width stable */}
      <span style={{ visibility:'hidden', display:'inline-block' }}>{widthSizer}</span>
      {/* outgoing */}
      <span
        key={`out-${shown}`}
        style={{
          position:'absolute', left:0, top:0, whiteSpace:'nowrap',
          transform: incoming ? 'translateY(-100%)' : 'translateY(0)',
          opacity: incoming ? 0 : 1,
          filter: incoming ? 'blur(3px)' : 'blur(0)',
          transition: 'transform .52s cubic-bezier(.7,0,.2,1), opacity .42s ease, filter .42s',
        }}
      >{shown}</span>
      {/* incoming */}
      {incoming && (
        <span
          key={`in-${incoming}`}
          style={{
            position:'absolute', left:0, top:0, whiteSpace:'nowrap',
            transform:'translateY(0)',
            opacity:1, filter:'blur(0)',
            animation:'morphIn .52s cubic-bezier(.7,0,.2,1) both',
          }}
        >{incoming}</span>
      )}
      <style>{`
        @keyframes morphIn {
          0%   { transform: translateY(100%); opacity: 0; filter: blur(3px); }
          60%  { opacity: 1; filter: blur(0); }
          100% { transform: translateY(0);    opacity: 1; filter: blur(0); }
        }
      `}</style>
    </span>
  );
}

/* ─────────────────── Home ─────────────────── */
export function Home({ tweaks }) {
  const [wordIdx, setWordIdx] = useState(0);
  const wrapRef = useRef(null);
  const lastSwap = useRef(0);
  const trigger = tweaks.trigger || 'hover';

  useEffect(() => {
    if (trigger !== 'auto') return;
    const id = setInterval(() => {
      setWordIdx(i => (i + 1) % WORDS.length);
    }, 2400);
    return () => clearInterval(id);
  }, [trigger]);

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
      const strength = Math.max(0, 1 - dist / radius);
      if (trigger === 'hover' && strength > 0.45) {
        const now = performance.now();
        if (now - lastSwap.current > 900) {
          lastSwap.current = now;
          setWordIdx(i => (i + 1) % WORDS.length);
        }
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
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
          <span className="onto-wrap" ref={wrapRef}>
            <img className="onto-img" src={ontoLogo} alt="onto_." />
            <span className="slot">
              <MorphWord
                words={WORDS}
                index={wordIdx}
                onClick={() => setWordIdx(i => (i + 1) % WORDS.length)}
              />
            </span>
          </span>
        </h1>

        <p className="hero-sub">
          A media lab at the intersection of art, archives and artificial intelligence.
        </p>

      </div>
    </div>
  );
}

/* ─────────────────── 3D team carousel ─────────────────── */
function TeamCarousel({ people }) {
  const [rot, setRot] = useState(0);
  const rotRef = useRef(0);
  const dragRef = useRef(null);
  const rafRef = useRef(null);
  const suppressClickRef = useRef(false);

  useEffect(() => { rotRef.current = rot; }, [rot]);
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const animateTo = (target) => {
    cancelAnimationFrame(rafRef.current);
    const from = rotRef.current;
    const d = target - from;
    const t0 = performance.now();
    const dur = 520;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setRot(from + d * e);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const snap = () => animateTo(Math.round(rotRef.current / 120) * 120);

  const spinTo = (i) => {
    if (suppressClickRef.current) { suppressClickRef.current = false; return; }
    const cur = rotRef.current;
    let target = -i * 120;
    target += Math.round((cur - target) / 360) * 360;
    if (Math.abs(target - cur) < 0.5) return;
    animateTo(target);
  };

  const onDown = (e) => {
    if (e.target.closest && e.target.closest('a')) return;
    dragRef.current = { x: e.clientX, rot: rotRef.current, moved: 0 };
    cancelAnimationFrame(rafRef.current);
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
  };
  const onMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    dragRef.current.moved = Math.max(dragRef.current.moved, Math.abs(dx));
    setRot(dragRef.current.rot + dx * 0.35);
  };
  const onUp = () => {
    if (!dragRef.current) return;
    suppressClickRef.current = dragRef.current.moved > 6;
    dragRef.current = null;
    snap();
  };

  const step = 120, R = 260, tilt = 14;
  let best = 0, bestA = 999;
  const cards = people.map((p, i) => {
    let a = ((i * step + rot) % 360 + 360) % 360;
    if (a > 180) a -= 360;
    const rad = a * Math.PI / 180;
    const x = Math.sin(rad) * R;
    const z = Math.cos(rad) * R - R;
    const abs = Math.abs(a);
    if (abs < bestA) { bestA = abs; best = i; }
    const ry = Math.max(-tilt * 2.2, Math.min(tilt * 2.2, -a * (tilt / 45)));
    const op = Math.max(0.3, 1 - (abs / 180) * 0.6);
    return {
      ...p, i,
      transform: `translate(-50%,-50%) translateX(${x.toFixed(1)}px) translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg)`,
      opacity: op.toFixed(3),
      z: Math.round(2000 + z),
    };
  });
  const active = people[best];

  return (
    <div className="about-carousel">
      <div
        className="tc-wheel"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {cards.map(c => (
          <div
            key={c.name}
            className="tc-card"
            style={{ transform: c.transform, opacity: c.opacity, zIndex: c.z }}
            onClick={() => spinTo(c.i)}
          >
            <div className="tc-card-ring">
              <div className="tc-card-inner">
                <div className="tc-photo" style={{ backgroundImage: `url(${c.img})` }} />
                <div className="tc-sheen" />
                <div className="tc-social">
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noreferrer"
                    title="LinkedIn"
                    className="tc-icon"
                    onClick={e => e.stopPropagation()}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.34 0h4.37v1.92h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v7.44h-4.56v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V22H7.56V8z" />
                    </svg>
                  </a>
                  {c.web && (
                    <a
                      href={c.web}
                      target="_blank"
                      rel="noreferrer"
                      title="Portfolio"
                      className="tc-icon"
                      onClick={e => e.stopPropagation()}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="12" cy="12" r="9" />
                        <ellipse cx="12" cy="12" rx="4" ry="9" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                      </svg>
                    </a>
                  )}
                  {c.mail && (
                    <a
                      href={c.mail}
                      title="Email"
                      className="tc-icon"
                      onClick={e => e.stopPropagation()}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="2.5" y="5" width="19" height="14" rx="2" />
                        <polyline points="3.5,6.5 12,13 20.5,6.5" />
                      </svg>
                    </a>
                  )}
                </div>
                <div className="tc-caption">
                  <div className="tc-name">{c.name}</div>
                  <div className="tc-role">{c.role}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="tc-dots">
        {people.map((p, i) => (
          <button
            key={p.name}
            className="tc-dot"
            style={{ background: i === best ? '#b13c85' : 'rgba(120,50,95,0.25)' }}
            onClick={() => spinTo(i)}
            aria-label={`Show ${p.name}`}
          />
        ))}
      </div>
      <div className="tc-bio">
        <div className="tc-bio-name">{active.name.toLocaleUpperCase('tr-TR')}</div>
        <p className="tc-bio-text">{active.bio}</p>
      </div>
    </div>
  );
}

/* ─────────────────── Inner pages ─────────────────── */
export function Portfolio() {
  const [open, setOpen] = useState(null);
  return (
    <div className="page" data-screen-label="04 Portfolio">
      <div className="page-eyebrow">Portfolio</div>
      <h1 className="page-title">Selected Work</h1>
      <p className="page-lede">
        Projects we've built with partners across cultural heritage, media, research and
        public broadcasting.
      </p>
      {PORTFOLIO_PAGE_ITEMS.length > 0 ? (
        <div className="portfolio-list">
          {PORTFOLIO_PAGE_ITEMS.map((w, i) => (
            <div
              key={w.title}
              className={`work-row ${open === i ? 'open' : ''}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="wthumb">
                <img src={PROJECT_IMGS[w.img]} alt={w.title} className="wthumb-img" />
              </div>
              <div className="wtitle">{w.title}</div>
              <div className="wpartner">{w.partner}</div>
              <div className="wyear">{w.year}</div>
              <div className="wdesc">{w.desc}</div>
              <div className="wexp">{open === i ? '— close' : '— read'}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="page-lede" style={{ opacity: .6 }}>
          Our featured projects have moved to the <a href="#about">About Us</a> page. More case studies coming soon.
        </p>
      )}
    </div>
  );
}

export function Blog() {
  const [filter, setFilter] = useState('all');
  const items = filter === 'all'
    ? BLOG
    : BLOG.filter(b => b.tags.includes(filter));
  return (
    <div className="page" data-screen-label="Blog">
      <div className="page-eyebrow">Blog</div>
      <h1 className="page-title">Research</h1>
      <p className="page-lede">
        News and essays on media art, archives, AI, and easy language.
      </p>
      <div className="filter-chips">
        {BLOG_TAGS.map(tag => (
          <button
            key={tag}
            className={`chip ${filter === tag ? 'on' : ''}`}
            onClick={() => setFilter(tag)}
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </button>
        ))}
      </div>
      <div className="blog-grid">
        {items.map((b) => (
          <article className="blog-card" key={b.title}>
            <div className="bimg" style={{ backgroundImage: `url(${b.img})` }} />
            <div className="bbody">
              <h3 className="btitle">{b.title}</h3>
              <p className="bexcerpt">{b.excerpt}</p>
              <div className="bfoot">
                <span className="bdate">{b.date}</span>
                <div className="btags">
                  {b.tags.slice(0, 3).map(t => <span key={t} className="btag">{t}</span>)}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function Manifesto() {
  return (
    <div className="page" data-screen-label="Manifesto">
      <div className="page-eyebrow">Manifesto</div>
      <h1 className="page-title">Company Values</h1>
      <div className="col-2">
        <div className="manifesto">
          {MANIFESTO.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div>
          <div className="principles">
            {PRINCIPLES.map(p => (
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

export function About() {
  const [openProject, setOpenProject] = useState(null);
  return (
    <div className="page about-page" data-screen-label="About Us">
      <div className="about-hero">
        <div className="about-grid">
          <div className="about-body">
            <div className="page-eyebrow">About Us</div>
            <h1 className="page-title">Our Story</h1>
            <p>Founded by three artist-developers, <Onto /> builds tools and experiences that connect creative practice with structured data.</p>
            <p>We work across commercial and artistic projects, from AI-driven archive systems to interactive installations. Having collaborated on numerous joint exhibitions and research projects, we bring an interdisciplinary mindset to every partnership.</p>
            <p>Thanks to this hybrid background, <Onto /> can design and deliver projects that span technology, culture, and design. We're always open to new collaborations with brands, institutions, and studios that share a curiosity for meaningful, data-driven storytelling.</p>
            <p>Based in Helsinki & Ankara.</p>
          </div>
          <TeamCarousel people={TEAM} />
        </div>
      </div>

      <div className="about-projects">
        <h2 className="page-title about-projects-title">Selected Work</h2>
        <div className="portfolio-list">
          {PORTFOLIO.map((w, i) => (
            <div
              key={w.title}
              className={`work-row ${openProject === i ? 'open' : ''}`}
              onClick={() => setOpenProject(openProject === i ? null : i)}
            >
              <div className="wthumb">
                <img src={PROJECT_IMGS[w.img]} alt={w.title} className="wthumb-img" />
              </div>
              <div className="wtitle-block">
                <div className="wtitle">{w.title}</div>
                {w.contributors && w.contributors.length > 0 && (
                  <div className="wcontributors">{w.contributors.join(', ')}</div>
                )}
              </div>
              <div className="wpartner">{w.partner}</div>
              <div className="wright">
                <div className="wyear">{w.year}</div>
                {w.links && w.links.length > 0 && (
                  <div className="wlinks">
                    {w.links.map(l => (
                      <a
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        title={l.label}
                        className="wlink-icon"
                        onClick={e => e.stopPropagation()}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <circle cx="12" cy="12" r="9" />
                          <ellipse cx="12" cy="12" rx="4" ry="9" />
                          <line x1="3" y1="12" x2="21" y2="12" />
                        </svg>
                      </a>
                    ))}
                  </div>
                )}
                <div className="wexp">{openProject === i ? '— close' : '— read'}</div>
              </div>
              <div className="wdesc">{w.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Contact() {
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="page" data-screen-label="08 Contact">
      <div className="page-eyebrow">Contact</div>

      {/* Services bento grid 
      <div className="services-bento">
        {SERVICES.map(s => (
          <div className={`service-card service-${s.size}`} key={s.title}>
            {s.icon && (
              <svg className="service-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {Array.from({length: 24}, (_, i) => {
                  const angle = (i / 24) * Math.PI * 2;
                  const inner = 5, outer = 21;
                  return <line key={i}
                    x1={24 + inner * Math.cos(angle)} y1={24 + inner * Math.sin(angle)}
                    x2={24 + outer * Math.cos(angle)} y2={24 + outer * Math.sin(angle)}
                    stroke="#e86dce" strokeWidth="1.8" strokeLinecap="round"
                  />;
                })}
              </svg>
            )}
            <h3 className="service-title">{s.title}</h3>
            {s.desc && <p className="service-desc">{s.desc}</p>}
          </div>
        ))}
      </div>
*/}
      {/* Newsletter banner — tagline top-aligned with form 
      <div className="newsletter-banner">
        <div className="nl-left">
          <p className="nl-tagline">From chaos<br />to clarity.</p>
        </div>
        <div className="nl-right">
          {sent ? (
            <p className="nl-thanks">You're in the loop. ✦</p>
          ) : (
            <form className="nl-form" onSubmit={handleSubmit}>
              <p className="nl-desc"><strong>Stay in the loop, not the backlog.</strong> Subscribe to our newsletter.</p>
              <label className="nl-label" htmlFor="nl-email">Email *</label>
              <div className="nl-row">
                <input
                  id="nl-email"
                  className="nl-input"
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="nl-submit-row">
                <button className="nl-btn" type="submit">Subscribe</button>
              </div>
            </form>
          )}
        </div>
      </div>
*/}
      {/* Contact details */}
      <div className="contact-details">
        <div className="contact-col">
          <div className="contact-item">
            <span className="contact-label">Email</span>
            <p className="contact-value contact-email-link">[firstname]@onto.fi</p>
          </div>
        </div>
        <div className="contact-col">
          <div className="contact-item">
            <span className="contact-label">Address</span>
            <address className="contact-value contact-address">
              c/o Helsinki Think Company Kumpula<br />
              Pietari Kalmin katu 5<br />
              00560 Helsinki
            </address>
          </div>
        </div>
        <div className="contact-col">
          <div className="contact-item">
            <span className="contact-label">Business Info</span>
            <address className="contact-value contact-address">
              Dasein AI Oy<br />
              Business ID [Y-tunnus]: 3612377-4
            </address>
          </div>
        </div>
      </div>
    </div>
  );
}
