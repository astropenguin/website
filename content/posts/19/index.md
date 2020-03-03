+++
title = "RADEX の自動インストーラを作成する"
date  = 2018-12-13T02:13:09+09:00
tags  = ["Advent calendar", "RADEX", "Homebrew", "GNU make"]
categories = ["Tech"]
toc = true
aliases = ["/blog/19/"]
+++

## TL;DR :christmas_tree:

これはアドベントカレンダーの13日目の記事です。
最近私の周りで non-LTE 放射輸送計算コード [RADEX](https://personal.sron.nl/~vdtak/radex/index.shtml) を使う人が増えてきたので、ビルドとインストールを GNU make や Homebrew で行えるようにしたという話です。

## Create Makefile

RADEX を使うためには、通常は [ウェブサイト](https://personal.sron.nl/~vdtak/radex/index.shtml)からソースコードをダウンロードし、説明に従ってビルドします。
その際、光子の脱出確率を決めるために ISM の geometry を与えたり、分子の Einstein 係数や衝突係数のデータファイルを格納するためのディレクトリを指定したりする必要があり、自動インストーラを作成するのには向いていないツールです。
そこで、これらを以下の通りに解決することで、インストーラを作成していくことにします。

1. ISM geometry ごとに異なる RADEX バイナリをビルドすることにする。これによって、3つのバイナリ `radex-uni` (uniform sphere) 、`radex-lvg` (expanding sphere) 、`radex-slab` (plane parallel slab) が生成される。
1. データディレクトリはデフォルトでは与えない。その代わり、RADEX 実行時にユーザがデータファイルのフルパスを指定する。

## GNU make

インストーラとしては、GNU make を選びました。
これは、だいたいどの環境でもデフォルトで `make` コマンドが用意されているためです。
というわけで、出来上がったものを以下で公開しました。

:zap: [astropenguin/radex\-install: Build and Install RADEX easily](https://github.com/astropenguin/radex-install)

使い方は README に書いてある通りですが、ビルドに必要な `gfortran` をインストールした上で Makefile をダウンロードし、同ディレクトリで

```shell
$ make install
```

するだけで RADEX バイナリのインストールが完了します。
これまでの手間を考えると、とても良い感じです。

## Homebrew

さらに、この Makefile を使って Homebrew formula も作成しました。

:beer: [astropenguin/homebrew\-formulae: Homebrew formulae for various tools](https://github.com/astropenguin/homebrew-formulae)

こちらは、以下の2行で `gfortran` のインストールも同時にやってくれます。

```shell
$ brew tap astropenguin/formulae
$ brew install radex
```

かなり便利になりました！

## References

+ [Radex: Non\-LTE molecular radiative transfer in homogeneous interstellar clouds](https://personal.sron.nl/~vdtak/radex/index.shtml)
+ [astropenguin/radex\-install: Build and Install RADEX easily](https://github.com/astropenguin/radex-install)
+ [astropenguin/homebrew\-formulae: Homebrew formulae for various tools](https://github.com/astropenguin/homebrew-formulae)
