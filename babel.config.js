const IS_PROD = ["prod"].includes(process.env.VUE_APP_ENV);

const plugins = [
  "@babel/plugin-proposal-optional-chaining",
  "@babel/plugin-proposal-nullish-coalescing-operator"
];
if (IS_PROD) {
  plugins.push("transform-remove-console");
}

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins
};
