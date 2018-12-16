+++
title = "ADC/MDAS への Linuxbrew のインストール"
date  = 2018-12-05T18:18:49+09:00
tags  = ["Advent calendar", "Linux", "Linuxbrew"]
categories = ["Tech"]
emoji = true
draft = false
+++

## TL;DR :christmas_tree:

これはアドベントカレンダーの5日目の記事です。
今日は天文データセンター (ADC) の[多波長データ解析システム (MDAS)](https://www.adc.nao.ac.jp/MDAS/mdas_j.html) に [Linuxbrew](http://linuxbrew.sh/) をインストールする際の手順をまとめました。

## Linuxbrew on ADC/MDAS

[Linuxbrew](http://linuxbrew.sh/) は macOS で使われているパッケージ管理システム [Homebrew](https://brew.sh/) の Linux 版です。
ADC/MDAS では一般ユーザは root 権限を持たないので、何かパッケージをインストールするときに root 権限を必要としない Linuxbrew を使えるととても便利です。

## Installation

インストールは [Install Linuxbrew](http://linuxbrew.sh/) に従っておけば OK です。
ADC/MDAS にログインした状態で以下を実行します。
これで Linuxbrew の諸々が `~/.linuxbrew` に置かれます。

```shell
$ sh -c "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install.sh)"
```

メモとしてですが、 git と curl を (すでにあるのに) インストールするようで、これらの依存関係をかなりの時間をかけて解決していました。
どうやら、システムの git と curl が最新版よりかなり古い場合、これらも brew でインストールすることになっているようです。
無事インストールが終わったら、[Install Linuxbrew](http://linuxbrew.sh/) にあるように、テストとパスの設定を行います。
ADC/MDAS は OS が RedHat なので、以下の通りで OK です。

```shell
$ test -d ~/.linuxbrew && eval $(~/.linuxbrew/bin/brew shellenv)
$ test -d /home/linuxbrew/.linuxbrew && eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)
$ test -r ~/.bash_profile && echo "eval \$($(brew --prefix)/bin/brew shellenv)" >> ~/.bash_profile
```

これでインストール作業完了です！
いったんログアウト→ログインして、コマンド `brew doctor` が動くか確認してください。

```shell
$ brew doctor
```

Warning は多数出ますが、error が出てなければ問題ないでしょう。
実際にパッケージをインストールする様子は明日以降にまとめたいと思います。

## References

+ [Linuxbrew | The Homebrew package manager for Linux](http://linuxbrew.sh/)
+ [The missing package manager for macOS — The missing package manager for macOS](https://brew.sh/)
+ [brew\(1\) – The missing package manager for macOS — Homebrew Documentation](https://docs.brew.sh/Manpage)