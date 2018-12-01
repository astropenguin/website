+++
title = "IPython shell で tee を実現する"
date  = 2018-12-01T23:54:06+09:00
tags  = ["Tips", "Advent calendar"]
emoji = true
draft = false
+++

## TL;DR

ウェブサイトへのアウトプットを軌道に乗せるため、アドベントカレンダーをやってみることにします:christmas_tree:
というわけでこれはアドベントカレンダー1日目の記事です。

Linux では標準出力をターミナルに表示しつつファイルにも保存したい時、以下のように `tee` コマンドを使いますが、これと同様の結果を IPython shell 上でも実現したい時の方法をまとめておきます。

```shell
<some command> | tee result.log
```

## IPython.utils.io.Tee

IPython パッケージの中に、そのものずばりの `Tee` クラスが用意されています。
以下のように記録したいコードの前後で以下のように記録することで、`print` 関数等の標準出力が同時にファイルにも保存されます。

```python
from IPython.utils.io import Tee

f = Tee('result.log')
... # some script
f.close()
```

もちろん、パッケージ開発の際は、ユーザがこのような対応を取らなくて良いように、Python のロギング機能を使うのが良いように思います。

## References

+ [Module: utils\.io — IPython 7\.2\.0 documentation](https://ipython.readthedocs.io/en/stable/api/generated/IPython.utils.io.html#IPython.utils.io.Tee)
+ [logging \-\-\- Python 用ロギング機能 — Python 3\.7\.1 ドキュメント](https://docs.python.org/ja/3.7/library/logging.html)