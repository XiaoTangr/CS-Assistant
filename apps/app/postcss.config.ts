module.exports = {
    plugins: [
        require('autoprefixer')({
            // 浏览器兼容性配置
            overrideBrowserslist: [
                '> 1%',           // 全球使用率大于1%
                'last 2 versions', // 每个浏览器的最后两个版本
                'not dead',       // 排除不再维护的浏览器
                'not ie < 11',    // 排除IE11以下版本
                'Chrome >= 60',   // Chrome 60及以上
                'Firefox >= 50',  // Firefox 50及以上
                'Safari >= 10',   // Safari 10及以上
                'Edge >= 15'      // Edge 15及以上
            ],
            // 是否添加 flexbox 前缀
            flexbox: 'no-2009', // 默认值，不添加2009年版本的flexbox前缀

            // 是否添加 grid 前缀
            grid: false, // 默认值，不添加grid前缀

            // 是否支持旧语法
            supports: true,

            // 是否添加 @viewport 前缀
            viewport: true
        }),
        require('cssnano')({
            preset: 'default'
        })
    ]
}