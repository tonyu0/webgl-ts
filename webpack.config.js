// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込む
const path = require('path')

module.exports = {
    // trueでwatchモードを有効にする。ファイル監視、再ビルド？キャッシュあり。
    watch: false,
    // webpack4以降はmodeを指定しないとwebpack実行時にエラー。
    // productionにするとoptimization.minimizerという設定が有効、圧縮されたふぁいるが出力
    mode: 'development',
    entry: path.resolve(__dirname, 'src/index.ts'),
    // SPA(画面)が増えるたび追加
    // output: {},
    module: {
        // .tsファイルはバンドル前にts-loaderでトランスパイル？babelも必要？
        rules: [
            {
                // loaderの処理対象ファイル
                test: /\.ts$/,
                use: [{
                    loader: 'ts-loader',
                    options: {},
                }],
                exclude: /node_modules/
            },
            {
                test: /\.(vert|frag)$/,
                exclude: /node_modules/,
                use: [
                    'raw-loader',
                    'glslify-loader'
                ]
            },
            {
                test: /\.(jpg|png)$/,
                loaders: 'url-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'src/gl'), 'node_modules']
    },

    // webpack-dev-serverの設定
    devServer: {
        port: 8080,
        contentBase: path.join(__dirname, 'dist/')
    }
}


