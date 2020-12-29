+++
title = "Python 製ジオコーディングライブラリ Geocoder を試す"
date  = 2018-12-12T01:51:14+09:00
tags  = ["Python", "Geocoder", "Azely"]
categories = ["Tech"]
aliases = ["/blog/18/"]
+++

## TL;DR :christmas_tree:

これはアドベントカレンダーの12日目の記事です。
今日は、Python 製のジオコーディングライブラリの [Geocoder](https://geocoder.readthedocs.io/) を試してみたという話です。

## Why geocoding?

地上望遠鏡の観測の際には、その地点での天体の方位角と仰角 (az, el) が一日の中でどう変化するかを知ることが重要です。
このような理由から、(az, el) プロット作成するためのコマンドラインツール [Azely](https://github.com/astropenguin/azely) を開発しているのですが、計算には天体の赤道座標値の他に、望遠鏡の緯度経度 (lat, lng) の座標値が必要になります。
天体座標は、例えば Astropy を使うことで天体名から検索することができます。
そこで、望遠鏡座標も地名 (e.g., 野辺山宇宙電波観測所) から検索 (ジオコーディング) できると便利です。

## Geocoder

> Simple and consistent geocoding library written in Python.
> - [Geocoder](https://geocoder.readthedocs.io/)

Geocoder は、複数のマップサービスのジオコーディング API を統一された文法 (メソッド) で扱うことができる Python 製ライブラリです。
一般的に API が返す JSON の結果はサービスごとに独自のため、これをプログラムの中で使うために独自のコードを書く必要があるのですが、Geocoder を使うと API の中身を気にせず簡単にジオコーディングを行うことができます。
ちなみに、[README](https://github.com/DenisCarriere/geocoder) によるとおよそ30個のマップサービスに対応しているそうです…すごい。
この中には、API キーの必要ない [OpenStreetMap](https://openstreetmap.jp/) なども含まれているので、Azely の中ではこうしたサービスを使うのが良さそうです。

## Installation

Python パッケージなので、pip でインストール可能です。

```shell
$ pip install geocoder
```

同時にコマンドラインツールも使えるようになるそうですが、ここでは扱いません。

## Usage

### Geocoding (OpenStreetMap)

例えば OpenStreetMap で野辺山宇宙電波観測所の座標を取得する場合、たったこれだけで取得できます。

```python
>>> import geocoder

>>> ret = geocoder.osm('野辺山宇宙電波観測所', timeout=5.0)
>>> print(ret.latlng)
[35.9429899, 138.473690612737]
```

ここで、`ret` はジオコーディングオブジェクトで、以下のようなメソッド (プロパティ) を持っています (他にもあります)。
`ret.ok` は、ネット接続がなかったり、タイムアウトの場合に `False` を返します。
参考までに、`ret.json` を Appendix に置いておきます。

| Method | Description |
| --- | --- |
| lat | 緯度 (deg) の float |
| lng | 経度 (deg) の float |
| latlng | [緯度, 経度] のリスト |
| address | 住所の文字列 |
| location | 場所の名前 |
| json | 取得された JSON の dict |
| geojson | GeoJSON 形式の dict |
| ok | 取得が成功したかを示す boolean |


また、他にも以下は上手く取得できました。
ただし、`'ASTE'` や `'ALMA'` だけだと別の場所が選ばれてしまうので、ある程度のヒントは必要なようです。

```python
>>> ret = geocoder.osm('ASTE telescope')
>>> print(ret.address)
ASTE (Atacama Submillimeter Telescope Experiment), San Pedro de Atacama, Provincia de El Loa, Región de Antofagasta, Chile
```

```python
>>> ret = geocoder.osm('NANTEN2')
>>> print(ret.address)
NANTEN2, San Pedro de Atacama - Paso Jama, San Pedro de Atacama, Provincia de El Loa, Región de Antofagasta, Chile
```

```python
>>> ret = geocoder.osm('ALMA AOS')
>>> print(ret.address)
AOS, San Pedro de Atacama, Provincia de El Loa, Región de Antofagasta, Chile
```

### Geocoding (IP address)

地味に便利そうなのが、ユーザの IP アドレスから場所を取得できる機能です。
ここで取得できるのはざっくりとした値にすぎませんが、例えば以下を名古屋市から実行した場合、住所が正しく取得できていることが分かります。

```python
>>> ret = geocoder.ip('me')
>>> print(ret.address)
Nagoya, Aichi, JP
```

## References

+ [Geocoder: Simple, Consistent — geocoder 1\.38\.1 documentation](https://geocoder.readthedocs.io/index.html)
+ [DenisCarriere/geocoder: Python Geocoder](https://github.com/DenisCarriere/geocoder)
+ [OpenStreetMap Japan \| 自由な地図をみんなの手に/The Free Wiki World Map](https://openstreetmap.jp/)
+ [astropenguin/azely: Calculate azimuth/elevation of astronomical objects](https://github.com/astropenguin/azely)


## Appendix

```python
{'accuracy': 0.31000000000000005,
 'address': '野辺山宇宙電波観測所, 南牧村, 南佐久郡, 長野県, 中部地方, 日本',
 'bbox': [138.4686251, 35.9401096, 138.4767526, 35.9453509],
 'confidence': 8,
 'country': '日本',
 'country_code': 'jp',
 'county': '南佐久郡',
 'importance': 0.31000000000000005,
 'lat': 35.9429899,
 'lng': 138.473690612737,
 'ok': True,
 'osm_id': '133160162',
 'osm_type': 'way',
 'place_id': '105994825',
 'place_rank': '22',
 'quality': 'observatory',
 'raw': {'place_id': '105994825',
  'licence': 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
  'osm_type': 'way',
  'osm_id': '133160162',
  'boundingbox': ['35.9401096', '35.9453509', '138.4686251', '138.4767526'],
  'lat': '35.9429899',
  'lon': '138.473690612737',
  'display_name': '野辺山宇宙電波観測所, 南牧村, 南佐久郡, 長野県, 中部地方, 日本',
  'place_rank': '22',
  'category': 'landuse',
  'type': 'observatory',
  'importance': 0.31000000000000005,
  'address': {'address100': '野辺山宇宙電波観測所',
   'village': '南牧村',
   'county': '南佐久郡',
   'state': '中部地方',
   'country': '日本',
   'country_code': 'jp'}},
 'region': '中部地方',
 'state': '中部地方',
 'status': 'OK',
 'type': 'observatory',
 'village': '南牧村'}
```
