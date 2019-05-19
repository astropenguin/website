+++
title = "Python dictionary の KeyError に keys 一覧を表示させる"
date  = 2019-05-20T00:21:21+09:00
tags  = ["Python"]
categories  = ["Tech"]
+++

## TL;DR :flags:

Python の小ネタですが、dictionary で存在しない key にアクセスした際に送出される `KeyError` のメッセージに、存在する keys 一覧を表示させる方法をメモしておきます。

## KeysInfoDict

以下のような dictionary のサブクラスを作成することで実現します。

```python
class KeysInfoDict(dict):
    """Dict that shows all keys when KeyError rises."""
    def __missing__(self, key):
        keys = ', '.join(map(repr, self))
        raise KeyError(f'Choose one from: {keys}')
```

Key が存在しなかった場合に呼ばれるメソッド `__missing__()` に処理を設定するのがポイントです。

> `self[key]` の実装において辞書内にキーが存在しなかった場合に、 `dict` のサブクラスのために `dict.__getitem__()` によって呼び出されます。
> [3\. データモデル — Python 3\.7\.3 ドキュメント](https://docs.python.org/ja/3.7/reference/datamodel.html?highlight=__missing__#object.__missing__)

また、key の repr をメッセージに含めることで、例えば key が `1` なのか `'1'` なのかを正しく表示するようにしています。

## Example

```python
>>> d = KeysInfoDict(a=1, b=2, c=3)
>>> d['d']
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 5, in __missing__
KeyError: "Choose one from: 'a', 'b', 'c'"
```

用途としては、例えばパッケージ内部の dictionary で、エラーは送出した上でユーザに使用可能な keys 一覧をサジェストしたい、といった場合かなと思います。
