---
title: AWS CDKをLocalStackで検証する方法
tags:
  - AWS
  - CDK
  - LocalStack
  - GitHubActions
  - DynamoDB
private: false
updated_at: ''
id: null
organization_url_name: works-hi
slide: false
ignorePublish: false
---
## はじめに

AWS CDK（Cloud Development Kit）を使ったインフラ構築を行う際、AWSアカウントに直接デプロイする前にローカル環境で動作確認したいというニーズがあります。LocalStackを使用することで、AWS環境をローカルでエミュレートし、コストをかけずに開発・テストを行うことができます。

本記事では、以下のリポジトリで実装した内容を紹介します。
<https://github.com/goataka/cdk-with-localstack>

## 対象読者

- AWS CDKを使った開発を行っている方
- LocalStackを使ったローカル開発に興味がある方
- GitHub ActionsでCI/CDパイプラインを構築したい方

## 環境

- Node.js 22
- AWS CDK 2.1100.3
- aws-cdk-local 3.0.1
- LocalStack latest
- Docker Compose

## プロジェクト概要

このプロジェクトは、AWS CDKで定義したインフラをLocalStackにデプロイし、動作確認を行うための検証用リポジトリです。シンプルなDynamoDBテーブルを作成する例を通じて、ローカル開発とCI/CD環境での動作確認方法を示しています。

### 作成するリソース

- DynamoDBテーブル: `cdk-localstack-table`
  - パーティションキー: `id` (String型)
  - 削除ポリシー: DESTROY

## CDKスタックの実装

DynamoDBテーブルを定義するシンプルなスタックです。

```typescript
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class CdkWithLocalstackStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table
    new dynamodb.Table(this, 'Table', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      },
      tableName: 'cdk-localstack-table',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
```

## ローカル開発環境でのデプロイ

### 1. 依存関係のインストール

```bash
npm install
npm run build
```

### 2. LocalStackの起動

Docker Composeを使用してLocalStackを起動します。

```yaml
services:
  localstack:
    image: localstack/localstack:latest
    ports:
      - "4566:4566"
    environment:
      - DEBUG=1
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
```

```bash
docker compose up -d
```

### 3. CDKのデプロイ

`cdklocal`コマンドを使用してLocalStackにデプロイします。

```bash
npx cdklocal deploy --require-approval never
```

### 4. デプロイの確認

```bash
awslocal dynamodb list-tables
awslocal dynamodb describe-table --table-name cdk-localstack-table
```

### 5. LocalStackの停止

```bash
docker compose down
```

## GitHub Actionsでの自動デプロイ

本リポジトリでは、2つのデプロイパターンをGitHub Actionsで実装しています。

### パターン1: setup-localstack Actionを使用（推奨）

LocalStack公式のGitHub Actionを使用する方法です。

**メリット**:

- LocalStackの起動・停止が自動管理される
- `awslocal` CLIが自動的にインストールされる
- ヘルスチェックや手動クリーンアップが不要
- シンプルで保守しやすい設定

**ワークフローの要点**:

```yaml
- name: Setup LocalStack
  uses: LocalStack/setup-localstack@v0.2.3
  with:
    image-tag: 'latest'
    install-awslocal: 'true'

- name: Deploy to LocalStack with CDK
  env:
    AWS_ACCESS_KEY_ID: "test"
    AWS_SECRET_ACCESS_KEY: "test"
    AWS_DEFAULT_REGION: "us-east-1"
  run: |
    npx cdklocal bootstrap
    npx cdklocal deploy --require-approval never
```

このアプローチの利点は、LocalStack公式のアクションがセットアップを簡素化してくれるため、メンテナンス性が高いことです。

### パターン2: Docker Composeを使用

ローカル開発環境と同じDocker Compose設定を使用する方法です。

**メリット**:

- ローカル環境との一貫性が保たれる
- Docker Composeの設定を細かく制御できる
- チーム全体で同じ環境を共有しやすい

**ワークフローの要点**:

```yaml
- name: Start LocalStack
  run: docker compose up -d

- name: Wait LocalStack
  run: |
    curl -s http://localhost:4566/_localstack/health \
      --retry 30 --retry-delay 2 --retry-all-errors | grep -q "available"

- name: Stop LocalStack
  if: always()
  run: docker compose down
```

このアプローチの利点は、ローカル開発とCI/CD環境で完全に同じ構成を使用できることです。

## 重要な注意点

### LocalStackのサービス制限について

`docker-compose.yml`で`SERVICES`環境変数を使ってサービスを制限する場合、注意が必要です。

**❌ 避けるべき設定**:

```yaml
environment:
  - SERVICES=dynamodb  # これは動作しません
```

**理由**:

`cdklocal`コマンドは内部的にSTS（Security Token Service）などの複数のAWSサービスを使用します。サービスを`dynamodb`のみに制限すると、以下のようなエラーが発生します：

```text
Unable to resolve AWS account to use. It must be either configured when you define your CDK Stack, or through the environment
```

このエラーメッセージは、実際にはSTSサービスが利用できないことが原因ですが、エラー内容からは原因が分かりづらいため、デバッグに時間がかかってしまいます。

**推奨**: `SERVICES`環境変数を設定せず、LocalStackのデフォルト設定を使用してください。

### AWS認証情報の設定

LocalStackでは、実際のAWS認証情報は不要ですが、AWS SDKが動作するためにダミーの認証情報を設定する必要があります。

```bash
export AWS_ACCESS_KEY_ID="test"
export AWS_SECRET_ACCESS_KEY="test"
export AWS_DEFAULT_REGION="us-east-1"
```

## 使用ツール紹介

### aws-cdk-local (cdklocal)

`aws-cdk-local`は、AWS CDKをLocalStackに対して実行するためのラッパーツールです。通常の`cdk`コマンドの代わりに`cdklocal`コマンドを使用することで、LocalStackをターゲットとしたデプロイが可能になります。

**インストール**:

```bash
npm install --save-dev aws-cdk-local
```

**使用方法**:

```bash
# 通常のCDK
cdk deploy

# LocalStack向け
npx cdklocal deploy
```

内部的には、エンドポイントURLをLocalStack（`http://localhost:4566`）に向けるように設定を変更してCDKコマンドを実行しています。

### awslocal

`awslocal`は、AWS CLIをLocalStackに対して実行するためのラッパーコマンドです。

**インストール**:

```bash
pip install awscli-local
```

**使用方法**:

```bash
# DynamoDBテーブルの一覧表示
awslocal dynamodb list-tables

# テーブルの詳細情報を取得
awslocal dynamodb describe-table --table-name cdk-localstack-table
```

## まとめ

本記事では、AWS CDKとLocalStackを組み合わせて、ローカル環境でAWSインフラの開発・テストを行う方法を紹介しました。

**ポイント**:

- LocalStackを使うことで、AWSアカウントなしでCDKの動作確認が可能
- GitHub Actionsで2つのデプロイパターンを実装（setup-localstack使用とDocker Compose使用）
- 推奨は`setup-localstack` Actionを使用する方法（保守性が高い）
- LocalStackのサービス制限には注意が必要（STSなどの追加サービスが必要）
- `cdklocal`と`awslocal`を使うことで、簡単にLocalStackと連携可能

LocalStackを活用することで、開発初期段階からインフラコードの動作確認を行い、AWSへのデプロイ前に問題を発見できるようになります。コスト削減と開発効率の向上に役立ててください。

## 参考リンク

- [AWS CDK](https://aws.amazon.com/cdk/)
- [LocalStack](https://localstack.cloud/)
- [setup-localstack Action](https://github.com/localstack/setup-localstack)
- [aws-cdk-local](https://github.com/localstack/aws-cdk-local)
- [awscli-local](https://github.com/localstack/awscli-local)
