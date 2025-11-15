# Qiita CLI セットアップ手順

このリポジトリではQiita CLIを使用して記事の管理を行います。

## 前提条件

- Node.js (v14以上)
- npm

## 初回セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Qiitaへのログイン

Qiita CLIを使用するには、Qiitaのアクセストークンが必要です。

1. [Qiitaの個人用アクセストークン作成ページ](https://qiita.com/settings/tokens/new)にアクセス
2. 以下のスコープを選択してトークンを作成:
   - `read_qiita`: Qiitaの情報を読み取る
   - `write_qiita`: Qiitaの情報を更新する
3. 生成されたトークンをコピー
4. ログインコマンドを実行:

```bash
npm run login
```

または

```bash
npx qiita login
```

5. トークンを貼り付けて認証を完了

## 使用方法

### 記事のプレビュー

ローカルで記事のプレビューを確認できます（デフォルト: http://localhost:8888）

```bash
npm run preview
```

### 新しい記事の作成

```bash
npm run new 記事のファイル名
```

例:
```bash
npm run new my-first-article
```

### 記事の公開・更新

全ての記事を公開・更新:

```bash
npm run publish
```

特定の記事のみ公開・更新:

```bash
npx qiita publish 記事のファイル名
```

### Qiitaから記事を取得

Qiitaに投稿済みの記事をローカルに同期:

```bash
npm run pull
```

## ディレクトリ構成

```
.
├── .github/
│   └── workflows/
│       └── publish.yml      # GitHub Actionsによる自動公開設定
├── public/                  # 記事ファイルの保存先（自動生成）
├── .gitignore              # Git管理対象外ファイルの設定
├── qiita.config.json       # Qiita CLI設定ファイル
├── package.json            # npmパッケージ設定
└── SETUP.md               # このファイル
```

## GitHub Actionsによる自動公開

mainまたはmasterブランチにプッシュすると、GitHub Actionsが自動的に記事を公開します。

### 設定方法

1. GitHubリポジトリの Settings > Secrets and variables > Actions にアクセス
2. 「New repository secret」をクリック
3. 以下を入力:
   - Name: `QIITA_TOKEN`
   - Secret: Qiitaのアクセストークン
4. 「Add secret」をクリック

これにより、mainまたはmasterブランチへのプッシュ時に自動的に記事が公開されます。

## トラブルシューティング

### プレビューが表示されない

- ポート8888が既に使用されていないか確認してください
- `qiita.config.json`でポート番号を変更できます

### 認証エラーが発生する

- アクセストークンが正しいか確認してください
- トークンに必要なスコープ（read_qiita, write_qiita）が付与されているか確認してください

## 参考リンク

- [Qiita CLI 公式ドキュメント](https://github.com/increments/qiita-cli)
- [Qiita CLI ガイド](https://qiita.com/Qiita/items/666e190490d0af90a92b)
