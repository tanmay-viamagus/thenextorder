import { initBotId } from "botid/client/core";

// Vercel BotID: invisible bot classification for the registration endpoint (checked server-side in /api/register).
initBotId({
  protect: [{ path: "/api/register", method: "POST" }],
});
