var path = require('path')
var HtmlWebpackPlugin=require('html-webpack-plugin');
module.exports={
    entry:'./src/index.js',
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'dist')
    },
    devServer:{
        inline: true//实时刷新
    },
    plugins:[
        new HtmlWebpackPlugin ({
            title: '',
            inject: true,
            template: path.resolve (__dirname, './index.html')
        })
    ]
}