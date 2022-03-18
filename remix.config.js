const alias = require("esbuild-plugin-alias");
const path = require("node:path");

/**
 * @type {import('remix-esbuild-override').AppConfig}
 */
module.exports = {
  serverBuildTarget: "cloudflare-workers",
  server: "./server.js",
  devServerBroadcastDelay: 1000,
  ignoredRouteFiles: [".*"],
  esbuildOverride: (option, { isServer }) => {
    option.plugins = [
      alias({
        through: require.resolve("no-op"),
        "html-tokenize": require.resolve("no-op"),
        multipipe: require.resolve("no-op"),
      }),
      ...option.plugins,
    ];
    if (isServer) {
      option.mainFields = ["browser", "module", "main"];
      option.inject?.push(path.resolve(__dirname, "process-shim.ts"));
      option.define = {
        ...option.define,
        "process.env.DOTENV_CONFIG_ENCODING": null,
        "process.env.DOTENV_CONFIG_PATH": null,
        "process.env.DOTENV_CONFIG_DEBUG": null,
        "process.env.DOTENV_CONFIG_OVERRIDE": null,
        "process.argv": "dummy_process_argv",
        "process.cwd": "dummy_process_cwd",
      };
    }
    return option;
  },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
};
