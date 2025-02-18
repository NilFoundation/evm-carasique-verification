pragma solidity >=0.8.4;

contract zkEVMKeccak {
    bytes32 private h;

   function test_addition(string memory input) public returns (bytes32 result)  {
        result = h;
        h = keccak256(bytes(input));
    }
}
