pragma solidity >=0.8.4;

contract zkEVMOverflow{
    uint256 overflows;

    function uncheckedAddition(uint8 a, uint8 b) public returns (bool result){
        uint8 sum;
        unchecked{
            sum = a+b;
        }
        if( sum < a || sum < b) {
            overflows++;
            result = true;
        }
        return result;
    }
}
