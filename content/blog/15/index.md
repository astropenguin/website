+++
title = "Hugo を使ったウェブサイトの作成: テストサイトの表示"
date  = 2018-12-09T17:40:27+09:00
tags  = ["Advent calendar", "Hugo", "Git", "GitHub", "Memo"]
emoji = true
draft = false
+++

## TL;DR :christmas_tree:

これはアドベントカレンダーの9日目の記事です。
今日は[昨日の続き](/blog/14)で、いよいよ Hugo を使ってウェブサイトを作成していきます。

## Install hugo

まずは Hugo をローカルにインストールします。
ここでは Homebrew を使ってインストールしました。
また、ついでに Hugo のバージョンも確認しておきましょう。
このバージョンは、後ほど Travis CI でビルドする際の Hugo のバージョンで使うのでメモしておきます

```shell
$ brew install hugo
$ hugo version
Hugo Static Site Generator v0.52/extended darwin/amd64 BuildDate: unknown
```

ここでは v0.52 であることが確認できました。

## Create an empty website

次に、Hugo で空のウェブサイトを作成し、Git での管理を開始します。
ここでは website というディレクトリを作成しました。
また、GitHub で website という名前でリモートレポジトリを作成し、これを追加します。

```shell
$ hugo new site website && cd website
$ git init
$ git remote add origin https://github.com/astropenguin/website.git
```

この状態のディレクトリ構成は以下のようになっていると思います。

```shell
$ tree -a -L 1
.
├── .git
├── archetypes
├── config.toml
├── content
├── data
├── layouts
├── static
└── themes
```

以下では、特に断りがなければ website ディレクトリで各種コマンドを実行しています。

```shell
$ pwd
/path/to/website
```

トップの6個のディレクトリは空でも Git に管理されるように .gitkeep という空のファイルを追加しておきます。
ファイル名は .gitkeep である必要はありませんが、慣習的にこうなっているようです。
また、ビルド結果が保存される public, resources ディレクトリ以下は Git の管理から外すため .gitignore に追記しておきます。

```shell
$ touch archetypes/.gitkeep
$ touch content/.gitkeep
$ touch data/.gitkeep
$ touch layouts/.gitkeep
$ touch static/.gitkeep
$ touch themes/.gitkeep
$ echo /public >> .gitignore
$ echo /resources >> .gitignore
```

## Choosing a theme

ここで、ウェブサイトのテーマを選びます。
テーマは Hugo でウェブサイトをビルドする際に必ず必要となるものです。
今回は、ミニマルなデザインかつ数式表示やウィジェットをサポートしているということで、 [Minimo](https://themes.gohugo.io/minimo/) を選びました。
このページからダウンロードしたものを themes ディレクトリに配置しても良いのですが、作者が [GitHub](https://github.com/MunifTanjim/minimo) で管理しているので、このレポジトリを submodule として追加することにします。

```shell
$ git submodule add https://github.com/MunifTanjim/minimo themes/minimo
```

こうすることで Minimo のコミット ID のみを管理するので、テーマの無数のファイルを website レポジトリで管理しなくてよくなります。
ここまでの作業をコミット→プッシュしておきます。

```shell
$ git add --all
$ git commit -m "Initial commit"
$ git push origin master
```

## An example site

Minimo テーマには exampleSite と呼ばれる、文字通りウェブサイトの作成例を示したファイルとディレクトリ (config.toml, content, data, static) が同梱されています。
これをコピーして、ローカルでウェブサイトがどう見えるかチェックしてみます。

```shell
$ cp -r themes/minimo/exampleSite/ .
```

この状態で `hugo server` を実行することで、 localhost:1313 でウェブサイトをプレビューすることができます。

```shell
$ open http://localhost:1313 && hugo server
```

こんな感じで表示されれば成功です！

![](examplesite.png)

次回からは、ここでコピーしてきた Hugo の設定ファイル (config.toml) を編集することで、私自身のウェブサイトの設定をしていきます。

## References

+ [Complete List \| Hugo Themes](https://themes.gohugo.io/)
+ [Minimo \| Hugo Themes](https://themes.gohugo.io/minimo/)
+ [MunifTanjim/minimo: Minimo \- Minimalist theme for Hugo](https://github.com/MunifTanjim/minimo)