# 開発環境構築してスマートコントラクトを作成する

スマートコントラクト実装ハンズオン2024夏 ver.
【実習】開発環境構築してスマートコントラクトを作成する
のサンプルコードです。

本実習はブロックチェーンやスマートコントラクトの前提知識無しにも関わらずスマートコントラクトを作成していただくという過酷な内容となっております。
そのため、この README では開発環境構築からスマートコントラクト作成までフルサポートさせていただきます。
こういった開発に慣れている方は README を見ないで一旦チャレンジしていただき、不明なところだけ参考にするという使い方もアリだと思います。



## 目的

実際に手を動かしスマートコントラクトに振れる事で、この後に続く座学の内容がより身近になっていてほしい。



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

### 0. Node.js をインストールする

もし環境が整っていない場合、まずは Node.js のインストールを実施しましょう。
https://nodejs.org/en/download からダウンロードできます。
パッケージマネージャを使ったインストール方法が出てきた場合は、Windows なら fnm、Mac なら nvm を使ってインストールするのが良さそうです。
Node.js はバージョンアップ頻度が激しく、開発する端末にて常に最新の Node.js だけをインストールしている場合は過去に開発した Node.js プロジェクトが動かなくなってしまう可能性があるため、複数バージョンをインストールしておけるようにしたものがパッケージマネージャです。

また、Node.js 本体のインストールでは LTS と付いているバージョンをインストールしてください。
LTS は Long Term Support バージョンの最新版で、長期サポートが約束されているため（新しいバージョンの中では）最も安定しています。

#### 0-a. Docker 環境を使う

もし Docker がインストールされていて動いている場合は、 Docker コンテナを使って Node.js 開発環境を動かす事ができます。
今回は `docker compose` 機能を使って環境構築をします。
プロジェクトフォルダに docker-compose.yml ファイルを作成する必要があるため、次のセクションで説明します。

### 1. プロジェクトフォルダを作成する

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

#### 1-a. Docker Compose を立ち上げる

Docker を使った Node.js 開発環境を構築する場合は、プロジェクトフォルダに docker-compose.yml ファイルを作成し、以下を記入してください。

```yml
version: '3'
services:
  app:
    image: node:20.16.0
    working_dir: /app
    tty: true
    volumes:
      - ./:/app
```

作成後、コマンドラインツールで別タブを開き、プロジェクトフォルダまで移動し、Docker を起動します。

```bash
# 例 : Mac でデスクトップに smart-contract というフォルダを作った場合
$ cd ~/Desktop/smart-contract
$ pwd
  -> /Users/ogawa_mitsunori/Desktop/smart-contract

# Docker Compose として起動
$ docker compose up
```

`Attaching to xxxxx` という出力がされるまで待機してください。
Docker Compose を起動したコマンドラインツールタブは本ハンズオン中ずっと使用するため、そのまま放置しておいてください。
その後、元のコマンドラインツールタブ側で Docker コンテナ内に入ります。

```bash
$ docker compose exec app /bin/bash
```

この Docker コンテナ内が Node.js 開発環境となります。

### 2. Hardhat をインストールする

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

### 3. スマートコントラクト開発環境を作成する

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

### 4. Counter コントラクトを作成する

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

### 5. ローカルブロックチェーンを動かす

スマートコントラクトをブロックチェーン上で使えるようにするため、デプロイを実施します。
本番のブロックチェーンにデプロイするよりも前に、作成したスマートコントラクトが正しく動くのかをチェックするためローカルブロックチェーンにデプロイします。
というわけでまずはローカルブロックチェーンを動かします。

まずはコマンドラインツールで別タブを開き、そちらでも Node.js を使えるようにします。
Windows かつ fnm で Node.js をインストールしている場合、開いた別タブで以下のコマンドを実行してください。

```bash
$ fnm env --use-on-cd | Out-String | Invoke-Expression
$ fnm use --install-if-missing 20

# 以下のコマンドで、それぞれのバージョンが表示されるか確認する
$ node -v
$ npm -v
```

もし `0. Node.js をインストールする` にて Docker Compose を使った Node.js 環境を構築している場合は、開いた別タブで以下のコマンドを実行し、Node.js 環境に入ります。

```bash
$ docker compose exec app /bin/bash
```

次にそのタブにて、 `1. プロジェクトフォルダ作成` を参考にプロジェクトフォルダまで移動して `npx hardhat node` を実行してください。

```bash
# ※念のため Private Key を隠させていただきます。
$ npx hardhat node
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (10000 ETH)
Private Key: 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Account #3: 0x90F79bf6EB2c4f870365E785982E1f101E93b906 (10000 ETH)
Private Key: 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Account #4: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 (10000 ETH)
Private Key: 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Account #5: 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc (10000 ETH)
Private Key: 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Account #6: 0x976EA74026E726554dB657fA54763abd0C3a0aa9 (10000 ETH)
Private Key: 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Account #7: 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955 (10000 ETH)
Private Key: 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Account #8: 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f (10000 ETH)
Private Key: 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Account #9: 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720 (10000 ETH)
Private Key: 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Account #10: 0xBcd4042DE499D14e55001CcbB24a551F3b954096 (10000 ETH)
Private Key: 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Account #11: 0x71bE63f3384f5fb98995898A86B02Fb2426c5788 (10000 ETH)
Private Key: 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Account #12: 0xFABB0ac9d68B0B445fB7357272Ff202C5651694a (10000 ETH)
Private Key: 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Account #13: 0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec (10000 ETH)
Private Key: 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Account #14: 0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097 (10000 ETH)
Private Key: 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Account #15: 0xcd3B766CCDd6AE721141F452C550Ca635964ce71 (10000 ETH)
Private Key: 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Account #16: 0x2546BcD3c84621e976D8185a91A922aE77ECEc30 (10000 ETH)
Private Key: 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Account #17: 0xbDA5747bFD65F08deb54cb465eB87D40e51B197E (10000 ETH)
Private Key: 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Account #18: 0xdD2FD4581271e230360230F9337D5c0430Bf44C0 (10000 ETH)
Private Key: 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Account #19: 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199 (10000 ETH)
Private Key: 0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.
```

なんとこれだけでローカルブロックチェーンを動かせます。
動かしたら、このコマンドラインツールのタブはそのままにしておきます。
以降は、コマンドラインツールにあるそれぞれのタブを以下のように呼称させていただきます。

- 開発タブ
  - スマートコントラクトをコンパイルしたりする方のタブ
- ノードタブ
  - `npx hardhat node` を動かしているタブ

### 6. Counter コントラクトをローカルブロックチェーンにデプロイする

デプロイには Hardhat ignition の機能を使います。
スマートコントラクトをデプロイすると、デプロイした場所のアドレス、通称 contract address が発行されます。
Hardhat ignition は一度デプロイしたスマートコントラクトのアドレスを保持し、以降はそのアドレスを使い回せるようになります。
ignition フォルダの中にある modules フォルダの中に `Counter.ts` というファイルを作成し、以下を記載します。

```ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CounterModule = buildModule("CounterModule", (m) => {
  const counter = m.contract("Counter");

  return { counter };
});

export default CounterModule;
```

作成後、コマンドラインツールの開発タブで `npx hardhat ignition deploy ignition/modules/Counter.ts --network localhost` を実行してください。

```bash
$ npx hardhat ignition deploy ignition/modules/Counter.ts --network localhost
Hardhat Ignition 🚀

Deploying [ CounterModule ]

Batch #1
  Executed CounterModule#Counter

[ CounterModule ] successfully deployed 🚀

Deployed Addresses

CounterModule#Counter - 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

`npx hardhat ignition deploy` が Hardhat ignition を使ったデプロイコマンド、 `ignition/modules/Counter.ts` が具体的なデプロイ指示のファイルになります。
`--network localhost` は、ローカルブロックチェーンを使いますという宣言です。
こうして出力された `0x5FbDB2315678afecb367f032d93F642f64180aa3` が、スマートコントラクトをデプロイした場所のアドレス、すなわち contract address となります。
※皆さんの環境では異なる contract address になっているかもしれませんが、大丈夫です。

ちなみにもう一度 `npx hardhat ignition deploy ignition/modules/Counter.ts --network localhost` をした場合、既に ignition を使ってデプロイしているため実際のデプロイ処理は走らず `0x5FbDB2315678afecb367f032d93F642f64180aa3` のみが出力されます。

```bash
$ npx hardhat ignition deploy ignition/modules/Counter.ts --network localhost
[ CounterModule ] Nothing new to deploy based on previous execution stored in ./ignition/deployments/chain-31337

Deployed Addresses

CounterModule#Counter - 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 7. デプロイした Counter コントラクトを動かす

ローカルブロックチェーンに接続し、デプロイした Counter コントラクトを使ってみましょう。
Hardhat console を使えば、対話型処理による JavaScript を使ったローカルブロックチェーンとのやり取りが可能です。
コマンドラインツールの開発タブで `npx hardhat console --network localhost` を実行してください。

```bash
$ npx hardhat console --network localhost
Welcome to Node.js v20.16.0.
Type ".help" for more information.
```

するとコマンドラインツールには `>` が表示され、ユーザーの入力を待っている状態となります。
`let counter = await hre.ethers.getContractAt("Counter", "0x5FbDB2315678afecb367f032d93F642f64180aa3")` を入力してみてください。
（`0x5FbDB2315678afecb367f032d93F642f64180aa3` の部分には、あなたの環境にデプロイした Counter コントラクトの contract address を入力してください）

```bash
> let counter = await hre.ethers.getContractAt("Counter", "0x5FbDB2315678afecb367f032d93F642f64180aa3") 
undefined
```

次に、デプロイした Counter コントラクトの現在の count 値を見てみます。
`await counter.get()` を入力してみましょう。

```bash
> await counter.get()
0n
```

デプロイしたばかりなので、初期値の `0` が入っています。
`n` は、メチャクチャ大きい数値を扱う事ができる数値型の中身を見た場合に付与される文字で、一旦無視していただいて大丈夫です。
次に、count 値を増やしてみます。
`await counter.inc()` してから再び `await counter.get()` してみましょう。

```bash
> await counter.inc()
ContractTransactionResponse {
  provider: HardhatEthersProvider {
    _hardhatProvider: LazyInitializationProviderAdapter {
      _providerFactory: [AsyncFunction (anonymous)],
      _emitter: [EventEmitter],
      _initializingPromise: [Promise],
      provider: [BackwardsCompatibilityProviderAdapter]
    },
    _networkName: 'localhost',
    _blockListeners: [],
    _transactionHashListeners: Map(0) {},
    _eventListeners: []
  },
  blockNumber: 2,
  blockHash: '0x36cda64ac6940aed4107767844c55c86d6c88f4466dab68e6456879ad1888f56',
  index: undefined,
  hash: '0x602c38fc4d2b9362d7297c84d84556f5b81cfd8170cb355dc9f1c4cf984662b1',
  type: 2,
  to: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  nonce: 1,
  gasLimit: 30000000n,
  gasPrice: 1766776712n,
  maxPriorityFeePerGas: 1000000000n,
  maxFeePerGas: 1970451776n,
  maxFeePerBlobGas: null,
  data: '0x371303c0',
  value: 0n,
  chainId: 31337n,
  signature: Signature { r: "0x832a9d90258d5cea1955c99b1225b304dbdf5d52206983c00fe9446b4098d8ab", s: "0x7349e5767ae60f7fb810eff6710cecfd97507df4c2a5f8bc359375081a9af12b", yParity: 1, networkV: null },
  accessList: [],
  blobVersionedHashes: null
}

> await counter.get()
1n
```

inc は count 値を変更する、つまりブロックチェーンが持つスマートコントラクトの状態を変更する function なので、トランザクションを発行しています。
`await counter.inc()` の後に出力されているのは、発行したトランザクションに関する情報です。
無事トランザクションが発行されてブロックに取り込まれたので、その後に実施した `await counter.get()` では `1n` が出力されている事がわかります。
※トランザクションについては、この後の座学にて少し触れます。

以上で本実習は終了となります。
`npx hardhat node` しているノードタブは以降の実習でも使いますのでそのままにしておいてください。
`npx hardhat console` している開発タブは対話的操作から抜け出したいので、キーボードの Ctrl(control) + C を2回押して抜け出してください。
お疲れ様でした。

### 8. Extra

もし時間がある方は、以下にチャレンジしてみましょう。

- デプロイした Counter コントラクトの function dec も使ってみる
  - count `0n` の時に function dec すると...？
- Solidity 言語仕様を知る
  - https://solidity-jp.readthedocs.io/ja/latest
- Counter コントラクトを拡張する
  - count を直接変更する function を作ってみる
  - 初期 count 値を指定できる constructor を作ってみる
  - count 変数を外から直接見れないようにしてみる
    - 見たい場合は function get を叩けば OK なので
  - count を最後に変更した address を保持し、外から見れるように function を作ってみる
  - etc...
- 拡張した Counter コントラクトをデプロイして使ってみる
  - 既に Hardhat ignition でデプロイしたものを新しくするには `--reset` オプションを付与して実行する必要があります
    - `npx hardhat ignition deploy ignition/modules/Counter.ts --network localhost --reset`
  - 追加した constructor を使いたい場合は ignition ファイルを修正する必要があります
