---
title: JIRAでGitHub Enterpriseを連携する際の設定値の具体例
tags:
  - jira
  - GithubEnterprise
private: false
updated_at: '2020-12-02T23:42:57+09:00'
id: 6a02fde3de1a78a85041
organization_url_name: null
slide: false
ignorePublish: false
---
# 概要

GitHub EnterpriseとJIRAの連携の設定で、JIRA側の設定でちょっと苦労したので、メモとして公開しておく。
基本的な設定はネットに結構あるのだが、設定項目の具体的な値の例がなくて困ったので記載しておく。
Enterpriseの場合、アプリではなく、DVSC accountsで連携設定をする。その際に指定する項目の例が以下になる。

# JIRA設定例

設定 > 製品 > 統合 > DVCSアカウント > GitHub エンタープライズアカウントをリンク

## 新しい GitHub エンタープライズアカウントを追加

### Team or User account

項目がTeamとか書いてるのに、これはGitHubのOrganizationを指定するらしい
``` ex) xxx-organization```

### Host URL

GitHub EnterpriseのサイトURLとか説明が書いてあるのに、指定するのは普通にGitHubのURL
```ex) https://github.com/```

### Client ID / Client Secret

これはGitHub側で指定した内容で、特に嵌る事はなかった。 

### Auto Link New Repositories / Enable Smart Commits

これは任意なので、ご都合に合わせて。特に困らなければ、そのままの方が。

# 最後に

以上、本当に簡単ですが、誰かの参考になれば幸いです。
