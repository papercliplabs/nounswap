import { LinkExternal } from "@/components/ui/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/Icon";

export default function StartJourney() {
  return (
    <section className="flex w-full max-w-[1680px] flex-col items-center justify-center gap-8 px-6 md:gap-16 md:px-10">
      <div className="flex flex-col items-center justify-center gap-2 px-6 text-center md:px-10">
        <h2>Start your Nouns journey</h2>
        <div className="max-w-[660px] paragraph-lg">
          Whether you're an artist, technologist, scientist, athlete, or someone
          with big ideas, there's a place for you in the Nouns community.
        </div>
      </div>
      <div className="flex w-full flex-col gap-6 md:flex-row md:gap-10">
        <LinkExternal
          href="https://warpcast.com/~/channel/nouns"
          className="relative flex w-full max-w-[1600px] flex-col items-center justify-start gap-6 overflow-hidden rounded-3xl bg-[#8661CD] p-6 text-center text-white md:p-12"
        >
          <Image
            src="/socials/farcaster.svg"
            width={48}
            height={48}
            alt="Farcaster"
          />
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-center text-white">Join the Nouns Community</h2>
            <div className="max-w-[640px] text-center text-gray-200 paragraph-lg">
              Join the conversation on Farcaster, a social network similar to X
              and Reddit. Share your ideas, connect with the Nouns community.
            </div>
          </div>
          <Button
            variant="secondary"
            className="flex gap-2.5 rounded-full border-none label-lg"
          >
            <span>Join Nouns on Farcaster</span>
            <Icon
              icon="arrowUpRight"
              size={24}
              className="fill-content-primary"
            />
          </Button>
          <div className="flex items-center justify-center gap-1.5">
            <Image
              src="/farcaster-followers.png"
              width={58}
              height={24}
              alt=""
            />
            <span>100k+ Followers</span>
          </div>
        </LinkExternal>

        <LinkExternal
          href="https://www.nouns.camp/"
          className="relative flex w-full max-w-[1600px] flex-col items-center justify-start gap-6 overflow-hidden rounded-3xl bg-background-dark p-6 text-center text-white md:p-12"
        >
          <Image src="/proposals.svg" width={48} height={48} alt="Proposals" />
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-center text-white">Explore Proposals</h2>
            <div className="max-w-[640px] text-center text-gray-200 paragraph-lg">
              Discover active proposals to see what the Nouns community is
              funding. Learn about the ideas shaping the future of Nouns.
            </div>
          </div>
          <Button
            variant="secondary"
            className="flex gap-2.5 rounded-full border-none label-lg"
          >
            <span>View Proposals</span>
            <Icon
              icon="arrowUpRight"
              size={24}
              className="fill-content-primary"
            />
          </Button>
        </LinkExternal>
      </div>
    </section>
  );
}
