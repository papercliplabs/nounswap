import umami, { UmamiEventData } from "@umami/node";
import Plausible from "plausible-tracker";

umami.init({
  websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  hostUrl: "https://umami.paperclip.xyz",
});

const plausible = Plausible({
  domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DATA_DOMAIN,
  apiHost: "https://plausible.paperclip.xyz",
});

export async function trackEvent(name: string, payload: UmamiEventData) {
  console.log("TRACKING EVENT", name, payload);

  // Umami
  if (process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) {
    try {
      const resp = await umami.track(name, payload);
      if (!resp.ok) {
        console.error("Event tracking failed", resp.status, await resp.text());
      }
    } catch (e) {
      console.error("Umami event tracking failed", e);
    }
  }

  // Plausible
  if (process.env.NEXT_PUBLIC_PLAUSIBLE_DATA_DOMAIN) {
    try {
      plausible.trackEvent(name, payload);
    } catch (e) {
      console.error("Plausible event tracking failed", e);
    }
  }
}
