+++
title = "Pythonのデータクラスのようにxarrayのデータ定義ができる拡張機能"
date = 2020-07-24T01:46:17+09:00
tags = ["Python", "NumPy", "pandas", "xarray"]
categories = ["Tech"]
+++

## TL;DR

[xarray]は多次元配列にメタデータ（軸のラベルなど）がくっついたデータを扱うためのツールとして、[NumPy]や[pandas]と同様にデータ解析で使われるPythonパッケージですが、様々なデータをxarray（のDataArray）で扱っていく中で以下のように感じることが増えてきました。

- 多次元配列の軸（dimensions）や型（dtype）を指定した配列生成関数がほしい
- 同様にメタデータ（coordinates）にも軸・型・デフォルトの値を指定したい
- 上2つを満たした[NumPy]の`ones()`のような特別な配列生成をしたい
- データ独自の処理（メソッド）を定義したい

これらをかなえる方法は色々考えられますが、Python 3.7から標準ライブラリに登場したデータクラス（[dataclasses]）が同じような悩み？をシンプルな書き方で解決していることに気づきました。そこで、データクラスと同様の書き方でユーザ定義のDataArrayクラスを作成するためのパッケージ「[xarray-custom]」を公開しましたのでご紹介します（pipでインストールできます）。

```python
from xarray_custom import ctype, dataarrayclass

@dataarrayclass(accessor='img')
class Image:
    """DataArray class to represent images."""

    dims = 'x', 'y'
    dtype = float
    x: ctype('x', int) = 0
    y: ctype('y', int) = 0

    def normalize(self):
        return self / self.max()
```

以下ではこのコードの仕組みを、PythonのデータクラスやDataAraryに触れながら解説していきます。

## Python's dataclass

まず、Pythonのデータクラスとはユーザ定義のデータ構造を簡単に作成するための機能（クラスデコレータ）です。

```python
from dataclasses import dataclass

@dataclass
class Coordinates:
    x: float
    y: float

    @classmethod
    def origin(cls):
        return cls(0.0, 0.0)

    def norm(self):
        return (self.x ** 2 + self.y **2) ** 0.5
```

このようにクラスを定義すると、

```python
coord = Coordinates(x=3, y=4)
```

のようにデータを格納するクラスを作成してくれます（本来は`__init__()`など諸々の特殊メソッドの実装が必要）。このようにデータクラスを定義することの利点としては以下が考えられるかと思います。

- 格納する値に名前・型（型ヒントのみ）・デフォルト値を持たせることができる
- 特別なデータ生成（上の例では`origin()`）をクラスメソッドで実現できる
- データ独自の処理（上の例では`norm()`）をインスタンスメソッドで実現できる

## xarray's DataArray

次に、[xarray]（DataArray）のデータ構造を見ていきます。DataArrayは[NumPy]の多次元配列（data）、軸（dimensions; メタデータの一種）、メタデータ（coordinates）からなるデータ構造を取ります。以下の例は、xyの2軸からなる単色画像をデータをDataArrayで表現しているつもりです。

```python
from xarray import DataArray

image = DataArray(data=[[0, 1], [2, 3]], dims=('x', 'y'),
                  coords={'x': [0, 1], 'y': [0, 1]})
print(image)

# <xarray.DataArray (x: 2, y: 2)>
# array([[0., 1.],
#        [2., 3.]])
# Coordinates:
#   * x        (x) int64 0 1
#   * y        (y) int64 0 1
```

`DataArray`はクラスなので、ユーザ定義のDataArrayを定義するための一般的な方法は`DataArray`をサブクラスとした新しいクラスを作成することです。しかし、`__init__()`などに定義をハードコードしてしまうと使い回しが効かないという問題があります。また、[xarray]や[pandas]ではそもそもサブクラス化を積極的に推奨しておらず、アクセサ（accessor）という特別なオブジェクトを介してユーザ定義の処理などを実装するのが良いとしています。

> One standard solution to this problem is to subclass Dataset and/or DataArray to add domain specific functionality. However, inheritance is not very robust. It’s easy to inadvertently use internal APIs when subclassing, which means that your code may break when xarray upgrades. Furthermore, many builtin methods will only return native xarray objects.
> ([Extending xarray] - xarray 0.15.0 documentation)

## xarray's dataarrayclass

ようやく本題です。冒頭に書いたような要望を実現するには、xarray（DataArray）の事情も考慮すると、

- （メタ）データの定義をハードコードせずに配列生成する方法を提供する
- アクセサを介したユーザ定義の処理を提供する
- これらをシンプルな書き方でできるようにする

ことが必要だということが分かりました。そこで、[xarray-custom]ではPythonのデータクラスに慣い、**ユーザ定義のDataArrayクラスをクラスデコレータ（dataarrayclass）で動的に改変する**ことで実現することにしました。[xarray-custom]を使うと上の単色画像の例は以下のように定義できます。

```python
from xarray_custom import ctype, dataarrayclass

@dataarrayclass(accessor='img')
class Image:
    """DataArray class to represent images."""

    dims = 'x', 'y'
    dtype = float
    x: ctype('x', int) = 0
    y: ctype('y', int) = 0

    def normalize(self):
        return self / self.max()
```

データクラスを知っていることで、このコードで何をしているのかは説明なしでも何となく理解していただけたのではないでしょうか。ここでのポイントは以下の3点です。

- クラス変数でデータの軸（`'x', 'y'`）・型（`float`）を指定する
- 特別な型付きのクラス変数で軸を含むメタデータの名前・軸・型・デフォルト値を指定する
- ユーザ定義の処理（メソッド）はアクセサ（`img`）配下に自動的に移動させる

ここで、`ctype`はメタデータを定義する特別な型（クラス）を生成するための関数です。それでは実際にユーザ定義の配列を生成してみましょう。

```python
image = Image([[0, 1], [2, 3]], x=[0, 1], y=[0, 1])
print(image)

# <xarray.DataArray (x: 2, y: 2)>
# array([[0., 1.],
#        [2., 3.]])
# Coordinates:
#   * x        (x) int64 0 1
#   * y        (y) int64 0 1
```

軸とメタデータが予め定義されているので、上のDataArrayの例と比べてとても簡潔に書けることが分かります。データクラスと異なるのは、型の情報が配列の型を決めるのに実際に使われるという点です。上の例では、integerのリストがDataArray内ではfloatに型変換されています。（暗黙の）型変換ができない場合は`ValueError`が送出されます。また、型を指定しないこともできます（その場合、任意の型のオブジェクトを受け付けます）。


### Instance methods via an accessor

[xarray]の方針に従い、クラスに定義したインスタンスメソッド（上の例では`normalize()`）はアクセサを介して実行することができます。アクセサなしで実行すると`AttributeError`が送出されます。

```python
normalized = image.img.normalize()
print(normalized)

# <xarray.DataArray (x: 2, y: 2)>
# array([[0.        , 0.33333333],
#        [0.66666667, 1.        ]])
# Coordinates:
#   * x        (x) int64 0 1
#   * y        (y) int64 0 1
```

### Special functions as class methods

特別な配列生成として、[NumPy]に慣い`zeros()`・`ones()`・`empty()`・`full()`がクラスメソッドとして自動的に追加されています。`zeros_like()`などは[xarray]のトップレベル関数に定義されていますのでそちらを使いましょう。

```python
uniform = Image.ones((2, 3))
print(uniform)

# <xarray.DataArray (x: 2, y: 3)>
# array([[1., 1., 1.],
#        [1., 1., 1.]])
# Coordinates:
#   * x        (x) int64 0 0
#   * y        (y) int64 0 0 0
```

## Misc

ここまでの話で、`dataarrayclass`でも`DataArray`のサブクラス化を結局行っているのでは？と思った方もいらっしゃるかもしれません。が、実際は生成されるDataArrayは本物の`DataArray`インスタンスです。逆に言うと、上の例では`Image`インスタンスではありません。

```python
print(type(image)) # xarray.core.dataarray.DataArray
```

これは、`dataarrayclass`内部では`__init__()`ではなく`__new__()`を動的に生成しており、`__new__()`がDataArrayを返すようにしているためです。このため、普通のクラスから作られたインスタンスのように、クラス変数等にアクセスできないことに注意が必要です。

[xarray]は[NumPy]や[pandas]に比べると記事数も少なく知名度も低いのかなという印象ですが、多次元配列を扱う課題には間違いなく有用ですのでどんどん使っていきたいところです。[xarray-custom]は開発初期で機能も少ないですが、こうした拡張機能の開発や記事を通して少しでもコミュニティに貢献できればと思っております。

## References

- [xarray-custom]
  - [Documentation]
- [xarray]
  - [Terminology]
  - [Extending xarray]
- [pandas]
  - [Registering custom accessors]

<!-- Markdown links -->
[NumPy]: https://numpy.org
[pandas]: https://pandas.pydata.org
[dataclasses]: https://docs.python.org/ja/3/library/dataclasses.html
[xarray]: https://xarray.pydata.org/en/stable/index.html
[Terminology]: https://xarray.pydata.org/en/stable/terminology.html
[Extending xarray]: https://xarray.pydata.org/en/stable/internals.html#extending-xarray
[xarray-custom]: https://github.com/astropenguin/xarray-custom
[Documentation]: https://astropenguin.github.io/xarray-custom
[Registering custom accessors]: https://pandas.pydata.org/docs/development/extending.html#registering-custom-accessors
