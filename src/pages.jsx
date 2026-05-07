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
          A media lab of artist–developers building AI tools and experiences for archives,
          accessibility, and the spaces between. From chaos to clarity with humans in
          the loop.
        </p>

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
      <div className="portfolio-list">
        {PORTFOLIO.map((w, i) => (
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
  return (
    <div className="page" data-screen-label="About Us">
      <div className="page-eyebrow">About Us</div>
      <h1 className="page-title">Our Story</h1>
      <div className="about-body">
        <p><Onto /> was founded by three artist–developers working at the intersection of media art, archiving, and artificial intelligence. Coming from both artistic and technical backgrounds, our team builds tools and experiences that connect creative practice with structured data.</p>
        <p>We work across commercial and artistic projects, from AI-driven archive systems to interactive installations. Having collaborated on numerous joint exhibitions and research projects, we bring an interdisciplinary mindset to every partnership.</p>
        <p>Thanks to this hybrid background, <Onto /> can design and deliver projects that span technology, culture, and design. We're always open to new collaborations with brands, institutions, and studios that share a curiosity for meaningful, data-driven storytelling.</p>
      </div>
      <div className="team">
        {TEAM.map(p => (
          <div className="person" key={p.name}>
            <div className="avatar">
              {p.img && <img src={p.img} alt={p.name} className="avatar-photo" />}
            </div>
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

      {/* Services bento grid */}
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

      {/* Newsletter banner — tagline top-aligned with form */}
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

      {/* Contact details */}
      <div className="contact-details">
        <div className="contact-col">
          <div className="contact-item">
            <span className="contact-label">Email</span>
            <a href="mailto:hello@onto.fi" className="contact-value contact-email-link">hello@onto.fi</a>
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
      </div>
    </div>
  );
}
