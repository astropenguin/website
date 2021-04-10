+++
title = "Python のタイムゾーン関連まとめ"
date = 2019-01-19T20:50:59+09:00
tags = ["Python", "datetime", "timezone"]
categories = ["Tech"]
aliases = ["/blog/25/"]
+++

## TL;DR :bamboo:

タイムゾーンを扱う Python パッケージを開発した際に調べた情報をまとめておきます。
そもそも Python におけるタイムゾーンは、tzinfo と呼ばれるオブジェクトによって表現されます。
これは、標準ライブラリの `datetime.tzinfo` クラスのサブクラスとして、標準ライブラリの `datetime.timezone` や外部ライブラリ pytz によって提供されています。

以下では、これらを使ってどのように tzinfo を取得・使用できるのかを紹介します。
その際、Python スクリプトでは以下のようなインポートを仮定しています。

```python
>>> import pytz
>>> import geocoder
>>> from timezonefinder import TimezoneFinder
>>> from datetime import datetime, timedelta, timezone, tzinfo
```

このうち、pytz・geocoder・timezonefinder は外部ライブラリです。
ただし、pytz は Python documentation でも紹介されているように、ほとんど標準ライブラリ的な扱いをされていると思われます。

## How to get tzinfo

tzinfo を様々な方法で取得する方法をまとめます。
ここでは `datetime.tzinfo` クラスと区別するため、取得したオブジェクトの変数名は `tz` として書いています。

### タイムゾーン ID から指定する

まずはベーシックな方法から。
例えば、日本のタイムゾーン ID は Asia/Tokyo なので、以下のように tzinfo を取得します。

```python
>>> query = 'Asia/Tokyo'
>>> tz = pytz.timezone(query)
>>> tz
<DstTzInfo 'Asia/Tokyo' LMT+9:19:00 STD>
```

ちなみに、全てのタイムゾーン ID は以下のように確認することができます。

```python
>>> pytz.all_timezones
['Africa/Abidjan',
 'Africa/Accra',
 'Africa/Addis_Ababa',
 ...,
 'Zulu']
```

### UTC からのオフセット値で指定する

UTC (協定世界時) からの任意のオフセット値を持つ tzinfo を取得したいときは、以下のようにします。

```python
>>> query = 9.0
>>> tz = timezone(timedelta(hours=query))
>>> tz
datetime.timezone(datetime.timedelta(0, 32400))
```

以下のように文字列に変換することで読みやすい感じになります。

```python
>>> str(tz)
'UTC+09:00'
```

### 経度緯度から求める

実際の開発では、ある場所の経度緯度からタイムゾーンを求めたい場合も多いと思います。
その際は、外部ライブラリ timezonefinder を使うことで簡単に取得できます。

```python
>>> query = {'lng': 135, 'lat': 35}
>>> tf = TimezoneFinder()
>>> tz = pytz.timezone(tf.timezone_at(**query))
>>> tz
<DstTzInfo 'Asia/Tokyo' LMT+9:19:00 STD>
```

ちなみに、検索すると pytzwhere を使用している例を見かけますが、timezonefinder の方が省メモリかつ高速だそうです。
最近の開発もこちらの方が活発っぽいので、これを使っておくのが良さそうです。

+ [Comparison to pytzwhere - MrMinimal64/timezonefinder](https://github.com/MrMinimal64/timezonefinder#comparison-to-pytzwhere)

### 場所名から求める

さらに、ある場所名から直接タイムゾーンを求めたい場合、場所名→経度緯度への変換を何かしらの方法で行う必要があります。
ここでは、[OpenStreetMap](https://openstreetmap.jp/) からジオコーディングが可能な geocoder を使った例を紹介します。

```python
>>> query = '名古屋市'
>>> g = geocoder.osm(query)
>>> lnglat = {'lng': g.lng, 'lat': g.lat}
>>> tf = TimezoneFinder()
>>> tz = pytz.timezone(tf.timezone_at(**lnglat))
>>> tz
<DstTzInfo 'Asia/Tokyo' LMT+9:19:00 STD>
```

他にも、[Google Maps API](https://cloud.google.com/maps-platform/?hl=ja) で API キーを取得して、Time Zone API を叩くといった方法もあります。

```python
>>> import googlemaps
>>> client = googlemaps.Client(key)
>>> result = client.timezone((lat, lng))
>>> tz = result['timeZoneId']
```

### UTC を指定する

最後に、UTC は各ライブラリで特別な方法で指定します。

```python
>>> tz = pytz.utc # also: pytz.UTC or timezone.utc
>>> tz
<UTC>
```

## How to use tzinfo

取得した tzinfo (`tz`) の実際の使い方をまとめます。
まず、上でどの手法で取得した `tz` も `datetime.tzinfo` のサブクラスであることを確認しておきましょう。

```python
>>> isinstance(tz, tzinfo)
True
```

### 日付に応じたタイムゾーンを求める

夏時間を採用する地域では、日付によってタイムゾーン名と UTC からのオフセット値が変わります。
tzinfo では以下のメソッドで `datetime.datetime` オブジェクトを与えることで、日付に応じた値の取得が可能です。
まずはタイムゾーン名から。

```python
>>> tz = pytz.timezone('Europe/Amsterdam')
>>> tz.tzname(datetime(2019, 1, 1))
'CET'

>>> tz.tzname(datetime(2019, 8, 1))
'CEST'
```

次に UTC オフセット値。
こちらは、`datetime.timedelta` オブジェクトによって表現されます。

```python
>>> tz.utcoffset(datetime(2019, 1, 1))
datetime.timedelta(0, 3600) # UTC+01:00

>>> tz.utcoffset(datetime(2019, 8, 1))
datetime.timedelta(0, 7200) # UTC+02:00
```

### タイムゾーンを持つ日付を扱う

Python の日付は、`datetime.datetime` に tzinfo を指定しない場合はタイムゾーンを持たない (timezone-naive な) オブジェクト、指定した場合はタイムゾーンを持つ (timezone-aware な) オブジェクトになります。
例えば、以下のように datetime オブジェクトを作成した場合は timezone-naive となります。

```python
>>> dt_naive = datetime(2019, 1, 1)
datetime.datetime(2019, 1, 1, 0, 0) # timezone-naive
```

timezone-aware なオブジェクトは、以下のように `localize` メソッドに timezone-naive なオブジェクトを与えてあげることで作成します。
オブジェクトを表示すると、tzinfo が含まれていることが分かります。

```python
>>> dt_aware = tz.localize(dt_naive)
>>> dt_aware
datetime.datetime(2019, 1, 1, 0, 0, tzinfo=<DstTzInfo 'Europe/Amsterdam' CET+1:00:00STD>)
```

ちなみに、timezone-aware → timezone-naive の変換は、以下の通りです。

```python
>>> dt_aware.replace(tzinfo=None)
datetime.datetime(2019, 1, 1, 0, 0)
```

### タイムゾーンの変換

timezone-aware なオブジェクトは、`astimezone` メソッドで他のタイムゾーンを持つオブジェクトに変換することができます。
例えば、あるタイムゾーンでの時刻が UTC で何時なのかを調べたい場合は、以下のようにします。

```python
>>> dt_aware.astimezone(pytz.utc)
datetime.datetime(2018, 12, 31, 23, 0, tzinfo=<UTC>)
```

ちなみに、引数に何も与えないと、マシンのローカルタイムゾーンに変換されるようです。

```python
>>> dt_aware.astimezone()
datetime.datetime(2019, 1, 1, 8, 0, tzinfo=datetime.timezone(datetime.timedelta(0, 32400), 'JST'))
```

## References

+ [datetime --- 基本的な日付型および時間型 — Python documentation](https://docs.python.org/ja/3/library/datetime.html)
+ [Python 製ジオコーディングライブラリ Geocoder を試す - Astropenguin](https://astropengu.in/blog/18/)
