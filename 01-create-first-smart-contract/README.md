# 開発環境構築してスマートコントラクトを作成する

スマートコントラクト実装ハンズオン2024夏 ver.
【実習】開発環境構築してスマートコントラクトを作成する
のサンプルコードです。

本実習はブロックチェーンやスマートコントラクトの前提知識無しにも関わらずスマートコントラクトを作成していただくという過酷な内容となっております。
そのため、この README では開発環境構築からスマートコントラクト作成までフルサポートさせていただきます。
こういった開発に慣れている方は README を見ないで一旦チャレンジしていただき、不明なところだけ参考にするという使い方もアリだと思います。



## 目的

実際に手を動かしスマートコントラクトに振れる事で、この後の座学がより頭に入ってきやすくなってもらえればな、というのが意図です。



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
  - Windows では「コマンド プロンプト」、Mac では「ターミナル」がデフォルトのツールです



## 開発

### 0. Node.js インストール

もし環境が整っていない場合、まずは Node.js のインストールを実施しましょう。
https://nodejs.org/ からダウンロードできます。
バージョンがいくつかあるかと思いますが LTS と付いているバージョンをインストールしてください。
LTS は Long Term Support バージョンの最新版で、長期サポートが約束されているため（新しいバージョンの中では）最も安定しています。

### 1. プロジェクトフォルダ作成

スマートコントラクト開発現場として、プロジェクトフォルダを作成しましょう。
コマンドラインツールを使わないで大丈夫です。
デスクトップにフォルダを作るなり、あるいは別の場所にフォルダを作りなりしてください。
作成したらコマンドラインツールを開き、そのフォルダまで移動しましょう。

```bash
# 例 : Mac でデスクトップに smart-contract というフォルダを作った場合
$ cd ~/Desktop/smart-contract
$ pwd
  -> /Users/ogawa_mitsunori/Desktop/smart-contract
```

### 2. Hardhat インストール

Hardhat とは、スマートコントラクト開発ツールです。
npm パッケージとして提供されているので、npm を使ってインストールします。
まずは、npm でパッケージを管理するための管理ファイルを作成するため、コマンドラインツールで `npm init` を実行してください。

```bash
$ npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (01-create-first-smart-contract) 
```

これは管理ファイル `package.json` を作成するためのコマンドで、自身のパッケージ名やバージョンもこのファイルで管理するためにその初期値を入力する必要があります。
全てデフォルト値を使って大丈夫なので、全て Enter を押してデフォルト値にして `package.json` を作成しましょう。

```bash
# 以下全て Enter して大丈夫です
package name: (01-create-first-smart-contract) 
version: (1.0.0) 
description: 
entry point: (index.js) 
test command: 
git repository: 
keywords: 
author: 
license: (ISC)

# 最後に以下のような確認が表示されるので、Enter を押して package.json ファイルを作成します
About to write to /Users/ogawa_mitsunori/Projects/drip/2024-summer-smart-contract-hands-on/01-create-first-smart-contract/package.json:

{
  "name": "01-create-first-smart-contract",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "description": ""
}


Is this OK? (yes)
```

`package.json` 作成後、Hardhat をインストールします。
コマンドラインツールで `npm i -D hardhat` を入力してください。

```bash
$ npm i -D hardhat
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated glob@7.2.0: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@8.1.0: Glob versions prior to v9 are no longer supported

added 267 packages, and audited 268 packages in 24s

52 packages are looking for funding
  run `npm fund` for details

8 low severity vulnerabilities

To address all issues, run:
  npm audit fix

Run `npm audit` for details.
```

### 3. スマートコントラクト開発環境作成

Hardhat を使ってスマートコントラクト開発環境を作成します。
npm を使ってローカルにインストールしたソフトウェアを使うには `npx ◯◯◯◯` コマンドを打ちます。
というわけでコマンドラインツールで `npx hardhat init` を実行してください。

```bash
$ npx hardhat init
888    888                      888 888               888
888    888                      888 888               888
888    888                      888 888               888
8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
888    888 .d888888 888    888  888 888  888 .d888888 888
888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888

👷 Welcome to Hardhat v2.22.8 👷‍

? What do you want to do? … 
❯ Create a JavaScript project
  Create a TypeScript project
  Create a TypeScript project (with Viem)
  Create an empty hardhat.config.js
  Quit
```

ここでは上から二番目の `Create a TypeScript project` を選択します。
キーボード上下でカーソルを合わせて Enter を押します。

```bash
✔ Hardhat project root: · /Users/ogawa_mitsunori/Projects/drip/2024-summer-smart-contract-hands-on/01-create-first-smart-contract
✔ Do you want to add a .gitignore? (Y/n) · y
✔ Do you want to install this sample project's dependencies with npm (@nomicfoundation/hardhat-toolbox)? (Y/n) · y
```

それ以外の選択肢はデフォルトのままで良いので、全て Enter を押して進めてください。
そうすると hardhat toolbox のインストールが始まるのでしばらく待ちます。

```bash
npm install --save-dev "@nomicfoundation/hardhat-toolbox@^5.0.0"
npm warn deprecated glob@5.0.15: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@7.1.7: Glob versions prior to v9 are no longer supported

added 299 packages, and audited 567 packages in 36s

92 packages are looking for funding
  run `npm fund` for details

25 vulnerabilities (22 low, 3 high)

To address issues that do not require attention, run:
  npm audit fix

Some issues need review, and may require choosing
a different dependency.

Run `npm audit` for details.

✨ Project created ✨

See the README.md file for some example tasks you can run

Give Hardhat a star on Github if you're enjoying it! ⭐️✨

     https://github.com/NomicFoundation/hardhat
```

### 3. Counter コントラクト作成

開発環境が整ったので、最初のスマートコントラクトを作成してみましょう。
https://solidity-by-example.org/first-app/
こちらにある Counter コントラクトを作成します。
contracts フォルダの中に `Counter.sol` というファイルを作成し、以下を記載します。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Counter {
    uint256 public count;

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

上記までの準備が出来たらコマンドラインツールで `npx hardhat compile` を実行し、作成した Counter コントラクトをコンパイルして EVM バイトコードに変換します。

```bash
$ npx hardhat compile
Generating typings for: 2 artifacts in dir: typechain-types for target: ethers-v6
Successfully generated 8 typings!
Compiled 2 Solidity files successfully (evm target: paris).
```

Successfully の表記が出ていれば、今回の実習は完了です。
お疲れ様でした。

### 4. Extra

次ステップとして以下を進めてみましょう。

- Solidity 言語仕様を知る
  - https://solidity-jp.readthedocs.io/ja/latest
- Counter コントラクトを拡張する
  - count を直接変更する function を作ってみる
  - 初期 count 値を指定できる constructor を作ってみる
  - count 変数を外から直接見れないようにしてみる
    - 見たい場合は function get を叩けば OK なので
  - count を最後に変更した address を保持し、外から見れるように function を作ってみる
  - etc...
