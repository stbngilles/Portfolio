import Script from "next/script";
import "./home.css";
import Ink from "@/components/home/Ink";
import Motion from "@/components/home/Motion";
import BookingWidget from "@/components/home/BookingWidget";
import Consent from "@/components/home/Consent";
import { CONSENT_KEY } from "@/components/home/consent-key";

/**
 * Chrome de la homepage. Séparée de `(marketing)/layout.tsx` : la home a sa
 * propre direction artistique, son header, son footer et son moteur de
 * mouvement (smooth scroll + ScrollTrigger, voir `Motion`).
 */

/**
 * Google Tag Manager porte toute la mesure à cookies : GA4, Clarity, et Google
 * Ads le jour des annonces. Rien n'est codé en dur ici en dehors de lui, une
 * balise s'ajoute dans le conteneur, pas dans le code.
 *
 * Posé ici et pas dans le layout racine : la plateforme `/app/*` n'a rien à
 * faire dans les statistiques du site, ni de bannière à afficher.
 *
 * Le script inline pose le consentement par défaut *avant* de charger GTM :
 * dans l'autre ordre, les balises du conteneur partiraient sans lui. Il relit
 * le choix enregistré par `Consent` (valable six mois), pour qu'un visiteur
 * qui a déjà accepté ne soit pas compté comme refusé à chaque arrivée.
 */
const GTM_ID = "GTM-WSJD329S";

const TAGS = `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
var pbc='denied';
try{var s=JSON.parse(localStorage.getItem('${CONSENT_KEY}')||'null');if(s&&s.v==='granted'&&Date.now()-s.t<15724800000)pbc='granted';}catch(e){}
gtag('consent','default',{analytics_storage:pbc,ad_storage:pbc,ad_user_data:pbc,ad_personalization:pbc,wait_for_update:500});
gtag('set','ads_data_redaction',true);
gtag('set','url_passthrough',true);
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb">
      <Script id="gtm" strategy="afterInteractive">
        {TAGS}
      </Script>
      <Motion />
      <Ink />
      {children}
      <BookingWidget />
      <Consent />
    </div>
  );
}
