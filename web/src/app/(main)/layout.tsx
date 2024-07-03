import { LinkExternal } from "@/components/ui/link";
import Image from "next/image";
import { Header } from "@/components/Header";

function Footer() {
  return (
    <footer className="flex h-20 w-full flex-row items-center justify-center gap-1 px-10 py-2">
      Made for{" "}
      <LinkExternal href="https://nouns.wtf/">
        <Image src="/nouns-icon.png" width={40} height={40} alt="Nouns" draggable={false} />
      </LinkExternal>{" "}
      by
      <LinkExternal href="https://paperclip.xyz/">Paperclip Labs</LinkExternal>
    </footer>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="border-border-primary flex grow flex-col items-start justify-start gap-10 px-4 py-4 pb-0 md:px-8 md:pt-10">
        {children}
      </main>
      {/* <Footer /> */}
    </>
  );
}
