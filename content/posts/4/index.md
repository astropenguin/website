+++
title = "rsync を使った転送・バックアップ"
date  = 2018-12-01T18:41:26+09:00
tags  = ["Linux"]
categories = ["Tech"]
aliases = ["/blog/4/"]
+++

rsync は SSH でのファイル・ディレクトリの転送・バックアップに便利な一方、
オプションが複雑なため間違えるとコピー先のデータを消してしまうこともある。
そこで、転送・バックアップのよく使うオプションについてまとめておく。

## Copy

### scp 相当の使い方をする場合

```shell
$ rsync -av source destination
```

### 中断した転送を再開できるようにする場合

```shell
$ rsync -avP source destination
```

+ `-P` オプションで `destiation` に中断時点の一時データが残される

## Backup

### ディレクトリごとバックアップする場合

```shell
$ rsync -av --delete source destination
```

+ `destination`の中に`source`ディレクトリがコピーされる
+ 通常はこの使い方をしておけば問題ないと思う

### ディレクトリ間でファイルを同期する場合

```shell
$ rsync -av --delete source/ destination
```

+ `source`の中身が`destination`の中身と同期される
+ `destination`の中身が強制的に置き換えられるので注意！

## Useful options

Referenceより抜粋。

| Option | Description |
| --- | --- |
| `-a` | `-rlptgoD`と指定したのと同様の効果。元のパーミッションやグループなどを保持したまま同期できるので、基本的に付加しておくのがよい。アーカイブモードとも呼ばれる。 |
| `-v` | 処理中の経過ファイル名を表示する。 |
| `-P` | `--partial` & `--progress` と同じ。 |
| `-z` | データを圧縮する。 |
| `--delete`| コピー元で削除されたファイルは、コピー先でも削除する。`-a`オプションと同時に指定することでコピー元とコピー先を同期できることになる。 |
| `--dry-run` (`-n`) | 実行時の動作だけを表示。テストに使用するとよい。 |
| `--partial` | 転送を中断したファイルを保持する。 |
| `--progress` | 転送の進行状況を表示する。 |

## References

+ [【 rsync 】コマンド（その1）――ファイルやディレクトリを同期する：Linux基本コマンドTips（82） - ＠IT](http://www.atmarkit.co.jp/ait/articles/1702/02/news031.html)
+ [はじめてrsyncを使う方が知っておきたい6つのルール - ITmedia エンタープライズ](http://www.itmedia.co.jp/enterprise/articles/0804/21/news013.html)
+ [rsync --delete で泣かないために - Qiita](https://qiita.com/QUANON/items/2953c52df7f65f2ecee5)
