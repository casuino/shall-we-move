import {TransactionBlock} from "@mysten/sui.js/transactions";
import {SuiClient} from "@mysten/sui.js/client";
import {SuiSignAndExecuteTransactionBlockInput} from "@mysten/wallet-standard/src";

import {WalletContextState} from "@suiet/wallet-kit";
import axios from "axios";
import {
    EXCHANGE_OBEJCT_ID_DEVNET,
    GAS_BUDGET,
    PACKAGE_ID_DEVNET,
    SUI_FULLNODE_DEVNET_ENDPOINT,
    VALIDATOR_ADDR_DEVNET,
    SUI_SYSTEM_STATE_OBJECT_ID
} from "../const/_const";


const MIST_UNIT = 1000000000;

const suiClient = new SuiClient({
    url: SUI_FULLNODE_DEVNET_ENDPOINT,
});

export const depositSui = async (amount: number, wallet: WalletContextState) => {
    try {
        // sui -> stakedSui
        const txbDigest = await stakeSuiTx(amount, wallet);
        const stakedSuiObjectId = await getStakedSuiFromTxDigest(txbDigest);

        // stakedsui -> chipsui
        await depositStakedSui(stakedSuiObjectId, wallet);
    }   catch(e) {
        throw new Error(e);
    }

}

export const withdrawSui = async (amount: number, wallet: WalletContextState) => {
    try {
        // chipsui -> stakedsui
        await withdrawStakedSui(amount, wallet);
        const stakedSuiArr = await getMyStakedSuiArr(wallet);
        let stakedSuiObjectId = "";
        for (let i = 0; i <stakedSuiArr.length; i++) {
            const stakedSui = stakedSuiArr[i];
            const stakedSuiBalance = parseInt(stakedSui?.data?.content?.fields?.principal, 10) / MIST_UNIT;

            if (stakedSuiBalance == amount) {
                stakedSuiObjectId = stakedSui.data.objectId;
                break;
            }
        }
        // const stakedSuiObjectId = await getStakedSuiFromTxDigest(txbDigest);
        console.log("Withdraw StakedSui: ", stakedSuiObjectId);

        // stakedsui -> sui
        await unStakeSuiTx(stakedSuiObjectId, wallet);
    }   catch(e) {
        throw new Error(e);
    }
}

// StakeSui Object ID를 가져오는 함수
const getStakedSuiFromTxDigest = async (txBlockDigest: string): Promise<string> => {
    try {
        const response = await axios.post(SUI_FULLNODE_DEVNET_ENDPOINT, {
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
                    showObjectChanges: true,
                    showBalanceChanges: true
                }],
        });

        const stakedSuiObjectId = response?.data?.result?.effects?.created[0]?.reference?.objectId;
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
    txb.setGasBudget(GAS_BUDGET);

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

const unStakeSuiTx = async (stakedSui_id: string, wallet: WalletContextState) => {
    const txb = new TransactionBlock();

    txb.setGasBudget(GAS_BUDGET);
    txb.moveCall({
        target: "0x3::sui_system::request_withdraw_stake",
        arguments: [
            txb.object(SUI_SYSTEM_STATE_OBJECT_ID),
            txb.object(stakedSui_id),
        ]
    });

    const stx: Omit<SuiSignAndExecuteTransactionBlockInput, "sui:devnet"> = {
        transactionBlock: txb,
        account: wallet.account,
        chain: "sui:devnet",
    }

    try {
        const result = await wallet.signAndExecuteTransactionBlock(stx)
        console.log("Unstake Sui Result: ", result.digest)
        return result.digest;
    }   catch(e) {
        throw new Error(e);
    }
}

// StakedSui를 Chipsui로 변환하는 함수
const depositStakedSui = async (stakedSui_id: string, wallet: WalletContextState) => {
    const txb = new TransactionBlock();

    txb.setGasBudget(GAS_BUDGET);
    txb.moveCall({
        target: `${PACKAGE_ID_DEVNET}::chipsui::depositStakedSui`,
        arguments: [
            txb.object(EXCHANGE_OBEJCT_ID_DEVNET),
            txb.object(stakedSui_id),
        ]
    });

    const stx: Omit<SuiSignAndExecuteTransactionBlockInput, "sui:devnet"> = {
        transactionBlock: txb,
        account: wallet.account,
        chain: "sui:devnet",
    }

    try {
        const result = await wallet.signAndExecuteTransactionBlock(stx);
        return result;
    }   catch (e) {
        throw new Error("[exchangeTx.ts:depositStakedSui] " + e);
    }
}


// Chipsui를 StakedSui로 변환하는 함수
export const withdrawStakedSui = async (amount: number, wallet: WalletContextState) => {
    const txb = new TransactionBlock();
    const amountInMist = amount * MIST_UNIT;

    const chip = await splitMyChip(txb, amountInMist, wallet);

    if(chip === null) {
        throw new Error("[exchangeTx.ts:withdrawStakedSui] Not Enough Chips");
    }
    txb.setGasBudget(GAS_BUDGET);
    txb.moveCall({
        target: `${PACKAGE_ID_DEVNET}::chipsui::withdrawStakedSui`,
        arguments: [
            txb.object(EXCHANGE_OBEJCT_ID_DEVNET),
            chip,
        ]
    });

    const stx: Omit<SuiSignAndExecuteTransactionBlockInput, "sui:devnet"> = {
        transactionBlock: txb,
        account: wallet.account,
        chain: "sui:devnet",
    }

    try {
        const result = await wallet.signAndExecuteTransactionBlock(stx);
        return result.digest;
    }   catch(e) {
        throw new Error("[exchangeTx.ts:withdrawStakedSui] " + e);
    }
}

export const splitMyChip = async (txb: TransactionBlock, amount: number, wallet: WalletContextState) => {
    const myChips = await getMyChips(wallet);

    let chip = null;
    let balanceSum = 0;
    const chipIdArr = [];
    for(let i = 0; i < myChips.length; i++){
        const chipBalance = parseInt(myChips[i].balance, 10);

        // 1개 chip으로 amount 만큼을 cover할 수 있는 경우
        if(chipBalance >= amount){
            const [coin] = txb.splitCoins(txb.object(myChips[i].coinObjectId), [txb.pure(amount)]);
            chip = coin;
            break;
        }

        balanceSum += chipBalance;
        chipIdArr.push(myChips[i].coinObjectId);
        // 여러 개 chip 합쳐서 amount 만큼을 cover할 수 있는 경우
        if(balanceSum >= amount){
            const sourceCoins = [];
            for(let j = 1; j < chipIdArr.length; j++){
                sourceCoins.push(txb.object(chipIdArr[j]));
            }
            txb.mergeCoins(txb.object(chipIdArr[0]), sourceCoins);
            const [coin] = txb.splitCoins(txb.object(chipIdArr[0]), [txb.pure(amount)]);
            chip = coin;
            break;
        }
    }

    // amount 만큼을 cover할 수 있는 chip이 없는 경우
    if(chip === null){
        return null;
    }

    return chip;

}

export const getMyChips = async (wallet: WalletContextState) => {
    const response = await suiClient.getCoins({
        owner: wallet.account.address,
        coinType: `${PACKAGE_ID_DEVNET}::chipsui::CHIPSUI`
    });

    return response.data;
}

export const getMyChipBalance = async (wallet: WalletContextState) => {
    if(!wallet.account) {
        return 0;
    }
    const myChips = await getMyChips(wallet);
    let balance = 0;
    for (let i = 0; i < myChips.length; i++) {
        const chip = myChips[i];
        balance += parseInt(chip.balance, 10) / MIST_UNIT;
    }

    return balance;
}

const getMyStakedSuiArr = async (wallet: WalletContextState) => {
    const response = await suiClient.getOwnedObjects({
        owner: wallet.account.address,
        filter: {
            StructType: '0x3::staking_pool::StakedSui'
        },
        options: {
            showContent: true,
            showType: true,
        }
    })

    return response.data;
}
