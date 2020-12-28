+++
title = "Python におけるシングルトンの実装"
date  = 2018-12-02T00:58:38+09:00
tags  = ["Advent calendar", "Python"]
categories = ["Tech"]
aliases = ["/blog/8/"]
+++

## TL;DR :christmas_tree:

これはアドベントカレンダーの2日目の記事です。
Pythonにおけるシングルトンの実装を試してみた際のメモです。

## Singleton in Python

シングルトンはメタクラスとして実装することができます。
仕組みとしては単純で、もしメタクラスが最初に呼び出された場合は通常のインスタンス生成と同様に `type(name, bases, dict)` が呼ばれ、そうでない場合は格納されたインスタンスを返すようにすれば良いです。

```python
class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)

        return cls._instances[cls]
```

以下のコードでシングルトンのクラスの振る舞いを確かめてみます。
ちなみに、`total_ordering` デコレータは比較演算子の実装を楽にするためのものです。

```python
from functools import total_ordering

@total_ordering
class TestClass(metaclass=Singleton):
    def __init__(self, value):
        self.value = value

    def __eq__(self, other):
        if not isinstance(other, self.__class__):
            return NotImplemented

        return self.value == other.value

    def __lt__(self, other):
        if not isinstance(other, self.__class__):
            return NotImplemented

        return self.value < other.value

instance_1 = TestClass(1)
instance_2 = TestClass(2)

print(instance_1 == instance_2) # 同値性チェック
print(instance_1 is instance_2) # 同一性チェック
print(instance_1.value)
print(instance_2.value)
```

結果は次のようになります。

```:plaintext
True
True
1
1
```

後に生成されたインスタンスは、最初と違う引数で生成されたのにも関わらず、最初に生成されたインスタンスと同一であることが分かります。

## References

+ [10\.2\. functools — 高階関数と呼び出し可能オブジェクトの操作 — Python 3\.6\.5 ドキュメント](https://docs.python.jp/3/library/functools.html#functools.total_ordering)
