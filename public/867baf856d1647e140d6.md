---
title: >-
  AWS CLIがMINGW64でc:\program: bad interpreter: No such file or
  directoryエラーになる場合の回避方法
tags:
  - Windows
  - MinGW
  - aws-cli
private: false
updated_at: '2020-12-25T01:30:45+09:00'
id: 867baf856d1647e140d6
organization_url_name: null
slide: false
ignorePublish: false
---
## はじめに

GitBashで入れたMINGW64をシェル実行環境として利用している人がそれなりに遭遇してそうですが、意外と記事がなかったので、記録として残しておきます。
エラーのキーワードで検索するとbrewとか、pipの話が出てきますが、全く関係ありませんでした。

### 追記

この方法ではコマンドプロンプトでの事項ができなくなるので、結局はスペースがないフォルダに再インストールしました。
シンボリックリンクなども試してみましたが、ダメでした。

## 前提条件

- Windows
- MINGW64 ※Cgwinでの動作は未確認ですが、同様の事が起きると思います
- AWS CLI

## 現象

上記の環境にてAWS CLIを利用した際に以下のようなエラーになる。

``` 
$ aws
bash: /c/Program Files/Python38/Scripts/aws: c:\program: bad interpreter: No such file or directory
```
## 回避方法

環境変数のpathで指定しているScriptsを「'（シングルコーテーション）」で囲む。

これを

```
C:\Program Files\Python38\Scripts\
```

こうする

```
'C:\Program Files\Python38\Scripts\'
```

## 補足

ちなみに、「"（ダブルコーテーション）」だと設定できないとエラーになります。
ダメもとでPYTHON_HOMEとかで別で設定もしてみましたが、やはりダメでした。

## 最後に

エラーの内容をよく見れば当たり前の回避方法ですが、MINGW64環境固有の問題かと勝手に思い込んで15分位無駄に時間を使ってしまったので、供養として書き残しました。誰かの役に立てば幸いです。
