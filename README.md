# ValheimJS plugin template

Start a TypeScript plugin for [ValheimJS](https://github.com/Therosin/ValheimJS) without cloning
the host repository. The SDK is installed from GitHub and Bun bundles each entry into a standalone
ES module for the host.

## Get started

1. Use this repository as a GitHub template and clone your new repository.
2. Change `name` in `src/manifest.ini` to your plugin's stable folder name. Optionally update the
   project name in `package.json`. Keep `apiVersion` aligned with your ValheimJS host.
3. Install [Bun](https://bun.sh), then run:

   ```sh
   bun install
   bun run typecheck
   bun run build
   ```

4. Copy the **contents** of `dist/` into `<game root>/ValheimJS/plugins/<name>/`, where `<name>`
   matches the manifest. Install on each process that needs this plugin. The host must support ES
   module plugin entries.

```text
src/
  manifest.ini         plugin name, version and host API version
  shared/main.ts       both processes; initialized first
  server/main.ts       dedicated server process
  client/main.ts       client process, including a player host
dist/                  generated deployable plugin files
```

Each entry exports a plugin descriptor. Delete a side's `main.ts` if you don't need that entry;
the build generates only the entries that exist. Shared and side entries use the same context,
state and exports. A process side is not a world-authority check: a player host runs the client
entry while it may also have authority. See [process branches](https://github.com/Therosin/ValheimJS/blob/main/docs/guides/process-branches.md).

The build copies non-code files from `src/` to `dist/`, preserving paths. Put shipped files in
`src/assets/` or `src/behaviours/`; bundle ordinary source imports into the entry that uses them.
Do not import another entry's `main.ts`.

## Keeping the SDK current

The dependency follows the ValheimJS repository's `main` branch. Keep it current with the host
your players and server use, then rebuild. Bun records the resolved GitHub commit in `bun.lock`;
`bun update` can retain it. To request `main` again:

```sh
bun remove @valheimjs/sdk
bun add github:Therosin/ValheimJS#main
bun run typecheck
bun run build
```

Check `bun.lock` against the current GitHub revision if a cached response returns an older commit.
For the plugin lifecycle, APIs and deployment details, start with the
[ValheimJS guides](https://github.com/Therosin/ValheimJS/tree/main/docs/guides).
