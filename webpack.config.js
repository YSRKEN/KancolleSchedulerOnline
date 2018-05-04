const path = require('path');

module.exports = {
    entry: [
        './src/app.ts'
    ],
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.csv$/,
                loader: 'url-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            }
        ]
    },
    performance: { hints: false }
};