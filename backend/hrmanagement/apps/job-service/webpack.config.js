const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { join } = require('path');

module.exports = {
  target: 'node',
  output: {
    path: join(__dirname, '../../dist/apps/job-service'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    plugins: [
      // Kütüphanelerin tsconfig içindeki alias yollarını Webpack'e zorla öğretir
      new TsconfigPathsPlugin({
        configFile: join(__dirname, './tsconfig.app.json'),
      }),
    ],
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc', // tsc kullanıldığı için Babel aranmasını engelleyecek
      main: './src/main.ts',
      tsConfig: join(__dirname, './tsconfig.app.json'),
      assets: ["./src/assets"],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: false,
      sourceMap: true,
    }),
  ],
};
