# solium を使ってみる

スマートコントラクト実装ハンズオン2024夏 ver.
【実習】solium を使ってみる
のサンプルコードです。

本学習では安心安全なスマートコントラクトを開発するためのツールの1つ、solium を実際に導入して使ってみます。



## 目的

リンターを介する事で、コーディングルールの整ったスマートコントラクト開発を体感してほしい。



## 環境

- Node.js がインストールされている
  - 筆者のバージョンは `v20.16.0` です
- npm が使える
  - Node.js がデフォルトで持っているパッケージ管理システム
    - 公開されているパッケージをインストールして使えるようにするためのシステムです
    - npm におけるパッケージとは、何かしらの機能を実現するためのコード群と見てもらえれば一旦大丈夫です
  - デフォルトなので、Node.js が入っていれば npm も使えるようになっているかと思います
  - 筆者のバージョンは `10.8.2` です
- コマンドラインツールが使える
  - Windows では「Windows PowerShell」、Mac では「ターミナル」がデフォルトのツールです



## 実習内容

### 0. 「Lock コントラクトを使ってみる」が完了している

前回の実習「[Lock コントラクトを使ってみる](../02-create-lock-withdraw-task/)」を完了させてください。
その環境をそのまま引き継いで実習を進めます。

### 1. solium をインストールする

solium は npm パッケージとして提供されています。
コマンドラインツールの開発タブで `npm i -D solium` を実行しましょう。

```bash
$ npm i -D solium
npm warn deprecated source-map-url@0.4.1: See https://github.com/lydell/source-map-url#deprecated
npm warn deprecated urix@0.1.0: Please see https://github.com/lydell/urix#deprecated
npm warn deprecated resolve-url@0.2.1: https://github.com/lydell/resolve-url#deprecated
npm warn deprecated source-map-resolve@0.5.3: See https://github.com/lydell/source-map-resolve#deprecated
npm warn deprecated chokidar@1.7.0: Chokidar 2 will break on node v14+. Upgrade to chokidar 3 with 15x less dependencies.
npm warn deprecated glob@7.1.2: Glob versions prior to v9 are no longer supported
npm warn deprecated fsevents@1.2.13: The v1 package contains DANGEROUS / INSECURE binaries. Upgrade to safe fsevents v2
npm warn deprecated mkdirp@0.5.1: Legacy versions of mkdirp are no longer supported. Please update to mkdirp 1.x. (Note that the API surface has changed to use Promises in 1.x.)

added 231 packages, and audited 798 packages in 20s

94 packages are looking for funding
  run `npm fund` for details

42 vulnerabilities (23 low, 7 moderate, 11 high, 1 critical)

To address issues that do not require attention, run:
  npm audit fix

Some issues need review, and may require choosing
a different dependency.

Run `npm audit` for details.
```

### 2. solium の初期設定を行う

solium を使うためには設定ファイルの配置が必要です。
コマンドラインツールの開発タブで `npx solium --init` を実行してください。

```bash
$ npx solium --init
```

すると、プロジェクトフォルダに `.soliumrc.json` ファイルと `.soliumignore` ファイルが生成されます。
これらのファイルは中身をいじらず、そのままで大丈夫です。

### 3. solium を動かす

コマンドラインツールの開発タブで `npx solium -d contracts` を実行してください。

```bash
$ npx solium -d contracts 

contracts/Lock.sol
  15:12    warning    Avoid using 'block.timestamp'.    security/no-block-members
  27:16    warning    Avoid using 'block.timestamp'.    security/no-block-members
  30:47    warning    Avoid using 'block.timestamp'.    security/no-block-members

✖ 3 warnings found.
```

solium は `-d` オプションでフォルダを指定する、あるいは `-f` オプションでファイル名を指定すると、該当するファイルをチェックしてくれます。
今回は Lock コントラクトに対して3つの警告が見つかりました。
全て `security/no-block-members` というルールに引っかかっており、理由は `Avoid using 'block.timestamp'.` です。
トランザクションをまとめてブロックを作成する際にブロック作成者が `block.timestamp` を決定するのですが、一定のルールにさえ従えばブロック作成者が自由に `block.timestamp` の値を決定できるので、それにより挙動が変わるような部分は脆弱性になりかねないため警告が出ているというわけです。
修正可能であればコードを修正して再度 solium を動かし、警告が消えている事を確認するという流れになるのですが、Lock コントラクトは `block.timestamp` を使う事がキモになっているのと代替手段が無いため、そのままにしておきます。

### 4. solium にひっかかるよう Counter コントラクトに手を加える

現在の Counter コントラクトは solium に引っかからない優秀なコードですが、逆に良くないコードを追加して solium でどのように出力されるのか見てみましょう。
contracts フォルダにある `Counter.sol` を以下のように変更します。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Counter {
    uint256 public count;

    constructor() {}

    function name() public pure returns (string memory) {
        return 'Counter';
    }

    // Function to get the current count
    function get() public view returns (uint256) {
        return count;
    }

    // Function to increment count by 1
    function inc() public {
        count += 1;
    }

    // Function to decrement count by 1
    function dec() public {
        // This function will fail if count = 0
        count -= 1;
    }
}
```

constructor と function name を追加しました。

### 5. solium を動かす 2回目

では、追加したコードが solium ではどのような扱いになるのか？
コマンドラインツールの開発タブで `npx solium -d contracts` を実行してください。

```bash
$ npx solium -d contracts 

contracts/Counter.sol
  7:18     warning    Code contains empty block                            no-empty-blocks
  10:15    error      String literal must be quoted with double quotes.    quotes

contracts/Lock.sol
  15:12    warning    Avoid using 'block.timestamp'.    security/no-block-members
  27:16    warning    Avoid using 'block.timestamp'.    security/no-block-members
  30:47    warning    Avoid using 'block.timestamp'.    security/no-block-members

✖ 1 error, 4 warnings found.
```

7行目 `constructor() {}` に対して `no-empty-blocks` ルール違反による警告が追加されました。
empty block とは `{}` 部分を指しており、何もしていないならこの constructor 自体無くてもいいよね？じゃあ消してね！という意図になります。

10行目 `return 'Counter';` に対しては `quotes` ルール違反によるエラーが追加されています。
`String literal must be quoted with double quotes.` 文字列は必ずダブルクォートで囲んでくださいね、という内容です。
しかもこちらは警告ではなくエラーでした。
指摘レベルは「警告」と「エラー」の2種類で、もし警告だけでエラーが1つも無い場合 `npx solium` は正常終了する扱いになるのですが、エラーが1つでも含まれている場合は `npx solium` がエラー終了となります。
この「もし期待通りではなければエラー終了する」という仕組みは CI で特に役立つのですが、今回は説明を割愛させていただきます。

以上で本実習は終了となります。
もし Docker で Node.js 環境を構築している場合は、以下のコマンドで Docker Compose 環境を止めてください。

```bash
# 開発タブは exit コマンドを打ち、Docker から抜けます
> root@xxxxxxxxxxxx:/# exit
```

```bash
# ノードタブは Ctrl + C を押して npx hardhat node を終了後に exit コマンドを打ち、Docker から抜けます
> root@xxxxxxxxxxxx:/# exit
```

```bash
# Docker Compose 実行していたタブでは Ctrl + C を押し、以下のコマンドで Docker コンテナを削除します
$ docker compose rm -f
```

お疲れ様でした。

### 6. Extra

もし時間がある方は、以下にチャレンジしてみましょう。

- ダブルクォートではなくシングルクォートで統一するよう solium 設定を変更してみる
  - https://ethlint.readthedocs.io/en/latest/user-guide.html
  - solium のユーザーガイドを見ながら挑戦してみてください
- 【高難度】MultiLock コントラクトを作成してみる
  - 「1つのスマートコントラクトで複数人の基軸通貨をロックできる」という要件を満たすスマートコントラクトを作成してみましょう
  - 今までに出てこなかった Solidity の言語仕様を使ったり、脆弱性に気をつける必要があります
- Solidity 言語仕様を知る
  - https://solidity-jp.readthedocs.io/ja/latest
