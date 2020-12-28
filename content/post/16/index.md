+++
title = "Hugo を使ったウェブサイトの作成: ウェブサイトの設定"
date  = 2018-12-10T22:50:44+09:00
tags  = ["Advent calendar", "Hugo", "Git", "GitHub"]
categories = ["Tech"]
aliases = ["/blog/16/"]
+++

## TL;DR :christmas_tree:

これはアドベントカレンダーの10日目の記事です。
今日は[昨日の続き](/blog/15)で、Hugo で作成したテストサイトの設定をいじっていきます。

## Site configuration (config.toml)

Hugo のウェブサイトの設定は config.toml というファイルで行います。
ちなみに [TOML (Tom's Obvious, Minimal Language)](https://github.com/toml-lang/toml) は JSON や YAML と同様の設定ファイル記述言語です。
今回は最低限の設定として、以下のような設定を書きました。
その他の設定可能な項目は、[Configure Hugo](https://gohugo.io/getting-started/configuration/) にまとまっています。

```toml
# このウェブサイトのタイトル
title = "Astropenguin"

# サイトの URL のルート
baseURL = "https://astropengu.in/"

# ウェブサイトのテーマ
theme = "minimo"

# 日本語の文字カウント等を有効化
hasCJKLanguage = true

# 絵文字の有効化
enableEmoji = true

# タグでのアクセント記号や大文字小文字の保持
preserveTaxonomyNames = false

# シンタックスハイライト有効化とスタイル
pygmentsCodefences = true
pygmentsStyle = "manni"

# タグのアドレス
[taxonomies]
tag = "tags"

# 記事の URL 設定
[permalinks]
page = "/:slug/"
blog = "/:section/:filename/"

# 外部リンクを新規タブで開く
[blackfriday]
hrefTargetBlank = true
```

この他に、テーマ固有の設定も書く必要がありますが、こちらはテーマによって異なるのでここではまとめません。
Minimo の場合は、[作者のデモページ](https://minimo.netlify.com/) を見てカスタマイズするのが良いと思います。
また、私のフルの config.toml を[こちら](https://github.com/astropenguin/website)で確認することもできます。

## References

+ [Minimo](https://minimo.netlify.com/)
+ [Configure Hugo \| Hugo](https://gohugo.io/getting-started/configuration/)
+ [toml\-lang/toml: Tom's Obvious, Minimal Language](https://github.com/toml-lang/toml)
+ [astropenguin/website: Personal website powered by Hugo](https://github.com/astropenguin/website)
