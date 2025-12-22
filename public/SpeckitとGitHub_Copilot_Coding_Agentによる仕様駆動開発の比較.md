---
title: Spec KitとGitHub Copilot Coding Agentによる仕様駆動開発の比較
tags:
  - ATDD
  - GitHubCopilot
  - AIエージェント
  - 仕様駆動開発
  - SpecKit
private: false
updated_at: '2025-12-23T02:13:54+09:00'
id: 66ecf5f472208d6185ce
organization_url_name: works-hi
slide: false
ignorePublish: false
---

## はじめに

本記事は以前書いた[「雑にエージェントにテスト設計をさせてみて考えたこと」](https://qiita.com/goataka/items/d1f6a3f5acfb23f102d1)と言う記事の続きです。\
仕様がないと難しいのであれば、それを与えた上で設計させてみようと試行中です。\
ただ、色々と盛り込もうとしすぎて実装・テスト設計までたどり着けていません・・・。

## 概要

本記事では、Spec KitとGitHub Copilot Coding Agentを使って仕様駆動開発をした際の比較を行います。

- 仕様駆動開発を前提とした比較
- 実際の使用経験を基にした内容
- DDD（ドメイン駆動設計）やATDD（受け入れテスト駆動開発）との相性を重視

### Kiro

諸々の都合により比較出来ていません。

- 気になってはいる
- ベンダーロックインの懸念がある
- 時間がたりない

## 対象ツール

### GitHub Spec Kit

<https://github.com/github/spec-kit>

- GitHubが提供する仕様駆動開発を支援するCLIツール
- VSCode拡張機能もあり
- 仕様を書きながらコードを生成・更新できる

### GitHub Copilot Coding Agent

<https://github.com/features/copilot>

- GitHubが提供するAI駆動型のコード生成・編集支援ツール
- 自然言語による指示でコードの生成や修正を行う
- クラウドベースで動作

## 特徴の比較

| 観点 | Spec Kit | GitHub Copilot Coding Agent | 補足 |
| ------ | --------- | ------------------------ | ------ |
| **使用形態** | ローカル（PC） | クラウド（ブラウザ, スマホ） | |
| **利用環境** | △限定 | 〇広い | |
| **環境構築** | ×必要 | 〇不要 | |
| **実行速度** | 〇速 | △中 | 単一作業の速度 |
| **複数実行** | △ | 〇 | 並行作業の可否 |
| **型の有無** | あり（テンプレート） | なし（自由形式） | |
| **型の学習** | △必要 | 〇不要 |  |
| **仕様駆動の理解** | 〇容易 | ×難しい |  |
| **柔軟性** | △低い | 〇高い| |
| **CI/CD統合** | △可能 | 〇必然 | CI/CD環境での統合容易性 |
| **操作** | △難しい | 〇容易 | コマンドの理解 |
| **コスト** | ツール費用＋マシンリソース | サブスクリプション費用 | |

## 共通の特徴

### メリット

- 技術的なデファクトの示唆を受けやすい
- ドメイン駆動や受け入れテスト駆動開発（ATTD）との相性は良い
- 各種仕様が明確なので、テスト駆動開発やドキュメントを作りやすい

### デメリット

- 変更指示の反映に漏れが多い
- 差分をみるのがしんどい
- 色々と考え出して実装まで時間がかかる
- 何をどう纏めるかは結局は工夫が必要
- リリースより後のフェーズ、Ops領域まで書き出すとかなり量が増える
- 提案された仕様の良し悪しは結局確認する必要はある
- 文章量が多くなりがちなので、読むのに疲れる
- 小さい間違いを見落としがち
- 自分でやった方が早いのに無駄に指示してしまう

## プラクティス

### 小さく実装を進める

肥大化するにつれレビューが辛くなる。

- 変更の追跡が容易
- 問題の早期発見
- 変更漏れの減少

### リポジトリ構成

- **小規模プロジェクト**：モノレポで仕様とコードを一元管理
- **大規模プロジェクト**：仕様リポジトリとコードリポジトリを分離して管理

### 仕様の確度

確定度合いを分けて管理する。

- **確定仕様**：プロダクト全体の方針や確定した要件（ストック情報、変更頻度: 低）
- **変更仕様**：開発中の変更内容やPR単位の仕様（フロー情報、変更頻度: 高）

### 情報の種類

内容の種類で分けて管理する。

- **開発プロセス**：開発の進め方、ワークフロー
- **機能**：ユーザー向け機能の仕様
- **アーキテクチャ**：システム構造、技術的な設計
- **リポジトリ管理**：ブランチ戦略、コミット規約

### 継続的なメンテナンス

乖離が発生しないよう管理する。

- 実装と仕様の乖離を定期的にチェック
- 仕様の更新を開発プロセスに組み込む
- CI/CDで仕様と実装の整合性を自動チェック

### 導入段階に応じた使い分け

最初は`Spec Kit`で、慣れたら`GitHub Copilot Coding Agent`がよい気がする。

#### 初心者・小規模チームにはSpec Kit

**状況**：

- 仕様駆動開発が初めての場合
- 型があることで安心したい場合
- ローカルでの高速な実行を重視する場合

**メリット**：

- 型があるSpec Kitで基本的な流れを学ぶ
- 仕様の書き方、進め方のパターンを体得する

#### 経験者・分散チームにはGitHub Copilot Coding Agent

**状況**：

- 仕様駆動開発の経験がある場合
- リモートワークや移動中も作業したい場合
- プロジェクト固有の仕様形式を作りたい場合
- マシンスペックに制約がある場合

**メリット**：

- 柔軟性の高いGitHub Copilot Coding Agentで効率的に開発する
- プロジェクトに最適な仕様の書き方を確立する

### 両方を活用する

両方のツールの特性を理解した上で使い分ける選択肢もあると思います。

1. **学習段階**：Spec Kitで基本を学ぶ
2. **実践段階**：GitHub Copilot Coding Agentで柔軟に開発
3. **標準化段階**：チームに合わせたハイブリッド運用

重要なのは、ツールに依存しすぎないことです。

## おわりに

まだ試行の途中なので記事が中途半端ですが、仕様駆動開発のためのツール選定や運用方法の参考になれば幸いです。\
実装まで完了させたら、また記事を書きたいと思います。

## 参考

以下のような技術スタックで試しています。

- Backend: NestJS + TypeScript
- Frontend: React + TypeScript
- Website: Docusaurus
- Authentication: Cognito
- Session Management: Redis(Valkey)
- Database: DynamoDB
- CI/CD: GitHub Actions
- Infrastructure: AWS CDK + LocalStack
- E2E Testing: Cucumber + Playwright
- Integration Testing: Jest(Vitest) + Supertest
- Unit Testing: Jest(Vitest)
- etc.

### GitHub Spec Kit の構成

<https://github.com/goataka/spec-kit/tree/qiita>

こちらは控えめにしたのと、途中なので少なめですね。

```
├── .github/                    # GitHub関連の設定とエージェント定義
│   ├── agents/                # カスタムエージェント定義ファイル
│   │   ├── speckit.analyze.agent.md
│   │   ├── speckit.checklist.agent.md
│   │   ├── speckit.clarify.agent.md
│   │   ├── speckit.constitution.agent.md
│   │   ├── speckit.implement.agent.md
│   │   ├── speckit.plan.agent.md
│   │   ├── speckit.specify.agent.md
│   │   ├── speckit.tasks.agent.md
│   │   └── speckit.taskstoissues.agent.md
│   └── prompts/               # エージェント用プロンプト定義
│       ├── speckit.analyze.prompt.md
│       ├── speckit.checklist.prompt.md
│       ├── speckit.clarify.prompt.md
│       ├── speckit.constitution.prompt.md
│       ├── speckit.implement.prompt.md
│       ├── speckit.plan.prompt.md
│       ├── speckit.specify.prompt.md
│       ├── speckit.tasks.prompt.md
│       └── speckit.taskstoissues.prompt.md
├── .specify/                  # Spec Kit設定とツール
│   ├── config/               # 設定ファイル
│   │   └── language.yaml     # 言語設定
│   ├── memory/               # プロジェクトメモリ
│   │   └── constitution.md   # プロジェクト憲章
│   ├── scripts/              # 自動化スクリプト
│   │   └── bash/
│   │       ├── check-prerequisites.sh    # 前提条件チェック
│   │       ├── common.sh                 # 共通関数
│   │       ├── create-new-feature.sh     # 新機能作成
│   │       ├── setup-plan.sh             # プラン設定
│   │       └── update-agent-context.sh   # エージェントコンテキスト更新
│   └── templates/            # テンプレートファイル
│       ├── agent-file-template.md
│       ├── checklist-template.md
│       ├── plan-template.md
│       ├── spec-template.md
│       └── tasks-template.md
├── .vscode/                   # VS Code設定
│   └── settings.json
├── specs/                     # 仕様ドキュメント
│   └── 20251222-114347794740791/  # タイムスタンプ付き仕様ディレクトリ
│       ├── contracts/         # API契約定義
│       │   └── api-contracts.md
│       ├── data-model.md      # データモデル定義
│       ├── plan.md            # 実装計画
│       ├── quickstart.md      # クイックスタートガイド
│       ├── research.md        # 調査資料
│       ├── spec.md            # 機能仕様
│       └── tasks.md           # タスク一覧
├── LICENSE                    # ライセンスファイル
└── README.md                  # プロジェクト概要
```

### GitHub Copilot Coding Agent の構成

<https://github.com/goataka/spec-driven-development/tree/qiita>

欲張りすぎて仕様の量が多くなっています・・・。

```
├── CONTRIBUTING.md              # コントリビューションガイド（人間向け）
├── LICENSE                      # MITライセンスファイル
├── README.md                    # プロジェクトの概要と目次
├── agent.md                     # AIエージェント向けの作業ガイド
├── docs/                        # プロジェクトドキュメント
│   ├── DEVELOPMENT_FLOW.md      # 開発フローの全体像
│   ├── agreement/               # 合意事項・規約
│   │   ├── code-comment.md      # コードコメント規約
│   │   ├── commit-convention.md # コミットメッセージ規約
│   │   ├── communication.md     # コミュニケーション規約
│   │   ├── diagram-style.md     # 図表作成規約（Mermaid）
│   │   ├── document-structure.md # ドキュメント構造規約
│   │   ├── review-guidelines.md # レビューガイドライン
│   │   ├── work-approach.md     # 作業の進め方
│   │   └── writing-style.md     # 文章スタイル規約
│   ├── build/                   # ビルド戦略
│   │   ├── BACKEND.md           # バックエンドビルド戦略
│   │   ├── CI_CD.md             # CI/CDビルド設定
│   │   ├── FRONTEND.md          # フロントエンドビルド戦略
│   │   ├── README.md            # ビルド戦略の概要
│   │   └── WEBSITE.md           # ドキュメントウェブサイトビルド戦略
│   ├── deploy/                  # デプロイ戦略
│   │   ├── BACKEND.md           # バックエンドデプロイ方針
│   │   ├── CI_CD.md             # CI/CDパイプライン設定
│   │   ├── DATABASE.md          # データベース管理
│   │   ├── FRONTEND.md          # フロントエンドデプロイ方針
│   │   ├── README.md            # デプロイ戦略の概要
│   │   ├── STRATEGIES.md        # デプロイメント戦略（ローリング、ブルーグリーン等）
│   │   └── WEBSITE.md           # ドキュメントウェブサイトデプロイ方針
│   ├── implement/               # 実装仕様
│   │   ├── API.md               # API設計とエンドポイント仕様
│   │   ├── BACKEND.md           # バックエンド設計（NestJS + TypeScript）
│   │   ├── DATABASE.md          # データベース設計（DynamoDB）
│   │   ├── DEPENDENCIES.md      # 依存関係管理（Dependabot、Renovate）
│   │   ├── FRONTEND.md          # フロントエンド設計（React + TypeScript）
│   │   ├── README.md            # 実装仕様の概要
│   │   ├── SECURITY.md          # セキュリティ設計（認証・認可）
│   │   └── WEBSITE.md           # ウェブサイト設計
│   ├── monitor/                 # 監視戦略
│   │   ├── ALERTS.md            # アラート設定
│   │   ├── DASHBOARDS.md        # ダッシュボード設定（Grafana）
│   │   ├── ERRORS.md            # エラー追跡（Sentry）
│   │   ├── LOGGING.md           # ログ管理（Winston/Pino）
│   │   ├── METRICS.md           # メトリクス収集（Prometheus）
│   │   └── README.md            # 監視戦略の概要
│   ├── monorepo/                # モノレポ構成
│   │   ├── DEPENDENCIES.md      # パッケージ間依存関係管理
│   │   ├── README.md            # モノレポ概要
│   │   ├── STRUCTURE.md         # ディレクトリ構造（計画中）
│   │   └── WORKFLOWS.md         # 開発ワークフロー
│   ├── operate/                 # 運用管理
│   │   ├── BACKUP.md            # バックアップとリストア
│   │   ├── DAILY.md             # 日常運用タスク
│   │   ├── INCIDENTS.md         # インシデント対応
│   │   ├── MAINTENANCE.md       # システムメンテナンス
│   │   ├── README.md            # 運用管理の概要
│   │   └── SECURITY.md          # セキュリティ運用
│   ├── release/                 # リリース管理
│   │   ├── CHANGELOG.md         # チェンジログ管理
│   │   ├── NOTES.md             # リリースノート
│   │   ├── PROCESS.md           # リリースプロセス
│   │   ├── README.md            # リリース管理の概要
│   │   └── VERSIONING.md        # バージョニング戦略
│   ├── test/                    # テスト戦略
│   │   ├── ACCESSIBILITY.md     # アクセシビリティテスト（WCAG 2.1 Level AA）
│   │   ├── COMPONENT.md         # コンポーネントテスト（Storybook）
│   │   ├── E2E.md               # E2Eテスト（Cucumber + Playwright）
│   │   ├── INTEGRATION.md       # 統合テスト（Jest + Supertest）
│   │   ├── PERFORMANCE.md       # パフォーマンステスト（Lighthouse CI）
│   │   ├── README.md            # テスト戦略の概要
│   │   ├── SECURITY_DYNAMIC.md  # 動的セキュリティテスト（OWASP ZAP）
│   │   ├── SECURITY_STATIC.md   # 静的セキュリティテスト（npm audit、CodeQL）
│   │   ├── SNAPSHOT.md          # スナップショットテスト（Vitest）
│   │   └── UNIT.md              # 単体テスト（Jest、Vitest）
│   └── user/                    # ユーザー向けドキュメント
│       ├── FAQ.md               # よくある質問と回答
│       ├── MANUAL.md            # ユーザーマニュアル（ナビゲーション）
│       ├── README.md            # 機能リファレンス
│       ├── RELEASE_NOTES.md     # リリースノート
│       ├── guides/              # ガイド
│       │   ├── startup.md       # スタートアップガイド
│       │   └── troubleshooting.md # トラブルシューティング
│       └── images/              # UIスクリーンショット・図表
│           ├── attendance-daily.svg   # 日次勤怠画面
│           ├── attendance-monthly.svg # 月次勤怠画面
│           ├── clock-history.svg      # 打刻履歴画面
│           ├── clock-in.svg           # 出勤打刻画面
│           ├── clock-out.svg          # 退勤打刻画面
│           ├── login.svg              # ログイン画面
│           ├── logout.svg             # ログアウト画面
│           ├── main-dashboard.svg     # メインダッシュボード画面
│           └── user-registration.svg  # ユーザー登録画面
└── specs/                       # 仕様書
    ├── README.md                # 仕様書の概要
    ├── architecture/            # アーキテクチャ決定記録（ADR）
    │   ├── 001-state-management-library.md # 状態管理ライブラリの選定
    │   ├── 002-ui-library-selection.md     # UIライブラリの選定
    │   ├── 003-orm-selection.md            # ORMの選定
    │   ├── 004-redis-cache-usage.md        # Redisキャッシュ利用
    │   ├── 005-cloud-hosting-platform.md   # クラウドホスティングプラットフォーム選定
    │   ├── 006-dynamodb-single-table-design.md # DynamoDBシングルテーブル設計
    │   ├── 007-dynamodb-toolbox-adoption.md    # DynamoDB Toolbox採用
    │   ├── 008-dynamodb-dax-usage.md       # DynamoDB DAX利用
    │   ├── 009-dynamodb-lsi-usage.md       # DynamoDB LSI利用
    │   ├── 010-dynamodb-global-tables.md   # DynamoDBグローバルテーブル
    │   ├── 011-vpc-endpoint-usage.md       # VPCエンドポイント利用
    │   ├── 012-api-gateway-integration.md  # API Gateway統合
    │   ├── 013-lambda-provisioned-concurrency.md # Lambdaプロビジョニング済み同時実行数
    │   ├── 014-s3-local-emulation.md       # S3ローカルエミュレーション
    │   └── README.md                       # アーキテクチャ決定記録の概要
    └── business/                # ビジネス要件仕様
        ├── 001-add-user-registration.md # ユーザー登録機能
        ├── 002-add-login.md             # ログイン機能
        ├── 003-add-logout.md            # ログアウト機能
        ├── 004-add-clock-in-out.md      # 出勤・退勤打刻機能
        ├── 005-add-attendance-history.md # 勤怠履歴機能
        └── images/              # ビジネス要件関連図表
            ├── 001-user-registration.svg # ユーザー登録フロー図
            ├── 002-login.svg             # ログインフロー図
            ├── 003-logout.svg            # ログアウトフロー図
            ├── 004-clock-in.svg          # 出勤打刻フロー図
            ├── 004-clock-out.svg         # 退勤打刻フロー図
            ├── 004-main-dashboard.svg    # メインダッシュボード図
            ├── 005-attendance-daily.svg  # 日次勤怠履歴図
            ├── 005-attendance-monthly.svg # 月次勤怠履歴図
            └── 005-clock-history.svg     # 打刻履歴図
```