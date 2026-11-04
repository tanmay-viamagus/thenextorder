import { initBotId } from "botid/client/core";

// Vercel BotID: invisible bot classification for the registration and RSVP endpoints (checked server-side in each).
initBotId({
  protect: [
    { path: "/api/register", method: "POST" },
    { path: "/api/rsvp", method: "POST" },
  ],
});
