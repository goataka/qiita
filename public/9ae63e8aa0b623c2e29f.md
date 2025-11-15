---
title: GitLab CEでGitHubをミラーリングする
tags:
  - GitHub
  - GitLab
  - GitLab-CI
  - GitLabCE
  - mirror
private: false
updated_at: '2022-05-02T08:41:16+09:00'
id: 9ae63e8aa0b623c2e29f
organization_url_name: works-hi
slide: false
ignorePublish: false
---
# 概要

**GitHub** -> **GitLab CE** の同期を実現した。

## 課題

- **GitLab**の**ミラーリング機能**の**Pull**は**CE(Community Edition)** では利用できない。
  - **Pull**は**EE(Enterprise Edition)** の機能となる。
- **GitLab CE**は**社内環境**にある為、**GitHub Action**では同期できない。

## 解決

- **GitLab**の**CI/CD**の**Schedule**を利用し、**Git**の機能のみで同期を実現した。

## 補足

- 仕組みとしてはGitLab, GitHub以外でも利用可能である。
- 鍵はアクセスを限定かつ個人管理にしない為、プロジェクト毎に生成する。

# ミラー実行用レポジトリの作成

ミラー対象のレポジトリとは別に実行用にレポジトリを作成する。

- レポジトリ名
  - 任意
  - `ex) Mirror Tool`
- ファイルを作成
  - .gitlab-ci.yml
    - CI/CDの実行内容
    - 下記の内容を転記する。
  - README.md
    -  任意
    -  `ex) 本ページへのURL`

## .gitlab-ci.yml

以下を転記する。

``` sh
# 実行用レポジトリのコードは使わないのでチェックアウトを無効化
variables:
  GIT_STRATEGY: none
  GIT_CHECKOUT: "false"
  
mirroring:
  rules:
    # 引数が未指定の場合、ジョブを実行しない
    - if: $SSH_PRIVATE_KEY && $SOURCE_HOST && $SOURCE_REPOSITORY  && $TARGET_HOST && $TARGET_REPOSITORY 

  before_script:
    # openssh-clientとgitをインストール
    - apt update -y && apt install -y openssh-client git
    # SSH用のディレクトリを作成
    - mkdir ~/.ssh/ && chmod 0700 ~/.ssh
    # SSHで秘密鍵を使うように設定
    - echo "Host $SOURCE_HOST, $TARGET_HOST" >> ~/.ssh/config
    - echo "  AddKeysToAgent yes" >> ~/.ssh/config
    - echo "  IdentityFile  ~/.ssh/id_rsa_mirror" >> ~/.ssh/config
    # SSHの設定を表示
    - cat ~/.ssh/config
    # 秘密鍵のファイルを生成し、権限を付与
    - echo "$SSH_PRIVATE_KEY" | tr -d "\r" > ~/.ssh/id_rsa_mirror
    - chmod 600 ~/.ssh/id_rsa_mirror
    # SSHエージェントを起動
    - eval $(ssh-agent -s)
    # SSHエージェントに秘密鍵を追加
    - ssh-add ~/.ssh/id_rsa_mirror
    # 対象のホストの公開鍵を取得し、known_hostsに追加
    - ssh-keyscan -H "$SOURCE_HOST" >> ~/.ssh/known_hosts
    - ssh-keyscan -H "$TARGET_HOST" >> ~/.ssh/known_hosts

  script:
    # ミラー元レポジトリを取得
    - git clone --mirror git@$SOURCE_HOST:$SOURCE_REPOSITORY.git work
    - cd work
    # ミラー先レポジトリへ送信
    - git push --mirror git@$TARGET_HOST:$TARGET_REPOSITORY.git
```

# レポジトリ毎の設定

ミラーしたいレポジトリ毎に以下を実行する。

## SSHキーを生成する

```sh
ssh-keygen -q -t ed25519 -C '${REPOSITORY_ID}' -N '' -f ~/.ssh/id_rsa_${REPOSITORY_ID}
```

`ex) ssh-keygen -q -t ed25519 -C 'mirror-tool' -N '' -f ~/.ssh/id_rsa_mirror-tool`

## ミラー元レポジトリ ex) GitHub

### デプロイキーを追加する

- 以下を開く。
  - `Source Repository > Settings > Security > Deploy keys > Add deploy key`
- 値を入力する。
  - Title
    - Name of id_rsa_${REPOSITORY_ID}.pub
    - `ex) id_rsa_mirror-tool.pub`
  - Key
    - Content of id_rsa_${REPOSITORY_ID}.pub
    - `ex) ssh-ed25519 [...] mirror-tool`
  - Allow write access
    - チェックしない
- `Add key`を押す。

## ミラー先レポジトリ ex) GitLab

### 新しいプロジェクトを作成する

- 作成したいグループで`New Project`を押す。
- `Create blank project`を選択する。
- 値を入力する。
  - Project name
    - ${REPOSITORY_NAME} Mirror
    - `ex) Mirror Tool Mirror`
  - Project slug
    - ${REPOSITORY_ID}_mirror
    - `ex) mirror_tool_mirror`
  - Project description
    - This repository is mirror for ${SOURCE_REPOSITORY}
    - `ex) This repository is mirror for github.com:***/mirror-tool.git`
  - Initialize repository with a README
    - チェックしない
- `Craete project`を押す。

### デプロイキーを追加する

- 以下を開く
  - `ミラー先レポジトリ > Settings > Repository > Deploy keys > Collapse`
- 値を入力する。
  - Title
    - id_rsa_${REPOSITORY_ID}.pubのファイル名を指定する。
    - `ex) id_rsa_mirror-tool.pub`
  - Key
    - id_rsa_${REPOSITORY_ID}.pubのテキストを指定する。
    - `ex) ssh-ed25519 [...] mirror-tool`
  - Grant write permissions to this key
    - チェックする
- `Add key`を押す。

## Scheduleを追加する

- 以下を開く。
  - `ミラー実行用レポジトリ > CI/CD > Schedules > New Schedule`
- 値を入力する。
  - Description
    - `${SOURCE_HOST}:${SOURCE_REPOSITORY_GROUP}/${REPOSITORY_ID} to ${TARGET_HOST}:${TARGET_REPOSITORY_GROUP}/${REPOSITORY_ID}-mirror`
    - `ex) github.com:***/mirror-tool to gitlab.internal:mirror/mirror-tool-mirror`
  - Interval Pattern
    - 任意に設定する
  - Target Branch
    - `.gitlab-ci.yml`を作成したブランチを指定する。
    - `ex) Main`
  - Variables
    - SOURCE_HOST
      - コピー元のホスト名を指定する。
      - `ex) github.com`
    - SOURCE_REPOSITORY
      - `${SOURCE_REPOSITORY_GROUP}/${REPOSITORY_ID}`
      - `ex) ***/mirror-tool`
    - TARGET_HOST
      - コピー先のホスト名を指定する。
      - `ex) gitlab.internal`
    - TARGET_REPOSITORY
      - `${TARGET_REPOSITORY_GROUP}/${REPOSITORY_ID}-mirror`
      - `ex) csr-dept/mirror-tool-mirror`
    - SSH_PRIVATE_KEY
      - 最初に作成したSSHキーの秘密鍵
      - `id_rsa_${REPOSITORY_ID}`のテキストを指定する。
        - ```
          ex) 
          -----BEGIN OPENSSH PRIVATE KEY-----
          (Omitted)
          -----END OPENSSH PRIVATE KEY-----
          ```
  - Activated
    - チェックする
- `Save pipeline schdule`を押す。

## Scheduleを実行する

Scheduleの動作を確認する。

- 以下を開く。
  - `ミラー実行用レポジトリ > CI/CD > Schedules`
- 作成したScheduleの`Play`を押す。
- 以下を開く。
  - `ミラー実行用レポジトリ > CI/CD > Pipelines`
- 実行されたJobの結果を確認する。

# 最後に

わかり辛い所があるかもしれませんが、参考になれば幸いです。
