import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Loader } from 'webpack';

type ModuleSettings = [string, { modules: boolean }];

export interface IPostCSSConfig {
  exec?: boolean;
  parser?: string | object;
  syntax?: string | object;
  plugins?: any[] | ((loader: any) => any[]);
  sourceMap?: string | boolean;
}

export interface IStylesConfig {
  postcss?: boolean | IPostCSSConfig;
}

export interface IRule {
  ext: string;
  use: Loader[];
}

function getExtensionSettings(ext: string): ModuleSettings[] {
  return [
    [`^(?!.*\\.global\\.${ext}$).*\\.${ext}$`, { modules: true }],
    [`\\.global\\.${ext}$`, { modules: false }],
  ];
}

export const rules: IRule[] = [
  {
    ext: 'css',
    use: [],
  },
];

const isProduction = process.env.NODE_ENV === 'production';

// Create generator to get rules
export default function *css(isClient = true) {

  // Source maps depend on us being in development
  const sourceMap = !isProduction;

  for (const loader of rules) {
    // Iterate over CSS/SASS/LESS and yield local and global mod configs
    for (const [test, modules] of getExtensionSettings(loader.ext)) {

      // Build the use rules
      const use = [
        // CSS hot loading on the client, in development
        (isClient && !isProduction) && 'css-hot-loader',

        // Add MiniCSS if we're on the client
        isClient && MiniCssExtractPlugin.loader,

        // Set-up `css-loader`
        {
          loader: isClient ? 'css-loader' : 'css-loader/locals',

          options: {
            importLoaders: loader.use.length + 1,
            localIdentName: '[local]-[hash:base64]',

            minimize: false,
            sourceMap,
            ...modules,
          },
        },

        // Add PostCSS
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins() {
              return [
                require('postcss-cssnext')({
                  features: {
                      autoprefixer: false,
                    },
                  },
                ),
                require('cssnano')(),
              ];
            },
            // Enable sourcemaps in development
            sourceMap,
          },
        },

        // Copy over the loader's specific rules
        ...loader.use,
      ];

      // Yield the full rule
      yield {
        test: new RegExp(test),

        // Remove all falsy values
        use: use.filter(l => l) as Loader[],
      };
    }
  }
}
