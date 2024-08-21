# Lock コントラクトを使ってみる

スマートコントラクト実装ハンズオン2024夏 ver.
【実習】Lock コントラクトを使ってみる
のサンプルコードです。

本学習では `npx hardhat init` 時にサンプルとして生成される Lock コントラクトを実際に利用してみます。
また、前回は Counter コントラクトを Hardhat ignition でデプロイし、それを Hardhat console で動作チェックしていましたが、今回は Hardhat task を使ってみます。



## 目的

前回作成した Counter コントラクトよりも更に複雑、かつ基軸通貨の取り扱いが入っている Lock コントラクトを実際に動かす事で、仮想通貨の送受信を体感してほしい。



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



## 実習内容

### 0. 「開発環境構築してスマートコントラクトを作成する」が完了している

前回の実習「[開発環境構築してスマートコントラクトを作成する](../01-create-first-smart-contract/)」を完了させてください。
その環境をそのまま引き継いで実習を進めます。

### 1. Lock コントラクトをデプロイする

まずは Lock コントラクトをローカルブロックチェーンにデプロイします。
`npx hardhat init` 時に ignition ファイルが生成されているので、それをそのまま使用してみましょう。
コマンドラインツールの開発タブで `npx hardhat ignition deploy ignition/modules/Lock.ts --network localhost` を実行してください。

```bash
$ npx hardhat ignition deploy ignition/modules/Lock.ts --network localhost
Compiled 2 Solidity files successfully (evm target: paris).
Hardhat Ignition 🚀

Deploying [ LockModule ]

Batch #1
  Executed LockModule#Lock

[ LockModule ] successfully deployed 🚀

Deployed Addresses

LockModule#Lock - 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

Lock コントラクトが、ローカルブロックチェーンの `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` にデプロイされました。
※皆さんの環境では異なる contract address になっているかもしれませんが、大丈夫です。

### 2. withdraw task を作成する

デプロイした Lock コントラクトの function withdraw を叩くための Hardhat task を作成します。
hardhat.config.ts ファイルに withdraw task を追加し、ファイル全体を以下のようにしてください。

```ts
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

task("withdraw", "Withdraw from Lock.").setAction(async (_, hre) => {
  const signers = await hre.ethers.getSigners();
  const defaultSigner = signers[0];

  const beforeBalance = await defaultSigner.provider.getBalance(defaultSigner.address);
  console.log('beforeBalance', beforeBalance);

  const lockContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const lock = await hre.ethers.getContractAt("Lock", lockContractAddress);
  await lock.withdraw();

  const afterBalance = await defaultSigner.provider.getBalance(defaultSigner.address);
  console.log('afterBalance', afterBalance);
  console.log('afterBalance - beforeBalance', afterBalance - beforeBalance);
});

const config: HardhatUserConfig = {
  solidity: "0.8.24",
};

export default config;
```

`hardhat/config` からインポートした task を使って、独自の task を定義します。
task の第一引数に `"withdraw"` を指定しているので、これで `npx hardhat withdraw` という形で呼び出す事ができるようになります。
先程デプロイして得た contract address `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` を使って Lock コントラクトオブジェクトを作成し、function withdraw を呼び出すように記載しています。
また、ロックしていた基軸通貨がちゃんと戻ってきているのか確認するために function withdraw 前後で getBalance したものをコンソールに出力するようにしました。

スマートコントラクトのデプロイや function の実行にはトランザクションを発行する必要があり、つまり何かしらのウォレット（秘密鍵）でトランザクションを署名しなければいけません。
Hardhat node で構築したローカルブロックチェーンでは予めウォレットが20個作成され、かつ基軸通貨が 10,000 ずつ付与されています。
（ `npx hardhat node` コマンド実行時、それぞれのウォレットに関する情報が出力されます。）
デフォルトでは、事前に作成された20個のウォレットのうち最初のウォレットがトランザクションの署名に使われるようになっています。

```ts
  const signers = await hre.ethers.getSigners();
  const defaultSigner = signers[0];
```

このようなコードを書く事で、 `const defaultSigner` には「事前に作成された20個のウォレットのうち最初のウォレット」が入ります。
Hardhat ignition を使って Lock コントラクトをデプロイしたのは defaultSigner なので、 defaultSigner の持つ基軸通貨が増えたのかどうかをチェックすれば、正しく function withdraw できているかがわかります。
`getBalance(address)` を呼び出すと、指定の address がどれくらい基軸通貨を持っているかがわかります。

### 3. withdraw task を動かす

では実際に、コマンドラインツールの開発タブで `npx hardhat withdraw --network localhost` を実行してみましょう。

```bash
$ npx hardhat withdraw --network localhost
beforeBalance 9999998811971038275200n
An unexpected error occurred:

ProviderError: Error: VM Exception while processing transaction: reverted with reason string 'You can't withdraw yet'
    at HttpProvider.request (/Users/ogawa_mitsunori/Projects/drip/2024-summer-smart-contract-hands-on/02-create-lock-withdraw-task/node_modules/hardhat/src/internal/core/providers/http.ts:96:21)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async HardhatEthersSigner.sendTransaction (/Users/ogawa_mitsunori/Projects/drip/2024-summer-smart-contract-hands-on/02-create-lock-withdraw-task/node_modules/@nomicfoundation/hardhat-ethers/src/signers.ts:125:18)
    at async send (/Users/ogawa_mitsunori/Projects/drip/2024-summer-smart-contract-hands-on/02-create-lock-withdraw-task/node_modules/ethers/src.ts/contract/contract.ts:313:20)
    at async Proxy.withdraw (/Users/ogawa_mitsunori/Projects/drip/2024-summer-smart-contract-hands-on/02-create-lock-withdraw-task/node_modules/ethers/src.ts/contract/contract.ts:352:16)
    at async SimpleTaskDefinition.action (/Users/ogawa_mitsunori/Projects/drip/2024-summer-smart-contract-hands-on/02-create-lock-withdraw-task/hardhat.config.ts:13:3)
    at async Environment._runTaskDefinition (/Users/ogawa_mitsunori/Projects/drip/2024-summer-smart-contract-hands-on/02-create-lock-withdraw-task/node_modules/hardhat/src/internal/core/runtime-environment.ts:359:14)
    at async Environment.run (/Users/ogawa_mitsunori/Projects/drip/2024-summer-smart-contract-hands-on/02-create-lock-withdraw-task/node_modules/hardhat/src/internal/core/runtime-environment.ts:192:14)
    at async main (/Users/ogawa_mitsunori/Projects/drip/2024-summer-smart-contract-hands-on/02-create-lock-withdraw-task/node_modules/hardhat/src/internal/cli/cli.ts:323:7)
```

beforeBalance の内容が出力された後、エラーになりました。

getBalance で得た値は、最小単位での基軸通貨量を表します。
例えば Ethereum では基軸通貨を ETH （イーサ）と呼びますが、最小単位は wei （ウェイ）と呼びます。
ETH の 1 / 10^18 が wei なので、1 ETH は 1,000,000,000,000,000,000 wei です。
beforeBalance は 9999998811971038275200 wei なので、 9,999.998811971038275200 ETH となります。
当初持っていた 10,000 ETH よりも少し減っているのは、スマートコントラクトをデプロイする時に発行したトランザクションの手数料と、Lock コントラクトに預け入れた 1,000,000,000 wei が原因です。

エラーの理由を見ると `'You can't withdraw yet'` とあります。
これは、Lock コントラクトの27行目 `require(block.timestamp >= unlockTime, "You can't withdraw yet");` に引っかかった事を意味しています。
解除される時間になっていないため withdraw できない事がわかりました。

### 4. Lock コントラクトの ignition ファイルを修正する

withdraw できるようにしたいので、Lock コントラクトの ignition ファイルを修正します。
Lock コントラクトの13行目 `constructor(uint _unlockTime) payable {` にある通り、いつまでロックするかは constructor の引数で指定する事が可能です。
その下にある14行目の require によると `block.timestamp` よりも前の時間を指定する事は出来ないので、デプロイして10秒後に withdraw 出来るよう変更しようと思います。
ignition フォルダの、更に modules フォルダの中にある `Lock.ts` というファイルを3行目を以下のように変更してください。

```ts
// NOTE: 変数名の意味合いが変わってしまいますが、一旦無視していただけると...
const JAN_1ST_2030 = 1893456000;
↓↓↓
const JAN_1ST_2030 = Math.floor(new Date().getTime() / 1000) + 10;
```

`new Date()` は現在日時を表す Date オブジェクトを生成します。
Date オブジェクトの `getTime()` を呼び出すと、それを UNIX Time 形式にしたミリ秒単位の数値が取得できます。
Lock コントラクト内で見ている `block.timestamp` は UNIX Time 形式ですがミリ秒ではなく秒単位なので、こちらも秒単位にすべく `/ 1000` し、端数切り捨てるため全体を `Math.floor` で囲んでいます。
ここまでで、現在時間が秒単位になった UNIX Time 形式の数値が生成されていますが、その10秒後にロック解除してほしいので `+ 10` してフィニッシュです。

また defaultSigner は 10,000 ETH 近くの基軸通貨を持っているので、function withdraw した後に増える量をわかりやすくするため、ロックする量を 1 ETH に増やしておきます。

```ts
// NOTE: 変数名の意味合いが変わってしまいますが、こちらも一旦無視していただけると...
const ONE_GWEI: bigint = 1_000_000_000n;
↓↓↓
const ONE_GWEI: bigint = 1_000_000_000_000_000_000n;
```

### 5. Lock コントラクトをデプロイする 2回目

一度デプロイした Lock コントラクトではなく、新たな Lock コントラクトを使いたいので `--reset` オプションを付与してデプロイします。
コマンドラインツールの開発タブで `npx hardhat ignition deploy ignition/modules/Lock.ts --network localhost --reset` を実行してください。

```bash
$ npx hardhat ignition deploy ignition/modules/Lock.ts --network localhost --reset
Hardhat Ignition 🚀

Deploying [ LockModule ]

Batch #1
  Executed LockModule#Lock

[ LockModule ] successfully deployed 🚀

Deployed Addresses

LockModule#Lock - 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
```

新しい Lock コントラクトが、ローカルブロックチェーンの `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9` にデプロイされました。
※皆さんの環境では異なる contract address になっているかもしれませんが、大丈夫です。

### 6. withdraw task の内容を修正する

hardhat.config.ts ファイルの `const lockContractAddress` が持つ値を、今回デプロイして得た `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9` に変更してください。

```ts
const lockContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
↓↓↓
const lockContractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
```

### 7. withdraw task を動かす 2回目

再び、コマンドラインツールの開発タブで `npx hardhat withdraw --network localhost` を実行してみましょう。

```bash
> npx hardhat withdraw --network localhost
beforeBalance 9998998253920281707014n
afterBalance 9999998202168715365654n
afterBalance - beforeBalance 999948248433658640n
```

function withdraw が成功しました！
defaultSigner の持っている基軸通貨が `999948248433658640n` 増えています。
ロックしていたのは 1 ETH なのに増えた分が 0.999948248433658640 ETH なのは何故なのか？と言うと、function withdraw を呼び出すために投げたトランザクションの手数料が引かれているためです。

以上で本実習は終了となります。
`npx hardhat node` しているノードタブは以降の実習では使わないので、キーボードの Ctrl(control) + C を押して終了させても大丈夫です。
お疲れ様でした。

### 8. Extra

もし時間がある方は、以下にチャレンジしてみましょう。

- 再度 withdraw を呼び出したらどうなるのか試してみる
- 預けている基軸通貨が無い状態で withdraw を呼び出したらエラーになるよう書き換えてみる
- 預ける基軸通貨が無かったら constructor がエラーになるよう書き換えてみる
- `'You can't withdraw yet'` エラーの内容に、あと何秒まてばロック解除されるのかを書き加えてみる
- Solidity 言語仕様を知る
  - https://solidity-jp.readthedocs.io/ja/latest
