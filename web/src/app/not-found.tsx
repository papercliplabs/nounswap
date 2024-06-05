import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex grow flex-col items-center justify-center">
      <h2>404 - Not Found</h2>
      <p>Could not find requested resource</p>
      <Suspense fallback={<LoadingSpinner />}>
        <Link href="/">Return Home</Link>
      </Suspense>
    </div>
  );
}
