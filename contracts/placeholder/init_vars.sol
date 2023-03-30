// SPDX-License-Identifier: Apache-2.0.
//---------------------------------------------------------------------------//
// Copyright (c) 2022 Mikhail Komarov <nemo@nil.foundation>
// Copyright (c) 2022 Ilias Khairullin <ilias@nil.foundation>
// Copyright (c) 2022 Aleksei Moskvin <alalmoskvin@nil.foundation>
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

import "../types.sol";
import "../cryptography/transcript.sol";
import "./proof_map_parser.sol";
import "../logging.sol";

library init_vars {
    struct vars_t {
        types.fri_params_type fri_params;
        types.placeholder_proof_map proof_map;
        uint256 proof_size;
        types.transcript_data tr_state;
        types.placeholder_common_data common_data;
        types.arithmetization_params arithmetization_params;
    }

    function init(bytes calldata blob, uint256[] calldata init_params,
                       int256[][] calldata columns_rotations, vars_t memory vars) internal pure {

        (vars.proof_map, vars.proof_size) = placeholder_proof_map_parser.parse_be(blob, 0);
        require(vars.proof_size == blob.length, "Proof is not correct!");
        transcript.init_transcript(vars.tr_state, hex"");

        uint256 idx;
        uint256 max_coset;
        uint256 i;

        vars.fri_params.modulus = init_params[idx++];
        vars.fri_params.r = init_params[idx++];
        vars.fri_params.max_degree = init_params[idx++];
        vars.fri_params.lambda = init_params[idx++];

        vars.common_data.rows_amount = init_params[idx++];
        vars.common_data.omega = init_params[idx++];
        vars.common_data.columns_rotations = columns_rotations;

        vars.fri_params.D_omegas = new uint256[](init_params[idx++]);
        for (i = 0; i < vars.fri_params.D_omegas.length;) {
            vars.fri_params.D_omegas[i] = init_params[idx];
        unchecked{ i++; idx++;}
        }

        vars.fri_params.max_step = 0;
        vars.fri_params.step_list = new uint256[](init_params[idx++]);
        for (i = 0; i < vars.fri_params.step_list.length;) {
            vars.fri_params.step_list[i] = init_params[idx];
            if(vars.fri_params.step_list[i] > vars.fri_params.max_step)
                vars.fri_params.max_step = vars.fri_params.step_list[i];
            unchecked{ i++; idx++;}
        }

        unchecked{
            idx++; // arithmetization_params length;
            vars.arithmetization_params.witness_columns = init_params[idx++];
            vars.arithmetization_params.public_input_columns = init_params[idx++];
            vars.arithmetization_params.constant_columns = init_params[idx++];
            vars.arithmetization_params.selector_columns = init_params[idx++];
            vars.arithmetization_params.permutation_columns = vars.arithmetization_params.witness_columns 
                + vars.arithmetization_params.public_input_columns 
                + vars.arithmetization_params.constant_columns;
        }

        unchecked{ max_coset = 1 << (vars.fri_params.max_step - 1);}

        vars.fri_params.max_coset = max_coset;
        vars.fri_params.s_indices = new uint256[](max_coset);
        vars.fri_params.correct_order_idx = new uint256[](max_coset);
        vars.fri_params.tmp_arr = new uint256[](max_coset << 1);
        vars.fri_params.s = new uint256[](max_coset);
        vars.fri_params.batches_num = 4;
        vars.fri_params.batches_sizes = new uint256[](vars.fri_params.batches_num);
        vars.fri_params.batches_sizes[0] = vars.arithmetization_params.witness_columns + vars.arithmetization_params.public_input_columns;        
        vars.fri_params.batches_sizes[1] = 1;
            // TODO We don't know T_polynomials size. 
            // We'll extract it from proof in parse_be function 
            //      and verify fri_proof.query_proof[i].initial_proof[2].values have 
        vars.fri_params.batches_sizes[2] = 0; 
        vars.fri_params.batches_sizes[3] = vars.arithmetization_params.permutation_columns 
            + vars.arithmetization_params.permutation_columns
            + vars.arithmetization_params.constant_columns 
            + vars.arithmetization_params.selector_columns + 2;

        batched_lpc_verifier.parse_proof_be(vars.fri_params, blob, vars.proof_map.eval_proof_combined_value_offset);
    }
}
