module.exports = {
    // 项目部署的基础路径
    // 我们默认假设你的应用将会部署在域名的根部,
    // 例如 https://www.my-app.com/
    // 如果你的应用部署在一个子路径下，那么你需要在这里
    // 指定子路径。比如将你的应用部署在
    // https://www.foobar.com/my-app/
    // 那么将这个值改为 '/my-app/'
    publicPath: process.env.NODE_ENV === 'production'
        ? './'
        : '/',
    // 构建好的文件输出到哪里
    outputDir: "dist",
    // 是否在保存时使用‘eslint-loader’进行检查 // 有效值: true | false | 'error'
    // 当设置为‘error’时，检查出的错误会触发编译失败
    lintOnSave: true,
    assetsDir: 'static',
    parallel: false,
    runtimeCompiler: true, //关键点在这
    pwa: {
        iconPaths: {
            favicon32: 'favicon.ico',
            favicon16: 'favicon.ico',
            appleTouchIcon: 'favicon.ico',
            maskIcon: 'favicon.ico',
            msTileImage: 'favicon.ico'
        }
    },
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/cli-service.md#配置代理
        proxy: null, // string | Object
        before: app => {}
    },
}