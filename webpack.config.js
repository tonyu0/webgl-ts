// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込む
const path = require('path')

module.exports = {
    // watchモードを有効にする。ファイル監視、再ビルド？キャッシュあり。
    watch: true,
    // webpack4以降はmodeを指定しないとwebpack実行時にエラー。
    // productionにするとoptimization.minimizerという設定が有効、圧縮されたふぁいるが出力
    mode: 'development',
    entry: path.resolve(__dirname, 'src/index.ts'),
    // エントリの定義: モジュール間の依存関係の解析を解析する地点のこと、mainのことだね
    // SPA(画面)が増えるたび追加
    // output: {},
    module: {
        // loohaaderの設定: .tsファイルはバンドル前にts-loaderでトランスパイル？babelも必要？
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
            }
        ]
    },

    // webpack-dev-serverの設定
    devServer: {
        port: 8080,
        contentBase: path.join(__dirname, 'dist/')
    }
}


