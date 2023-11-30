
// SPDX-License-Identifier: Apache-2.0.
//---------------------------------------------------------------------------//
// Copyright (c) Generated by zkllvm-transpiler
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//---------------------------------------------------------------------------//
pragma solidity >=0.8.4;

import "../../cryptography/transcript.sol";
// Move away unused structures from types.sol
import "../../types.sol";
import "../../basic_marshalling.sol";
import "../../interfaces/modular_verifier.sol";
import "./commitment.sol";
import "./gate_argument.sol";
import "./lookup_argument.sol";
import "./permutation_argument.sol";
import "hardhat/console.sol";
import "../../algebra/field.sol";

contract modular_verifier_circuit1 is IModularVerifier{
    uint256 constant modulus = 28948022309329048855892746252171976963363056481941560715954676764349967630337;
    bool    constant use_lookups = false;
    bytes32 constant vk1 = bytes32(0xd01dad89947ad38adc7e68ae52f8fb2a1c430fd535887b78fd3ac57a2cbc5f09);
    bytes32 constant vk2 = bytes32(0xf347e1a5c5bec69f49b12f482b4eb2ba2687d9270cb998f29ba4ead18a440703);
    bytes32 transcript_state;
    address _gate_argument_address;
    address _permutation_argument_address;
    address _lookup_argument_address;
    address _commitment_contract_address;
    uint64 constant sorted_columns = 0;
    uint64   constant f_parts = 8;   // Individually on parts
    uint64  constant z_offset = 0xa1;
    uint64  constant table_offset = z_offset + 0x80 * 4 + 0xc0;
    uint64  constant table_end_offset = table_offset + 256;
    uint64  constant quotient_offset = 320;
    uint64  constant rows_amount = 16;
    uint256 constant omega = 14450201850503471296781915119640920297985789873634237091629829669980153907901;
    uint256 constant special_selectors_offset = z_offset + 4 * 0x80;

    function initialize(
//        address permutation_argument_address,
        address lookup_argument_address,
        address gate_argument_address,
        address commitment_contract_address
    ) public{
        types.transcript_data memory tr_state;
        transcript.init_transcript(tr_state, hex"");
        transcript.update_transcript_b32(tr_state, vk1);
        transcript.update_transcript_b32(tr_state, vk2);

//      _permutation_argument_address = permutation_argument_address;
        _lookup_argument_address = lookup_argument_address;
        _gate_argument_address = gate_argument_address;
        _commitment_contract_address = commitment_contract_address;

//        ICommitmentScheme commitment_scheme = ICommitmentScheme(commitment_contract_address);
//        tr_state.current_challenge = commitment_scheme.initialize(tr_state.current_challenge);
        tr_state.current_challenge = modular_commitment_scheme_circuit1.initialize(tr_state.current_challenge);
        transcript_state = tr_state.current_challenge;
    }

    struct verifier_state{
        uint256 xi;
        uint256 Z_at_xi;
        uint256 l0;
        uint256[f_parts] F;
        bool b;
    }

    // Public input columns
    function public_input_direct(bytes calldata blob, uint256[] calldata public_input, verifier_state memory state) internal view
    returns (bool check){
        check = true;

        uint256 result = 0;
        uint256 Omega = 1;

        for(uint256 i = 0; i < public_input.length;){
            if( public_input[i] != 0){
                uint256 L = mulmod(
                    Omega,
                    field.inverse_static(
                        addmod(state.xi, modulus - Omega, modulus),
                        modulus
                    ),
                    modulus
                );

                result = addmod(
                    result,
                    mulmod(
                        public_input[i], L, modulus
                    ),
                    modulus
                );
            }
            Omega = mulmod(Omega, omega, modulus);
            unchecked{i++;}
        }
        result = mulmod(
            result, addmod(field.pow_small(state.xi, rows_amount, modulus), modulus - 1, modulus), modulus
        );
        result = mulmod(result, field.inverse_static(rows_amount, modulus), modulus);

        // Input is proof_map.eval_proof_combined_value_offset
        if( result != basic_marshalling.get_uint256_be(
            blob, 224
        )) check = false;
    }

    function verify(
        bytes calldata blob,
        uint256[] calldata public_input
    ) public returns (bool result) {
        verifier_state memory state;
        state.b = true;
        state.xi = basic_marshalling.get_uint256_be(blob, 0x79);
        state.Z_at_xi = addmod(field.pow_small(state.xi, rows_amount, modulus), modulus-1, modulus);
        state.l0 = mulmod(
            state.Z_at_xi,
            field.inverse_static(mulmod(addmod(state.xi, modulus - 1, modulus), rows_amount, modulus), modulus),
            modulus
        );

        //0. Direct public input check
        if(public_input.length > 0) {
            if (!public_input_direct(blob[865:865+320], public_input, state)) {
                emit WrongPublicInput();
                state.b = false;
            }
        }

        //1. Init transcript
        types.transcript_data memory tr_state;
        tr_state.current_challenge = transcript_state;

        {
            //2. Push variable_values commitment to transcript
            transcript.update_transcript_b32_by_offset_calldata(tr_state, blob, 0x9);

            //3. Permutation argument
            uint256[3] memory permutation_argument = modular_permutation_argument_circuit1.verify(
                blob[0xa1:865+320],
                transcript.get_field_challenge(tr_state, modulus),
                transcript.get_field_challenge(tr_state, modulus),
                state.l0
            );
            state.F[0] = permutation_argument[0];
            state.F[1] = permutation_argument[1];
            state.F[2] = permutation_argument[2];
        }

        //4. Lookup library call
                //No lookups

        //5. Push permutation batch to transcript
        transcript.update_transcript_b32_by_offset_calldata(tr_state, blob, 0x31);

        {
            //6. Gate argument
            IGateArgument modular_gate_argument = IGateArgument(_gate_argument_address);
            state.F[7] = modular_gate_argument.verify(blob[table_offset:table_end_offset], transcript.get_field_challenge(tr_state, modulus));
            state.F[7] = mulmod(
                state.F[7],
                addmod(
                    1,
                    modulus - addmod(
                        basic_marshalling.get_uint256_be(blob, special_selectors_offset),
                        basic_marshalling.get_uint256_be(blob, special_selectors_offset + 0x60),
                        modulus
                    ),
                    modulus
                ),
                modulus
            );
        }

        // No public input gate

        uint256 F_consolidated;
        {
            //7. Push quotient to transcript
            for( uint8 i = 0; i < f_parts;){
                F_consolidated = addmod(F_consolidated, mulmod(state.F[i],transcript.get_field_challenge(tr_state, modulus), modulus), modulus);
                unchecked{i++;}
            }
            transcript.update_transcript_b32_by_offset_calldata(tr_state, blob, 0x59);
        }

        //8. Commitment scheme verify_eval
        {
//            ICommitmentScheme commitment_scheme = ICommitmentScheme(_commitment_contract_address);
            uint256[5] memory commitments;
            commitments[0] = uint256(vk2);
            for(uint16 i = 1; i < 4;){
                commitments[i] = basic_marshalling.get_uint256_be(blob, 0x9 + (i-1)*(0x28));
                unchecked{i++;}
            }
            if(!modular_commitment_scheme_circuit1.verify_eval(
                blob[z_offset - 0x8:], commitments, state.xi, tr_state.current_challenge
            )) {
                emit WrongCommitment();
                state.b = false;
            }
        }

        //9. Final check
        {
            uint256 T_consolidated;
            uint256 factor = 1;
            for(uint64 i = 0; i < uint64(uint8(blob[z_offset + basic_marshalling.get_length(blob, z_offset - 0x8) *0x20 + 0xf]));){
                T_consolidated = addmod(
                    T_consolidated,
                    mulmod(basic_marshalling.get_uint256_be(blob, table_offset + quotient_offset + i *0x20), factor, modulus),
                    modulus
                );
                factor = mulmod(factor, state.Z_at_xi + 1, modulus);
                unchecked{i++;}
            }
            if( F_consolidated != mulmod(T_consolidated, state.Z_at_xi, modulus) ) {
                emit ConstraintSystemNotSatisfied();
                state.b = false;
            }
        }

        emit VerificationResult(state.b);

        result = state.b;
    }
}
        