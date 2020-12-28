+++
title = "プログラミング用フォント Ricty のインストール"
date  = 2018-12-11T23:06:55+09:00
tags  = ["Advent calendar", "Ricty", "Homebrew"]
categories = ["Tech"]
aliases = ["/blog/17/"]
+++

## TL;DR :christmas_tree:

これはアドベントカレンダーの11日目の記事です。
今日は雑ですが、プログラミング用フォント Ricty のインストールのメモです。

## Ricty

> Ricty (リクティ) は Linux 環境での研究・開発を想定したプログラミング用フォントです。
> テキストエディタやターミナルエミュレータ、プログラミング言語やマークアップ言語に対する使用に適しています。
- [プログラミング用フォント Ricty](https://www.rs.tus.ac.jp/yyusa/ricty.html)

ということで、これを VS Code や Terminal のフォントとして設定すると見やすくなりそうです。

## Installation

インストールは Homebrew で行えます。
インストール後に以下の通りの caveats が出ますので、その通りにします。

```shell
==> Caveats
***************************************************
Generated files:
  /usr/local/opt/ricty/share/fonts/RictyDiscord-Regular.ttf
      /usr/local/opt/ricty/share/fonts/Ricty-Bold.ttf
      /usr/local/opt/ricty/share/fonts/Ricty-Regular.ttf
      /usr/local/opt/ricty/share/fonts/RictyDiscord-Bold.ttf
***************************************************
To install Ricty:
  $ cp -f /usr/local/opt/ricty/share/fonts/Ricty*.ttf ~/Library/Fonts/
  $ fc-cache -vf
***************************************************
```

というわけで、全てのスクリプトは以下の通りです。

```shell
$ brew tap sanemat/font
$ brew install ricty
$ cp -f /usr/local/opt/ricty/share/fonts/Ricty*.ttf ~/Library/Fonts/
$ fc-cache -vf
```

VS Code に設定したらこんな感じになりました！

![](ricty-vscode.png)

## References

+ [プログラミング用フォント Ricty](https://www.rs.tus.ac.jp/yyusa/ricty.html)
+ [プログラミング用フォントRictyをMacにインストールする \- Qiita](https://qiita.com/segur/items/50ae2697212a7bdb7c7f)
