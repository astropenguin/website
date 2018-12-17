+++
title = "Python で一時的に関数出力を凍結 (キャッシュ) する"
date  = 2018-12-15T01:32:30+09:00
tags  = ["Advent calendar", "Python"]
categories = ["Tech"]
emoji = true
draft = false
+++

## TL;DR :christmas_tree:

これはアドベントカレンダーの15日目の記事です。
今日は、Python の関数出力を一時的に変化させないようにキャッシュするという、わりとマニアックな話のメモです。

## Temporary caching of function's return

例えば、ユーザからクエリを受け取り、何かファイルからデータを読み込み、該当する値を返す処理を考えます。

```python
def get_value(query):
    data = load(filename)
    return data[query]
```

このように書くことで、ファイルに変更があった場合もその都度関数がロードするため、常に最新の値を得ることができます。
一方、以下のように大量のクエリを処理する場合、クエリの数だけロードが発生するので、もしファイルが巨大な場合I/Oで非常に時間がかかることが予想されます。

```python
for query in million_query_list:
    value = get_value(query)
    ... # 値に対する何かの処理
```

そこで、`get_value` 関数自体は変更することなく、`for` 文の中だけ `load` 関数の出力を凍結 (キャッシュ) することができないか考えてみます。
これは、`load` 関数をキャッシュ化した関数を作成し、一時的に `load` 関数と置き換えてあげることで可能になります。
また、"`for` 文の中" などのコンテクストを扱いたいので、`with` 文を使ったコンテキストマネージャを使ってあげれば良いことも分かります。

## Freeze context manager

というわけで、以下のようなコンテクストマネージャを作成しました。
`with freeze(func, module)` のように関数とこれが属するモジュールを与えることにより、`with` 文の中では **`func()` が最初に返した値**を常に返すようになります。

```python
from inspect import getmodule

class freeze:
    def __init__(self, func, module=None):
        self.func = func
        self.module = module or getmodule(func)

    def frozen(self, *args, **kwargs):
        if hasattr(self, 'cache'):
            return self.cache

        self.cache = self.func(*args, **kwargs)
        return self.cache

    def __enter__(self):
        setattr(self.module, self.func.__name__, self.frozen)

    def __exit__(self, exc_type, exc_value, traceback):
        setattr(self.module, self.func.__name__, self.func)
```

## An example

これをテストするため、以下のような現在時刻を返す `now` 関数を作成しました。

```python
from datetime import datetime

def now():
    return datetime.now()
```

これを普通に3連続で実行すると、マイクロ秒単位で異なる時間を返すはずです。

```python
print(now())
print(now())
print(now())

# 2018-12-15 23:08:20.573039
# 2018-12-15 23:08:20.573235
# 2018-12-15 23:08:20.573312
```

今度はこれを、`freeze` コンテクストマネージャの下で実行してみます。

```python
with freeze(now):
    print(now())
    print(now())
    print(now())

print(now())

# 2018-12-17 23:08:29.831403
# 2018-12-17 23:08:29.831403
# 2018-12-17 23:08:29.831403
# 2018-12-17 23:08:29.831526
```

このように、`with` 文中では、最初に呼び出された時刻を返し続けることが分かります。
また、`with` 文の外では、再び現在時刻を返していることが確認できました。