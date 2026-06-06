import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientShell from "@/components/ClientShell";

/**
 * Layout du site marketing (pixelbrute.be public).
 * Ce route group `(marketing)` est invisible dans l'URL : la racine `/`,
 * `/equipe`, `/services`, `/realisations` continuent de fonctionner exactement
 * comme avant. C'est uniquement pour découpler la chrome du site vitrine
 * de celle de la plateforme `/app/*`.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="noise-bg" />
      <Navbar />
      <ClientShell>{children}</ClientShell>
      <Footer />
    </>
  );
}
