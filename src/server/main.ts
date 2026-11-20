import { definePlugin } from "@valheimjs/sdk";

// Runs on the dedicated-server process, after shared setup.
// A player hosting a world uses the client entry instead; process side is not authority.
export default definePlugin({
    // Add dedicated-server hooks and setup here.
});
