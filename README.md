# esbuild-plugin-cp

ESBuild plugin for assets copy. 

It's a fork from linbudu599's [esbuild-plugin-copy](https://github.com/LinbuduLab/esbuild-plugins/tree/master/packages/esbuild-plugin-copy#readme)

watch has been removed. exclude has been added.


- [Author](https://github.com/Kwizach)
- [GitHub Repo](https://github.com/Kwizach/esbuild-plugin-cp#readme)
- [Changelog](https://github.com/Kwizach/esbuild-plugin-cp#CHANGELOG.md)

## Features

- Keep copied assets file structure
- Control assets destination path freely
- Exclude assets with blog
- Support verbose output log
- Run only once or only when assets changed

## Usage

```bash
npm install esbuild-plugin-cp --save-dev
pnpm install esbuild-plugin-cp --save-dev
yarn add esbuild-plugin-cp --save-dev
```

```typescript
import { build } from 'esbuild';
import { copy } from 'esbuild-plugin-cp';

(async () => {
  const res = await build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [
      copy({
        // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
        // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
        resolveFrom: 'cwd',
        assets: {
          from: ['./assets/*'],
          to: ['./assets', './tmp-assets'],
          exclude: [
            '.assets/*.txt',    // exclude all .txt files from assets 
            '.assets/**/*.js'   // exclude all .js files from assets and his sub directories
          ]
        },
      }),
    ],
  });
})();
```

### Keep file structure

```typescript
import { copy } from 'esbuild-plugin-cp';
import { build } from 'esbuild';

(async () => {
  const res = await build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    // as resolveFrom not set, we use dist as output base dir
    outfile: './dist/main.js',
    plugins: [
      copy({
        assets: [
          {
            from: ['./node_modules/tinymce/skins/**/*'],
            to: ['./dest/skins'],
          },
        ],
      }),
    ],
  });
})();
```

File structure will be kept:

```text
|-node_modules/tinymce/skins
|--- content
|----- dark
|----- default
|----- document
|--- ui
|----- oxide
|----- oxide-dark
```

```text
|- dist/dest/skins
|--- content
|----- dark
|----- default
|----- document
|--- ui
|----- oxide
|----- oxide-dark
```

You can also use patterns with extension names like `./path/**/*.js`.

## File Glob

Note: This plugin doesnot expand directories by default, which means when you're using pattern `dir/*` or `dir/*.*` , you will only get the file inside `dir/` like `dir/index.md`. If you want to match the nested files like `dir/path/to/index.md`, you will need to use pattern like `dir/**/*`.

If you're using `dir/*` and there are no files under this directory, you will got an warning:

```bash
No files matched using current glob pattern: ./node_modules/tinymce/skins/*, maybe you need to configure globby by options.globbyOptions?
```

## Configurations

```typescript
import type { GlobbyOptions } from 'globby';

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
   * set to true if you want to execute in onStart hook
   *
   * @default false
   */
  copyOnStart: boolean;

  /**
   * enable verbose logging
   *
   * outputs from-path and to-path finally passed to `fs.copyFileSync` method
   *
   * @default false
   */
  verbose: boolean;

  /**
   * options passed to `globby` when we 're globbing for files to copy
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
```
