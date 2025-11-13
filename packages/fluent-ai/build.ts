import dts from "bun-plugin-dts";

await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  external: ["zod"],
  plugins: [
    dts({
      libraries: {
        importedLibraries: ["zod"],
      },
    }),
  ],
  format: "esm",
  target: "bun",
  naming: "[dir]/[name].js",
});
