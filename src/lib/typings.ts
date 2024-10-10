import type { Options as GlobbyOptions } from 'globby';

export type MaybeArray<T> = T | T[];

// file/folder/globs
export interface AssetPair {
  /**
   * from path is resolved based on `cwd`
   */
  from: MaybeArray<string>;

  /**
   * to path is resolved based on `outdir` or `outfile` in your ESBuild options by default
   * you can also set `resolveFrom` to change the base dir
   */
  to: MaybeArray<string>;

  /**
   * exclude path(s) or file(s)
   */
  exclude?: MaybeArray<string>;
}

export interface Options {
  /**
   * assets pair to copy
   *
   * @default []
   */
  assets: MaybeArray<AssetPair>;

  /**
   * execute copy in `ESBuild.onEnd` hook(recommended)
   *
   * set to 'onStart' if you want to execute in onStart hook
   *
   * @default 'onEnd'
   */
  hook: 'onStart' | 'onEnd';

  /**
   * enable verbose logging
   *
   * outputs from-path and to-path finally passed to `fs.copyFileSync` method
   *
   * @default false
   */
  verbose: boolean;

  /**
   * options passed to `globby` when we're globbing for files to copy
   *
   * @default {}
   */
  globbyOptions: GlobbyOptions;

  /**
   * only execute copy operation once
   *
   * useful when you're using ESBuild.build watching mode
   *
   * @default false
   */
  once: boolean;

  /**
   * base path used to resolve relative `assets.to` path
   * by default this plugin use `outdir` or `outfile` in your ESBuild options
   * you can specify "cwd" or process.cwd() to resolve from current working directory,
   * also, you can specify somewhere else to resolve from.
   *
   * @default "out"
   */
  resolveFrom: 'cwd' | 'out' | (string & {});

  /**
   * use dry run mode to see what's happening.
   *
   * by default, enable this option means enable `verbose` option in the same time
   *
   * @default false
   */
  dryRun?: boolean;
}
