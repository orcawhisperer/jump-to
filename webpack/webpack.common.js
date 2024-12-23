const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: {
    popup: path.resolve(__dirname, '..', 'src/pages/popup/index.tsx'),
    options: path.resolve(__dirname, '..', 'src/pages/options/index.tsx'),
    background: path.resolve(__dirname, '..', 'src/background/index.ts'),
    content: path.resolve(__dirname, '..', 'src/content/index.ts')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [tailwindcss, autoprefixer]
              }
            }
          }
        ]
      },
      {
        test: /\.(jpg|jpeg|png|gif|ico|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico'],
    alias: {
      '@': path.resolve(__dirname, '..', 'src')
    }
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '..', 'src/assets'),
          to: path.resolve(__dirname, '..', 'dist/assets')
        },
        {
          from: path.resolve(__dirname, '..', 'src/manifest.json'),
          to: path.resolve(__dirname, '..', 'dist/manifest.json')
        }
      ]
    }),
    new HtmlPlugin({
      title: 'JumpTo',
      filename: 'popup.html',
      chunks: ['popup'],
      template: path.resolve(__dirname, '..', 'src/pages/popup/index.html')
    }),
    new HtmlPlugin({
      title: 'JumpTo Options',
      filename: 'options.html',
      chunks: ['options'],
      template: path.resolve(__dirname, '..', 'src/pages/options/index.html')
    })
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '..', 'dist'),
    clean: true
  },
  optimization: {
    splitChunks: {
      chunks(chunk) {
        return chunk.name !== 'content' && chunk.name !== 'background';
      }
    }
  },
  performance: {
    hints: false
  }
};
