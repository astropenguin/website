+++
title = "Python 3.7になったGoogle ColabでCASAを動かしてみる"
description = "2021年4月時点ではプレリリース版CASAのインストールが必要です"
date = 2021-04-10T12:18:00+09:00
tags = ["CASA", "Google", "Colab"]
categories = ["Astronomy", "Python"]
image = "cover.jpg"
+++

## TL;DR

[Google Colaboratory](https://colab.research.google.com/)（Colab）のPythonのバージョンは長らく3.6でしたが、2021年2月24日に3.7にアップグレードされました[^1]。
これによって、Python 3.6系にしか対応していない[^2]電波天文学のデータ解析ソフトウェア[CASA](https://casa.nrao.edu/)がColab上で動かなくなってしまいました。
この記事では、3.7系対応のプレリリース版CASA6.2をColabにインストールし、[公式のノートブック](https://colab.research.google.com/github/casangi/examples/blob/master/casa6/CASA6_demo.ipynb)が動くことを確認してみました[^3]。

[^1]: https://github.com/googlecolab/colabtools/issues/1422#issuecomment-784545501
[^2]: 2021年4月時点の最新版CASA6.1の話です
[^3]: ノートブックの内容が動くだけで、全ての動作を保証するものではありません

## How to install

まず、リリース版のインストール方法は[CASA docs](https://casa.nrao.edu/casadocs/casa-6.1.0/usingcasa/obtaining-and-installing)に記載されている以下の方法です。

```shell
apt-get install libgfortran3
pip install --index-url https://casa-pip.nrao.edu/repository/pypi-casa-release/simple casatools
pip install --index-url https://casa-pip.nrao.edu/repository/pypi-casa-release/simple casatasks
```

これをColabで実行すると、Python 3.7対応のcasatoolsが存在しないのでエラーが出てインストールできません。

```plaintext
Looking in indexes: https://casa-pip.nrao.edu/repository/pypi-casa-release/simple
ERROR: Could not find a version that satisfies the requirement casatools (from versions: none)
ERROR: No matching distribution found for casatools
```

そこで、<https://casa-pip.nrao.edu>を検索してPython 3.7対応のプレリリース版を探します。
記事作成時点では、6.2.0.100などが良さそうです[^4]。
というわけで、プレリリース版のインストール方法ではこれらを手動でダウンロードします。

```shell
apt-get install libgfortran3
wget https://casa-pip.nrao.edu/repository/casa-test-wheel/packages/casatools/6.2.0.100/casatools-6.2.0.100-cp37-cp37m-manylinux2010_x86_64.whl
wget https://casa-pip.nrao.edu/repository/casa-test-wheel/packages/casatasks/6.2.0.100/casatasks-6.2.0.100-py3-none-any.whl
wget https://casa-pip.nrao.edu/repository/casa-aux-wheel/packages/casadata/2021.4.5/casadata-2021.4.5-py3-none-any.whl
pip install casatools-6.2.0.100-cp37-cp37m-manylinux2010_x86_64.whl
pip install casatasks-6.2.0.100-py3-none-any.whl
pip install casadata-2021.4.5-py3-none-any.whl
```

[^4]: マイナー以下のバージョンの違いは筆者は良く分かりませんでした…

## Operation check

以上のインストール方法を書いた[公式のノートブックのコピー](https://colab.research.google.com/gist/astropenguin/d30e10bbe8239ebd54767a148bfd8bf1/casa6-2_demo.ipynb)を作成しました。
実行したところ、少なくともノートブックの内容（listobs, tclean, exportfits）は動作することが確認できました。

## References

- [CASA: Common Astronomy Software Applications](https://casa.nrao.edu/)
- [Obtaining and Installing — CASA Documentation](https://casa.nrao.edu/casadocs/casa-6.1.0/usingcasa/obtaining-and-installing)
- [CASA6_demo.ipynb (CASA official)](https://colab.research.google.com/github/casangi/examples/blob/master/casa6/CASA6_demo.ipynb)
- [CASA6.2_demo.ipynb (Made by the author)](https://colab.research.google.com/gist/astropenguin/d30e10bbe8239ebd54767a148bfd8bf1/casa6-2_demo.ipynb)
