
// SPDX-License-Identifier: Apache-2.0.
//---------------------------------------------------------------------------//
// Copyright (c) 2023 Generated by ZKLLVM-transpiler
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
import "../../interfaces/modular_commitment.sol";
// Move away unused structures from types.sol
import "../../types.sol";
import "../../basic_marshalling.sol";
import "../../containers/merkle_verifier.sol";
import "../../algebra/polynomial.sol";
import "hardhat/console.sol";

library modular_commitment_scheme_circuit6 {
    uint256 constant modulus = 28948022309329048855892746252171976963363056481941560715954676764349967630337;
    uint64 constant batches_num = 5;
    uint256 constant r = 2;
    uint256 constant lambda = 40;
    uint256 constant D0_size = 128;
    uint256 constant max_degree = 7;
    uint256 constant D0_omega = 7356716530956153652314774863381845254278968224778478050456563329565810467774;
    uint256 constant unique_points = 6;
    uint256 constant permutation_point = 3;
    uint256 constant quotient_point = 1;
    uint256 constant lookup_point = 5;
    bytes constant   points_ids = hex"020202020202020204040404040402020001";
    uint256 constant omega = 199455130043951077247265858823823987229570523056509026484192158816218200659;
    uint256 constant _etha = 6008563573403509417202325099986068091355178794944813546249543044368318679621;

    struct commitment_state{
        bytes   leaf_data;
        uint256 roots_offset;
        uint256 initial_data_offset;
        uint256 initial_proof_offset;
        uint256 round_proof_offset;
        uint256 round_data_offset;
        uint256[r]  alphas;
        uint64[batches_num] batch_sizes;
        uint64 poly_num;
        uint256 points_num;
        uint256 theta;
        uint256 x_index;
        uint256 x;
        uint256 max_batch;
        uint256 domain_size;
        uint256[] final_polynomial;
        uint256 leaf_length;
        uint256[][unique_points] denominators;
        uint256[unique_points] factors;
        uint256[][unique_points] combined_U;
        uint256[][unique_points] unique_eval_points;
        uint256[2] y;
        uint256 j;
        uint256 offset;
    }

    function calculate_2points_interpolation(uint256[] memory xi, uint256[2] memory z, uint256 modulus)
    internal pure returns(uint256[2] memory U){
//        require( xi.length == 2 );
        U[0] = addmod(mulmod(z[0], xi[1], modulus),modulus - mulmod(z[1], xi[0], modulus), modulus);
        U[1] = addmod(z[1], modulus - z[0], modulus);
    }

//  coeffs for zs on each degree can be precomputed if necessary
    function calculate_3points_interpolation(uint256[] memory xi, uint256[3] memory z, uint256 modulus)
    internal pure returns(uint256[3] memory U){
//        require( xi.length == 3 );
        z[0] = mulmod(z[0], addmod(xi[1], modulus - xi[2], modulus), modulus);
        z[1] = mulmod(z[1], addmod(xi[2], modulus - xi[0], modulus), modulus);
        z[2] = mulmod(z[2], addmod(xi[0], modulus - xi[1], modulus), modulus);

        U[0] = mulmod(z[0], mulmod(xi[1], xi[2], modulus), modulus);
        U[0] = addmod(U[0], mulmod(z[1], mulmod(xi[0], xi[2], modulus), modulus), modulus);
        U[0] = addmod(U[0], mulmod(z[2], mulmod(xi[0], xi[1], modulus), modulus), modulus);

        U[1] = modulus - mulmod(z[0], addmod(xi[1], xi[2], modulus), modulus);
        U[1] = addmod(U[1], modulus - mulmod(z[1], addmod(xi[0], xi[2], modulus), modulus), modulus);
        U[1] = addmod(U[1], modulus - mulmod(z[2], addmod(xi[0], xi[1], modulus), modulus), modulus);

        U[2] = addmod(z[0], addmod(z[1], z[2], modulus), modulus);
    }

    function prepare_eval_points(uint256[][unique_points] memory result, uint256 xi) internal view {
        uint256 inversed_omega = field.inverse_static(omega, modulus);
		 result[0] = new uint256[](2);
		 result[0][0] = mulmod(xi, inversed_omega, modulus);
		 result[0][1] = xi;
		 result[1] = new uint256[](1);
		 result[1][0] = xi;
		 result[2] = new uint256[](2);
		 result[2][0] = xi;
		 result[2][1] = _etha;
		 result[3] = new uint256[](2);
		 result[3][0] = xi;
		 result[3][1] = mulmod(xi, omega, modulus);
		 result[4] = new uint256[](3);
		 result[4][0] = xi;
		 result[4][1] = mulmod(xi, omega, modulus);
		 result[4][2] = _etha;
		 result[5] = new uint256[](3);
		 result[5][0] = xi;
		 result[5][1] = mulmod(xi, omega, modulus);
		 result[5][2] = mulmod(xi, field.pow_small(omega, 6, modulus), modulus);

    }

    function prepare_U_V(bytes calldata blob, commitment_state memory state, uint256 xi) internal view returns(bool result){        
        result = true;
        uint64 ind = 0;
        prepare_eval_points(state.unique_eval_points, xi);
                // Prepare denominators
        for( ind = 0; ind < state.unique_eval_points.length;){
            state.denominators[ind] = new uint256[](state.unique_eval_points[ind].length + 1);
            if( state.unique_eval_points[ind].length == 1 ){
                state.factors[ind] = 1;
                state.denominators[ind][0] = modulus - state.unique_eval_points[ind][0];
                state.denominators[ind][1] = 1;
            } else 
            if( state.unique_eval_points[ind].length == 2 ){
                // xi1 - xi0
                state.factors[ind] = 
                    addmod(state.unique_eval_points[ind][1], modulus - state.unique_eval_points[ind][0], modulus);
                state.denominators[ind][2] = 1;

                state.denominators[ind][1] = 
                    modulus - addmod(state.unique_eval_points[ind][0], state.unique_eval_points[ind][1], modulus);

                state.denominators[ind][0] = 
                    mulmod(state.unique_eval_points[ind][0], state.unique_eval_points[ind][1], modulus);
                state.denominators[ind][0] = mulmod(state.denominators[ind][0], state.factors[ind], modulus);
                state.denominators[ind][1] = mulmod(state.denominators[ind][1], state.factors[ind], modulus);
                state.denominators[ind][2] = mulmod(state.denominators[ind][2], state.factors[ind], modulus);
            } else 
            if( state.unique_eval_points[ind].length == 3 ){
                state.factors[ind] = modulus - 
                    mulmod(
                        mulmod(
                            addmod(state.unique_eval_points[ind][0], modulus - state.unique_eval_points[ind][1], modulus),
                            addmod(state.unique_eval_points[ind][1], modulus - state.unique_eval_points[ind][2], modulus),
                            modulus
                        ),
                        addmod(state.unique_eval_points[ind][2], modulus - state.unique_eval_points[ind][0], modulus),
                        modulus
                    );
                state.denominators[ind][3] = 1;
                state.denominators[ind][2] =
                    modulus - addmod(
                        state.unique_eval_points[ind][0], 
                        addmod(state.unique_eval_points[ind][1],state.unique_eval_points[ind][2], modulus), 
                        modulus
                    );
                state.denominators[ind][1] = 
                    addmod(
                        mulmod(state.unique_eval_points[ind][0], state.unique_eval_points[ind][1], modulus),
                        addmod(
                            mulmod(state.unique_eval_points[ind][0], state.unique_eval_points[ind][2], modulus),
                            mulmod(state.unique_eval_points[ind][1], state.unique_eval_points[ind][2], modulus),
                            modulus
                        ), 
                        modulus
                    );
                state.denominators[ind][0] = 
                    modulus - mulmod(
                        state.unique_eval_points[ind][0], 
                        mulmod(state.unique_eval_points[ind][1],state.unique_eval_points[ind][2], modulus), 
                        modulus
                    );
                state.denominators[ind][0] = mulmod(state.denominators[ind][0], state.factors[ind], modulus);
                state.denominators[ind][1] = mulmod(state.denominators[ind][1], state.factors[ind], modulus);
                state.denominators[ind][2] = mulmod(state.denominators[ind][2], state.factors[ind], modulus);
                state.denominators[ind][3] = mulmod(state.denominators[ind][3], state.factors[ind], modulus);
            } else {
                console.log("UNPROCESSED number of evaluation points");
                return false;
            }
            unchecked{ind++;}
        }

        // Prepare combined U
        for( uint256 ind = 0; ind < unique_points;){
            uint256[] memory point = state.unique_eval_points[ind];
            state.combined_U[ind] = new uint256[](state.unique_eval_points[ind].length);
            uint64 cur = 0;
            uint256 offset = 0x8;
            for( uint256 k = 0; k < batches_num;){
                for( uint256 i = 0; i < state.batch_sizes[k];){   
                    uint256 cur_point = 0;
                    if(cur < points_ids.length ) cur_point = uint8(points_ids[cur]);
                    else if(k == 2) cur_point = permutation_point;
                    else if(k == 3) cur_point = quotient_point;
                    else if(k == 4) cur_point = lookup_point;
                    else console.log("Wrong index");

                    polynomial.multiply_poly_on_coeff(
                        state.combined_U[ind], 
                        state.theta, 
                        modulus
                    );
                    if( cur_point == ind ){
                        if( point.length == 1 ){
                            state.combined_U[ind][0] = addmod(
                                state.combined_U[ind][0],
                                basic_marshalling.get_uint256_be(blob, offset), 
                                modulus
                            );
                        }  else 
                        if( point.length == 2 ){
                            uint256[2] memory tmp;
                            tmp[0] = basic_marshalling.get_uint256_be(blob, offset);
                            tmp[1] = basic_marshalling.get_uint256_be(blob, offset + 0x20);
                            tmp = calculate_2points_interpolation(
                                point, tmp, modulus
                            );
                            state.combined_U[ind][0] = addmod(state.combined_U[ind][0], tmp[0], modulus);
                            state.combined_U[ind][1] = addmod(state.combined_U[ind][1], tmp[1], modulus);
                        } else 
                        if( point.length == 3){
                            uint256[3] memory tmp;
                            tmp[0] = basic_marshalling.get_uint256_be(blob, offset);
                            tmp[1] = basic_marshalling.get_uint256_be(blob, offset + 0x20);
                            tmp[2] = basic_marshalling.get_uint256_be(blob, offset + 0x40);
                            tmp = calculate_3points_interpolation(
                                point, tmp, modulus
                            );
                            state.combined_U[ind][0] = addmod(state.combined_U[ind][0], tmp[0], modulus);
                            state.combined_U[ind][1] = addmod(state.combined_U[ind][1], tmp[1], modulus);
                            state.combined_U[ind][2] = addmod(state.combined_U[ind][2], tmp[2], modulus);
                        } else {
                            return false;
                        }
                    } 
                    offset += state.unique_eval_points[cur_point].length * 0x20;
                    unchecked{i++;cur++;}
                }
                unchecked{k++;}
            }
            unchecked{ind++;}
        }
    }

    function compute_combined_Q(bytes calldata blob,commitment_state memory state) internal view returns(uint256[2] memory y){
        uint256[2][unique_points] memory values;
        {
            uint256 offset = state.initial_data_offset - state.poly_num * 0x40; // Save initial data offset for future use;
            uint256 cur = 0;
            for(uint256 b = 0; b < batches_num;){
                for(uint256 j = 0; j < state.batch_sizes[b];){
                    uint256 cur_point = 0;
                    if(cur < points_ids.length ) cur_point = uint8(points_ids[cur]);
                    else if(b == 2) cur_point = permutation_point;
                    else if(b == 3) cur_point = quotient_point;
                    else if(b == 4) cur_point = lookup_point;
                    else console.log("Wrong index");

                    for(uint256 k = 0; k < unique_points; ){
                        values[k][0] = mulmod(values[k][0], state.theta, modulus);
                        values[k][1] = mulmod(values[k][1], state.theta, modulus);
                        unchecked{k++;}
                    }

                    values[cur_point][0] = addmod(values[cur_point][0], basic_marshalling.get_uint256_be(blob, offset), modulus);
                    values[cur_point][1] = addmod(values[cur_point][1], basic_marshalling.get_uint256_be(blob, offset + 0x20), modulus);
                    unchecked{offset += 0x40;j++; cur++;}
                }
                unchecked{b++;}
            }
        }
        for(uint256 p = 0; p < unique_points; ){
            uint256[2] memory tmp = values[p];
            tmp[0] = mulmod(tmp[0], state.factors[p], modulus);
            tmp[1] = mulmod(tmp[1], state.factors[p], modulus);
            uint256 s = state.x;
            tmp[0] = addmod(tmp[0], modulus - polynomial.evaluate(state.combined_U[p], s , modulus), modulus);
            tmp[1] = addmod(tmp[1], modulus - polynomial.evaluate(state.combined_U[p], modulus - s, modulus), modulus);
            tmp[0] = mulmod(tmp[0], field.inverse_static(polynomial.evaluate(state.denominators[p], s, modulus), modulus), modulus);
            tmp[1] = mulmod(tmp[1], field.inverse_static(polynomial.evaluate(state.denominators[p], modulus - s, modulus), modulus), modulus);
            y[0] = addmod(y[0], tmp[0], modulus);
            y[1] = addmod(y[1], tmp[1], modulus);
            unchecked{p++;}
        }
    }

    function initialize(
        bytes32 tr_state_before
    ) internal returns(bytes32 tr_state_after){
        types.transcript_data memory tr_state;
        tr_state.current_challenge = tr_state_before;
        uint256 etha = transcript.get_field_challenge(tr_state, modulus);
        require(etha == _etha, "Wrong etha");
        tr_state_after = tr_state.current_challenge;
    }

    function copy_memory_pair_and_check(bytes calldata blob, uint256 proof_offset, bytes memory leaf, uint256[2] memory pair) 
    internal pure returns(bool b){
        uint256 c = pair[0];
        uint256 d = pair[1];
        assembly{
            mstore(
                add(leaf, 0x20), 
                c
            )
            mstore(
                add(leaf, 0x40), 
                d
            )
        }
        if( !merkle_verifier.parse_verify_merkle_proof_bytes_be(blob, proof_offset, leaf, 0x40 )){
            return false;
        } else {
            return true;
        }
    }

    function copy_reverted_memory_pair_and_check(bytes calldata blob, uint256 proof_offset, bytes memory leaf, uint256[2] memory pair) 
    internal pure returns(bool b){
        uint256 c = pair[0];
        uint256 d = pair[1];
        assembly{
            mstore(
                add(leaf, 0x20), 
                d
            )
            mstore(
                add(leaf, 0x40), 
                c
            )
        }
        if( !merkle_verifier.parse_verify_merkle_proof_bytes_be(blob, proof_offset, leaf, 0x40 )){
            return false;
        } else {
            return true;
        }
    }

    function copy_pairs_and_check(bytes calldata blob, uint256 offset, bytes memory leaf, uint256 size, uint256 proof_offset) 
    internal pure returns(bool b){
        uint256 offset2 = 0x20;
        for(uint256 k = 0; k < size;){
            assembly{
                mstore(
                    add(leaf, offset2), 
                    calldataload(add(blob.offset, offset))
                )
                mstore(
                    add(leaf, add(offset2, 0x20)), 
                    calldataload(add(blob.offset, add(offset, 0x20)))
                )
            }
            unchecked{
                k++; offset2 += 0x40; offset += 0x40;
            }
        }
        if( !merkle_verifier.parse_verify_merkle_proof_bytes_be(blob, proof_offset, leaf, offset2 - 0x20 )){
            return false;
        } else {
            return true;
        }
    }

    function copy_reverted_pairs_and_check(bytes calldata blob, uint256 offset, bytes memory leaf, uint256 size, uint256 proof_offset) 
    internal pure returns(bool){
        uint256 offset2 = 0x20;
        for(uint256 k = 0; k < size;){
            assembly{
                mstore(
                    add(leaf, offset2), 
                    calldataload(add(blob.offset, add(offset, 0x20)))
                )
                mstore(
                    add(leaf, add(offset2, 0x20)), 
                    calldataload(add(blob.offset, offset))
                )
            }
            unchecked{
                k++; offset2 += 0x40; offset += 0x40;
            }
        }
        if( !merkle_verifier.parse_verify_merkle_proof_bytes_be(blob, proof_offset, leaf, offset2 - 0x20 )){
            return false;
        } else {
            return true;
        }
    }

    function colinear_check(uint256 x, uint256[2] memory y, uint256 alpha, uint256 colinear_value) internal pure returns(bool){
        uint256 tmp;
        tmp = addmod(y[0], y[1], modulus);
        tmp = mulmod(tmp, x, modulus);
        tmp = addmod(
            tmp, 
            mulmod(
                alpha,
                addmod(y[0], modulus-y[1], modulus), 
                modulus
            ),
            modulus
        );
        uint256 tmp1 = mulmod(colinear_value , 2, modulus);
        tmp1 = mulmod(tmp1 , x, modulus);
        if( tmp !=  tmp1 ){
            console.log("Colinear check failed");
            return false;
        }
        return true;
    }

    function verify_eval(
        bytes calldata blob,
        uint256[5] memory commitments,                   
        uint256 challenge,
        bytes32 transcript_state
    ) internal view returns (bool){
        types.transcript_data memory tr_state;
        tr_state.current_challenge = transcript_state;
        commitment_state memory state;
        {
            uint256 offset;

            if (challenge!= transcript.get_field_challenge(tr_state, modulus)) return false;

            for(uint8 i = 0; i < batches_num;){
                transcript.update_transcript_b32(tr_state, bytes32(commitments[i]));
                unchecked{i++;}
            }
            state.theta = transcript.get_field_challenge(tr_state, modulus);

            state.points_num = basic_marshalling.get_length(blob, 0x0);
            unchecked{
                offset = 0x8 + state.points_num*0x20 + 0x8;
            }
            for(uint8 i = 0; i < batches_num;){
                state.batch_sizes[i] = uint64(uint8(blob[offset + 0x1]));
                if( state.batch_sizes[i] > state.max_batch ) state.max_batch = state.batch_sizes[i];
                state.poly_num += state.batch_sizes[i];
                unchecked { i++; offset +=2;}
            }
            unchecked{
                offset += 0x8;
                offset += state.poly_num;
                state.roots_offset = offset + 0x8;
                offset += 0x8;
            }
            for( uint8 i = 0; i < r;){
                transcript.update_transcript_b32(tr_state, bytes32(basic_marshalling.get_uint256_be(blob, offset + 0x8)));
                state.alphas[i] = transcript.get_field_challenge(tr_state, modulus);
                unchecked{i++; offset +=40; }
            }

            
        bytes calldata proof_of_work = blob[blob.length - 4:];
        transcript.update_transcript(tr_state, proof_of_work);
        uint256 p_o_w = transcript.get_integral_challenge_be(tr_state, 4);
        if (p_o_w & 0xffff0000 != 0) return false;

                        
            unchecked{
                offset += 0x8 + r;
                state.initial_data_offset = offset + 0x8;
                offset += 0x8 + 0x20*basic_marshalling.get_length(blob, offset);
            }

            unchecked{
                state.round_data_offset = offset + 0x8;
                offset += 0x8 + 0x20*basic_marshalling.get_length(blob, offset);
                offset += 0x8;
            }
            state.initial_proof_offset = offset; 
            for(uint8 i = 0; i < lambda;){
                for(uint j = 0; j < batches_num;){
                    if(basic_marshalling.get_uint256_be(blob, offset + 0x10) != commitments[j] ) return false;
                    offset = merkle_verifier.skip_merkle_proof_be(blob, offset);
                    unchecked{j++;}
                }
                unchecked{i++;}
            }
            offset += 0x8;
            state.round_proof_offset = offset;

            for(uint256 i = 0; i < lambda;){
                for(uint256 j = 0; j < r;){
                    if(basic_marshalling.get_uint256_be(blob, offset + 0x10) != basic_marshalling.get_uint256_be(blob, state.roots_offset + j * 40 + 0x8) ) return false;                
                    offset = merkle_verifier.skip_merkle_proof_be(blob, offset);
                    unchecked{j++;}
                }
                unchecked{i++;}
            }

            state.final_polynomial = new uint256[](basic_marshalling.get_length(blob, offset));
            unchecked{offset += 0x8;}
            for (uint256 i = 0; i < state.final_polynomial.length;) {
                state.final_polynomial[i] = basic_marshalling.get_uint256_be(blob, offset);
                unchecked{ i++; offset+=0x20;}
            }
        }
        if( state.final_polynomial.length > (( 1 << (field.log2(max_degree + 1) - r + 1) ) ) ){
            console.log("Wrong final poly degree");
            return false;
        }

        if( !prepare_U_V(blob, state, challenge) ) return false;

        state.leaf_data = new bytes(state.max_batch * 0x40 + 0x40);
        for(uint256 i = 0; i < lambda;){
            // Initial proofs
            state.x_index = uint256(transcript.get_integral_challenge_be(tr_state, 8))  % D0_size;
            state.x = field.pow_small(D0_omega, state.x_index, modulus);
            state.domain_size = D0_size >> 1;
            for(uint256 j = 0; j < batches_num;){
                if( state.x_index < state.domain_size ){
                    if(!copy_pairs_and_check(blob, state.initial_data_offset, state.leaf_data, state.batch_sizes[j], state.initial_proof_offset)){
                        console.log("Error in initial mekle proof");
                        return false;
                    }
                } else {
                    if(!copy_reverted_pairs_and_check(blob, state.initial_data_offset, state.leaf_data, state.batch_sizes[j], state.initial_proof_offset)){
                        console.log("Error in initial mekle proof");
                        return false;
                    }
                }
                state.leaf_length = state.batch_sizes[j] * 0x40;
                state.initial_data_offset += state.batch_sizes[j] * 0x40;
                state.initial_proof_offset = merkle_verifier.skip_merkle_proof_be(blob, state.initial_proof_offset);
                unchecked{j++;}
            }
            {
                state.y = compute_combined_Q(blob, state);
                if( state.x_index < state.domain_size ){
                    if( !copy_memory_pair_and_check(blob, state.round_proof_offset, state.leaf_data, state.y) ){
                        console.log("Not validated!");
                        return false;
                    }
                }else{
                    if( !copy_reverted_memory_pair_and_check(blob, state.round_proof_offset, state.leaf_data, state.y) ){
                        console.log("Not validated!");
                        return false;
                    }
                }
            }
            if( !colinear_check(state.x, state.y, state.alphas[0], basic_marshalling.get_uint256_be(blob,state.round_data_offset)) ){
                console.log("Colinear check failed");
                return false;
            }

            state.round_proof_offset = merkle_verifier.skip_merkle_proof_be(blob, state.round_proof_offset);
            for(state.j = 1; state.j < r;){
                state.x_index %= state.domain_size; 
                state.x = mulmod(state.x, state.x, modulus);
                state.domain_size >>= 1;                   
                if( state.x_index < state.domain_size ){
                    if(!copy_pairs_and_check(blob, state.round_data_offset, state.leaf_data, 1, state.round_proof_offset)) {
                        console.log("Error in round mekle proof");
                        return false;
                    }
                } else {
                    if(!copy_reverted_pairs_and_check(blob, state.round_data_offset, state.leaf_data, 1, state.round_proof_offset)) {
                        console.log("Error in round mekle proof");
                        return false;
                    }
                }
                state.y[0] = basic_marshalling.get_uint256_be(blob, state.round_data_offset);
                state.y[1] = basic_marshalling.get_uint256_be(blob, state.round_data_offset + 0x20);
                if( !colinear_check(state.x, state.y, state.alphas[state.j], basic_marshalling.get_uint256_be(blob,state.round_data_offset + 0x40)) ){
                    console.log("Round colinear check failed");
                    return false;
                }
                unchecked{state.j++; state.round_data_offset += 0x40;}
                state.round_proof_offset = merkle_verifier.skip_merkle_proof_be(blob, state.round_proof_offset);
            }

            state.x = mulmod(state.x, state.x, modulus);
            if(polynomial.evaluate(state.final_polynomial, state.x, modulus) != basic_marshalling.get_uint256_be(blob, state.round_data_offset)) {
                console.log("Wrong final poly check");
                return false;
            }
            if(polynomial.evaluate(state.final_polynomial, modulus - state.x, modulus) != basic_marshalling.get_uint256_be(blob, state.round_data_offset + 0x20)){
                console.log("Wrong final poly check");
                return false;
            }
            state.round_data_offset += 0x40;
            
            unchecked{i++;}
        }
        return true;
    }
}        
    