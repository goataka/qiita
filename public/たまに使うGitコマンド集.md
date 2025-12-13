---
title: たまに使うGitコマンド集
tags:
  - Git
  - GitHub
  - GitLab
  - 初心者
private: false
updated_at: '2022-09-16T19:02:16+09:00'
id: d910871db4b53d77bffe
organization_url_name: works-hi
slide: false
ignorePublish: false
---
# はじめに

便利だが、たまにしか使わないコマンドをメモとして残します。

## 基本方針

- main へのマージは squash する
  - squash するので rebase は使わない
  - squash するので feature の commit は自由にする
  - main からの merge commit も気にせず入れる

## 基本的なコマンド

https://qiita.com/shimotaroo/items/b73d896ace10894fd290

## 見つからないコマンド

### エディターをVimに変更したい

``` shell
git config --global core.editor vim
```

### リモートの状態に戻したい

``` shell
git switch feature
git fetch origin # ローカルを最新にする
git reset --hard origin/feature # 強制的に戻す 
```
[gitでリモートのブランチにローカルを強制一致させたい時](https://qiita.com/ms2sato/items/72b48c1b1923beb1e186)

### 一時的に変更を退避したい

``` shell
git stash -u # 退避する
git stash pop # 退避内容を戻して消す apply & drop
```
[【git stash】コミットはせずに変更を退避したいとき](https://qiita.com/chihiro/items/f373873d5c2dfbd03250)

### マージ先の変更を取り込む

``` shell
git switch develop
git pull origin develop # ローカルを最新にする
git switch feature 
git merge develop # developの変更をfeatureに取り込む
# コンフリクトする場合は解消する
git push
```

[pull requestでCan't automatically merge発生の場合の対応](https://qiita.com/hibriiiiidge/items/7fee5035a48dbb73aa51)

### リモートの直前のコミットを取り消したい 

``` shell
git switch feature
git reset --hard HEAD^ # 1つ前の状態に戻す
git push origin feature 
```

[困ったときの git reset コマンド集](https://qiita.com/ChaaaBooo/items/459d5417ff4cf815abce)

### リモートのコミットのコメントを修正したい

forceが利用できる環境のみ可能

``` shell
git switch feature
git rebase -i HEAD~1
# 一覧の変更したいコミットの pick を reword に変更し、保存する
git push --force origin feature
```

[GitHub Docs - 古いまたは複数のコミットメッセージの修正](https://docs.github.com/ja/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/changing-a-commit-message#amending-older-or-multiple-commit-messages)

### 空のブランチを作成したい

``` shell
git checkout --orphan doc
```

[gitの空ブランチを作る](https://qiita.com/akiko-pusu/items/7c0a99b8cb37882d2cfe)

## 参考

https://git-scm.com/book/ja/v2

- 本家

https://k.swd.cc/learnGitBranching-ja/

- 練習用サイト
