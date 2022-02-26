let path = require("path");
const webpack = require("webpack");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
// 代码压缩
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const resolve = (dir) => {
  return path.join(__dirname, dir);
};

const productionGzipExtensions = ["js", "css"];
const isProd = process.env.VUE_APP_ENV === "production";

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: "Vue",
    "vue-router": "VueRouter",
    vuex: "Vuex",
    axios: "axios"
  },
  css: [],
  js: [
    "//cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js",
    "//cdn.jsdelivr.net/npm/vue-router@3.3.4/dist/vue-router.min.js",
    "//cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js",
    "//cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js"
  ]
};

module.exports = {
  devServer: {
    port: 8000, //自定义项目运行端口
    // open: "true",  //自动打开浏览器
    // proxy: {
    //   "/server": {
    //     target: "http://site.ydidc.com/server",
    //     changeOrigin: true,
    //     pathRewrite: {
    //       "^/server": ""
    //     }
    //   },
    //   "/form": {
    //     target: "http://site.ydidc.com/server/form",
    //     changeOrigin: true,
    //     pathRewrite: {
    //       "^/form": ""
    //     }
    //   }
    // }
  },
  configureWebpack: (config) => {
    config.entry.app = ["babel-polyfill", "whatwg-fetch", "./src/main.js"];
    config.performance = {
      hints: false
    };
    // Ignore all locale files of moment.js
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
    // 生产环境下将资源压缩成gzip格式
    if (isProd) {
      // gzip压缩
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: "gzip",
          test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
          threshold: 10240,
          minRatio: 0.8
        })
      );
      // 清楚console
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            output: {
              // 删除注释
              comments: false
            },
            compress: {
              drop_console: true //清除console语句
              // pure_funcs: ['console.log'] // 自定义去除函数
            }
          },
          sourceMap: false
        })
      );
    }
    // if prod, add externals
    if (isProd) {
      config.externals = assetsCDN.externals;
    }
  },
  chainWebpack: (config) => {
    // 配置别名
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@views", resolve("src/views"))
      .set("@components", resolve("src/components"));
    // 生产环境下关闭css压缩的 colormin 项，因为此项优化与主题色替换功能冲突
    if (isProd) {
      config.plugin("optimize-css").tap((args) => {
        args[0].cssnanoOptions.preset[1].colormin = false;
        return args;
      });
    }
    // 生产环境下使用CDN
    if (isProd) {
      config.plugin("html").tap((args) => {
        args[0].cdn = assetsCDN;
        return args;
      });
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            "primary-color": "#00aaff",
            "primary-color-2": "#46A1FF",
            "success-color": "#05BF69",
            "error-color": "#FF5330",
            "border-radius-base": "4px",
            "text-color-secondary": "#ACB3B9",
            "text-color": "#475666",
            "table-row-hover-bg": "#edf2f6"
          },
          javascriptEnabled: true
        }
      }
    }
  },
  publicPath: "/console",
  outputDir: "dist",
  assetsDir: "static",
  productionSourceMap: false,
  lintOnSave: true
};
