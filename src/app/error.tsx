"use client"; // Error components must be Client Components
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/utils/analytics";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("APPLICATION ERROR", error);
    trackEvent("app_error", { message: `${error}` });
  }, [error]);

  return (
    <div className="flex grow flex-col items-center justify-center gap-2 p-4 text-center">
      <h2>Ooops, something went wrong :(</h2>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
