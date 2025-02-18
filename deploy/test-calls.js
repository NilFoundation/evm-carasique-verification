const hre = require('hardhat')
const {getNamedAccounts} = hre

module.exports = async function () {
    console.log("Deploy calls!");
    const {deployments, getNamedAccounts} = hre;
    const {deploy} = deployments;
    const {deployer, tokenOwner} = await getNamedAccounts();

    console.log("Deploy counter")
    let counter_tx = await deploy('zkEVMCounter', {
        from: deployer,
        log: true,
    });
    console.log(counter_tx);

    console.log("Deploy calldata")
    let calldata_tx = await deploy('zkEVMCalldata', {
        from: deployer,
        log: true,
    });
    console.log(counter_tx);

    console.log("Deploy call counter")
    let call_counter_tx = await deploy("zkEVMCallCounter", {
        from: deployer,
        log: true,
        args: [counter_tx.address]
    });
    console.log(call_counter_tx);

    console.log("Deploy revert")
    let revert_tx = await deploy("zkEVMRevert", {
        from: deployer,
        log: true,
        args: [counter_tx.address]
    });
    console.log(revert_tx);

    console.log("Deploy try-catching")
    let try_catch_tx = await deploy("zkEVMTryCatch", {
        from: deployer,
        log: true,
        args: [counter_tx.address, revert_tx.address]
    });
    console.log(try_catch_tx);

    console.log("Deploy dynamic storage layout contract")
    let dynamic_storage_tx = await deploy("zkEVMDynamicStorageLayout", {
        from: deployer,
        log: true,
        args: []
    });
    console.log(dynamic_storage_tx);

    console.log("Deploy arithmetic overflow tests")
    let dynanmic_storage_tx = await deploy("zkEVMOverflow", {
        from: deployer,
        log: true,
        args: []
    });
    console.log(dynanmic_storage_tx);

    console.log("Deploy DELEGATECALL example")
    let delegatecall_tx = await deploy("zkEVMDelegateCall", {
        from: deployer,
        log: true,
        args: [counter_tx.address]
    });
    console.log(delegatecall_tx);

    console.log("Deploy indexed logs example")
    let indexed_logs_tx = await deploy("zkEVMIndexedLog", {
        from: deployer,
        log: true,
        args: []
    });
    console.log(indexed_logs_tx);
}

module.exports.tags = ['testZKevmFixture']
