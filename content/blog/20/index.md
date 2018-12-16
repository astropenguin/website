+++
title = "IPython/Jupyter の設定も Pipenv で管理する"
date  = 2018-12-14T12:28:08+09:00
tags  = ["Advent calendar", "Python", "IPython", "Jupyter", "Pipenv"]
categories = ["Tech"]
emoji = true
draft = false
+++

## TL;DR :christmas_tree:

これはアドベントカレンダーの14日目の記事です。
[2018年の Python プロジェクトのはじめかた](https://qiita.com/sl2/items/1e503952b9506a0539ea) にもあるように、[pipenv](https://pipenv-ja.readthedocs.io/ja/translate-ja/) の登場によって Python でも依存関係 (Python バージョン + パッケージ) を両方管理した環境構築が簡単にできるようになりました。
そうなると、IPython や Jupyter の設定ファイルや、パッケージのインポートなどを記述できる IPython のスタートアップスクリプトも環境ごとに管理したいところです。
そこで、この記事では pipenv で作成した環境でこれらを管理する方法をまとめます。

## Create an environment

前提条件として、以下のコマンドで pipenv で作成した仮想環境 (ここでは名前を env とします) と、IPython/Jupyter がインストール済みであるとします。
特に明記がない限り、コマンドは env から実行しているものとします。
また、仮想環境に (`pipenv shell` で) 入ってコマンドを実行している場合は、プロンプトを `(env) $ ` として表しました。


```shell
$ mkdir env && cd env
$ pipenv --python 3
$ pipenv install ipython jupyter
```

## IPython profile

IPython 関連は、プロファイルと呼ばれるディレクトリとファイル群によって設定されます。
通常これは `ipython profile create default` によって、~/.ipython/profile_default に作成されることが多いと思いますが (多くの記事もこれに従っているはず) 、何もしないと仮想環境でもこれを引き継いで使ってしまうため、あまり使い勝手がよくありません。
そこで、env 以下にプロファイルを作成し、これを読み込むように pipenv を設定します。

まず、.env ファイルに以下の環境変数を書き込むことで、pipenv 実行時には env/.ipython が ~/.ipython の代わりに IPython ディレクトリとして使われるようになります。

```shell
$ echo 'IPYTHONDIR=.ipython' >> .env
```

この状態で以下のようにプロファイルを作成することで、env/.ipython/profile_default が作成されます。

```shell
$ pipenv shell
(env) $ mkdir -p .ipython
(env) $ ipython profile create default
```

例えば、スタートアップスクリプトで何かパッケージをインポートするようにしてみましょう。

```shell
# import this で Zen of Python を表示
(env) $ echo 'import this' >> .ipython/profile_default/startup/01.py
```

この状態で IPython shell を起動してみます。
以下のように、Zen of Python が表示されれば成功です。

```shell
(env) $ ipython
Loading .env environment variables…
Python 3.6.5 (default, Jul 10 2018, 11:33:24)
Type 'copyright', 'credits' or 'license' for more information
IPython 7.2.0 -- An enhanced Interactive Python. Type '?' for help.
The Zen of Python, by Tim Peters

Beautiful is better than ugly.
Explicit is better than implicit.
...
```

## Create a Jupyter kernel

上で作成したプロファイルを Jupyter Notebook でも使用したい場合、プロファイルを受け取れるような IPython kernel を作成してあげる必要があります。
以下のコマンドで、.venv 以下にカーネルが作成されます。

```shell
(env) $ ipython kernel install --sys-prefix --profile default --display-name Default
Installed kernelspec python3 in /path/to/env/.venv/share/jupyter/kernels/python3
```

オプションのうち、`--profile` は IPython プロファイル名と同じにしておきます。
`--display-name` はブラウザで表示される任意のカーネル名です。
この状態で Jupyter Notebook を起動してみます。

```shell
(env) $ jupyter notebook
```

ウェブブラウザが開き、新規ノートブック作成 (New) から上で設定したカーネル (ここでは Default) が選べるようになっていれば成功です。

![](display-name.png)

## Demo repository

ここまでの手順は、スクリプトにまとめて [pipenv のスクリプトショートカット](https://pipenv-ja.readthedocs.io/ja/translate-ja/advanced.html#custom-script-shortcuts) から実行できるようにしておくと便利です。
そこで、これのデモ用に以下のレポジトリを GitHub で公開しました。

:penguin: [astropenguin/pipenv\-ipython\-jupyter: Demo of IPython/Jupyter custom config management by Python\-pipenv](https://github.com/astropenguin/pipenv-ipython-jupyter)

これを clone したのち、以下の通りに実行すると、上記の諸々の設定が自動で行われます。

```shell
$ pipenv install
$ pipenv run configure
```

あとは、.ipython/profile_default を git で管理するなりすれば、環境構築がさらに楽になるはずです！

## References

+ [Overview of the IPython configuration system — IPython documentation](https://ipython.readthedocs.io/en/stable/development/config.html)
+ [Installing the IPython kernel -- IPython documentation](https://ipython.readthedocs.io/en/stable/install/kernel_install.html)
+ [Custom Script Shortcuts — pipenv documentation](https://pipenv.readthedocs.io/en/latest/advanced/#custom-script-shortcuts)
+ [Automatic Loading of .env -- pipenv documentation](https://pipenv.readthedocs.io/en/latest/advanced/#automatic-loading-of-env)
+ [astropenguin/pipenv\-ipython\-jupyter: Demo of IPython/Jupyter custom config management by Python\-pipenv](https://github.com/astropenguin/pipenv-ipython-jupyter)
+ [2018年の Python プロジェクトのはじめかた \- Qiita](https://qiita.com/sl2/items/1e503952b9506a0539ea)