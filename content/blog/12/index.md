+++
title = "ADC/MDAS への tmux のインストール"
date  = 2018-12-06T12:16:40+09:00
tags  = ["Advent calendar", "Linux", "Linuxbrew", "tmux"]
emoji = true
draft = false
+++

## TL;DR :christmas_tree:

これはアドベントカレンダーの6日目の記事です。
今日は[昨日の続き](/blog/11)で、[Linuxbrew](http://linuxbrew.sh/) を利用して ADC/MDAS に [tmux](https://github.com/tmux/tmux) をインストールした話です。

## Install tmux by Linuxbrew

ALMAデータのキャリブレーションやイメージングなどの重い処理の際に、ネットワークトラブルなどで不意にSSH接続が切れてしまい最初から作業のやり直し、というのは大変です。
また、複数のデータを並行して処理したい時に処理の数だけターミナルをを開くのも面倒です。
そこで、SSH接続が切れてもサーバ上の処理を継続させたり、1つのSSH接続で複数の処理を並行して実行できたりできる、tmux (terminal multiplexer) というソフトウェアを使うのがとても便利です。
[昨日の記事](/blog/11)で Linuxbrew が準備できているので、インストールはとても簡単です。

```shell
$ brew install tmux
```

ただし、Linuxbrew で git と curl をインストールしている影響で、そのまま tmux を起動すると以下のようなメッセージが出ます (tmux 自体は動きます) 。

```shell
$ tmux
Package bash-completion was not found in the pkg-config search path.
Perhaps you should add the directory containing `bash-completion.pc'
to the PKG_CONFIG_PATH environment variable
No package 'bash-completion' found
bash: /yum: No such file or directory
```

これを回避するためには、以下を .bash_profile に書いておけば OK です。

```shell
$ echo 'export PKG_CONFIG_PATH=$PKG_CONFIG_PATH:/usr/share/pkgconfig' >> ~/.bash_profile
```

## References

+ [tmux/tmux: tmux source code](https://github.com/tmux/tmux)