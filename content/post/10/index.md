+++
title = "Python のコンテキストマネージャを使った複数行の時間計測"
date = 2018-12-04T21:35:49+09:00
tags = ["Python", "IPython"]
categories = ["Tech"]
aliases = ["/blog/10/"]
+++

## TL;DR :christmas_tree:

これはアドベントカレンダーの4日目の記事です。
今日は Python で複数行のコードの実行時間を計測する際の書き方をまとめました。

## Context stopwatch

複数行のコードの時間計測では、よく以下のようなコードを見かけます。

```python
import time

start = time.time()
... # some code
... # some code
... # some code
end = time.time()

print(f'elapsed time = {end-start:.2f} sec')
```

これでももちろん問題ないのですが、コードの計測のたびに `start` や `stop` をコードの前後に書き加えるのは面倒です。
このような複数行の、すなわちある種の文脈 (context) を扱うのには、Python の標準ライブラリの一つ [contextlib](https://docs.python.jp/3/library/contextlib.html?highlight=contextlib#contextlib.contextmanager) を使うのが便利です。
この中の `contextmanager` を使うと、以下のような `stopwatch` を作成することができます。

```python
import time
from contextlib import contextmanager

@contextmanager
def stopwatch():
    start = time.time()
    yield
    end = time.time()
    print(f'elapsed time = {end-start:.2f} sec')
```

つまり、`with` 文の中に入っているコードの実行前に `yield` の前に書かれた内容が、コードの実行後に `yield` の後に書かれた内容が自動的に実行されることになります。
これを使うと、上のコードは以下のように書くことができます。

```python
with stopwatch():
    ... # some code
    ... # some code
    ... # some code
```

## In IPython or Jupyter notebook

IPython や Jupyter notebook 上では、[cell magic](https://ipython.readthedocs.io/en/stable/interactive/magics.html) と呼ばれる書き方によって、以下のようにセル単位で時間計測もできます。
Pure Python では使えませんが、普段使いにはこちらの方が楽かもしれません。

```python
%%time
... # some code
... # some code
... # some code
```

## References

+ [29\.6\. contextlib — with 文コンテキスト用ユーティリティ — Python 3\.6\.5 ドキュメント](https://docs.python.jp/3/library/contextlib.html?highlight=contextlib)
+ [Built-in magic commands &mdash; IPython 7.2.0 documentation](https://ipython.readthedocs.io/en/stable/interactive/magics.html)
