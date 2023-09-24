
import {SuiClient, getFullnodeUrl} from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import {CUR_NETWORK, PACKAGE_ID_DEVNET} from "./const/_const";

const suiClient = new SuiClient({
    url: getFullnodeUrl(CUR_NETWORK),
});

export const splitMyChip = async (txb: TransactionBlock, amount: number, dealerAddress: string) => {
    const myChips = await getMyChips(dealerAddress);

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

    console.log("Split CHIPS: ", chip);
    // amount 만큼을 cover할 수 있는 chip이 없는 경우
    if(chip === null){
        return null;
    }

    return chip;

}

export const getMyChips = async (dealerAddress: string) => {
    const response = await suiClient.getCoins({
        owner: dealerAddress,
        coinType: `${PACKAGE_ID_DEVNET}::chipsui::CHIPSUI`
    });

    return response.data;
}