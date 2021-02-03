+++
title = "ADC/MDASへのLinuxbrewのインストール（2021年版）"
description = "最新版のcURL・Gitを手動で入れてから行いましょう"
date = 2021-02-03T15:28:00+09:00
tags = ["Linux", "Linuxbrew", "cURL", "Git"]
categories = ["Tech"]
image = "image.jpg"
+++

## TL;DR :snowman:

以前の記事（[ADC/MDAS への Linuxbrew のインストール](/posts/11)）で、天文データセンター（ADC）の多波長データ解析システム（MDAS）に Linuxbrew をインストールする際の手順をまとめました。
ところが、システムにインストールされているcURLとGitのバージョンが古いため、2021年2月時点で最新版のLinuxbrewでは新規インストールやアップデートの際にエラーが出てしまいます。
この記事では、最新版のcURLとGitを管理者権限なしでインストールすることで、これを回避する方法をまとめました。

## 最新版のcURLのインストール

MDASにログイン後、以下のスクリプトを実行することで、`USER_LOCAL`直下に最新版のcURLがインストールされます。

```bash
USER_LOCAL=$HOME/.local
CURL_VERSION=7.74.0

wget https://curl.se/download/curl-$CURL_VERSION.tar.gz
tar xf curl-$CURL_VERSION.tar.gz
cd curl-$CURL_VERSION
./configure --prefix=$USER_LOCAL
make install
```

## 最新版のGitのインストール

続いて、以下のスクリプトを実行することで、`USER_LOCAL`直下に最新版のGitがインストールされます。

```bash
USER_LOCAL=$HOME/.local
GIT_VERSION=2.30.0

wget https://github.com/git/git/archive/v$GIT_VERSION.tar.gz
tar xf v$GIT_VERSION.tar.gz
cd git-$GIT_VERSION
make configure
./configure --prefix=$USER_LOCAL
make install
```

## 環境変数の設定

最後に、諸々の環境変数を設定・反映させます。
特に`HOMEBREW_*`が重要で、手動でインストールしたcURL・GitをシステムのものだとLinuxbrewに認識させるのに必要です。

```bash
USER_LOCAL='$HOME/.local'
BASH_PROFILE=$HOME/.bash_profile

echo 'export PATH=$PATH:'$USER_LOCAL/bin >> $BASH_PROFILE
echo 'export HOMEBREW_DEVELOPER=1' >> $BASH_PROFILE
echo 'export HOMEBREW_CURL_PATH='$USER_LOCAL/bin/curl >> $BASH_PROFILE
echo 'export HOMEBREW_GIT_PATH='$USER_LOCAL/bin/git >> $BASH_PROFILE

source $BASH_PROFILE
```

## Linuxbrewのインストール（初回のみ）

すでにLinuxbrewがインストール済みの場合、以下の手順は必要ありません。

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## References

- [Git - Gitのインストール](https://git-scm.com/book/ja/v2/%E4%BD%BF%E3%81%84%E5%A7%8B%E3%82%81%E3%82%8B-Git%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB)
- [build and install curl from source](https://curl.se/docs/install.html)
- [brew/brew.sh at master · Homebrew/brew](https://github.com/Homebrew/brew/blob/master/Library/Homebrew/brew.sh#L289)
