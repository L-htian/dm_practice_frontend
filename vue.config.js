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

    devServer:{
        assetsPublicPath: './',
    },
}