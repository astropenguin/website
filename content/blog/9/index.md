+++
title = "Matplotlib のデフォルトスタイルの復元方法"
date  = 2018-12-03T21:47:56+09:00
tags  = ["Advent calendar", "Memo", "Python", "matplotlib"]
emoji = true
draft = false
+++

## TL;DR :christmas_tree:

これはアドベントカレンダーの3日目の記事です。
今日は雑ですが、[matplotlib](https://matplotlib.org/) のデフォルトスタイルを復元する方法のメモです。

```python
import matplotlib.pyplot as plt
plt.rcParams.update(plt.rcParamsDefault)
```