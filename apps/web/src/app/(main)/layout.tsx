import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/Nav/MobileNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex grow items-start justify-center">{children}</main>
      <Footer />
      <MobileNav />
    </>
  );
}
