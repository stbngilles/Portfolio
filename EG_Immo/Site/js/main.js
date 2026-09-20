/* Maison — comportement du site (menu, fiches, formulaire) */
(function () {
  "use strict";
  if (location.search.indexOf("capture") !== -1) document.documentElement.classList.add("capture");
  if (location.search.indexOf("ecran") !== -1) document.documentElement.classList.add("ecran");

  var BIENS = {
    "MG-0027": {
      titre: "Villa sous les chênes",
      lieu: "Brasschaat",
      pays: "Belgique",
      prix: "2 950 000 €",
      accroche: "Une villa moderniste baignée de lumière, implantée au cœur d’un environnement boisé et préservé.",
      recit: "Quatre chambres, un parc de 4 200 m², quinze minutes d’Anvers.",
      description: [
        "Posée en retrait de la rue, la villa s’ouvre sur son parc par des baies toute hauteur. Le séjour à double hauteur prolonge la terrasse et la piscine, dans un même plan de pierre claire.",
        "Quatre chambres, chacune avec sa salle de bain, occupent l’étage. Au rez-de-chaussée, un bureau, une cuisine ouverte et une buanderie complètent des volumes calmes et précis."
      ],
      faits: [["Localisation", "Brasschaat, Anvers"], ["Surface habitable", "625 m²"], ["Chambres", "4"], ["Salles de bain", "4"], ["Terrain", "4 200 m²"], ["Année", "2022"]],
      caracteristiques: ["Piscine extérieure", "Terrasse couverte", "Cuisine ouverte", "Bureau", "Garage double", "Domotique", "Chauffage par le sol", "Alarme"],
      pourquoi: ["Un parc de 4 200 m² entièrement clos, sans vis-à-vis.", "Une lumière traversante du matin au soir, orientation sud-ouest.", "Quinze minutes d’Anvers, écoles internationales à proximité."],
      situation: [["Anvers, centre", "15 min"], ["Écoles internationales", "10 min"], ["Aéroport de Bruxelles", "45 min"]],
      images: ["brasschaat-01", "brasschaat-02", "brasschaat-03", "brasschaat-04", "brasschaat-05", "brasschaat-06"],
      alt: "Villa contemporaine blanche au bord de sa piscine, dans un parc arboré à Brasschaat"
    },
    "MG-0031": {
      titre: "Maison de verre",
      lieu: "Oud-Turnhout",
      pays: "Belgique",
      prix: "3 295 000 €",
      accroche: "Béton clair et verre, une maison livrée en 2023 dont chaque terrasse suit la course du soleil.",
      recit: "Livrée en 2023, terrasses plein sud, intimité totale.",
      description: [
        "Construite sur un terrain d’angle dans un quartier résidentiel calme, la maison a été pensée pour la lumière. L’entrée, en double hauteur, donne directement sur la pièce de vie et le jardin.",
        "Les finitions ont été choisies sans compromis : menuiseries fines, pierre naturelle, cuisine sur mesure. Les terrasses profitent d’un ensoleillement maximal tout en préservant une intimité totale."
      ],
      faits: [["Localisation", "Oud-Turnhout, Anvers"], ["Surface habitable", "465 m²"], ["Chambres", "3"], ["Salles de bain", "2"], ["Terrain", "3 072 m²"], ["Année", "2023"]],
      caracteristiques: ["Terrasses multiples", "Piscine", "Cheminée", "Sauna", "Cuisine extérieure", "Foyer extérieur", "Dressing", "Alarme"],
      pourquoi: ["Une construction récente, sans travaux à prévoir.", "Un plan simple et lisible, où chaque pièce voit le jardin.", "Un quartier calme, à vingt minutes de Turnhout et quarante d’Anvers."],
      situation: [["Turnhout", "20 min"], ["Anvers", "40 min"], ["Eindhoven", "45 min"]],
      images: ["anvers-01", "anvers-02", "anvers-03", "anvers-04", "anvers-05", "anvers-06"],
      alt: "Villa en béton clair et verre, façade ouverte sur le jardin, près d’Anvers"
    },
    "MG-0034": {
      titre: "Pavillon des pins",
      lieu: "Kapellen",
      pays: "Belgique",
      prix: "Prix sur demande",
      accroche: "Sous les pins, une villa d’architecte et son pavillon de bien-être, pour une vie de villégiature à l’année.",
      recit: "Six chambres, piscine chauffée, plus de 5 000 m² de jardin.",
      description: [
        "Nichée dans un cadre verdoyant, la villa déploie ses volumes autour d’une piscine chauffée. Le pavillon, avec sauna et vue panoramique, prolonge les jours d’été jusqu’à l’automne.",
        "Six chambres et de multiples terrasses accueillent une famille nombreuse ou des invités, en toute indépendance. Le jardin paysagé, entièrement clos, garantit une intimité rare."
      ],
      faits: [["Localisation", "Kapellen, Anvers"], ["Surface habitable", "495 m²"], ["Chambres", "6"], ["Salles de bain", "3"], ["Terrain", "5 044 m²"], ["Année", "1998, rénovée en 2020"]],
      caracteristiques: ["Piscine chauffée", "Pavillon de bien-être", "Sauna", "Terrasses", "Comptoirs en pierre", "Cheminée", "Garage", "Jardin paysagé"],
      pourquoi: ["Plus de 5 000 m² de jardin, une rareté à Kapellen.", "Une architecture de caractère, rénovée avec justesse.", "Le calme des pins, à dix minutes du centre et vingt d’Anvers."],
      situation: [["Kapellen, centre", "10 min"], ["Anvers", "20 min"], ["Frontière néerlandaise", "15 min"]],
      images: ["kapellen-01", "kapellen-02", "kapellen-03", "kapellen-04", "kapellen-05", "kapellen-06"],
      alt: "Villa à toit de chaume et pavillon de piscine sous les pins, à Kapellen"
    },
    "MG-0036": {
      titre: "Maison du parc",
      lieu: "Kapellen",
      pays: "Belgique",
      prix: "1 690 000 €",
      accroche: "Un patio au centre, du verre tout autour : une maison calme, ouverte sur son jardin et sur le ciel.",
      recit: "Plain-pied, patio central, à deux pas du centre.",
      description: [
        "Construite en 2023, la maison s’organise autour d’un patio central qui distribue la lumière dans chaque pièce. Le séjour, la salle à manger et la cuisine forment un même espace, prolongé par une terrasse couverte.",
        "Trois chambres, un bureau et une salle de télévision occupent l’aile arrière. Un sous-sol complet et un garage complètent l’ensemble."
      ],
      faits: [["Localisation", "Kapellen, Anvers"], ["Surface habitable", "447 m²"], ["Chambres", "3"], ["Salles de bain", "1"], ["Terrain", "1 335 m²"], ["Année", "2023"]],
      caracteristiques: ["Patio central", "Terrasse couverte", "Sous-sol", "Garage", "Bureau", "Buanderie", "Chauffage par le sol", "Alarme"],
      pourquoi: ["Une construction neuve aux finitions durables.", "Un plan de plain-pied, rare et recherché.", "Un quartier discret, à deux pas du centre de Kapellen."],
      situation: [["Kapellen, centre", "5 min"], ["Gare de Kapellen", "7 min"], ["Anvers", "20 min"]],
      images: ["kapellen-b-01", "kapellen-b-02", "kapellen-b-03", "kapellen-b-04", "kapellen-b-05", "kapellen-b-06"],
      alt: "Maison en pierre grise aux lignes horizontales, posée sur une pelouse à Kapellen"
    }
  };

  var accueil = document.getElementById("accueil");
  var fiche = document.getElementById("bien");
  var mentions = document.getElementById("mentions-legales");
  var menu = document.getElementById("menu");
  var ouvrirs = document.querySelectorAll("[data-menu-ouvrir]");
  var fermer = menu.querySelector("[data-menu-fermer]");
  var dernierFocus = null;

  function q(sel) { return fiche.querySelector(sel); }
  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined) e.textContent = txt;
    return e;
  }

  /* ---------- Menu ---------- */
  function ouvrirMenu() {
    dernierFocus = document.activeElement;
    menu.setAttribute("data-open", "true");
    menu.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
    marquerOuvert("true");
    fermer.focus();
  }
  function fermerMenu() {
    menu.setAttribute("data-open", "false");
    menu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
    marquerOuvert("false");
    if (dernierFocus && dernierFocus.focus) dernierFocus.focus();
  }
  function marquerOuvert(valeur) {
    Array.prototype.forEach.call(ouvrirs, function (b) { b.setAttribute("aria-expanded", valeur); });
  }
  Array.prototype.forEach.call(ouvrirs, function (b) { b.addEventListener("click", ouvrirMenu); });
  fermer.addEventListener("click", fermerMenu);
  document.addEventListener("keydown", function (e) {
    if (menu.getAttribute("data-open") !== "true") return;
    if (e.key === "Escape") fermerMenu();
    /* Le focus reste dans le menu tant qu'il est ouvert */
    if (e.key === "Tab") {
      var focusables = menu.querySelectorAll("a, button");
      var premier = focusables[0], dernier = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
      else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
    }
  });
  Array.prototype.forEach.call(menu.querySelectorAll("a"), function (a) {
    a.addEventListener("click", function () { fermerMenu(); });
  });

  function marquerMenu(cible) {
    Array.prototype.forEach.call(menu.querySelectorAll(".menu__nav a"), function (a) {
      if (a.getAttribute("href") === cible) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  /* ---------- Image responsive (AVIF > WebP, largeurs 640 / 1080 / 1600) ---------- */
  var LARGES = { "brasschaat-01": true, "anvers-01": true, "kapellen-01": true, "kapellen-b-01": true, "brasschaat-03": true, "brasschaat-05": true, "kapellen-02": true, "kapellen-03": true, "kapellen-b-02": true };
  function imageResponsive(nom, alt, sizes, eager) {
    var ws = LARGES[nom] ? [640, 1080, 1600] : [640, 1080];
    var pic = el("picture");
    ["avif", "webp"].forEach(function (f) {
      var src = el("source");
      src.type = "image/" + f;
      src.srcset = ws.map(function (w) { return "img/r/" + nom + "-" + w + "." + f + " " + w + "w"; }).join(", ");
      src.sizes = sizes;
      pic.appendChild(src);
    });
    var img = el("img");
    img.src = "img/r/" + nom + "-1080.webp"; img.alt = alt;
    img.width = 1600; img.height = 1067;
    if (!eager) img.loading = "lazy";
    pic.appendChild(img);
    return pic;
  }

  /* ---------- Carte de bien (sélection, biens similaires) ---------- */
  function carteBien(ref, b, image) {
    var art = el("article", "bien-carte");
    var fig = el("div", "bien-carte__image");
    fig.appendChild(imageResponsive(image, b.alt, "(max-width: 860px) 100vw, (max-width: 1100px) 50vw, min(33vw, 460px)"));
    var texte = el("div", "bien-carte__texte");
    var gauche = el("div");
    var h = el("h3");
    var a = el("a", null, b.titre); a.href = "#bien/" + ref;
    h.appendChild(a);
    gauche.appendChild(h);
    gauche.appendChild(el("p", "recit", b.recit));
    gauche.appendChild(el("p", "lieu", b.lieu + " · " + b.faits[1][1]));
    texte.appendChild(gauche);
    texte.appendChild(el("span", "chiffre prix", b.prix === "Prix sur demande" ? "Sur demande" : b.prix));
    art.appendChild(fig); art.appendChild(texte);
    return art;
  }

  /* ---------- Fiche bien ---------- */
  function rendreBien(ref) {
    var b = BIENS[ref];
    if (!b) return false;
    var heroZone = q("[data-bien-hero]");
    heroZone.replaceChildren(imageResponsive(b.images[0], b.alt, "100vw", true));
    q("[data-bien-ref]").textContent = "Réf. " + ref;
    q("[data-bien-titre]").textContent = b.titre;
    q("[data-bien-lieu]").textContent = b.lieu + " · " + b.pays;
    q("[data-bien-accroche]").textContent = b.accroche;
    q("[data-bien-prix]").textContent = b.prix;

    var faits = q("[data-bien-faits]");
    faits.innerHTML = "";
    b.faits.concat([["Référence", ref]]).forEach(function (f) {
      var li = el("li");
      li.appendChild(el("span", null, f[0]));
      li.appendChild(el("span", null, f[1]));
      faits.appendChild(li);
    });

    var galerie = q("[data-bien-galerie]");
    galerie.innerHTML = "";
    b.images.slice(1).forEach(function (nom, i) {
      var fig = el("figure");
      fig.appendChild(imageResponsive(nom, b.titre + ", vue " + (i + 2), "(max-width: 860px) 100vw, min(62vw, 890px)"));
      galerie.appendChild(fig);
    });

    var desc = q("[data-bien-description]");
    desc.innerHTML = "";
    b.description.forEach(function (p) { desc.appendChild(el("p", null, p)); });

    var carac = q("[data-bien-caracteristiques]");
    carac.innerHTML = "";
    b.caracteristiques.forEach(function (c) { carac.appendChild(el("li", null, c)); });

    var pourquoi = q("[data-bien-pourquoi]");
    pourquoi.innerHTML = "";
    b.pourquoi.forEach(function (c) { pourquoi.appendChild(el("li", null, c)); });

    var situation = q("[data-bien-situation]");
    situation.innerHTML = "";
    b.situation.forEach(function (s) {
      var li = el("li");
      li.appendChild(el("span", null, s[0]));
      li.appendChild(el("span", null, s[1]));
      situation.appendChild(li);
    });

    var similaires = q("[data-bien-similaires]");
    similaires.innerHTML = "";
    Object.keys(BIENS).filter(function (k) { return k !== ref; }).forEach(function (k) {
      similaires.appendChild(carteBien(k, BIENS[k], BIENS[k].images[0]));
    });

    Array.prototype.forEach.call(fiche.querySelectorAll("[data-bien-visite]"), function (btn) {
      btn.onclick = function () {
        document.getElementById("recherche").value = "Visite privée de « " + b.titre + " » (" + ref + ").";
      };
    });
    document.title = b.titre + " · Maison";
    return true;
  }

  function router() {
    var h = location.hash || "";
    if (h === "#mentions-legales") {
      accueil.hidden = true;
      fiche.hidden = true;
      mentions.hidden = false;
      marquerMenu("");
      document.title = "Mentions légales · Maison";
      window.scrollTo(0, 0);
      mentions.querySelector("h1").focus({ preventScroll: true });
      return;
    }
    var m = h.match(/^#bien\/(MG-\d{4})$/);
    if (m && rendreBien(m[1])) {
      accueil.hidden = true;
      mentions.hidden = true;
      fiche.hidden = false;
      marquerMenu("#selection");
      window.scrollTo(0, 0);
      fiche.querySelector("h1").focus({ preventScroll: true });
      return;
    }
    var etaitFiche = !fiche.hidden || !mentions.hidden;
    fiche.hidden = true;
    mentions.hidden = true;
    accueil.hidden = false;
    document.title = "Maison";
    var cible = h && document.querySelector(h);
    if (h === "" || h === "#maison") marquerMenu("#maison");
    else if (cible) marquerMenu(h);
    if (cible && etaitFiche) cible.scrollIntoView({ block: "start" });
  }
  window.addEventListener("hashchange", router);
  router();

  /* ---------- Formulaire ---------- */
  var form = document.getElementById("formulaire");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bouton = form.querySelector("button[type=submit]");
    bouton.disabled = true;
    bouton.textContent = "Envoi…";
    setTimeout(function () {
      var merci = el("p", "formulaire__merci", "Merci. Nous vous rappelons sous deux jours ouvrés, à l’heure qui vous convient.");
      merci.setAttribute("role", "status");
      merci.setAttribute("tabindex", "-1");
      form.replaceChildren(merci);
      merci.focus();
    }, 618);
  });
})();
