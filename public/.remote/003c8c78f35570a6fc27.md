---
title: AWS CDKはグローバルでインストールしない
tags:
  - AWS
  - npx
  - CDK
private: false
updated_at: '2020-12-25T02:11:26+09:00'
id: 003c8c78f35570a6fc27
organization_url_name: null
slide: false
ignorePublish: false
---
## はじめに

結論を先に書くと、ローカルにインストールし、`npx cdk`で呼びましょう、と言う話です。

## 本文

### グローバルにインストールするデメリット

グローバルにインストールをして暫くたつと、以下のようなエラーがでるようになります。

``` 
This CDK CLI is not compatible with the CDK library used by your application. 
Please upgrade the CLI to the latest version. 
(Cloud assembly schema version mismatch: Maximum schema version supported is 4.0.0, but found 7.0.0)
```

原因としては、グローバルに入れたCDKとローカルのCDKのバージョンに違いがあるからです。
インストールした直後には違いはないので、グローバルに入れて、そのまま利用してしまう人が多いと思いますが、後日新しいバージョンが出た時に修正をして、`npm run build`をすると新しいバージョンが出ているメッセージが出て、更新を促され、以下のようなコマンドを実行します。

``` shell
$ ncu -u
$ npm i
```

しかし、これはローカルのみの更新となる為、グローバルは更新されず、バージョンの違いが発生して上記のエラーとなります。

### ローカルにインストールする方法

これを回避する為、AWS CDKはローカルにインストールします。

``` shell
npm install aws-cdk
```

こうする事でCDK自体が`package.json`でバージョン管理されるようになり、バージョンを纏めて管理できるようになり、`ncu`の実行時に違いが発生する事がなくなります。

### ローカルでインストールした場合の実行方法

``` shell
bash: cdk: command not found
```

しかし、このやり方だと`cdk`では上記のようなエラーとなって、呼び出せなくなってしまいます。cdkが`.\node_module\.bin`にあり、パスが通ってないからです。パスを通す事で実行可能になりますが、プロジェクト毎で切り替えるのは辛く、もっと簡単な方法があります。

``` shell
npx cdk bootstrap
``` 
npxを使う事で、複雑な事はせず、CDKを実行する事ができます。

## さいごに

CDKはたまにしか触らないのに、嵌りポイントが多く、ネットにまだ記事が少なく、自分も直ぐに忘れてしまうので、少しずつ、増やしてきます。

## 参考文献

- npxでnodeモジュールを実行する
 - https://qiita.com/tatakahashiap/items/1c4ab221c4993e7c4ebf
- AWS CDKでハマったこと＆解決法
  - https://qiita.com/honmaaax/items/d1467b1f49df2ae09b97
