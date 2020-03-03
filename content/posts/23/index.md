+++
title = "Python の setup.py の内容を setup.cfg で管理する"
date  = 2018-12-17T20:43:36+09:00
tags  = ["Advent calendar", "Python", "pip", "setuptools"]
categories  = ["Tech"]
toc = true
aliases = ["/blog/23/"]
+++

## TL;DR :christmas_tree:

これはアドベントカレンダーの17日目の記事です。
今日は、Python のパッケージのインストールで使われる setup.py の内容を、設定ファイル setup.cfg に切り出して管理するための方法をまとめました。

## setup.py & setup.cfg

setup.py は、Python のパッケージを pip などでインストールする際に、パッケージの情報やインストール方法などを記述した Python スクリプトです。
2018年現在は、このスクリプトの中で [setuptools](https://setuptools.readthedocs.io/en/latest/) をインポートし、以下のように記述するのが一般的です。

```python
from setuptools import setup

setup(name='sample',
      version='0.1',
      author='astropenguin',
      ...)
```

`setup` 関数の引数は少ない場合でも10個近くあるため、これをコードから分離して、設定ファイルとして管理できると良さそうです。
そのような理由で setuptools v30.3.0 (2016年12月) から、setup.py と同階層に設定ファイル setup.cfg を置くと、`setup` 関数の実行時にこれを読み込むようになったそうです。
この場合の setup.py は以下を書くだけで OK です。

```python
from setuptools import setup

setup() # without any parameters!
```

## Example of setup.cfg

実際の setup.cfg の書き方は、[Configuring setup() using setup.cfg files](https://setuptools.readthedocs.io/en/latest/setuptools.html#configuring-setup-using-setup-cfg-files) にまとまっています。
以下はこのページに載っていた書き方の引用です。

<details>
<summary>長いので折りたたんであります</summary>

```ini
[metadata]
name = my_package
version = attr: src.VERSION
description = My package description
long_description = file: README.rst, CHANGELOG.rst, LICENSE.rst
keywords = one, two
license = BSD 3-Clause License
classifiers =
    Framework :: Django
    Programming Language :: Python :: 3
    Programming Language :: Python :: 3.5

[options]
zip_safe = False
include_package_data = True
packages = find:
scripts =
  bin/first.py
  bin/second.py
install_requires =
  requests
  importlib; python_version == "2.6"

[options.package_data]
* = *.txt, *.rst
hello = *.msg

[options.extras_require]
pdf = ReportLab>=1.2; RXP
rest = docutils>=0.3; pack ==1.1, ==1.3

[options.packages.find]
exclude =
    src.subpackage1
    src.subpackage2

[options.data_files]
/etc/my_package =
    site.d/00_default.conf
    host.d/00_default.conf
data = data/img/logo.png, data/svg/icon.svg
```

</details>

セクション (`[name]`) の書き方から、INIファイルと同様のフォーマットとなっているようです。
これから、`[metadata]` と `[options]` の2つのセクションから構成されることが分かります。
また、`[options]` セクションには、`[options.name]` のように (サブ) セクションを持っています。

ただし、コメント開始文字がセミコロン (`;`) ではなくナンバーサイン (`#`) であり、文字列のセミコロン区切りは意味を持っていることに注意が必要です。
これらの記法は以下にまとまっています。

+ [metadata の記法 -- setuptools documentation](https://setuptools.readthedocs.io/en/latest/setuptools.html#metadata)
+ [options の記法 -- setuptools documentation](https://setuptools.readthedocs.io/en/latest/setuptools.html#options)

## setuptools-py2cfg

もしすでにパッケージの setup.py を書いているのであれば、[setuptools-py2cfg](https://github.com/gvalkov/setuptools-py2cfg) というツールによって内容を setup.cfg に変換できます。
色々と覚えるよりも、まずはこれで変換してみる方が楽な気がしました。

```shell
$ pip install setuptools-py2cfg
$ setuptools-py2cfg /path/to/setup.py
```

## pyproject.toml

この記事を書くために setuptools 関連を調べていたところ、これらは pyproject.toml という [PEP 518](https://www.python.org/dev/peps/pep-0518/) で標準化された設定ファイルで置き換えられる可能性があるそうです。

> Pip builds packages by invoking the build system. Presently, the only supported build system is setuptools, but in the future, pip will support PEP 517 which allows projects to specify an alternative build system in a pyproject.toml file. - [pip documentation](https://pip.pypa.io/en/stable/reference/pip/)

パッケージングや環境構築関連は、この先まだまだ変化がありそうです。
それにしても、TOML が本格的に Python に入ってくる可能性もあるのですね...

## References

+ [Welcome to Setuptools’ documentation\! — setuptools documentation](https://setuptools.readthedocs.io/en/latest/)
+ [Configuring setup() using setup.cfg files — setuptools documentation](https://setuptools.readthedocs.io/en/latest/setuptools.html#configuring-setup-using-setup-cfg-files)
+ [setuptools\-py2cfg](https://github.com/gvalkov/setuptools-py2cfg)
+ [PEP 518 \-\- Specifying Minimum Build System Requirements for Python Projects \| Python\.org](https://www.python.org/dev/peps/pep-0518/)
+ [Poetry: Python の依存関係管理とパッケージングを支援するツール \| org\-技術](https://org-technology.com/posts/python-poetry.html)
+ [Pythonとパッケージングと私](https://www.slideshare.net/aodag/python-79546865)
