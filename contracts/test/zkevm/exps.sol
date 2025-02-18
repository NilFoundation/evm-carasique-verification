pragma solidity >=0.8.4;

contract zkEVMExp {
    uint256 s;

    function test_addition(uint256 x,uint256[] calldata degrees) public  {
        uint256 r;

        for( uint8 i = 0; i < degrees.length; i++){
            uint256 d = degrees[i];
            assembly {
                r :=  exp(x, d)
            }
            s += r;
        }
    }
}
