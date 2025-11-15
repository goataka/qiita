# qiita

Qiita記事をGitHubで管理するためのリポジトリです。

## セットアップ

### 1. Qiitaアクセストークンの取得

1. [Qiitaの設定ページ](https://qiita.com/settings/tokens/new)でアクセストークンを生成
2. 必要な権限: `read_qiita`, `write_qiita`

### 2. GitHubシークレットの設定

1. リポジトリの Settings > Secrets and variables > Actions に移動
2. `QIITA_TOKEN` という名前でシークレットを追加
3. 上記で取得したQiitaアクセストークンを値として設定

## 使用方法

### 既存記事の取得

1. GitHubリポジトリの Actions タブに移動
2. 「既存記事の取得」ワークフローを選択
3. 「Run workflow」ボタンをクリックして手動実行

このワークフローは、Qiitaに投稿済みの記事を取得し、リポジトリに保存します。
