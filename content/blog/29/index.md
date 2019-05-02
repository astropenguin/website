+++
title = "Pandas とセットで理解する xarray: データ構造編"
date  = 2019-05-01T16:05:17+09:00
tags  = ["Python", "xarray", "pandas"]
categories  = ["Tech"]
emoji = true
draft = true
+++

## TL;DR :flags:

[xarray] はラベル付き多次元配列のセットを扱うための Python パッケージで, [PyData] によって開発されています.
Python にはもともと, 多次元配列を効率的に扱うことのできる [NumPy], ラベル付き 1 次元配列 (系列データ) のセットを扱う [pandas] がありましたが, xarray は pandas の多次元版と考えることができます.
実際, pandas には 2 次元配列のセットと扱うための [Panel](https://pandas.pydata.org/pandas-docs/stable/reference/panel.html) と呼ばれるデータ構造がありましたが, xarray の登場によって deprecated となり, 代わりに `to_xarray()` メソッドが `pd.DataFrame` に追加されることで移行が促されています.

> Panel was deprecated in the 0.20.x release, showing as a DeprecationWarning.
> Using Panel will now show a FutureWarning. The recommended way to represent 3-D data are with a MultiIndex on a DataFrame via the to_frame() or with the xarray package.
> Pandas provides a to_xarray() method to automate this conversion.
>
> [v0\.20\.1 \(May 5, 2017\) — pandas 0\.24\.2 documentation](https://pandas.pydata.org/pandas-docs/stable/whatsnew/v0.20.0.html)

こうした背景の一方, xarray は pandas ほど使われていないのかなあという印象です.
例えば, Google Trends によると, pandas と xarray の検索数には大きな開きがあることが分かります.
また, 実際 xarray を紹介している記事等も (日本語, 英語ともに) pandas のそれと比べて圧倒的に少ないです.

<script type="text/javascript" src="https://ssl.gstatic.com/trends_nrtr/1754_RC01/embed_loader.js"></script> <script type="text/javascript"> trends.embed.renderExploreWidget("TIMESERIES", {"comparisonItem":[{"keyword":"pandas","geo":"","time":"today 5-y"},{"keyword":"xarray","geo":"","time":"today 5-y"}],"category":31,"property":""}, {"exploreQuery":"cat=31&date=today%205-y&q=pandas,xarray","guestPath":"https://trends.google.co.jp:443/trends/embed/"}); </script>

実際問題, 多次元配列というのは一般的には使われていない (使う必要がない) のかもしれません (例えば, Excel で表現できるデータであれば pandas の範疇).
しかし, 研究分野の測定データは多次元に普通になり得ますし, データには測定時刻や座標等のラベルが付くことがほとんどですので, ラベル付き多次元配列というのは結構需要があるはずです.

そこで, この記事を含む一連の記事では, xarray について (自分の理解を深める意味でも) 紹介します.
タイトルの通り, xarray のデータ構造やメソッドは pandas のそれと共通する部分が多いので, これらを比較してまとめることにします.
今回の記事では xarray のデータ構造のみの紹介です.

## Scope

一連の記事を書く際に使用した xarray, pandas, および NumPy のバージョンは以下の通りです.

- xarray: v0.12.1
- pandas: v0.24.2
- numpy: v1.16.3

これらは以下のようにインポートすることにします.

```python
>>> import pandas as pd
>>> import xarray as xr
>>> import numpy as np
```

## Data structures

### Dataset & DataArray

以下の図は **Dataset** と呼ばれる, pandas での DataFrame (`pd.DataFrame`) に相当するデータ構造を示したものです.
これは例えば, ある地域における気温と降水量のメッシュデータを, 時系列で保存したものと見ることができます.
ここで, (x,y) はメッシュ座標, (lat, lon) は経緯度座標として, 別々に表現されているような状況です.

> ![dataset-diagram.png](dataset-diagram.png)
>
> [Data Structures — xarray 0\.12\.1 documentation](http://xarray.pydata.org/en/stable/data-structures.html)

xarray では, pandas の系列データ (`pd.Series`) に相当するデータが多次元配列になり得ます.
この図では, 全ての要素がそれに当たり, **DataArray** (`xr.DataArray`) と呼ばれます.

### Coordinate(s) & dimension(s)

pandas では特定の系列データをラベル (`pd.Index`) に割り当てますが, xarray でも同様に, 特定の (複数も可) DataArray をラベル化することができます.
この図では, 気温と降水量が測定データなので, この 2 つ以外の全ての要素を割り当てるのが良さそうです.
ラベル化された DataArray(s) は **coordinate(s)** と特別に呼ばれます.
一方, xarray ではラベル化によってオブジェクトが変化する (`pd.Series` → `pd.Index`) ことはなく, あくまで DataArray のままです.

最後に, pandas にはない概念として, Dataset や DataArray の各次元軸を規定する **dimension(s)** があります.
Dimensions は軸名と軸の値を持つラベルとして, 1 次元の DataArray で表現されます.
これらは, coordinates とは別に生成することもできますし, 1 次元の coordinates を割り当てることもできます.
この図では, 例えば (x, y, t) を dimensions に割り当てるのが良いかもしれません.

これらの概念を pandas との比較でまとめると以下の通りです.

| | xarray | pandas |
| --- | --- | --- |
| 次元軸 | Dimension(s) (`xr.DataArray`) | n/a |
| ラベル | Coordinate(s) (`xr.DataArray`) | Index (`pd.Index`) or MultiIndex (`pd.MultiIndex`) |
| データ | DataArray (`xr.DataArray`) | Series (`pd.Series`) |
| データセット | Dataset (`xr.Dataset`) | DataFrame (`pd.DataFrame`) |

## Examples

以上を踏まえ, 実際に Dataset を生成してみましょう.
以下のスクリプトは, [xarray documentation](http://xarray.pydata.org/en/stable/data-structures.html) に記載されている例を元に, 上の説明に合うように書き直したものになります.
Dimensions は `dims` として軸名のタプルで, coordinates は `coords` として `name: (<dims>, <value>)` の辞書で表現されます.

```python
# fix random seed
np.random.seed(2019)

# observed data
temperature = 15 + 8*np.random.randn(2, 2, 3)
precipitation = 10 * np.random.rand(2, 2, 3)

# coordinates
latitude = [[42.25, 42.21], [42.63, 42.59]]
longitude = [[-99.83, -99.32], [-99.79, -99.23]]
x = ['1', '2']
y = ['a', 'b']
t = pd.date_range('2014-09-06', periods=3)
reference_time = pd.Timestamp('2014-09-05')

# create dataarrays
dims = ('x', 'y', 't')
coords = {'latitude': (('x', 'y'), latitude),
          'longitude': (('x', 'y'), longitude),
          'reference_time': reference_time,
          'x': ('x', x),
          'y': ('y', y),
          't': ('t', t)}

temperature = xr.DataArray(temperature, coords, dims)
precipitation = xr.DataArray(precipitation, coords, dims)

# create dataset
ds = xr.Dataset()
ds['temperature'] = temperature
ds['precipitation'] = precipitation
```

### DataArray

まずは DataArray を表示させてみます.
NumPy array に coordinates がくっついた文字列が出力されます.
(x, y, t) に注目すると, 名前の横に `*` が表示されていることが分かりますが, これらの coordinates が dimensions として割り当てられていることを表しています.

```python
>>> temperature

<xarray.DataArray (x: 2, y: 2, t: 3)>
array([[[13.258568, 21.571643, 26.850222],
        [25.654912, 12.105077, 20.484871]],

       [[19.590091, 17.301821, 13.114926],
        [22.627922,  1.482998, 12.240458]]])
Coordinates:
    latitude        (x, y) float64 42.25 42.21 42.63 42.59
    longitude       (x, y) float64 -99.83 -99.32 -99.79 -99.23
    reference_time  datetime64[ns] 2014-09-05
  * x               (x) <U1 '1' '2'
  * y               (y) <U1 'a' 'b'
  * t               (t) datetime64[ns] 2014-09-06 2014-09-07 2014-09-08
```

次に, coordinate にアクセスしてみます.
これも上で説明した通り, coordinates も DataArray であることが分かります.
(lat, lon) は dimensions が (x, y) なので, 元の DataArray の coordinates のうち, (x, y) に含まれる coordinates (lat, lon 自身も含む) が引き継がれています.

```python
>>> temperature.coords['latitude']

<xarray.DataArray 'latitude' (x: 2, y: 2)>
array([[42.25, 42.21],
       [42.63, 42.59]])
Coordinates:
    latitude        (x, y) float64 42.25 42.21 42.63 42.59
    longitude       (x, y) float64 -99.83 -99.32 -99.79 -99.23
    reference_time  datetime64[ns] 2014-09-05
  * x               (x) <U1 '1' '2'
  * y               (y) <U1 'a' 'b'
```

最後に, 個々の DataArray の持つ NumPy array には `values` アトリビュートでアクセスできます.

```python
>>> temperature.values

array([[[13.25856829, 21.57164284, 26.85022247],
        [25.65491234, 12.10507702, 20.48487065]],

       [[19.59009141, 17.30182133, 13.11492592],
        [22.62792195,  1.48299758, 12.24045835]]])
```

### Dataset

Dataset を表示させてみます.
DataArray の一覧が data variables として表示されています.
データが多様な次元を持つため, pandas DataFrame のような表形式のすっきりとした表示にはなりませんが, データ構造を理解していれば情報がまとまっていることが分かるかと思います.

```python
>>> ds

<xarray.Dataset>
Dimensions:         (t: 3, x: 2, y: 2)
Coordinates:
    latitude        (x, y) float64 42.25 42.21 42.63 42.59
    longitude       (x, y) float64 -99.83 -99.32 -99.79 -99.23
    reference_time  datetime64[ns] 2014-09-05
  * x               (x) <U1 '1' '2'
  * y               (y) <U1 'a' 'b'
  * t               (t) datetime64[ns] 2014-09-06 2014-09-07 2014-09-08
Data variables:
    temperature     (x, y, t) float64 13.26 21.57 26.85 ... 22.63 1.483 12.24
    precipitation   (x, y, t) float64 1.629 8.892 1.485 ... 5.783 2.993 8.372
```

最後に, 個々の DataArray には辞書形式でアクセスできます.

```python
>>> ds['temperature']
```

今回はここまでです.
次回は Dataset, DataArray のメソッドを pandas と比較してまとめたいと思います.

## References

- [xarray: N\-D labeled arrays and datasets in Python — xarray 0\.12\.1 documentation](http://xarray.pydata.org/en/stable/)
- [pandas: powerful Python data analysis toolkit — pandas 0\.24\.2 documentation](https://pandas.pydata.org/pandas-docs/stable/)
- [Numpy and Scipy Documentation — Numpy and Scipy documentation](https://docs.scipy.org/doc/)

[xarray]: http://xarray.pydata.org/en/stable/
[pandas]: https://pandas.pydata.org/
[PyData]: https://pydata.org/
[NumPy]: https://www.numpy.org/
