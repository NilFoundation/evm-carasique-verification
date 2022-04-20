const myModule = require("./auxProofGen.js");
const myModule2 = require('./verifyPlaceholderUnifiedAddition.js');
const fs = require("fs");
const web3 = require('web3');
const bip39 = require('bip39');
const {hdkey} = require('ethereumjs-wallet');


function runTest() {
    var result = myModule.onRuntimeInitialized = async () => {
        var t = myModule.ccall('proof_gen', // name of C function
            'string', // return type
            null, // argument types
            null // arguments
        );
        t = t.slice(0, -1); // remove /n from the end
        console.log(await myModule2.verifyPlaceholderUnifiedAddition(t));
    }
}

runTest()