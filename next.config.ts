// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração para SVGs com webpack 5
  webpack(config, { isServer }) {
    // Pega a regra do file-loader para imagens
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.('.svg')
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
                'prefixIds',
              ],
            },
          },
        },
      ],
    });

    return config;
  },
  
};

export default nextConfig;