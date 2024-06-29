import umami, { UmamiEventData } from "@umami/node";

umami.init({
  websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  hostUrl: "https://analytics.paperclip.xyz",
});

export async function trackEvent(name: string, payload: UmamiEventData) {
  console.log("TRACKING EVENT", name, payload);
  if (process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) {
    const resp = await umami.track(name, payload);

    if (!resp.ok) {
      console.error("Event tracking failed", resp.status, await resp.text());
    }
  }
}
