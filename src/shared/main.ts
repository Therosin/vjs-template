import { definePlugin } from "@valheimjs/sdk";

// Runs on both process types, before the matching server or client entry.
// Check live authority before performing world-authoritative work.
export default definePlugin({
    // setup(ctx) { ... },
    // onServerTick(ctx, snapshot) { ... },
});
