+++
title = "Pythonのクラスとメタクラスまとめ"
description = "__new__・__init__・typeの役割を正しく理解するためのメモ"
date = 2020-12-29T17:48:00+09:00
tags = ["Python"]
categories = ["Tech"]
image = "image.jpg"
+++

## TL;DR :bamboo:

Pythonのクラス・メタクラス関連は毎回こんがらかるのでメモ。`__new__`・`__init__`・`type`の役割を正しく理解するのが重要。
まず、以下では通常のクラス定義として以下を考えることにする。

```python
# 通常のクラス定義

class Class:
    def __init__(self, arg):
        self.arg = arg
```

## __new__はインスタンスを生成・__init__はインスタンスを初期化

`__new__`は初期化されていないクラスのインスタンスを生成するのに使われる。`__init__`はインスタンスが生成された後に初期化のため呼び出される。
`__init__`によってインスタンスが生成されている訳ではないことに注意する（Pythonで`__init__`をコンストラクタと呼ばないのはそのためである）。
つまり、以下の2つは等価である。

```python
# 通常のインスタンス生成

obj = Class(arg)
```

```python
# __new__と__init__を明示的に呼び出したインスタンス生成

obj = Class.__new__(Class, arg)
obj.__init__(arg)
```

`__new__`は一般的には定義されていないので、その場合は基底クラス`object`の`__new__`が呼び出されることになる。
つまり、以下とも等価である。

```python
# __new__が定義されていない場合のインスタンス生成

obj = object.__new__(Class, arg)
obj.__init__(arg)
```

`__new__`の使い所としてはインスタンス生成のカスタマイズが考えられるだろう。
例えば、以下はシングルトン（複数のインスタンスで同一性が保証されたクラス）の実装例である。

```python
# __new__を使ったシングルトンの実装

class Singleton:
    def __new__(cls):
        if not hasattr(cls, "_instance"):
            cls._instance = super().__new__(cls)

        return cls._instance


print(Singleton() is Singleton()) # True
```

他の用途としては、タプルやNumPyなどイミュータブルなオブジェクトのサブクラスが考えられる。

## メタクラスはtypeのカスタマイズ

メタクラスの役割はクラス生成そのもののカスタマイズである。
そもそも、クラスは以下のように組み込みクラスの`type`を使って`type(name, bases, dict)`で動的に生成できる。
つまり、通常のクラス定義は以下と等価である。

```python
# typeによるクラス定義

def __init__(self, arg):
    self.arg = arg


Class = type("Class", (object,), {"__init__": __init__})
```

これは、`type`がメタクラス、つまり**インスタンスがクラスとなるようなクラス**であることを表している。
`metaclass`を使ったクラス定義は、カスタマイズされた`type`を使ってクラス生成することに相当する。
つまり、`metaclass=meta`の場合のクラス生成は以下のように行われることを意味する。

```python
# metaclass=metaの場合のクラス定義

Class = meta("Class", (object,), {"__init__": __init__})
```

また、以下が通常のクラス定義と等価であることが分かるはずである。

```python
# metaclass=typeの場合のクラス定義

class Class(metaclass=type):
    def __init__(self, arg):
        self.arg = arg
```

メタクラスの使い所は、`__new__`や`__init__`では行えないようなクラスに対するメソッド等の動的な追加・変更が考えられるだろう。
例えば、以下はキャメルケースのメソッド名をスネークケースに変更する実装例である。

```python
# メソッド名のスネークケース化

# install from PyPI
from inflection import underscore


def snake_case(name, bases, dict):
    new_dict =  {underscore(k): v for k, v in dict.items()}
    return type(name, bases, new_dict)


class Example(metaclass=snake_case):
    def CamelCaseMethod(self):
        pass


obj = Example()
obj.camel_case_method() # ok
obj.CamelCaseMethod() # AttributeError
```

ちなみに、最終的に`type`が呼ばれさえすれば良いので、`metaclass`に渡すのはcallableなオブジェクトであればクラスでなくてもかまわない。
実際、上の例では関数を`metaclass`に渡している（ただし、`type`のインスタンスを返すだけなのでメタクラスではないことに注意）。

## メタクラスとクラスデコレータ

クラスを動的に変更するもう一つの方法としてクラスデコレータがある。
これは、**クラスを受け取りクラスを返す関数**として実装し、関数デコレータと同様にクラス定義の上にデコレートするものである。
例えば、先ほどのスネークケースの実装例は、クラスデコレータでは以下のように書ける。

```python
# メソッド名のスネークケース化（クラスデコレータ版）

def snake_case(cls):
    for name, obj in vars(cls).items():
        new_name = underscore(name)

        if name != new_name:
            setattr(cls, new_name, obj)
            delattr(cls, name)

    return cls


@snake_case
class Example:
    def CamelCaseMethod(self):
        pass
```

生成されたクラスをカスタマイズする用途であれば、クラスデコレータは直感的で分かりやすい。
例えば、Python 3.7で導入された[データクラス](https://docs.python.org/ja/3/library/dataclasses.html)ではクラスデコレータが使われている。
私見だが、引数を持つデコレータを作成することができるのもクラスデコレータの利点かもしれない。

一方、クラスデコレータでカスタマイズできるのは主にクラス変数とインスタンスメソッドであり、クラス自身が持つメソッド（つまりクラスを`type`のインスタンスと見たときのインスタンスメソッド）を変更することはできない。
例えば、クラスを`print`したときの表示はメタクラスを使わないとカスタマイズできない。

```python
# クラスのreprのカスタマイズ

class Meta(type):
    def __repr__(self):
        return self.__name__ + "!"


class Custom(metaclass=Meta):
    pass


print(Custom) # Custom!
```

また、動的なクラス継承などもメタクラスの範疇である。

```python
# クラス名に応じた継承先の変更

def meta(name, bases, dict):
    return type(name, (eval(name.lower()), *bases), dict)


class List(metaclass=meta):
    pass


class Tuple(metaclass=meta):
    pass


print(List([0, 1, 2])) # [0, 1, 2]
print(Tuple([0, 1, 2])) # (0, 1, 2)
```

このようにメタクラスの方が強力だが、反面どうしても抽象的な概念が登場して分かりづらくなるので、なるべくクラスデコレータまでに留めておきたいところ。
また、関数デコレータと同様に、クラスをもとにした新しいクラスを返すのであればクラスデコレータでも可能なので、表面上はこれで良い場合も多いだろう。

```python
# クラスのreprのカスタマイズ（クラスデコレータ版）

class Meta(type):
    def __repr__(self):
        return self.__name__ + "!"


def deco(cls):
    return Meta(cls.__name__, cls.__bases__, dict(cls.__dict__))


@deco
class Custom:
    pass


print(Custom) # Custom!
```

## まとめ

- `__new__`はインスタンス生成のカスタマイズ
- `__init__`はインスタンスのカスタマイズ
- メタクラスは`type`のカスタマイズ
- クラスデコレータは`type`インスタンス（＝クラス）のカスタマイズ

## References

- [組み込み関数 — Python 3.9.1 ドキュメント](https://docs.python.org/ja/3/library/functions.html#type)
- [dataclasses --- データクラス — Python 3.9.1 ドキュメント](https://docs.python.org/ja/3/library/dataclasses.html)
- [Python の __new__ ってなに？ | 民主主義に乾杯](https://python.ms/new/#_1-new-%E3%81%A8-init-%E3%81%AE%E9%81%95%E3%81%84)
- [Python のメタクラスとクラスデコレータってなに？ | 民主主義に乾杯](https://python.ms/metaclass/#_1-%E3%83%A1%E3%82%BF%E3%82%AF%E3%83%A9%E3%82%B9)
- [inflection · PyPI](https://pypi.org/project/inflection/)
