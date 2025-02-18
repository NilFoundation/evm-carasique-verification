pragma solidity >=0.8.4;

contract zkEVMCalldata {
    bytes32 h;
    event Result(bytes32 result);

   function keccak(bytes calldata input) external returns (bytes32 result)  {
        h = keccak256(input);
        emit Result(h);
        return h;
    }
}
