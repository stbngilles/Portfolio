import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const MEMBERS = {
  esteban: {
    idx: '01 / 02',
    name: 'Esteban',
    role: 'Fondateur · Designer-développeur',
    img: '/esteban.jpg',
    intro: 'Je code chaque site comme si c\'était le mien. La perf et le détail, ça ne se négocie pas.',
    facts: [
      { lbl: 'Rôle', val: 'Design & dev' },
      { lbl: 'Basé à', val: 'Liège, BE' },
      { lbl: 'Stack', val: 'Next.js / TS' },
      { lbl: 'Note Google', val: '5,0★' },
    ],
    sections: [
      { n: '01', t: 'L\'informatique, ma vocation', p: 'Actuellement en études d\'informatique et développement d\'applications, je gère toute la partie technique de l\'agence. De l\'architecture à la mise en ligne, en passant par le SEO, c\'est moi qui pose les fondations sous le capot.' },
      { n: '02', t: 'Ma vision d\'un bon site', p: 'Pour moi, un bon site va bien au-delà de l\'esthétique. C\'est avant tout un site fiable, parfaitement référencé et surtout un outil qui <em>convertit</em> les visiteurs en clients. Mon objectif technique est toujours de construire une plateforme qui réponde exactement à vos attentes — pas un truc à la mode qui sera obsolète dans deux ans.' },
      { n: '03', t: 'Ce qui me motive', p: 'Dans la création de sites web, ce qui m\'anime le plus, c\'est de pouvoir aider mes clients à gagner en visibilité. J\'aime l\'idée que mon code leur permette de continuer à vivre de leurs activités grâce à l\'investissement qu\'ils ont placé dans un outil performant. <em>Leurs succès deviennent aussi les miens.</em>' },
    ],
    stack: ['HTML / CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'SQL', 'SEO technique'],
  },
  amandine: {
    idx: '02 / 02',
    name: 'Amandine',
    role: 'Direction de projet · Relation client',
    img: '/amandine.jpg',
    intro: 'Un beau site qui ne convertit pas n\'a aucun intérêt. On dessine pour vos clients, pas pour le concours.',
    facts: [
      { lbl: 'Rôle', val: 'Direction de projet' },
      { lbl: 'Basée à', val: 'Liège, BE' },
      { lbl: 'Formation', val: 'Psychologie' },
      { lbl: 'Réponse', val: 'Sous 48 h' },
    ],
    sections: [
      { n: '01', t: 'Le parcours', p: 'Actuellement en études de psychologie — ma véritable passion — j\'ai aussi forgé mon expérience de terrain en boucherie. Ce contact direct avec la clientèle m\'a beaucoup apporté, et c\'est ce qui m\'a poussée à m\'investir comme commerciale indépendante. J\'aime <em>comprendre les gens</em>, écouter leurs besoins et les accompagner dans leurs projets.' },
      { n: '02', t: 'Mon rôle au quotidien', p: 'Je suis votre interlocutrice principale. Je gère l\'entièreté de la relation, de nos premiers échanges jusqu\'au lancement de votre site, en passant par sa maintenance. Ce qui me passionne le plus, c\'est cette <em>communication constante</em> avec vous, pour m\'assurer que votre vision prenne vie de manière parfaite et transparente.' },
    ],
    stack: null,
  },
};

function html(m, slug) {
  const url = `https://pixelbrute.be/equipe/${slug}/`;
  const img = `https://pixelbrute.be${m.img}`;
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${m.name} · ${m.role} — Pixelbrute · Studio web à Liège</title>
<meta name="description" content="${m.name}, ${m.role.toLowerCase()} chez Pixelbrute — studio web à Liège. ${m.intro.replace(/<[^>]+>/g, '').slice(0, 120)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">

<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icon.svg">
<meta name="theme-color" content="#1F3FBF">

<meta property="og:type" content="profile">
<meta property="og:locale" content="fr_BE">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="Pixelbrute">
<meta property="og:title" content="${m.name} — Pixelbrute · Studio web à Liège">
<meta property="og:description" content="${m.role}. ${m.intro.replace(/<[^>]+>/g, '').slice(0, 140)}">
<meta property="og:image" content="${img}">
<meta property="og:image:alt" content="${m.name}, ${m.role} chez Pixelbrute">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${m.name} — Pixelbrute">
<meta name="twitter:description" content="${m.role} · Pixelbrute · Studio web à Liège">
<meta name="twitter:image" content="${img}">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "${m.name}",
  "jobTitle": "${m.role}",
  "image": "${img}",
  "url": "${url}",
  "worksFor": {
    "@type": "Organization",
    "name": "Pixelbrute",
    "url": "https://pixelbrute.be/"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Liège",
    "addressCountry": "BE"
  }${m.stack ? `,\n  "knowsAbout": ${JSON.stringify(m.stack)}` : ''}
}
</script>

<link rel="stylesheet" href="/artifact/styles.css">
<style>
  .member-page { padding: 150px 0 120px; }
  @media (max-width: 720px) { .member-page { padding: 120px 0 80px; } }
  .back-link {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--muted); text-decoration: none;
    margin-bottom: 56px; transition: color 200ms;
  }
  .back-link:hover { color: var(--accent); }
  .back-link svg { width: 12px; height: 12px; }

  .mh {
    display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 60px;
    align-items: center; margin-bottom: 100px;
  }
  @media (max-width: 860px) { .mh { grid-template-columns: 1fr; gap: 40px; } }
  .mh__meta .eyebrow { margin-bottom: 22px; }
  .mh__name {
    font-family: var(--font-sans); font-weight: 700;
    font-size: clamp(56px, 7.5vw, 104px);
    line-height: 0.92; letter-spacing: -0.045em; margin: 0;
  }
  .mh__role {
    font-family: var(--font-serif); font-style: italic;
    font-size: clamp(22px, 2.2vw, 32px);
    color: var(--accent); margin-top: 14px; letter-spacing: -0.01em;
  }
  .mh__intro {
    font-size: 17px; color: var(--muted); line-height: 1.6;
    margin: 28px 0 0; max-width: 520px;
    border-left: 2px solid var(--accent); padding-left: 18px;
    font-style: italic;
  }
  .mh__portrait {
    aspect-ratio: 4/5; border-radius: 22px;
    background-size: cover; background-position: center;
    box-shadow: var(--shadow-card);
    position: relative; overflow: hidden;
  }
  .mh__portrait::after {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(31,63,191,.0) 60%, rgba(31,63,191,.18));
    pointer-events: none;
  }

  .facts {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1px; background: var(--line);
    border: 1px solid var(--line); border-radius: 18px;
    overflow: hidden; margin-bottom: 100px;
    background: var(--paper);
  }
  @media (max-width: 720px) { .facts { grid-template-columns: repeat(2, 1fr); } }
  .fact { padding: 26px 28px; background: var(--paper); }
  .fact .l {
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--muted); margin-bottom: 10px;
  }
  .fact .v {
    font-family: var(--font-serif); font-size: 26px;
    letter-spacing: -0.02em; color: var(--ink);
  }

  .narrative { max-width: 760px; margin: 0 auto 100px; }
  .nb { padding: 50px 0; border-top: 1px solid var(--line); }
  .nb:last-child { border-bottom: 1px solid var(--line); }
  .nb__n {
    font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em;
    color: var(--accent); margin-bottom: 16px; display: block;
  }
  .nb__t {
    font-family: var(--font-sans); font-weight: 600;
    font-size: clamp(26px, 3vw, 38px); letter-spacing: -0.02em;
    line-height: 1.1; margin: 0 0 18px;
  }
  .nb__t em { font-family: var(--font-serif); font-style: italic; font-weight: 400; color: var(--accent); }
  .nb__p { font-size: 17px; line-height: 1.7; color: var(--ink-soft); margin: 0; }
  .nb__p em { font-family: var(--font-serif); font-style: italic; color: var(--accent); font-size: 1.05em; }

  .stack-wrap { max-width: 760px; margin: 0 auto 100px; }
  .stack-wrap h3 {
    font-family: var(--font-sans); font-weight: 600;
    font-size: 22px; letter-spacing: -0.02em; margin: 0 0 24px;
  }
  .stack { display: flex; flex-wrap: wrap; gap: 10px; }
  .stack .chip {
    font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--ink-soft);
    border: 1px solid var(--line); border-radius: 999px;
    padding: 9px 16px; background: var(--paper);
  }

  .end-cta {
    text-align: center;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-ink) 100%);
    color: #fff; border-radius: 28px; padding: 80px 40px;
    position: relative; overflow: hidden;
  }
  .end-cta::before {
    content: ""; position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px,transparent 1px);
    background-size: 36px 36px;
  }
  .end-cta > * { position: relative; }
  .end-cta h2 {
    font-family: var(--font-sans); font-weight: 600;
    font-size: clamp(30px, 4vw, 48px); letter-spacing: -0.03em;
    line-height: 1.05; margin: 0 0 16px;
  }
  .end-cta h2 em { font-family: var(--font-serif); font-style: italic; font-weight: 400; color: var(--amber); }
  .end-cta p { font-size: 17px; color: rgba(255,255,255,.78); max-width: 520px; margin: 0 auto 32px; line-height: 1.6; }

  /* simple footer */
  .mini-footer {
    margin-top: 80px; padding: 30px 0; border-top: 1px solid var(--line);
    display: flex; flex-wrap: wrap; justify-content: space-between; gap: 14px;
    font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.06em;
    color: var(--muted);
  }
  .mini-footer a { color: inherit; text-decoration: none; }
  .mini-footer a:hover { color: var(--accent); }
</style>
</head>
<body>

<div class="bg-mesh"></div>
<div class="bg-grid"></div>

<!-- nav simplifié -->
<nav class="nav scrolled">
  <div class="nav__inner">
    <a href="/" class="brand"><span class="brand__mark"></span>Pixelbrute</a>
    <div class="nav__links">
      <a href="/#cible">Pour qui</a>
      <a href="/#work">Réalisations</a>
      <a href="/#methode">Méthode</a>
      <a href="/#faq">FAQ</a>
    </div>
    <a href="/#contact" class="btn btn-accent nav__cta">Démarrer un projet
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
    </a>
  </div>
</nav>

<main class="member-page">
  <div class="wrap">

    <a href="/#equipe" class="back-link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
      Retour à l'équipe
    </a>

    <div class="mh">
      <div class="mh__meta">
        <span class="eyebrow"><span class="bar"></span>Membre ${m.idx} · L'équipe</span>
        <h1 class="mh__name">${m.name}<span class="mh__role-inline"></span></h1>
        <div class="mh__role">${m.role}</div>
        <p class="mh__intro">« ${m.intro} »</p>
      </div>
      <div class="mh__portrait" style="background-image:url(${m.img})"></div>
    </div>

    <div class="facts">
      ${m.facts.map(f => `<div class="fact"><div class="l">${f.lbl}</div><div class="v">${f.val}</div></div>`).join('')}
    </div>

    <section class="narrative">
      ${m.sections.map(s => `
      <div class="nb">
        <span class="nb__n">${s.n}</span>
        <h2 class="nb__t">${s.t}</h2>
        <p class="nb__p">${s.p}</p>
      </div>`).join('')}
    </section>

    ${m.stack ? `
    <section class="stack-wrap">
      <h3>Stack &amp; spécialités</h3>
      <div class="stack">
        ${m.stack.map(s => `<span class="chip">${s}</span>`).join('')}
      </div>
    </section>` : ''}

    <section class="end-cta">
      <h2>Un projet en tête&nbsp;? <em>Parlons-en.</em></h2>
      <p>Un premier échange offert, sans engagement, pour voir ensemble ce qu'on peut construire.</p>
      <a href="/#contact" class="btn btn-light">Démarrer un projet
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
      </a>
    </section>

    <div class="mini-footer">
      <div>© ${new Date().getFullYear()} Pixelbrute · Studio web à Liège</div>
      <div><a href="mailto:contact@pixelbrute.be">contact@pixelbrute.be</a> · <a href="tel:+32492200275">+32 492 20 02 75</a></div>
    </div>

  </div>
</main>

</body>
</html>`;
}

for (const [slug, m] of Object.entries(MEMBERS)) {
  const out = path.join(root, 'public', 'artifact', `equipe-${slug}.html`);
  fs.writeFileSync(out, html(m, slug));
  console.log('built', out, '(', fs.statSync(out).size, 'bytes )');
}
