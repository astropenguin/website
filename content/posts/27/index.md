+++
title = "GitHub で SSH 公開鍵を公開する"
date  = 2019-02-11T16:14:36+09:00
tags  = ["Linux", "GitHub", "Security"]
categories  = ["Tech"]
aliases = ["/blog/27/"]
+++

## TL;DR :snowman:

[SSHの公開鍵配布を簡単にやる](https://s8a.jp/distribution-of-ssh-key#%E9%9D%A2%E5%80%92%E3%81%AA%E5%85%AC%E9%96%8B%E9%8D%B5%E3%81%AE%E9%85%8D%E5%B8%83%E3%82%92%E7%B0%A1%E7%B4%A0%E5%8C%96%E3%81%99%E3%82%8B) を読んでなるほどなと思ったので、自分の環境でもやってみることにしました。
つまり、GitHub に登録した SSH 公開鍵が URL で公開されていることを利用して、これを各種サーバに設置する公開鍵として使おうということです。
暗号強度にさえ気を使っていれば、面倒な公開鍵のサーバへの設置をコマンド一発で行うことができ、ついでに GitHub clone/push なども SSH 経由で行うことができる (HTTPS の場合の personal token が不要) のため便利そうです。

## Operation policy

+ 秘密鍵 (と公開鍵) の生成はクライアントごとに 1 個だけ作成する
    - この際、暗号強度は十分高める (RSA 4096 bit など)
+ 公開鍵は GitHub で公開し、これをサーバの `~/.ssh/authorized_keys` に登録する
    - 登録は、(サーバのネット接続前提だが) 以下のコマンドで行える

```shell
$ curl -sS https://github.com/astropenguin.keys >> ~/.ssh/authorized_keys
```

## Make an SSH key pair on client

ここでは仮に `test_rsa` [^1]という秘密鍵を作成し、公開鍵 `test_rsa.pub` を公開するとします。
まず、クライアント上で新規鍵を作成します。
この際、デフォルトでは RSA 2048 bit の鍵長となるので、以下のように明示的に変更します。

```shell
$ cd ~/.ssh
$ ssh-keygen -t rsa -b 4096 -C user@host -f test_rsa
```

`-t` で鍵の種類を、 `-b` で鍵長を、 `-C` で公開鍵の最後に書かれるコメント[^2]を、 `-f` で秘密鍵の名前を指定します。
出来上がった鍵が所望の種類、鍵長になっていることを以下のコマンドで確認しておきます。

```shell
$ ssh-keygen -lf test_rsa
4096 SHA256:wXz5ff3T9ETG+exBF5IpzvRwhJcpOidKexcvkA61Kn0 user@host (RSA)
```

上記の設定通りの内容になっているので大丈夫ですね。

[^1]: 実際はデフォルト名 (id_rsa) でクライアント間で共通にしておくと色々便利だと思います。
[^2]: コメントは GitHub に登録した際に消されてしまうようですが、念のため書いておく方が良いでしょう。

## Paste public key on GitHub

上記で作成した **公開**鍵を GitHub に登録します。
まず、公開鍵の中身のテキストを何らかの方法でコピーします。
ちなみに macOS ならば、以下のコマンドでクリップボードに入ります。

```shell
$ cat test_rsa.pub | pbcopy
```

次に、ブラウザで https://github.com/settings/keys を開き、 **New SSH Key** から公開鍵を登録します。
Title の部分には鍵のコメント (user@host) を書いておくと良いでしょう[^3]。

![](new_ssh_key.png)

最後に、クライアントから SSH 経由で GitHub に接続できることを確認します。
以下のように successfully authenticated と言われれば OK です。

```shell
$ ssh -T -i test_rsa git@github.com
Hi astropenguin! You've successfully authenticated,
but GitHub does not provide shell access.
```

[^3]: 何も書かないと、公開鍵に書かれたコメントが自動的に入るようです。

## References

+ [SSHの公開鍵配布を簡単にやる \| 綺麗に死ぬITエンジニア](https://s8a.jp/distribution-of-ssh-key#%E9%9D%A2%E5%80%92%E3%81%AA%E5%85%AC%E9%96%8B%E9%8D%B5%E3%81%AE%E9%85%8D%E5%B8%83%E3%82%92%E7%B0%A1%E7%B4%A0%E5%8C%96%E3%81%99%E3%82%8B)
