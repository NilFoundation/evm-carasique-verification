pragma solidity >=0.8.4;

contract zkEVMSigned {
    int256 counter = 0x1;

    function test_addition(int256[5] calldata keys, int256[5] calldata values) public returns (int result)  {
        for( uint8 i = 0; i < 5; i++ ){
            result += keys[i] * values[i];
        }
        counter += result;
    }
}
