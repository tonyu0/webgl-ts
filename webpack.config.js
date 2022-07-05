// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込む
const path = require('path')

module.exports = {
    // trueでwatchモードを有効にする。ファイル監視、再ビルド？キャッシュあり。
    watch: false,
    // webpack4以降はmodeを指定しないとwebpack実行時にエラー。
    // productionにするとoptimization.minimizerという設定が有効、圧縮されたふぁいるが出力
    mode: 'development',
    entry: {
        main: path.resolve(__dirname, 'src/index.ts'),
        app: path.resolve(__dirname, 'src/app.ts'),
        page0: path.resolve(__dirname, 'src/page0.ts'),
        page1: path.resolve(__dirname, 'src/page1.ts'),
        glsl: path.resolve(__dirname, 'src/glsl-renderer.ts'),
    },
    // SPA(画面)が増えるたび追加
    // output: {},
    module: {
        // .tsファイルはバンドル前にts-loaderでトランスパイル？babelも必要？
        rules: [
            {
                // loaderの処理対象ファイル
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {},
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.(vert|frag)$/,
                exclude: /node_modules/,
                use: ['raw-loader', 'glslify-loader'],
            },
            {
                test: /\.(jpg|png)$/,
                loaders: 'url-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'src/gl'), 'node_modules'],
    },

    // webpack-dev-serverの設定
    devServer: {
        port: 8080,
        contentBase: path.join(__dirname, 'dist/'),
        historyApiFallback: true, // 404s willl fallback to index.html
    },
}
