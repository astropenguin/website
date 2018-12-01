+++
title = "畳み込みによる画像のノイズ除去"
date  = 2018-12-01T18:40:47+09:00
tags  = ["Python", "NumPy", "SciPy", "Tips"]
emoji = true
draft = false
+++

画像などの2次元配列で、周囲に非ゼロの値が存在しないような孤立したピクセル値をゼロにしたいことがある。
例えば、天体画像を N-sigma clipping した際に、ノイズの影響で天体以外の場所に残ってしまった
スパイク状のゴミを消去したい場合などである。
この場合、あるピクセルの周囲に非ゼロの値がいくつ存在するかを2次元の畳み込みで求めるのが簡単である。

## Python code

2次元のとある NumPy 配列 `array` があるとする。
このとき、以下のような2次元配列 `kernel` と畳み込むと、
周囲のピクセル値の和となるような2次元配列を計算できる。

```py
import numpy as np

kernel = np.array([[1, 1, 1],
                   [1, 0, 1],
                   [1, 1, 1]])
```

これを応用して、非ゼロを `True` 、それ以外を `False` とするような
2次元配列に対して同様の操作をすることで、周囲の非ゼロピクセル数が計算できる。

```py
from scipy.signal import convolve2d

# 非ゼロを True で表す
condition = (array != 0)

# 周囲の非ゼロピクセル数を計算する
neighbours = convolve2d(condition, kernel, mode='same',
                        boundary='fill', fillvalue=0)
```

あとはこれを使って孤立したピクセル (`neighbours==0`) を処理すれば良い。

```py
# 周囲に非ゼロの値がないピクセル値をゼロにする
array[neighbours==0] = 0
```

## Others

余談だが、この方法を使って [Conway's game of life (ライフゲーム)](https://ja.wikipedia.org/wiki/%E3%83%A9%E3%82%A4%E3%83%95%E3%82%B2%E3%83%BC%E3%83%A0) を簡単に実装することができる。

<script src="https://gist.github.com/astropenguin/6e87dde2ab0018c31dbdffe3309e3cc0.js"></script>