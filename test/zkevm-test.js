const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const {anyValue} = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const {expect} = require("chai");
const hre = require('hardhat')
const fs = require("fs");
const path = require("path");
const {BigNumber} = require("ethers");
const {getNamedAccounts} = hre
const losslessJSON = require("lossless-json")

/* global BigInt */
await deployments.fixture(['ModularVerifierFixture']);
describe('zkEVM test', function () {
    const {deployments, getNamedAccounts} = hre;
    const {deploy} = deployments;

    it("zkEVM testMinimalMath", async function () {
        await deployments.fixture(['testZKevmFixture']);
        let test_addition = await ethers.getContract('zkEVMMinimalMath');
        // console.log("contract object is");
        // console.log(test_addition["bytecode"]);
        let tx = await test_addition.test_addition(3, 2, {gasLimit: 30_500_000});
        let txReciept = await tx.wait(1);
        console.log("the transaction details are");
        console.log(txReciept);
    });
    it("zkEVM testModularOperations", async function () {
        await deployments.fixture(['testZKevmFixture']);
        let test_addition = await ethers.getContract('zkEVModularOperations');
        // console.log("contract object is");
        // console.log(test_addition["bytecode"]);
        let tx = await test_addition.test_addition(324, {gasLimit: 30_500_000});
        let txReciept = await tx.wait(1);
        console.log("the transaction details are");
        console.log(txReciept);
    });
    it("zkEVM testModularOperations", async function () {
        await deployments.fixture(['testZKevmFixture']);
        let test_addition = await ethers.getContract('zkEVMKeccak');
        // console.log("contract object is");
        // console.log(test_addition["bytecode"]);
        let tx = await test_addition.test_addition("Hello, world!", {gasLimit: 30_500_000});
        let txReciept = await tx.wait(1);
        console.log("the transaction details are");
        console.log(txReciept);
    });
    it("zkEVM testModularOperations", async function () {
        await deployments.fixture(['testZKevmFixture']);
        let test_addition = await ethers.getContract('zkEVMMemInit');
        // console.log("contract object is");
        // console.log(test_addition["bytecode"]);
        let tx = await test_addition.test_addition([0, 2, 3, 15, 20], [255, 30, 20, 4, 3], {gasLimit: 30_500_000});
        let txReciept = await tx.wait(1);
        console.log("the transaction details are");
        console.log(txReciept);
    });
    it("zkEVM testExpOperations", async function () {
        await deployments.fixture(['testZKevmFixture']);
        let test_addition = await ethers.getContract('zkEVMExp');
        // console.log("contract object is");
        // console.log(test_addition["bytecode"]);
        let tx = await test_addition.test_addition(3, [0, 1, 2, 0x12334], {gasLimit: 30_500_000});
        let txReciept = await tx.wait(1);
        console.log("the transaction details are");
        console.log(txReciept);
    });
    it("zkEVM testPrecompiles", async function () {
        await deployments.fixture(['testZKevmFixture']);
        let test_addition = await ethers.getContract('zkEVMPrecompiles');
        // console.log("contract object is");
        //     console.log(test_addition["bytecode"]);
        let tx = await test_addition.test_expmod(3, [0, 1, 2, 0x12334], {gasLimit: 30_500_000});
        let txReciept = await tx.wait(1);
        console.log("the transaction details are");
        console.log(txReciept);
    });
})
