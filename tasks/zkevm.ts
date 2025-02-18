import {task} from "hardhat/config";
import fs from "fs";
import path from "path";
import losslessJSON from "lossless-json";
import {URL} from "url";
import { expect } from "chai";
const util = require('util')

const getNonce  = async(address) =>{
    const params = {
        method: "eth_getTransactionCount",
        params: [address,"latest"],
        id:"1",
        "jsonrpc":"2.0"
    };
    const options = {
        method: 'POST',
        body: JSON.stringify( params )
    };
    const resp = await fetch( 'http://127.0.0.1:8545/', options )
    const jsoned_resp =  await resp.json()
    const result = await jsoned_resp;
    return result.result;
}

const getBalance  = async(address) =>{
    const params = {
        method: "eth_getBalance",
        params: [address,"latest"],
        id:"1",
        "jsonrpc":"2.0"
    };
    const options = {
        method: 'POST',
        body: JSON.stringify( params )
    };
    const resp = await fetch( 'http://127.0.0.1:8545/', options )
    const jsoned_resp =  await resp.json()
    const result = await jsoned_resp;
    return result.result;
}

const getEthereumAccount  = async(address) =>{
    return {
        address: address,
        balance: await getBalance(address),
        nonce: await getNonce(address),
        storage: {}
    }
}

const getBytecode  = async(address) =>{
    const params = {
        method: "eth_getCode",
        params: [address,"latest"],
        id:"1",
        "jsonrpc":"2.0"
    };
    const options = {
        method: 'POST',
        body: JSON.stringify( params )
    };
    const resp = await fetch( 'http://127.0.0.1:8545/', options )
    const jsoned_resp =  await resp.json()
    const result = await jsoned_resp;
    return result.result;
}

const getAccount  = async(address, keys) =>{
    return {
        address: address,
        balance: await getBalance(address),
        nonce: await getNonce(address),
        bytecode: await getBytecode(address),
        storage: await(getStorageItems(address, keys))
    }
}

const getTrace  = async(tx_hash) =>{
    const params = {
        method: "debug_traceTransaction",
        params: [tx_hash],
        id:"1",
        "jsonrpc":"2.0"
    };
    const options = {
        method: 'POST',
        body: JSON.stringify( params )
    };
    const resp = await fetch( 'http://127.0.0.1:8545/', options )
    const jsoned_resp =  await resp.json()
    const result = await jsoned_resp;
    return result.result;
}

const getStorageAt  = async(address, storageKey) =>{
    const params = {
        method: "eth_getStorageAt",
        params: [address,storageKey, "latest"],
        id:"1",
        "jsonrpc":"2.0"
    };
    const options = {
        method: 'POST',
        body: JSON.stringify( params )
    };
    const resp = await fetch( 'http://127.0.0.1:8545/', options )
    const jsoned_resp =  await resp.json()
    const result = await jsoned_resp;
    return result.result;
}

const getStorageItems = async(address, keys) =>{
    let result = {};
    for(let i = 0; i < keys.length; i++){
        result[keys[i]] = await getStorageAt(address, keys[i]);
    }
    return result;
}

const counter = async ()=>{
    let result = {};
    result["eth_accounts"] = {};
    result["accounts"] = {};
    result["blocks"] = {};

    // Step 1. Load ethereum accounts involved in your test
    const signer = await ethers.provider.getSigner();
    const signer_address = await signer.getAddress();
    let eth_account_data = await getEthereumAccount(signer_address);
    result["eth_accounts"][signer_address] = eth_account_data;

    // Step 2. Load contracts involved in your test
    let counter = await ethers.getContract('zkEVMCounter');
    result["accounts"][counter.address] = await getAccount(counter.address, [
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000000000000000000000000057"
    ]);

    // Step 3. Run transactions, traces and get receipts
    // We won't fully simulate block logic, because it differs from cluster's

    // Three counters in the first block
    {
        let tx1 = await counter.inc({gasLimit: 100_000});
        let tx2 = await counter.inc({gasLimit: 100_000});
        let tx3 = await counter.inc({gasLimit: 100_000});

        let txReciept1 = await tx1.wait(1);
        let txReciept2 = await tx2.wait(1);
        let txReciept3 = await tx3.wait(1);

        // console.log(txReciept1["blockHash"]);
        // console.log(txReciept2["blockHash"]);
        // console.log(txReciept3["blockHash"]);

        let trace1 = await getTrace(tx1.hash);
        result["blocks"][txReciept1["blockHash"]] = {};
        result["blocks"][txReciept1["blockHash"]]["transactions"] = {};
        result["blocks"][txReciept1["blockHash"]]["transactions"][tx1.hash] = {};
        result["blocks"][txReciept1["blockHash"]]["transactions"][tx1.hash]["tx"] = tx1;
        result["blocks"][txReciept1["blockHash"]]["transactions"][tx1.hash]["reciept"] = txReciept1;
        result["blocks"][txReciept1["blockHash"]]["transactions"][tx1.hash]["trace"] = trace1;


        let trace2 = await getTrace(tx2.hash);
        if( txReciept2["blockHash"] != txReciept1["blockHash"] ) {
            result["blocks"][txReciept2["blockHash"]] = {};
            result["blocks"][txReciept2["blockHash"]]["transactions"] = {};
        }
        result["blocks"][txReciept2["blockHash"]]["transactions"][tx2.hash] = {};
        result["blocks"][txReciept2["blockHash"]]["transactions"][tx2.hash]["tx"] = tx2;
        result["blocks"][txReciept2["blockHash"]]["transactions"][tx2.hash]["reciept"] = txReciept2;
        result["blocks"][txReciept2["blockHash"]]["transactions"][tx2.hash]["trace"] = trace2;

        let trace3 = await getTrace(tx3.hash);
        if( txReciept3["blockHash"] != txReciept3["blockHash"] ) {
            result["blocks"][txReciept3["blockHash"]] = {};
            result["blocks"][txReciept3["blockHash"]]["transactions"] = {};
        }
        result["blocks"][txReciept3["blockHash"]]["transactions"][tx3.hash] = {};
        result["blocks"][txReciept3["blockHash"]]["transactions"][tx3.hash]["tx"] = tx3;
        result["blocks"][txReciept3["blockHash"]]["transactions"][tx3.hash]["reciept"] = txReciept3;
        result["blocks"][txReciept3["blockHash"]]["transactions"][tx3.hash]["trace"] = trace3;
    }
    //  Three counters in the second block
    {
        let tx1 = await counter.inc({gasLimit: 100_000});
        let tx2 = await counter.inc({gasLimit: 100_000});
        let tx3 = await counter.inc({gasLimit: 100_000});

        let txReciept1 = await tx1.wait(1);
        let txReciept2 = await tx2.wait(1);
        let txReciept3 = await tx3.wait(1);

        // console.log(txReciept1["blockHash"]);
        // console.log(txReciept2["blockHash"]);
        // console.log(txReciept3["blockHash"]);

        let trace1 = await getTrace(tx1.hash);
        result["blocks"][txReciept1["blockHash"]] = {};
        result["blocks"][txReciept1["blockHash"]]["transactions"] = {};
        result["blocks"][txReciept1["blockHash"]]["transactions"][tx1.hash] = {};
        result["blocks"][txReciept1["blockHash"]]["transactions"][tx1.hash]["tx"] = tx1;
        result["blocks"][txReciept1["blockHash"]]["transactions"][tx1.hash]["reciept"] = txReciept1;
        result["blocks"][txReciept1["blockHash"]]["transactions"][tx1.hash]["trace"] = trace1;


        let trace2 = await getTrace(tx2.hash);
        if( txReciept2["blockHash"] != txReciept1["blockHash"] ) {
            result["blocks"][txReciept2["blockHash"]] = {};
            result["blocks"][txReciept2["blockHash"]]["transactions"] = {};
        }
        result["blocks"][txReciept2["blockHash"]]["transactions"][tx2.hash] = {};
        result["blocks"][txReciept2["blockHash"]]["transactions"][tx2.hash]["tx"] = tx2;
        result["blocks"][txReciept2["blockHash"]]["transactions"][tx2.hash]["reciept"] = txReciept2;
        result["blocks"][txReciept2["blockHash"]]["transactions"][tx2.hash]["trace"] = trace2;

        let trace3 = await getTrace(tx3.hash);
        if( txReciept3["blockHash"] != txReciept3["blockHash"] ) {
            result["blocks"][txReciept3["blockHash"]] = {};
            result["blocks"][txReciept3["blockHash"]]["transactions"] = {};
        }
        result["blocks"][txReciept3["blockHash"]]["transactions"][tx3.hash] = {};
        result["blocks"][txReciept3["blockHash"]]["transactions"][tx3.hash]["tx"] = tx3;
        result["blocks"][txReciept3["blockHash"]]["transactions"][tx3.hash]["reciept"] = txReciept3;
        result["blocks"][txReciept3["blockHash"]]["transactions"][tx3.hash]["trace"] = trace3;
    }
    console.log(JSON.stringify(result));
}

const overflow = async ()=>{
    let result = {};
    result["eth_accounts"] = {};
    result["accounts"] = {};
    result["blocks"] = {};

    // Step 1. Load ethereum accounts involved in your test
    const signer = await ethers.provider.getSigner();
    const signer_address = await signer.getAddress();
    let eth_account_data = await getEthereumAccount(signer_address);
    result["eth_accounts"][signer_address] = eth_account_data;

    // Step 2. Load contracts involved in your test
    let counter = await ethers.getContract('zkEVMOverflow');
    result["accounts"][counter.address] = await getAccount(counter.address, [
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000000000000000000000000057"
    ]);

    // Step 3. Run transactions, traces and get receipts
    // We won't fully simulate block logic, because it differs from cluster's

    // Three counters in the first block
    let tx1, tx2, txReciept1, txReciept2;
    try {
        tx1 = await counter.uncheckedAddition(2, 2, {gasLimit: 100_000});
        tx2 = await counter.uncheckedAddition(0xFF, 0xFF, {gasLimit: 100_000});

        txReciept1 = await tx1.wait(1);
        txReciept2 = await tx2.wait(1);
    } catch (error){
        console.log("ERROR emited");
        console.log( tx1 );
        console.log( tx2 );
    }

    let trace1 = await getTrace(tx1.hash);
    result["blocks"][txReciept1["blockHash"]] = {};
    result["blocks"][txReciept1["blockHash"]]["transactions"] = {};
    result["blocks"][txReciept1["blockHash"]]["transactions"][tx1.hash] = {};
    result["blocks"][txReciept1["blockHash"]]["transactions"][tx1.hash]["tx"] = tx1;
    result["blocks"][txReciept1["blockHash"]]["transactions"][tx1.hash]["reciept"] = txReciept1;
    result["blocks"][txReciept1["blockHash"]]["transactions"][tx1.hash]["trace"] = trace1;


    let trace2 = await getTrace(tx2.hash);
    if( txReciept2["blockHash"] != txReciept1["blockHash"] ) {
        result["blocks"][txReciept2["blockHash"]] = {};
        result["blocks"][txReciept2["blockHash"]]["transactions"] = {};
    }
    result["blocks"][txReciept2["blockHash"]]["transactions"][tx2.hash] = {};
    result["blocks"][txReciept2["blockHash"]]["transactions"][tx2.hash]["tx"] = tx2;
    result["blocks"][txReciept2["blockHash"]]["transactions"][tx2.hash]["reciept"] = txReciept2;
    result["blocks"][txReciept2["blockHash"]]["transactions"][tx2.hash]["trace"] = trace2;
    console.log(JSON.stringify(result));
}

const calldata = async ()=>{
    console.log("Call calldata 3 times");
    //await deployments.fixture([99'testZKevmFixture']);
    let calldata = await ethers.getContract('zkEVMCalldata');
    console.log("contract object is");
    console.log(calldata);
    let tx = await calldata.keccak("0x123455", {gasLimit: 30_500_000});
    let txReciept = await tx.wait(1);
    console.log("Transaction");
    console.log(util.inspect(tx, {depth: null}));
    console.log("TxRecipt");
    console.log(JSON.stringify(txReciept));

    tx = await calldata.keccak("0x112233", {gasLimit: 30_500_000});
    txReciept = await tx.wait(1);
    console.log("Transaction");
    console.log(JSON.stringify(tx));
    console.log("TxRecipt");
    console.log(JSON.stringify(txReciept));

    tx = await calldata.keccak("0xaabbccddeeff", {gasLimit: 30_500_000});
    txReciept = await tx.wait(1);
    console.log("Transaction");
    console.log(util.inspect(tx, {depth: null}));
    console.log("TxRecipt");
    console.log(JSON.stringify(txReciept));
}

const dynamic_storage = async (hre)=>{
    console.log("Call counter caller");
    //await deployments.fixture(['testZKevmFixture']);
    let counter = await ethers.getContract('zkEVMDynamicStorageLayout');
    console.log("contract object is");
    console.log(JSON.stringify(counter));
    console.log("Contract address = ", counter.address);

//    const code = hre.eth_getCode(counter.address);
//    console.log("Contract code = ", code);
    let tx = await counter.set(0x123, 0x456, {gasLimit: 30_500_000});
    let txReciept = await tx.wait(1);
    console.log("Transaction");
    console.log(JSON.stringify(tx));
    console.log("TxRecipt");
    console.log(JSON.stringify(txReciept));

    let empty_tx = await counter.get(0x456, {gasLimit: 30_500_000});
    let empty_txReciept = await empty_tx.wait(1);
    console.log("Transaction");
    console.log(JSON.stringify(empty_tx));
    console.log("TxRecipt");
    console.log(JSON.stringify(empty_txReciept));

    let non_empty_tx = await counter.get(0x123, {gasLimit: 30_500_000});
    let non_empty_txReciept = await non_empty_tx.wait(1);
    console.log("Transaction");
    console.log(JSON.stringify(non_empty_tx));
    console.log("TxRecipt");
    console.log(JSON.stringify(non_empty_txReciept));
}

const revert = async ()=>{
    console.log("Call counter caller");
    //await deployments.fixture(['testZKevmFixture']);
    let counter = await ethers.getContract('zkEVMRevert');
    console.log("contract object is");
    console.log(counter);
    let tx = await expect(counter.callInc({gasLimit: 30_500_000}));
    const latestBlock = await ethers.provider.getBlock("latest");
    const latestTXHash = latestBlock.transactions.at(-1);
    console.log(latestTXHash);
    // // Get latest transaction receipt object
}

const try_catch = async ()=>{
    console.log("Call counter caller");
    //await deployments.fixture(['testZKevmFixture']);
    let counter = await ethers.getContract('zkEVMTryCatch');
    console.log("contract object is");
    console.log(counter);
    let tx = await counter.callInc({gasLimit: 30_500_000});
    let txReciept = await tx.wait(1);
    console.log("Transaction");
    console.log(util.inspect(tx, {depth: null}));
    console.log("TxRecipt");
    console.log(JSON.stringify(txReciept));    // // Get latest transaction receipt object
}

task("zkevm-counter")
    .setAction(async (hre) => {
        await counter();
    });
task("zkevm-call-counter")
    .setAction(async (hre) => {
        await call_counter(hre);
    });
task("zkevm-revert")
    .setAction(async (hre) => {
        await revert();
    });
task("zkevm-try-catch")
    .setAction(async (hre) => {
        await try_catch();
    });
task("zkevm-calldata")
    .setAction(async (hre) => {
        await calldata();
    });
task("zkevm-dynamic-storage")
    .setAction(async (hre) => {
        await dynamic_storage(hre);
    });
task("zkevm-overflow")
    .setAction(async (hre) => {
        await overflow(hre);
    });
