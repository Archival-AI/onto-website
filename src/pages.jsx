// Pages — Home + inner pages
import React, { useState, useEffect, useRef } from 'react'
import { WORDS, PORTFOLIO, BLOG, BLOG_TAGS, TEAM, SERVICES } from './data'
import ontoLogo from '../assets/onto-logo.png'
import belReportPdf from '../assets/bel/BEL-Industry-Report.pdf'
import luPhoto from '../assets/portraits/lu_photo.jpeg'

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
           More case studies coming soon.
        </p>
      )}
    </div>
  );
}

const BEL_STATS = [
  { num: '13', label: 'Finnish learners co-designed and tested the prototype' },
  { num: '4', label: 'Reading levels per article: A2, B1, B2 and the original' },
  { num: '2', label: 'Weeks of diary-based testing on a real news platform' },
  { num: '8', label: 'Easy-language news platforms benchmarked across 3 languages' },
];

const BEL_FINDINGS = [
  { text: <><strong>Readers compared levels as a strategy</strong> starting at B2, dropping to A2 when confused, escalating to the original when something felt off. Choice itself lowered the threshold for reading in Finnish.</> },
  { text: <><strong>The original is the ground truth.</strong> One-click access to the standard article built trust. Readers switched to it whenever a simplification felt strange or unclear.</> },
  { text: <><strong>On-demand explanations were hit-or-miss</strong> Strong on vocabulary, weak on cultural context the article itself doesn't carry. Readers asked for translations, grammar notes and saved-word review.</> },
];

function BelReportButton({ onClick, variant = 'solid', children }) {
  return (
    <button className={`bel-btn ${variant}`} onClick={onClick} type="button">
      {children}
    </button>
  );
}

export function BEL() {
  const [pdfOpen, setPdfOpen] = useState(false);
  return (
    <div className="page" data-screen-label="BEL Project">
      <div className="page-eyebrow">Project · Research</div>
      <h1 className="page-title">Beyond Easy Language</h1>
      <p className="page-lede">
        Designing AI-simplified Easy Finnish News with Immigrant L2 Learners
      </p>

      <div className="bel-tags">
        <span className="bel-tag">In Collaboration with Keskisuomalainen Oyj</span>
        <span className="bel-tag">Funded by Media Industry Research Foundation of Finland</span>
        <span className="bel-tag">Jan – Jul 2026</span>
      </div>

      <div className="bel-cta">
        <BelReportButton variant="solid" onClick={() => setPdfOpen(false)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1.5 12s3.8-7 10.5-7 10.5 7 10.5 7-3.8 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3"/></svg>
          View report
        </BelReportButton>
        {/*
        <a className="bel-btn outline" href={belReportPdf} download="BEL Industry Report.pdf">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v13"/><polyline points="6,11 12,17 18,11"/><path d="M4 21h16"/></svg>
          Download PDF
        </a> */}
      </div>

      <div className="bel-stats">
        {BEL_STATS.map((s) => (
          <div className="bel-stat" key={s.label}>
            <div className="bel-stat-num">{s.num}</div>
            <div className="bel-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bel-cols">
        <div>
          <span className="bel-eyebrow">The Problem</span>
          <h2 className="bel-h2">Easy news stops helping right when learners need it most</h2>
          <p className="bel-p">
            Easy Finnish serves roughly 11–14% of Finland's population, but for language learners only during a short
            window, between A2 and B1. Beyond that, easy news feels too simple while standard news is still too hard.
            Readers land in a limbo with no format made for them.
          </p>
        </div>
        <div>
          <span className="bel-eyebrow">The Idea</span>
          <h2 className="bel-h2">Make difficulty a control held by the reader</h2>
          <p className="bel-p">
            Working with university students learning Finnish, we built two AI features into the real reading
            environment of Helsingin Uutiset. So every article can meet the reader at their level, with the
            original always one tap away.
          </p>
        </div>
      </div>

      <span className="bel-eyebrow">What we built</span>
      <div className="bel-cards">
        <div className="bel-card">
          <div className="bel-pill-row">
            <span className="bel-pill tone-1">A2</span>
            <span className="bel-pill tone-2">B1</span>
            <span className="bel-pill tone-3">B2</span>
            <span className="bel-pill tone-4">Original</span>
          </div>
          <h3>The level selector</h3>
          <p className="bel-p" style={{ fontSize: 15 }}>
            Every article in four versions, three generated by an LLM and checked against 40 official Easy Finnish
            criteria. Shared paragraph structure lets readers hop between levels or to the original without
            losing their place.
          </p>
        </div>
        <div className="bel-card">
          <div className="bel-highlight-demo">
            Suomen <mark>eduskunta päätti</mark> uudesta laista…
            <span className="bel-gloss">→ "eduskunta päätti" = the parliament decided (past tense)</span>
          </div>
          <h3>The highlighter</h3>
          <p className="bel-p" style={{ fontSize: 15 }}>
            Select any word, phrase or paragraph and get an explanation tuned to your proficiency level such as grammar,
            vocabulary or content, with the full article as context.
          </p>
        </div>
      </div>

      <span className="bel-eyebrow">What we found</span>
      <div className="bel-findings">
        {BEL_FINDINGS.map((f, i) => (
          <div key={i}>
            <div className="bel-finding-bar" />
            <p className="bel-p" style={{ fontSize: 15.5 }}>{f.text}</p>
          </div>
        ))}
      </div>

      <div className="bel-callout-ring">
        <div className="bel-callout">
          <span className="bel-eyebrow">For newsrooms</span>
          <p>
            Cover real current issues, not just "immigrant topics". Simplify everything, keep it free, and always
            keep the original one tap away. Above all: give readers control over the simplification.
          </p>
        </div>
      </div>

      <div className="bel-footer">
        <p>Begüm Çelik · Lù Chén · Vertti Luostarinen. The full research paper is forthcoming. <br></br>Report licensed under CC BY 4.0.</p>
        <div className="bel-footer-actions">
          <BelReportButton variant="outline" onClick={() => setPdfOpen(false)}>View report</BelReportButton>
          {/*<a className="bel-btn solid" href={belReportPdf} download="BEL Industry Report.pdf">Download PDF</a>*/}
        </div>
      </div>

      {pdfOpen && (
        <div className="bel-modal-overlay" onClick={() => setPdfOpen(false)}>
          <div className="bel-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bel-modal-head">
              <span>BEL Industry Report — PDF</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <a className="bel-btn solid" style={{ padding: '7px 16px', fontSize: 12.5 }} href={belReportPdf} download="BEL Industry Report.pdf">Download</a>
                <button className="bel-modal-close" title="Close" onClick={() => setPdfOpen(false)}>✕</button>
              </div>
            </div>
            <iframe src={belReportPdf} title="BEL Industry Report" style={{ flex: 1, border: 'none', width: '100%' }} />
          </div>
        </div>
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

function LuNote({ children, note }) {
  return (
    <span className="lu-note" tabIndex={0}>
      {children}
      <span className="lu-pop">
        <span className="lu-pop-head">
          <span className="lu-pop-avatar" style={{ backgroundImage: `url(${luPhoto})` }} />
          <span className="lu-pop-tag">/// Lù</span>
        </span>
        <span className="lu-pop-text">{note}</span>
      </span>
    </span>
  );
}

const MANIFESTO_TENETS = [
  {
    num: '0',
    lead: 'The Critical AI Engineer considers Artificial Intelligence to be the most transformative language of our time, shaping the way we move, communicate and think. It is the work of the Critical Engineer to study and exploit this language, exposing its influence.',
    body: (
      <>
        <p>It feels like a good starting point to answer why we should choose to engage with such a problematic technology in the first place. Personally, the justification is that AI is, for better or for worse, "the most transformative language of our time", and we can still influence how it will be developed in the future. As the ones implementing it, we have the most ethical responsibility, but also agency in how it will affect the lives of others.</p>
        <p>
          AI has now become ubiquitous infrastructure that is an inescapable part of society. There is no going back to a post-AI world. AI engineers hold power over how people write, speak and discover information. We should be mindful of our responsibility while embracing the discursive disruption it can create.{' '}
          <LuNote note={<>It feels like we can play a masking game, substituting "Artificial Intelligence" with many other things, many other "languages": be it AI, Engineering, Design Thinking… at one point, Movable Type Printing, at one point, knotting. There lies a cliché about technological developments. And what has been transformed within these waves of technological changes?</>}>
            AI has the power to both uplift and crush vulnerable communities, and to even resurrect or extinguish entire languages.
          </LuNote>
        </p>
      </>
    ),
  },
  {
    num: '1',
    lead: 'The Critical AI Engineer considers any technology depended upon to be both a challenge and a threat. The greater the dependence on an AI model, the greater the need to study and expose its inner workings, regardless of ownership or legal provision.',
    body: (
      <>
        <p>I personally believe that foundation models currently present the largest threat to the existence of humanity, and therefore do not belong in closed labs. With their ongoing involvement in the genocide in Gaza, all of the leading US AI labs have shown their willingness to sidestep all of their commitments to so-called 'AI safety'.</p>
        <p>Because calls for an AI cease-fire are utopian, we need to take action to remedy the current power imbalance between closed and open-source AI. In practice, this means investing in public AI initiatives and projects that aim to democratize the training and inference of frontier models. While boycotting closed AI labs is quite inconsequential, the everyday choices of which AI providers we choose to trust do carry some weight.</p>
      </>
    ),
  },
  {
    num: '2',
    lead: 'The Critical AI Engineer raises awareness that with each technological advance our techno-political literacy is challenged.',
    body: (
      <>
        <p>As Critical AI Engineers, we should contribute more to the public discourse on AI ethics and reject both techno-utopian and faux-critical blanket statements about AI. As practitioners at the forefront of AI adoption, I feel we should be part of defining the ruleset we work within. In a nutshell, we should educate the public more.</p>
        <p>AI has become such a polarised topic that it is very hard to have a nuanced conversation about topics such as the environmental toll of data centers or the replacement of human labor. The job of the critical AI engineer is to weigh the ethical consequences of specific AI use cases where the reality is often more complex than simple binary options. The choice of not using AI also has an opportunity cost attached to it.</p>
      </>
    ),
  },
  {
    num: '3',
    lead: 'The Critical AI Engineer deconstructs and incites suspicion of rich user experiences.',
    body: (
      <>
        <p>As knowledge is increasingly accessed through conversational interfaces, we should pay close attention to how these interfaces talk to us. We should look beyond the customer-service-worker-meets-omniscient-godlike-entity personas of mainstream chat assistants, and ask what other types of personas we could design.</p>
        <p>AI assistants hallucinate, yet are often designed to appear deceptively lucid. Interfaces of all kinds often mask the messy uncertainness of the underlying systems, exploiting and eroding user trust. Why not visualize bias and detect hallucinations in the interface itself, or if nothing else, create designs that look and feel as unstable as the AI behind it?</p>
      </>
    ),
  },
  {
    num: '4',
    lead: 'The Critical AI Engineer looks beyond the "awe of implementation" to determine methods of influence and their specific effects.',
    body: (
      <p>As many organizations still seem to be in the "let's just do something, anything with AI" phase, consultancies sell proof-of-concepts of unfeasible or irresponsible pipe dreams, without clearly outlining the real-world consequences of these systems. As critical AI engineers, our job should be to say either "no, this should not be done with AI" or "no, this should in fact not be done at all" around 80% of the time. The only way to actually serve our clients and to also maintain our own credibility is to resist the allure of projects that have no other goal than technical innovation.</p>
    ),
  },
  {
    num: '5',
    lead: "The Critical AI Engineer recognises that each work of AI engineering engineers its user, proportional to that user's dependency upon it.",
    body: (
      <p>AI systems can sometimes improve the accessibility of information or services, but the tradeoffs need to be considered carefully. Often, "accessibility gains" are taken for granted and thought of as emerging automatically as a result of the interactivity and customizability of generative AI technologies. In reality, we are often merely supplanting a set of assumptions about the user with another set of assumptions. We need to know we are actually gaining something meaningful when we are giving away control to systems that are known to be misaligned, persuasive and biased. To assess these gains, we need to involve users during the design process.</p>
    ),
  },
  {
    num: '6',
    lead: 'The Critical AI Engineer expands "machine" to describe interrelationships encompassing devices, bodies, agents, forces and networks.',
    body: (
      <>
        <p>The word "agent" resonates differently in the AI age than it did when the manifesto was originally written. AI agents can empower individuals by allowing them to automate, augment and redesign their daily tasks. But their disruptive potential is often wasted when agents are used to simply replicate existing workflows. As a result, many AI agents become 'human-assisted technology' that still need workers to act as secretaries and overseers.</p>
        <p>
          One of the main reasons for these issues is the overreliance on quick technical POC's that don't consider the complexity of the socio-technical assemblages these systems will be integrated in. Fully understanding this "machine" often takes a lot of time, money and patience, things people commissioning POC's often lack.{' '}
          <LuNote note={<>Technological systems are often engineered with promises of empowerment and convenience. "Let's automate tasks that are too dangerous or tedious for humans," so claimed marketing campaigns. In reality, many technical solutions do not eliminate the danger or tedium in human labour; rather, they relocate these labours and sometimes midwife new forms of dangerous or tedious work. While "empowerment" and "convenience" are staged for some upon the interfaces, the labour of mining, labelling, and manufacturing happens backstage. To critically engineer AI, we have to scrutinise these claims of labour emancipation with patience. In <em>More Work for Mother</em>, Ruth Schwartz Cowan examined class and gender disparities through the ironies of household technologies. (…)</>}>
            This also contributes to a wider problem known as 'POC purgatory', where the POC is so far removed from reality that it does not serve its purpose of proving a concept.
          </LuNote>
        </p>
      </>
    ),
  },
  {
    num: '7',
    lead: 'The Critical AI Engineer observes the space between the production and consumption of technology. Acting rapidly to changes in this space, the Critical AI Engineer serves to expose moments of imbalance and deception.',
    body: (
      <>
        <p>Many problems of today's AI systems can be mitigated with better engineering, and good engineering takes time. Carbon footprint and data sovereignty issues can be reduced by optimizing AI models for edge devices and local hardware. Bias can be reduced with evaluations. The issues related to data extractivism and third-world labor can be circumvented by relying on truly open-source models that are not as smart, and therefore take more work to implement.</p>
        <p>We should do whatever we can to resist the war economy of AI that insists we iterate as quickly as possible, use the best models possible and vibe-code using as many tokens as possible. The best way to do this is to engineer systems that act as proof that there are alternative ways of doing things. The Māori transcription tool Kaituhi is a good practical example of what this can look like.</p>
      </>
    ),
  },
  {
    num: '8',
    lead: 'The Critical AI Engineer looks to the history of art, architecture, activism, philosophy and invention and finds exemplary works of Critical Engineering. Strategies, ideas and agendas from these disciplines will be adopted, re-purposed and deployed.',
    body: (
      <p>One of the main reasons why I chose to become an AI engineer is because it allows me to put concepts from Foucault and other thinkers into practice. Thinking about epistemological questions such as "what is the difference between oversimplification and hallucination" are not some musings during coffee breaks, but an integral part of the work itself. AI engineering sometimes resembles practice-based research in the sense that these theoretical assumptions need to be put to the test in the real world.</p>
    ),
  },
  {
    num: '9',
    lead: 'The Critical AI Engineer notes that AI models expand into social and psychological realms, regulating behaviour between people and the machines they interact with. By understanding this, the Critical AI Engineer seeks to reconstruct user-constraints and social action through means of digital excavation.',
    body: (
      <>
        <p>The data the AI models are trained on establishes the boundaries on what the model can do. We need better tools to excavate the training data that has been fed into LLMs, and to understand how that influences their behavior. While all kinds of experimental interpretability tools already exist, none of them are supported via APIs. This is yet another argument for using local models.</p>
        <p>Many of the bias-related problems regarded as "inherent" to the technology can be mitigated with better AI engineering. While bias cannot be eliminated completely, AI engineers can at least measure and quantify its effects. Many of the most egregious cases of so-called "AI bias" are actually just due to humans in charge of these projects being biased against evaluations.</p>
      </>
    ),
  },
  {
    num: '10',
    lead: 'The Critical AI Engineer considers the exploit to be the most desirable form of exposure.',
    body: (
      <>
        <p>The study of LLM capabilities is quite practice-driven, and mostly consists of researchers trying out different prompts. Exposing exploits and vulnerabilities involves coming up with creative narratives that will trick the model into misbehaving. The field of AI safety would advance a lot quicker if they involved more artists.</p>
        <p>The exploits we discover can serve as empirical proof against the doomsday narrative deployed by the AI industry. And fighting that narrative is important, as I sense that we are already conforming to having those kinds of problems current LLM systems can solve, instead of creating LLM systems that would solve our actual problems.</p>
      </>
    ),
  },
];

const MANIFESTO_FINAL = [
  'The Critical AI Engineer recognizes AI as the most transformative language of our time. They accept that the power to engineer language carries a profound ethical responsibility; they exert their agency to ensure these technologies uplift rather than erase vulnerable communities, protecting the survival of diverse linguistic and social identities.',
  'The Critical AI Engineer considers the concentration of frontier models within private labs a threat to collective security. They act to dismantle this power imbalance by prioritizing the democratization of training and inference infrastructure, shifting material trust away from closed ecosystems toward public and open-source intelligence.',
  'The Critical AI Engineer rejects the polarization of techno-utopianism and faux-criticality, choosing instead to provide the public with the technical nuance required to navigate complex ethical trade-offs.',
  'The Critical AI Engineer rejects the deceptive lucidity of the "omniscient assistant" persona, recognizing it as a mask for systemic uncertainty and bias. They design interfaces that provide a legible mapping of an AI\'s instability.',
  'The Critical AI Engineer resists the "innovation at all costs" mandate, recognizing that technical feasibility does not grant ethical or functional legitimacy.',
  'The Critical AI Engineer views "accessibility gains" through generative AI not as an inherent byproduct of the technology, but as a site of rigorous trade-off. They mandate the direct involvement of users throughout the design process to ensure that accessibility is an empirical outcome rather than a speculative marketing claim.',
  "The Critical AI Engineer distinguishes between true augmentation and the mere replication of existing workflows through \"human-assisted technology.\" They demand the time, capital, and patience necessary to move beyond the superficial automation of tasks, ensuring that agents empower individuals rather than burdening them with the hidden labor of overseeing fragile systems.",
  'The Critical AI Engineer resists the "war economy" of AI, characterized by reckless iteration speeds and excessive token consumption, by championing intentional, sovereign engineering. They prove through material implementation that ethical alternatives to data extractivism and labor exploitation are both possible and necessary.',
  'The Critical AI Engineer views AI engineering as a form of practice-based research, where theoretical and epistemological inquiry is an integral requirement. They recognize that concepts such as power, discourse, and knowledge-production are not abstract musings but the very material being engineered.',
  'The Critical AI Engineer recognizes that bias is often a failure of engineering rigor rather than a technological inevitability. They commit to quantifying and measuring algorithmic prejudice, viewing the refusal to conduct thorough evaluations not as a technical oversight, but as an intentional projection of human bias.',
  'The Critical AI Engineer recognizes that defining the boundaries of AI capability is a creative and practice-driven endeavor. By operating in novel, non-standard domains where models are most prone to collapse, the Critical AI Engineer ensures that society does not conform to the limitations of current LLMs, but instead demands the engineering of systems that address actual human needs.',
];

export function Manifesto() {
  return (
    <div className="page" data-screen-label="Manifesto">
      <div className="page-eyebrow">Our Values</div>
      <h1 className="page-title">The Critical AI Engineering Manifesto</h1>
      <p className="man-byline">By Vertti Luostarinen · annotated by Lù Chén</p>
      <p className="man-hint">
        <span className="man-hint-avatar" style={{ backgroundImage: `url(${luPhoto})` }} />
        Hover the green-marked passages to read Lù's margin notes.
      </p>

      <div className="man-intro">
        <p>The <a href="https://criticalengineering.org" target="_blank" rel="noreferrer">critical engineering manifesto</a> was originally published in 2011 by a group of three artists/engineers: Julian Oliver, Gordan Savičić and Danja Vasiliev. Although the manifesto is quite old at this point, it has lost none of its relevance, and I thought it would be a good starting point for defining my position as an AI engineer in this day and age, and when needed, to update it to the changed AI landscape.</p>
        <p>Like all good manifestos, the critical engineering manifesto raises more questions than it answers. The main question left open is the role of the engineer. The manifesto regards engineering more as a methodology for artists engaging in 'hacktivist' interventions. Engineers are responsible for building the infrastructure that designers and artists operate within. The focus on engineering, therefore, places an emphasis on foundational systems rather than individual projects. Rather than hacking existing systems, it proposes building new ones.</p>
        <p>Even though my job title is 'AI engineer', I see no clear difference between art, research, design and engineering. All four are needed to successfully complete a project. Writing prompts is an art, empirical evaluations and reviewing existing literature is research, understanding the needs of your stakeholders is design, and building the software architecture is engineering. It also needs to be noted that my work with AI mostly concerns LLMs, and to a lesser extent, computer vision.</p>
        <p>As an AI engineer, I have yet to see a single AI policy paper or ethical framework that had any bearing on my day-to-day work, so I need to create one for myself. In this text, my goal is to reinterpret the tenets of the critical engineering manifesto, and define what they mean to me in practice. Then, I distill these observations into a new manifesto, the Critical AI Engineering Manifesto.</p>
      </div>

      {MANIFESTO_TENETS.map((t) => (
        <React.Fragment key={t.num}>
          <div className="man-tenet">
            <div className="man-tenet-num">{t.num}</div>
            <p className="man-tenet-lead">{t.lead}</p>
          </div>
          <div className="man-tenet-body">{t.body}</div>
        </React.Fragment>
      ))}

      <div className="man-callout-ring">
        <div className="man-callout">
          <span className="man-callout-eyebrow">The Manifesto</span>
          <h2>A Reverse-engineered Critical AI Engineering Manifesto</h2>
          <ol start="0">
            {MANIFESTO_FINAL.map((line, i) => <li key={i}>{line}</li>)}
          </ol>
        </div>
      </div>

      <p className="man-footnote">Written by Vertti Luostarinen. Margin notes by Lù Chén. After <em>The Critical Engineering Manifesto</em> (Oliver, Savičić &amp; Vasiliev, 2011).</p>
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
