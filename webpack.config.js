const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: './dist/bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    watch: true,
};
