/** @type {import('next').NextConfig} */

const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE_BUNDLE === 'true' });
const newrelicExternals = require('newrelic/load-externals');

const nextConfig = {
  compiler: { emotion: true },
  transpilePackages: [
    '@newscorp-djcs/sonata-react',
    '@newscorp-ghfb/wsj-react-library',
    '@newscorp-ghfb/dj-upc-library',
    'wsj-svg',
  ],
  experimental: {
    clientRouterFilter: false,
    esmExternals: 'loose',
    instrumentationHook: true,
    webVitalsAttribution: ['CLS', 'LCP'],
  },
  reactStrictMode: false,
  sassOptions: { includePaths: [path.join(__dirname, 'styles')] },
  webpack(wpConfig) {
    newrelicExternals(wpConfig);

    wpConfig.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            replaceAttrValues: { '#222': 'currentColor' },
            svgoConfig: { plugins: [{ name: 'preset-default', removeViewBox: false }] },
          },
        },
        'url-loader',
      ],
    });

    return wpConfig;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
