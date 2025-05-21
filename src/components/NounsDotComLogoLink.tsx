import Link from "next/link";
import Icon from "./ui/Icon";
import clsx from "clsx";

export function NounsDotComLogoLink({ darkMode }: { darkMode?: boolean }) {
  return (
    <Link
      href="/"
      className="flex shrink grow-0 flex-row items-center gap-1.5 [&>svg]:hover:rotate-12"
    >
      <Icon
        icon="swap"
        size={28}
        className={clsx(
          "transition-all ease-linear",
          darkMode ? "fill-white" : "fill-content-primary",
        )}
      />
      <div
        className={clsx(
          "hidden heading-4 md:flex",
          darkMode ? "text-white" : "text-content-primary",
        )}
      >
        Nouns.com
      </div>
    </Link>
  );
}
