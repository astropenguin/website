+++
title = "Hugo shortcode を使った Instagram 埋め込みテスト"
date  = 2018-12-16T01:33:19+09:00
tags  = ["Advent calendar", "Instagram", "Hugo"]
categories = ["Tech"]
aliases = ["/blog/22/"]
+++

## TL;DR :christmas_tree:

これはアドベントカレンダーの16日目の記事です。
今日は雑ですが、Hugo に標準で実装されている、ショートコードを使ったメディアの埋め込みのメモです。

## Embedding an Instagram photo

Hugo は `{{/* params */}}` のフォーマットで、[各種ショートコード](https://gohugo.io/content-management/shortcodes/)を提供しています。
例えば、下の写真は以下のショートコードで埋め込んでいます。

```plaintext
{{</* instagram BrfsVjEhud0 hidecaption */>}}
```

`<script>` タグを使って埋め込むよりも簡単かつ読みやすい Markdown になるので便利ですね。
ちなみに、ショートコードを**コードとして表示する**際は、 `{{</*/* params */*/>}}` と書かないと `<pre>` タグの中でも Hugo によって変換されてしまうため注意が必要です。

## References

+ [Shortcodes | Hugo](https://gohugo.io/content-management/shortcodes/)
