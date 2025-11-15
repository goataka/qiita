---
title: 'AWS CDKで「Error: ARNs must have at least 6 components: undefined」になる時の解決策'
tags:
  - AWS
  - TypeScript
  - CDK
private: false
updated_at: '2020-12-24T23:58:49+09:00'
id: a7a00da37b072186702f
organization_url_name: null
slide: false
ignorePublish: false
---
## エラー

AWS CDKで以下のようなエラーが出る事があります。

```
Error: ARNs must have at least 6 components: undefined
```

意味としては、`lambdaVersionArn`が`undefined`で、少なくとも６つのブロックをもつARNの形式が必要だと言っています。

## 発生個所

ここではARNでバージョン指定のLambdaを取得しています。

``` sample-stack.ts
const lambdaVersionArn = props.lambdaVersionArn;
const lambdaVersion = lambda.Version.fromVersionArn(this, 'LambdaFunc', lambdaVersionArn);
```

ARNを外部から受け取っているStackで、Bootstrapや該当Stackではない処理を実行する時に、`lambdaVersionArn`を指定しないので`undefined`になってしまいます。

## 対応方法

`lambdaVersionArn`の値は実際には実行時にしか使われないのでダミーを指定する事で回避ができます。

```
arn:aws:lambda:dummyAccount:function:dummyFunc:dummyVersion
```

ARNのフォーマットでダミーの値を作成します。

### 指定方法１：引数

``` shell
cdk bootstrap -c lambda-version-arn=arn:aws:lambda:dummyAccount:function:dummyFunc:dummyVersion
```

`-c`をつけて指定する方法は簡単ですが、bootstrapに関係ない引数が必要になるので、避けたい所です。

### 指定方法２：Stack内

``` sample-stack.ts
const lambdaVersionArn = props.lambdaVersionArn ?? 'arn:aws:lambda:dummyAccount:function:dummyFunc:dummyVersion';
const lambdaVersion = lambda.Version.fromVersionArn(this, 'LambdaFunc', lambdaVersionArn);
```

分かりやすくはありますが、環境要因をStack内に書きたくないですね。

### 指定方法３：Stack呼び出し

``` sample.ts
const lambdaVersionArn = app.node.tryGetContext('lambda-version-arn') ?? 'arn:aws:lambda:dummyAccount:function:dummyFunc:dummyVersion';
new SampleStack(app, `sample-stack`, {
    lambdaVersionArn : lambdaVersionArn,
});
```

引数を取る部分と近くなり、環境要因が纏まって、スッキリしました。

## 余談

CDKは非常に便利ですが、結構癖があるので、対応方法を考える時に悩む事が多い気がします。
