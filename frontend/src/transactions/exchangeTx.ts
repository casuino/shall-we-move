import {TransactionBlock} from "@mysten/sui.js/transactions";
import {SuiClient} from "@mysten/sui.js/client";
import {SuiSignAndExecuteTransactionBlockInput} from "@mysten/wallet-standard/src";

import config from "../config.json";

import {WalletContextState} from "@suiet/wallet-kit";
import axios from "axios";

// TODO: /src/config.json -> json으로 관리하지 말고 모듈로 관리하자. ex) /src/const/_const.ts

const SUI_SYSTEM_STATE_OBJECT_ID = "0x0000000000000000000000000000000000000000000000000000000000000005";
const VALIDATOR_ADDR_DEVNET = "0x661b595068d1096e4b2cf3da1e151534d4d7154167528bbcb461d0eb4f541d1a";

const MIST_UNIT = 1000000000;

const suiClient = new SuiClient({
    url: config.SUI_FULLNODE_DEVNET_ENDPOINT,
});

export const depositSui = async (amount: number, wallet: WalletContextState) => {
    try {
        // sui -> stakedSui
        const txbDigest = await stakeSuiTx(amount, wallet);
        const stakedSuiObjectId = await getStakedSui(txbDigest);

        // stakedsui -> chipsui
        await depositStakedSui(stakedSuiObjectId, wallet);
    }   catch(e) {
        throw new Error(e);
    }

}

export const withdrwaSui = async (amount: number, wallet: WalletContextState) => {
    try {
        // chipsui -> stakedsui
        const txbDigest = await stakeSuiTx(amount, wallet);
        const stakedSuiObjectId = await getStakedSui(txbDigest);

        // stakedsui -> sui
        await depositStakedSui(stakedSuiObjectId, wallet);
    }   catch(e) {
        throw new Error(e);
    }
}

// StakeSui Object ID를 가져오는 함수
const getStakedSui = async (txBlockDigest: string): Promise<string> => {
    try {
        const response = await axios.post(config.SUI_FULLNODE_DEVNET_ENDPOINT, {
            jsonrpc: "2.0",
            id: 1,
            method: "sui_getTransactionBlock",
            params: [
                txBlockDigest,
                {
                    showInput: true,
                    showRawInput: false,
                    showEffects: true,
                    showEvents: true,
                    showObjectChanges: false,
                    showBalanceChanges: false
                }],
        });

        const stakedSuiObjectId: string = response.data?.result?.effects?.created[0]?.reference?.objectId;
        return stakedSuiObjectId;
    }   catch(e) {
        throw new Error(e);
    }
}

// Sui를 Stake하는 함수
const stakeSuiTx = async (amount:number, wallet: WalletContextState): Promise<string> => {
    const txb = new TransactionBlock();

    // TODO: 하나의 tx 내에서 digest 받아서 아직 만들어지지 않은 stakedSuio의 objectId를 가져올 수 있을까? (-> depositStakedSui)
    // const digest = await txb.getDigest();

    const [coin] = txb.splitCoins(txb.gas, [txb.pure(amount * MIST_UNIT)]);

    txb.moveCall({
        target: "0x3::sui_system::request_add_stake",
        arguments: [
            txb.object(SUI_SYSTEM_STATE_OBJECT_ID),
            coin,
            txb.pure(VALIDATOR_ADDR_DEVNET),
        ]
    });

    const stx: Omit<SuiSignAndExecuteTransactionBlockInput, "sui:devnet"> = {
        transactionBlock: txb,
        account: wallet.account,
        chain: "sui:devnet",
    }

    // TODO: response & error handling 어떻게 할지 잘 고민해보자!
    // return wallet.signAndExecuteTransactionBlock(stx)
    try {
        const result = await wallet.signAndExecuteTransactionBlock(stx)
        return result.digest;
    }   catch(e) {
        throw new Error(e);
    }
}

// StakedSui를 Chipsui로 변환하는 함수
const depositStakedSui = async (stakedSui_id: string, wallet: WalletContextState) => {
    const txb = new TransactionBlock();

    txb.moveCall({
        target: `${config.PACKAGE_ID_DEVNET}::chipsui::depositStakedSui`,
        arguments: [
            txb.object(config.EXCHANGE_OBEJCT_ID_DEVNET),
            txb.object(stakedSui_id),
        ]
    });

    const stx: Omit<SuiSignAndExecuteTransactionBlockInput, "sui:devnet"> = {
        transactionBlock: txb,
        account: wallet.account,
        chain: "sui:devnet",
    }

    return wallet.signAndExecuteTransactionBlock(stx)
}


// TODO : Chipsui를 StakedSui로 변환하는 함수 -- 현재 작동 안 함!!
export const withdrawStakedSui = async (amount: number, wallet: WalletContextState) => {
    const txb = new TransactionBlock();

    // TODO 1: ChipSUI를 어떻게 파라미터로 넣을까
    // TODO 2: ChipSUI가 각각 쪼개져있는데, 유저가 자유롭게 금액을 선정하게 할 수 있을까?
    //      안된다면 ChipSUI 목록 중에 고르게 해야하나? 컨트랙을 수정해야하나(ChipSUI 합치게끔 - SUI 처럼 한 개의 오브젝트로)?

    const chipArr = [];
    let totalAmount = 0;

    const myChips = await getMyChips(wallet);
    for (let i = 0; i < myChips.length; i++) {
        const chip = myChips[i];
        if (totalAmount < amount) {
            chipArr.push(txb.object(chip.coinObjectId));
            totalAmount += parseInt(chip.balance, 10) / MIST_UNIT;
        }
    }
    console.log("Total Amount: ", totalAmount);

    if (totalAmount < amount) {
        throw new Error("Not enough ChipSUI");
    }

    const [coin] = txb.splitCoins(txb.object(myChips[1].coinObjectId), [txb.pure(amount * MIST_UNIT)]);

    console.log("Chip ID: ", myChips[1].coinObjectId);

    txb.moveCall({
        target: `${config.PACKAGE_ID_DEVNET}::chipsui::withdrawStakedSui`,
        typeArguments: [
            `${config.PACKAGE_ID_DEVNET}::chipsui::Exchange`,
            `${config.PACKAGE_ID_DEVNET}::chipsui::CHIPSUI`
        ],
        arguments: [
            txb.object(config.EXCHANGE_OBEJCT_ID_DEVNET),
            txb.object(myChips[1].coinObjectId),
        ]
    });

    const stx: Omit<SuiSignAndExecuteTransactionBlockInput, "sui:devnet"> = {
        transactionBlock: txb,
        account: wallet.account,
        chain: "sui:devnet",
    }

    try {
        const result = await wallet.signAndExecuteTransactionBlock(stx)
        console.log("Withdraw StakedSui: ", result);
    }   catch(e) {
        throw new Error(e);
        console.log("Withdraw StakedSui Error: ", e);
    }
}

export const getMyChips = async (wallet: WalletContextState) => {
    const response = await suiClient.getCoins({
        owner: wallet.account.address,
        coinType: `${config.PACKAGE_ID_DEVNET}::chipsui::CHIPSUI`
    });

    console.log("My Coins: ", response.data);

    return response.data;
}
