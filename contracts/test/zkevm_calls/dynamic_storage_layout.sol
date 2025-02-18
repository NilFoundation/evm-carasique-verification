pragma solidity >=0.8.4;

contract zkEVMDynamicStorageLayout {
    event Result(uint256 result);

    function set(uint256 key, uint256 value) public{
        assembly{
            sstore(key, value)
        }
    }
    function get(uint256 key) public returns (uint256 result){
        assembly{
            result := sload(key)
        }
        emit Result(result);
    }
}
