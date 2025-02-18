pragma solidity >=0.8.4;

contract zkEVMMemInit {
    uint256 counter = 0x1;

    function test_addition(uint8[5] calldata keys, uint8[5] calldata values) public returns (uint256 result)  {
        uint8[30] memory tmp;

        for(uint8 i = 0; i < 5; i++){
            tmp[keys[i]] = values[i];
        }

        for(uint16 i = 0; i < 30; i++){
            result += uint256(i) * uint256(tmp[i]);
        }

        counter += result;
    }
}
