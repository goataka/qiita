---
title: CodeceptJSにトライしてみた。
tags:
  - bdd
  - gherkin
  - e2e
  - テスト自動化
  - CodeceptJS
private: false
updated_at: '2023-11-11T11:33:02+09:00'
id: 6000f803dfccd0240c83
organization_url_name: works-hi
slide: false
ignorePublish: false
---
## 最初に

本記事は[GitHub: GOAMI-Takaaki/codeceptjs-hotel-planisphere](https://github.com/GOAMI-Takaaki/codeceptjs-hotel-planisphere)の転記になります。

## 概要

自動化練習サイト「HOTEL PLANISPHERE」を対象に、Gherkin記法のテストを、CodeceptJS で実装したサンプルコードを紹介します。

### 対象

- サービス
  - [HOTEL PLANISPHERE - 自動化練習サイト](https://hotel.testplanisphere.dev/ja/)
- シナリオ
  - [testplanisphere/hotel-example-webdriverio-ja](https://github.com/testplanisphere/hotel-example-webdriverio-ja/)

### 構成

- 自動化フレームワーク
  - [CodeceptJS](https://codecept.io/) + [Playwright](https://playwright.dev/)
- プログラミング言語
  - [TypeScript](https://www.typescriptlang.org/)
- テスト記法
  - [Gherkin](https://cucumber.io/docs/gherkin/reference/)

### 環境

- ライブラリ
  - [Node.js](https://nodejs.org/ja)
- OS
  - [WSLg](https://learn.microsoft.com/ja-jp/windows/wsl/tutorials/gui-apps) + [Ubuntu 22.04.2 LTS](https://apps.microsoft.com/store/detail/ubuntu-22042-lts/9PN20MSR04DW)

## 基本

### CodeceptJS とは

- E2Eテストフレームワークである。
- Node.jsプロジェクトである。
- Gherkin記法をサポートしている。
 
#### Pros

- コードが直感的で分かりやすい。
  - ex. `I.click('ログイン')`
- 対応しているテストツールが多い。
  - ex. Playwright, WebDriver, Puppeteer, TestCafe, Appium
- プラグインが豊富である。
  - ex. ビジュアルテスト、データ駆動テスト、テストレポートなど

#### Cons

- ドキュメント通りに動作しないことがある。
  - ex. iframeやポップアップ
- 日本語ドキュメントが少ない。
  - CodeceptJS に関する Qiita は 44 記事だけである。
- Gherkin記法がサブ的な位置づけである。
  - 機能強化の見通しが不透明である。

### Gherkin 記法とは

- 自然言語で記述するシナリオ・フォーマットの１つである。
  - ex. Feature / Scenario / Given / when / Then で記述する。
- 振る舞い駆動開発 (Behavior Driven Development: BDD) で利用される。
  - TDD としての SpceBDD と 受け入れテストとしての StoryBDD がある。
- [Cucumber](https://cucumber.io/)で利用されている記法として知られる。
  - [Gherkin Reference](https://cucumber.io/docs/gherkin/reference/) で詳述されている。

#### Pros

- 自然言語で記述できる。
  - 誰でも理解・記述でき、関係者と認識を合わせやすい。
- シナリオだけで記述できる。
  - 画面操作を含まず、実装前に定義できる。
- 記述方法が共通化されている。
  - ナレッジの再利用性がある。

#### Cons

- 記述が冗長になりやすい。
  - ex. `ログイン画面のメールアドレスに{string}を入力する。`
- 曖昧になりやすい。
  - 実装者との認識が一致しない可能性がある。
- フォーマットの拡張性がない。
  - デシジョン・テーブルなどパターンテストには利用しづらい。

## プロジェクト作成

ref. [Quickstart | CodeceptJS](https://codecept.io/quickstart/)

```sh
# フォルダを作成する。
$ mkdir codeceptjs-hotel-planishpere
$ cd codeceptjs-hotel-planishpere

# CodeceptJS と Playwright をインストールする。
$ npx create-codeceptjs .

# プロジェクトの初期化をする。
$ npx codeceptjs init
# TypeScriptは利用する。
? Do you plan to write tests in TypeScript? Yes
# テストを各ファイル名のルールだが、今回は使用しない。
? Where are your tests located? ./*_test.ts
# 使うテストツールは Playwright にする。
? What helpers do you want to use? Playwright
# 出力フォルダ名は output にする。
? Where should logs, screenshots, and reports to be stored? ./output
# ローカライズは英語のままにする。ja-JP だと不具合もある。
? Do you want to enable localization for tests? http://bit.ly/3GNUBbh English

# ブラウザは chromium を選択する。
Configure helpers...
? [Playwright] Browser in which testing will be performed. Possible options: chromium, firefox, webkit or electron chrom
ium
# ベース URL は HOTEL PLANISPHERE に指定する。
? [Playwright] Base url of site to be tested https://hotel.testplanisphere.dev/ja/
# テスト時の画面は非表示にする。
? [Playwright] Show browser window No
# 最初に作るシナリオ名は login にする。
? Feature which is being tested (ex: account, login, etc) login
# シナリオを記述するファイル名は login.ts にする。
? Filename of a test login.ts

# Gherkin 用の初期化をする。
$ npx codeceptjs gherkin:init
```

## フォルダ構成

### 自動作成

- features
  - Gherkin形式で書くシナリオを配置する。
- output
  - 実行時のスクリーンショットなどが配置される。
- step_definitions
  - シナリオで記載されるステップを配置する。
- [codecept.conf.js](https://github.com/GOAMI-Takaaki/codeceptjs-hotel-planisphere/tree/main/codecept.conf.ts)
  - 動作を切り替える設定ファイル。
- [step_file.ts](https://github.com/GOAMI-Takaaki/codeceptjs-hotel-planisphere/tree/main/steps_file.ts)
  - 共通で利用するステップを配置する。
- [steps.d.ts](https://github.com/GOAMI-Takaaki/codeceptjs-hotel-planisphere/tree/main/steps.d.ts)
  - defコマンドによりTypescript用の定義が自動生成される。

### 手動作成

- data
  - シナリオに利用するファイルを配置する。
- src
  - 共通のコードを配置する。

### 設定

### 自動作成

ref. [Configuration | CodeceptJS](https://codecept.io/configuration/)

```typescript
export const config: CodeceptJS.MainConfig = {
  tests: './*_test.ts', // テスト対象（未使用）
  output: './output', // 出力先
  helpers: {
    Playwright: {
      browser: 'chromium', //ブラウザ
      url: 'https://hotel.testplanisphere.dev/ja/index.html', // 初期URL
    },
  },
  include: { 
    I: './steps_file' // 共通ステップを定義するファイルを指定する。
  },
  gherkin: {
    features: [ 
      // シナリオ毎に作成する。
    ],
    steps: [ 
      // ページ毎に作成する。
    ]
  },
  name: 'hotel-example-codeceptjs-ja' // プロジェクト名
}
```

### 手動作成

ref. [Configuration](https://codecept.io/helpers/Playwright/#configuration) in Playwright | CodeceptJS

```typescript
export const config: CodeceptJS.MainConfig = {
  ...
  helpers: {
    Playwright: {
      ...
      windowSize: '1980x1080', // 画面サイズ
      locale: 'ja-JP', // 言語
      video: false, // 動画を取得するか
      keepVideoForPassedTests: false, // 成功時も動画を残すか
      disableScreenshots: false, // スクリーンショットを無効にするか
      fullPageScreenshots: true, // スクリーンショットを全画面にするか
      uniqueScreenshotNames: true, // スクリーンショット名をユニークにするか
      highlightElement: false, // エラー箇所をハイライトするか（不具合？）
      show: false, // 画面表示をするか
      trace: true, // 詳細な記録(htmlやスクリーンショット)を残すか
      keepTraceForPassedTests: false, // 成功時も詳細な記録を残すか
    },
  },
  ...
}
```

## テスト作成

ref. [Behaivior Driven Development | CodeceptJS](https://codecept.io/bdd/)

### シナリオ記述

- features にファイルを追加する。
  ```sh
  $ touch https://github.com/GOAMI-Takaaki/codeceptjs-hotel-planisphere/tree/main/features/login.feature
  ```
- シナリオを記述する。
 
  login.feature
  ```gherkin
  Feature: ログイン
    シンプルなテキストインプットとボタンの画面です。
    ログイン情報はCookieに保存されます。
    会員登録画面で保存したユーザの他、登録済みのユーザ（下記）があります。

    Scenario: 定義済みユーザでログインができること
      Given ホームを開く。
        And ログインペ―ジに移動する。
        And "ichiro@example.com" "password"でログインする。
      Then マイペ―ジである事を確認する。
  ```
- codecept.conf.ts の features に追記する。
  ```typescript
  export const config: CodeceptJS.MainConfig = {
    ...
    gherkin: {
      features: [ 
        './features/login.feature', // 追記
        ...
      ],
    },
    ...
  }
  ```

### ステップ実装

ref. [Playwright Helper](https://codecept.io/helpers/Playwright/),  [Locators](https://codecept.io/locators/) | CodeceptJS

- step_definitions にファイルを追加する。
  ```sh
  $ touch ./step_definitions/login.ts
  $ touch ./step_definitions/home.ts
  $ touch ./step_definitions/mypage.ts
  ```
- 各ステップを記述する。
 
  home.ts
  ```typescript
  const { I } = inject();

  const URL = 'https://hotel.testplanisphere.dev/ja/index.html';
  Given('ホームを開く。', () => {
    // URLを開く
    I.amOnPage(URL);
  });  

  export {};
  ```
  login.ts
  ```typescript
  const { I } = inject();

  Given('ログインペ―ジに移動する。', () => {
    I.click('ログイン', locate('nav'));
  });

  const login = (email: string, password:string) => {
    I.fillField('メールアドレス', email);
    I.fillField('パスワード', password);
    I.click('ログイン', '#login-button');
  };

  Given('{string} {string}でログインする。', login);

  export {};
  ```
  mypage.ts
  ```typescript
  const { I } = inject();
  
  const URL = 'https://hotel.testplanisphere.dev/ja/mypage.html';

  Then('マイペ―ジである事を確認する。', () => {
    I.seeCurrentUrlEquals(URL);
  });

  export {};
  ```
- codecept.conf.ts の step_definitions に追記する。
  ```typescript
  export const config: CodeceptJS.MainConfig = {
    ...
    gherkin: {
      steps: [
        './step_definitions/home.ts', //追記
        './step_definitions/login.ts', //追記
        './step_definitions/mypage.ts', //追記
      ]
    },
    ...
  }
  ```

## テスト実行

ref. [Commands | CodeceptJS](https://codecept.io/commands/#commands)

```sh
# ログインを実行する。
$ npx codeceptjs run features/login.feature

# 特定のシナリオだけ実行する。
$ npx codeceptjs run --verbose --grep "定義済みユーザでログインができること"

# 全シナリオを実行する。
$ npx codeceptjs run 
```

### プロジェクト作成してない場合

```sh
# ライブラリをインストールする。
$ npm ci

# Playwright の関連ライブラリをインストールする。
$ npx playwright install-deps
```

## デバッグ実行

### デバック用引数を指定して実行する。

```sh
$ npx codeceptjs run --verbose
```

### ステップの実行状況を確認する。

```sh
ログイン --
  シンプルなテキストインプットとボタンの画面です。
  ログイン情報はCookieに保存されます。
  会員登録画面で保存したユーザの他、登録済みのユーザ（下記）があります。
  ✖ 定義済みユーザでログインができること in 7514ms

-- FAILURES:

  1) ログイン
      定義済みユーザでログインができること:
    expected url of current page "https://hotel.testplanisphere.dev/ja/mypage.html" to equal "https://hotel.testplanisphere.dev/ja/login.html"
  
  Scenario Steps:
  - I.seeCurrentUrlEquals("https://hotel.testplanisphere.dev/ja/mypage.html") at ./step_definitions/mypage.ts:26:5
  - I.click("ログイン", "#login-button") at login (./step_definitions/login.ts:24:5)
  - I.fillField("パスワード", "wrong") at login (./step_definitions/login.ts:23:5)
  - I.fillField("メールアドレス", "ichiro@example.com") at login (./step_definitions/login.ts:22:5)
  - I.click("ログイン", nav) at ./step_definitions/login.ts:10:5
  - I.amOnPage("https://hotel.testplanisphere.dev/ja/index.html") at ./step_definitions/home.ts:6:5
```

### 出力された画像や動画、トレースを確認する。
 
```sh
Artifacts:
- screenshot: ~/output/定義済みユーザでログ_1693978807.failed.png
- video: ~/output/videos/6bdb1195-5850-431b-8722-14924907c83c_定義済みユーザでログインができること.failed.webm
- trace: ~/output/trace/39dade40-4344-4e00-98d3-ea5953f89d14_定義済みユーザでログインができること.failed.zip
```

### 画面を表示して確認する。

codeceptjs.conf.ts
```typescript
export const config: CodeceptJS.MainConfig = {
  helpers: {
    Playwright: {
      show: true // false -> true
    },
  },
};
```

### 変数を出力して確認する。
 
login.ts
```typescript
const login = (email: string, password:string) => {
  console.log(`email=${email}`);
  I.fillField('メールアドレス', email);
  I.fillField('パスワード', password);
  I.click('ログイン', '#login-button');
};
Given('{string} {string}でログインする。', login);
```

## Tips

### 複数データでシナリオ実行する。

Paramterized Testのような動作になる。

ref. [Examples](https://codecept.io/bdd/#examples) in Behavior Driven Development | CodeceptJS

mypage.feature
- Scenario を Outline にする。
  ```gherkin
    Scenario Outline: 定義済みユーザの情報が表示されること
  ```
- 変数を`<カラム名>`で指定する。
  ```gherkin
      Given ホームを開く。
        And ログインペ―ジに移動する。
        And "<email>" "<password>"でログインする。
      Then マイペ―ジである事を確認する。
        And メールアドレスが"<email>"である事を確認する。
        And 氏名が"<username>"である事を確認する。
        And 会員ランクが"<rank>"である事を確認する。
        ...
  ```
- Examples にデータを表形式で記載する。 
  ```gherkin
      Examples:
        | email               | password  | rank         | username  |...|
        |	ichiro@example.com  | password  | プレミアム会員 | 山田一郎  |...|
        |	sakura@example.com  | pass1234  | 一般会員      | 松本さくら |...|
        |	jun@example.com     | pa55w0rd! | プレミアム会員 | 林潤      |...|
        |	yoshiki@example.com | pass-pass | 一般会員      | 木村良樹   |...|
  ```

### 複数データでステップを実行する。

ref. [Tables](https://codecept.io/bdd/#tables) in Behavior Driven Development | CodeceptJS

- ステップの下にデータを表形式で記載する。
  - ex. カラム名: planName

  plan.feature
  ```gherkin
    Scenario: 未ログイン状態でプラン一覧が表示されること
      Given ホームを開く。
        And 宿泊予約ペ―ジに移動する。
      Then プラン数が7である。
        And 以下のプランが表示されている。
        | planName               |
        | お得な特典付きプラン     |
        | 素泊まり                |
        | 出張ビジネスプラン       |
        | エステ・マッサージプラン |
        | 貸し切り露天風呂プラン   |
        | カップル限定プラン       |
        | テーマパーク優待プラン   |
  ```
- ステップ実装
 
  plan.ts
  ```typescript
  // 変数 table で受け取る。
  Then('以下のプランが表示されている。', (table: any) => { 
    // データを行単位に分割する。
    const rows = table.parse().hashes(); 
    for (const row of rows) { 
      // 値をカラム名で取得する。
      I.see(row.planName); 
    }
  });
  ```

### 共通で利用するステップを追加する。

- step_files.ts に追記する。
  ```typescript
  export = function() {
    return actor({
      // 独自定義の関数を追加する。
      seeNumberOfTabs: async (expected: number)=> {
        const actual = await this.grabNumberOfOpenTabs();
        assert(actual == expected, `期待されたタブの数は${expected}だが、実際は${actual}である。`);
      },
    });
  }
  ```
- ステップで利用する。
 
  reserve.ts
  ```typescript
  Given('宿泊予約確認が閉じられる。', () => {
    // どこからでも利用可能になる。
    I.seeNumberOfTabs(1);
  });
  ```

### アクションをステップにする。

- シナリオに記載できるよう、ステップとしてラップする。

  action.ts
  ```typescript
  Given('{int}秒待つ。', (sec: number) => {
    I.wait(sec);
  });
  ```
- シナリオに記載する。
 
  ```gherkin
  Scenario: 未入力でエラーとなること
    Given ホームを開く。
      And 3秒待つ。
      And ログインペ―ジに移動する。
      ...
  ``` 

## TODO

### 修正

- ポップアップ不具合
- 金額計算不具合

### 追加

- [Reports](https://codecept.io/reports/)
- [Custom Helper](https://codecept.io/helpers/)
- [Mobile](https://codecept.io/helpers/Appium.html)
- [Visual Testing](https://codecept.io/visual/)
- [AI Testing](https://codecept.io/ai/)

## 最後に

本記事が自動化検討のお役に立てば幸いです。
