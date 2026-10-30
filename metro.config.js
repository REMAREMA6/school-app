const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Limit watch folders to reduce inotify watcher usage
// Only watch app/, src/, and project root config files — NOT node_modules
config.watchFolders = [
  path.resolve(__dirname, "app"),
  path.resolve(__dirname, "src"),
];

// Exclude node_modules from the watcher to avoid ENOSPC errors
config.watcher = {
  ...config.watcher,
  healthCheck: { enabled: false },
};

// Also restrict resolver to not look inside node_modules for non-JS assets
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
];

module.exports = withNativeWind(config, { input: "./global.css" });
