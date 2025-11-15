# Qiita Article Management

このリポジトリは、Qiitaに投稿する記事を管理するためのものです。

## 機能

- 📝 記事の作成と管理
- 🚀 自動アップロードCI（GitHub Actions）
- 🔗 リンク切れチェック（PR時）
- ✨ Markdown lintチェック（reviewdog）
- 🛠️ VSCode推奨拡張機能
- 🤖 GitHub Copilot日本語サポート

## セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/goataka/qiita.git
cd qiita
```

### 2. VSCode拡張機能のインストール

VSCodeで開くと、推奨拡張機能のインストールを促されます。以下の拡張機能がインストールされます：

- Markdown Lint
- GitHub Copilot
- GitHub Copilot Chat
- Markdown All in One
- Markdown Preview GitHub Styles
- Code Spell Checker

### 3. Qiita Token の設定

記事を自動アップロードするには、GitHubリポジトリのSecretsに`QIITA_TOKEN`を設定してください。

1. [Qiitaのアクセストークンを生成](https://qiita.com/settings/tokens/new)
2. GitHubリポジトリの Settings > Secrets and variables > Actions
3. `New repository secret` をクリック
4. Name: `QIITA_TOKEN`、Secret: 生成したトークン

## 使い方

### 記事の作成

`articles/` ディレクトリに新しいMarkdownファイルを作成します。

```bash
mkdir -p articles
touch articles/my-first-article.md
```

### 記事のフォーマット

記事はQiita CLIのフォーマットに従います：

```markdown
---
title: 記事のタイトル
tags:
  - タグ1
  - タグ2
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---

# 記事の内容

ここに記事の本文を書きます。
```

### 自動アップロード

`main` ブランチに記事をプッシュすると、自動的にQiitaにアップロードされます。

```bash
git add articles/
git commit -m "新しい記事を追加"
git push origin main
```

## CI/CD

### 自動アップロード

- トリガー: `main` ブランチへのプッシュ（`articles/` 配下の変更時）
- ワークフロー: `.github/workflows/upload-articles.yml`

### リンク切れチェック

- トリガー: プルリクエスト（Markdownファイルの変更時）
- ワークフロー: `.github/workflows/link-check.yml`

### Markdown Lint

- トリガー: プルリクエスト（Markdownファイルの変更時）
- ワークフロー: `.github/workflows/reviewdog-markdownlint.yml`
- 設定ファイル: `.markdownlint.json`

## 開発ガイドライン

### Markdown ルール

- 行の長さ: 120文字まで（コードブロックとテーブルは除く）
- HTML要素: `<details>`, `<summary>`, `<br>` のみ許可
- その他のルールは `.markdownlint.json` を参照

### GitHub Copilot

このリポジトリでは、GitHub Copilotが日本語で応答するように設定されています。
設定は `.github/copilot-instructions.md` を参照してください。

## ライセンス

MIT License