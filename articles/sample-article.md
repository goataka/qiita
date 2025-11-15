---
title: サンプル記事
tags:
  - Qiita
  - GitHub
  - CI/CD
private: true
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---

# はじめに

これはQiita記事管理リポジトリのサンプル記事です。

## 特徴

このリポジトリには以下の機能が含まれています：

- 自動アップロードCI
- リンク切れチェック
- Markdown lint（reviewdog）
- VSCode推奨拡張機能

## 使い方

記事を作成したら、`main`ブランチにプッシュするだけで自動的にQiitaにアップロードされます。

```bash
git add articles/
git commit -m "記事を追加"
git push origin main
```

## まとめ

GitHub Actionsを使用することで、記事の管理と公開を自動化できます。
