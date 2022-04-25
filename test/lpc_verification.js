const BN = require('bn.js');
const Verifier = artifacts.require("TestLpcVerifier");

contract("LPC proof verifier", accounts => {
    it("Case 1", async () => {
        const instance = await Verifier.deployed();

        var init_params = [];
        // 0) modulus
        // 1) r
        // 2) max_degree
        // 3) lambda
        init_params.push(new BN('21888242871839275222246405745257275088548364400416034343698204186575808495617', 10));
        init_params.push(3);
        init_params.push(15);
        init_params.push(3);

        var D_omegas = [];
        D_omegas.push(new BN('14940766826517323942636479241147756311199852622225275649687664389641784935947', 10));
        D_omegas.push(new BN('19540430494807482326159819597004422086093766032135589407132600596362845576832', 10));
        D_omegas.push(new BN('21888242871839275217838484774961031246007050428528088939761107053157389710902', 10));
        init_params.push(D_omegas.length);
        init_params = init_params.concat(D_omegas);

        var q = [];
        q.push(0);
        q.push(0);
        q.push(1);
        init_params.push(q.length);
        init_params = init_params.concat(q);

        var eval_points = [];
        eval_points.push(5);

        await instance.verify(
            "0x00000000000000200f044be55eca548bd7963cc4cfb11adb7a3b043c3f300c80eba0fdcc790035360000000000000001000000000000000000000000000000000000000000000000000000093c3fd5c4000000000000000300000000000000020d290fcf4d9880f934970cc30d943c97a4bca78fcfa4b59fc4f1dcfffbf5d90d1e89d09fb2cf975e1a93b0f9659074117acd0d049a9a5445cfb3857c4eafa8e100000000000000031096b25766820f869d1063a7e5ab016df4b8a0b8bfa9739d7e9d0705f3c892c000000000000000200f044be55eca548bd7963cc4cfb11adb7a3b043c3f300c80eba0fdcc7900353600000000000000020559201106e80dedf628230cd76d081bf8b42137cf2c9d6bb862f2fbcafd37a31278f47c764d688ed5ea487d2cd262139c57874aa1b1c5406e59ac5ae0597dba0000000000000001000000000000002089ffef10298d75442953c55f49ab403ac8aba5dfff26cae891f7da6da89eaf860000000000000003000000000000000100000000000000000000000000000020b4de53960b02deaa73a50c20b9bc745da743bdd4d08a40442ee757745df5455700000000000000010000000000000001000000000000002058acfb8892e18e2cfb2b3adcb50bfdcb56903f02ba4bc77b1c970c2a4949ac000000000000000001000000000000000100000000000000201e9cf6673864e7364b2619c142a4e113ea2495907f2dbd7c7a8a878589ead8890000000000000002000000000000000100000000000000200f044be55eca548bd7963cc4cfb11adb7a3b043c3f300c80eba0fdcc790035360000000000000004000000000000000100000000000000000000000000000020c6bb06cb7f92603de181bf256cd16846b93b752a170ff24824098b31aa008a7e0000000000000001000000000000000100000000000000206926cc6f9563da8fa6836177688ebfd52e3446c2e344d37949a222802a94eee70000000000000001000000000000000100000000000000205194a231165353123cbe4940bdbee3c1e726f8ed8ab5c6f5632d9353a2e8496d00000000000000010000000000000001000000000000002072697671d9683845d813b5b609a51e9e1c398b1ae9e2fecd065680155b0c6550000000000000000900000000000000200f044be55eca548bd7963cc4cfb11adb7a3b043c3f300c80eba0fdcc7900353600000000000000040000000000000001000000000000000000000000000000208a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b000000000000000100000000000000010000000000000020f30cd4b26a02d9e7718d60239f2256ee5ed5c5abfb059c08afa921df0b4cb30f0000000000000001000000000000000100000000000000204588fe9e87ee6f31163531890c67d678d24c4494821a1028f0f465520ff379e3000000000000000100000000000000000000000000000020ff58fff29fd22036c585d43655b2a2e930aaccffa097d22c96f45c4f101223c815129f22d89d9f177f2bef167f2bebff6f1f053ea8efce60b2729eb5d6b7fca7000000000000002089ffef10298d75442953c55f49ab403ac8aba5dfff26cae891f7da6da89eaf8600000000000000021096b25766820f869d1063a7e5ab016df4b8a0b8bfa9739d7e9d0705f3c892c00100e08088a0fc78dae25e6ca97531359118ec3c519327c73b112609da091a9c0000000000000001000000000000002092cad6b6dc11265ace0231dab76bbd850f777478ec08c9745f09bac21d8352f60000000000000002000000000000000100000000000000000000000000000020bfab4c0cb5f9a42b2b9b7b574606437cb1bc719135a8c82d73b53491df46df920000000000000001000000000000000100000000000000209b5aecf08a63bcecb281eafbd55d2efcc0931766837bb23546064c2732b2918a00000000000000020000000000000001000000000000002089ffef10298d75442953c55f49ab403ac8aba5dfff26cae891f7da6da89eaf860000000000000003000000000000000100000000000000000000000000000020b4de53960b02deaa73a50c20b9bc745da743bdd4d08a40442ee757745df5455700000000000000010000000000000001000000000000002058acfb8892e18e2cfb2b3adcb50bfdcb56903f02ba4bc77b1c970c2a4949ac000000000000000001000000000000000100000000000000201e9cf6673864e7364b2619c142a4e113ea2495907f2dbd7c7a8a878589ead8890000000000000005000000000000002089ffef10298d75442953c55f49ab403ac8aba5dfff26cae891f7da6da89eaf860000000000000003000000000000000100000000000000000000000000000020f3d4b9dc2076341e8ad25dffbd467bc8e06cb910966771fd65e0dc2cd64001220000000000000001000000000000000100000000000000208fa8a9e215a9b8a70dde00e8b2b9ee97eb237b0197775eb989a18545b2ea1dd90000000000000001000000000000000000000000000000200f3152c8e1a84e494393fe3413f931112a52cca6b24dea3e3de57518257cf3671f038da27bfa89c4d253a180298520e3522382d3aec3d1eb39204d179d46302d000000000000002092cad6b6dc11265ace0231dab76bbd850f777478ec08c9745f09bac21d8352f6000000000000000215129f22d89d9f177f2bef167f2bebff6f1f053ea8efce60b2729eb5d6b7fca706bc0a25ec560c40cd3552712f86ba3ab317177ef9e82af96f934bfc08b869f70000000000000000000000000000002040c65a5efd7f000070c85a5efd7f00000400000003000000d0c65a5efd7f0000000000000000000000000000000000020000000000000001000000000000002092cad6b6dc11265ace0231dab76bbd850f777478ec08c9745f09bac21d8352f60000000000000002000000000000000100000000000000000000000000000020bfab4c0cb5f9a42b2b9b7b574606437cb1bc719135a8c82d73b53491df46df920000000000000001000000000000000100000000000000209b5aecf08a63bcecb281eafbd55d2efcc0931766837bb23546064c2732b2918a0000000000000003000000000000002092cad6b6dc11265ace0231dab76bbd850f777478ec08c9745f09bac21d8352f600000000000000020000000000000001000000000000000000000000000000205b48230bf16d87c7cbb75d193410129bfce679cba9a3e3d93b4a95fd7164b226000000000000000100000000000000000000000000000020ef3317577acca48fc1dbaf4b3bdbba08a978d2d2dd88e0f10d311f12921d7ad400000000000000022ccdd9c90f73ed6044929653b96c27da9a85fb6434f2d995318b75e5d35020dc187657b05dc117c7fc140169d98793b2f35956ad726cb2a6c7e02dd841a52a7b00000000000000030f4ddea1978cefa4c7d74dcdf03b17fd391e24c4cd32fc32067f37f873fed96800000000000000200f044be55eca548bd7963cc4cfb11adb7a3b043c3f300c80eba0fdcc79003536000000000000000230644e72e131a0241a2988cc74389d96cde5cdbc97894b683d626c78eb81b1a700000000000000059e26bcea0d48bac65a4e1a8be2302529067f891b047e4e56000000000000000400000000000000204a6b3b11e6a1118081ef484f3aacc8c26e49c747a5e5d83793e50c55a5b26ca90000000000000003000000000000000100000000000000010000000000000020e5a2d1c4f990b34d8b080880ddfb17316ae7d88122d8b12c89d1eaf303db3c9400000000000000010000000000000001000000000000002030f4527353532d2e25bc497c2648ab07e0cf132fa613237fb3f7cc897c8df69b00000000000000010000000000000000000000000000002077d9a4c40566e6eda342b871662e80914a918d208a6eb9a72045676fc8dbc1120000000000000002000000000000000400000000000000200f044be55eca548bd7963cc4cfb11adb7a3b043c3f300c80eba0fdcc79003536000000000000000400000000000000010000000000000001000000000000002098933caf4e64b72e53030c35166a6b709eaa309f04280fcb49b138b78d2182330000000000000001000000000000000100000000000000201631f007544f0a857330bc2a777aedd26905c9e7def7f4b21e776b1d49794730000000000000000100000000000000000000000000000020ad5faa0795ad48ddd74cc5f8553d73df66d9a9719d03c2b9c7e9a75172457ebe00000000000000010000000000000001000000000000002072697671d9683845d813b5b609a51e9e1c398b1ae9e2fecd065680155b0c6550000000000000000c00000000000000200f044be55eca548bd7963cc4cfb11adb7a3b043c3f300c80eba0fdcc790035360000000000000004000000000000000100000000000000010000000000000020300b58bfb9b4d9f23116fbb21ffdf6b0b0d1b5ec21dc7a650e8f867c95ef1e3900000000000000010000000000000001000000000000002061c153133c33dda131c8f208caabd332d7a8882e4c4c3594b8ad55201fee7a2a0000000000000001000000000000000000000000000000203d7881e38b2267cb5d42b352ea67fb1adf179e0fe7797ba17f6f60be930eab97000000000000000100000000000000000000000000000020ff58fff29fd22036c585d43655b2a2e930aaccffa097d22c96f45c4f101223c8194bd943b12560c514bea7e441775f43499ba1e673b06d928d230469fd6e857d00000000000000204a6b3b11e6a1118081ef484f3aacc8c26e49c747a5e5d83793e50c55a5b26ca900000000000000020f4ddea1978cefa4c7d74dcdf03b17fd391e24c4cd32fc32067f37f873fed968016252b713ded281d579e8d5682134ef0b94ad958558f02a4cb7cf9f54a0c5d3000000000000000000000000000000209e1270ac710c44b66a8ea892c15c2e46756dd98e3a193775ee7d88008aa74a370000000000000002000000000000000100000000000000010000000000000020055c5a5c315ffdab1d5d764a01f20e1642654c734beb3aa0c80d95d6d80bb8bf00000000000000010000000000000001000000000000002055984fefe3b5f7107abe88b4ed6c68b551df4217ada0a559cfed17d555d006070000000000000002000000000000000400000000000000204a6b3b11e6a1118081ef484f3aacc8c26e49c747a5e5d83793e50c55a5b26ca90000000000000003000000000000000100000000000000010000000000000020e5a2d1c4f990b34d8b080880ddfb17316ae7d88122d8b12c89d1eaf303db3c9400000000000000010000000000000001000000000000002030f4527353532d2e25bc497c2648ab07e0cf132fa613237fb3f7cc897c8df69b00000000000000010000000000000000000000000000002077d9a4c40566e6eda342b871662e80914a918d208a6eb9a72045676fc8dbc112000000000000000000000000000000204a6b3b11e6a1118081ef484f3aacc8c26e49c747a5e5d83793e50c55a5b26ca900000000000000030000000000000001000000000000000100000000000000200216f102ba4fcb567c8273e663d85b451dae3318a314ff108c6e6aa3f5b2cac8000000000000000100000000000000010000000000000020105c4bcd056907959bc9151574ab2c233c2910ca4019b6b24eaae5ccc9bd2b70000000000000000100000000000000010000000000000020887aabb38c8179d7bdcf870179d0e13844b9b380623d6cae8ac9e789929140b714dfe3068c0364fe885652071172633065ab69c92da61baab589ae2a24f54b5600000000000000209e1270ac710c44b66a8ea892c15c2e46756dd98e3a193775ee7d88008aa74a370000000000000002194bd943b12560c514bea7e441775f43499ba1e673b06d928d230469fd6e857d27dcbd13c9e17b771a340a2c37c93a87e3475de72f9c52650658276cf1e4ccd30000000000000000000000000000002040c65a5efd7f000070c85a5efd7f00000400000003000000d0c65a5efd7f000000000000000000000000000000000002000000000000000000000000000000209e1270ac710c44b66a8ea892c15c2e46756dd98e3a193775ee7d88008aa74a370000000000000002000000000000000100000000000000010000000000000020055c5a5c315ffdab1d5d764a01f20e1642654c734beb3aa0c80d95d6d80bb8bf00000000000000010000000000000001000000000000002055984fefe3b5f7107abe88b4ed6c68b551df4217ada0a559cfed17d555d00607000000000000000200000000000000209e1270ac710c44b66a8ea892c15c2e46756dd98e3a193775ee7d88008aa74a370000000000000002000000000000000100000000000000010000000000000020ce08e95b573f6b192995f97b211eafcc971fbb1c217fad11ec4c919fe141b5c20000000000000001000000000000000000000000000000203dcf6d8669153cd06dbe056daa7a340179eb1f77703d0ae4bc64ddd35d3fd08d000000000000000214ad0d275985f520ba97143109b2e598b8ccc7dd75d08ef66dcaeb121de6a52907a3fb74a10f1114879a1573dca674474a990c7cb325ff106a4b801e8c6fe1fe00000000000000031b74924f9e1932fb248147ae20fb65ae7b6a79ffbc15b94d06f7bad9613116ef00000000000000200f044be55eca548bd7963cc4cfb11adb7a3b043c3f300c80eba0fdcc7900353600000000000000020a3a9f7d33a184d13887390927d64f5b57b6e8c76e4b9215dc0402c6040588cc2629aef5ad901b57183f5d72d658da5039e978de12e1d531263e10872adae3a5000000000000000200000000000000205bbc194d21b75d5e77c72be2ca4027d01fe09ef8e5f2aef15cc224cb994e680400000000000000030000000000000001000000000000000100000000000000205180c4a9d5f8c3ba20dd9191a66cc2c896c9665137dfeb3718b75db1de03d8c1000000000000000100000000000000000000000000000020668fd05cbad02f2599914105d3b60cd84cf97f9727e07c77e500d5a1af3c7cc60000000000000001000000000000000100000000000000208a8ebf5272d1733030c47dd710f6055bffbe488b4e54bd4cd5f79cd64a97c7b40000000000000002000000000000000200000000000000200f044be55eca548bd7963cc4cfb11adb7a3b043c3f300c80eba0fdcc7900353600000000000000040000000000000001000000000000000100000000000000208c70b2a4d4bf0a446ca0a3aef3bbf0703c67ae4dfdaf990ca3968dbdffa4a21a000000000000000100000000000000000000000000000020f7921556c3601046d5b782240bb4f5bbb00e47f67b53846bff3ce71268a84abd0000000000000001000000000000000100000000000000205194a231165353123cbe4940bdbee3c1e726f8ed8ab5c6f5632d9353a2e8496d00000000000000010000000000000001000000000000002072697671d9683845d813b5b609a51e9e1c398b1ae9e2fecd065680155b0c6550000000000000000a00000000000000200f044be55eca548bd7963cc4cfb11adb7a3b043c3f300c80eba0fdcc790035360000000000000004000000000000000100000000000000010000000000000020a1278239f7685e35a460d6bdd510a3768172573d6a47e8a4e5121827633e2b53000000000000000100000000000000000000000000000020e2f8945e4898a7b897af6f417af1d6067b4d415b90df5cc767061065b4b1e94d0000000000000001000000000000000100000000000000204588fe9e87ee6f31163531890c67d678d24c4494821a1028f0f465520ff379e3000000000000000100000000000000000000000000000020ff58fff29fd22036c585d43655b2a2e930aaccffa097d22c96f45c4f101223c826b0902e3b5b6fbf18fe0993375881b8b34c1cc4b04fb178f038c762333e75da00000000000000205bbc194d21b75d5e77c72be2ca4027d01fe09ef8e5f2aef15cc224cb994e680400000000000000021b74924f9e1932fb248147ae20fb65ae7b6a79ffbc15b94d06f7bad9613116ef2959ffd943c8e244d7d529ec2f11ecf8aee527139917336171c6986a07365772000000000000000200000000000000200406a73d2313e87e8c4747596f60fb7259bdf60d42c6f61a92b5b7213c368071000000000000000200000000000000010000000000000001000000000000002057d67b6c2dc62ddbbf885935f77b8a52cfb6745ca4920b38d045d6a62977ea8400000000000000010000000000000000000000000000002006710d01f42e66cbedc04459fde055770b57db2f23aa3d1cabb8a23349100fd80000000000000002000000000000000200000000000000205bbc194d21b75d5e77c72be2ca4027d01fe09ef8e5f2aef15cc224cb994e680400000000000000030000000000000001000000000000000100000000000000205180c4a9d5f8c3ba20dd9191a66cc2c896c9665137dfeb3718b75db1de03d8c1000000000000000100000000000000000000000000000020668fd05cbad02f2599914105d3b60cd84cf97f9727e07c77e500d5a1af3c7cc60000000000000001000000000000000100000000000000208a8ebf5272d1733030c47dd710f6055bffbe488b4e54bd4cd5f79cd64a97c7b4000000000000000600000000000000205bbc194d21b75d5e77c72be2ca4027d01fe09ef8e5f2aef15cc224cb994e680400000000000000030000000000000001000000000000000100000000000000209a53f5e310640dde2ea5f4224687f2bee8da9907329166a70b1972c159c0f5580000000000000001000000000000000000000000000000201a4e6f2311f88380880589b3007eae8c66bdf9ddc9dd7a5982a4b392cd0baa65000000000000000100000000000000000000000000000020ac8fea8c2de5836168be1a8e51cead52f93c7fec6bdeafba7d20fc0151417b171c51089bfa950635423129a4e65959e00365d45a28f68e06d8166b30aa56872700000000000000200406a73d2313e87e8c4747596f60fb7259bdf60d42c6f61a92b5b7213c368071000000000000000226b0902e3b5b6fbf18fe0993375881b8b34c1cc4b04fb178f038c762333e75da2e064dc98e373407a42705cbd2a6dfaf6e95d098faf293c7b33fca738f416e8d0000000000000000000000000000002040c65a5efd7f000070c85a5efd7f00000400000003000000d0c65a5efd7f000000000000000000000000000000000002000000000000000200000000000000200406a73d2313e87e8c4747596f60fb7259bdf60d42c6f61a92b5b7213c368071000000000000000200000000000000010000000000000001000000000000002057d67b6c2dc62ddbbf885935f77b8a52cfb6745ca4920b38d045d6a62977ea8400000000000000010000000000000000000000000000002006710d01f42e66cbedc04459fde055770b57db2f23aa3d1cabb8a23349100fd8000000000000000000000000000000200406a73d2313e87e8c4747596f60fb7259bdf60d42c6f61a92b5b7213c36807100000000000000020000000000000001000000000000000100000000000000209a97ff33d87ab17c8a10cdd6748d40ec44dec1581147e33b765e57f89d3d3ce1000000000000000100000000000000010000000000000020d301079fb4b9365db6d7a19e5e19557ee2b9210e93f8c392c71131ac69a53fb8",
            "0x00010203040506070809",
            init_params,
            eval_points
        );
    
    });

    it("Case 2 (batched)", async () => {
        const instance = await Verifier.deployed();

        var leaf_size = 1;

        var init_params = [];
        // 0) modulus
        // 1) r
        // 2) max_degree
        // 3) leaf_size
        // 4) lambda
        init_params.push(new BN('52435875175126190479447740508185965837690552500527637822603658699938581184513', 10));
        init_params.push(3);
        init_params.push(15);
        init_params.push(leaf_size);
        init_params.push(2);

        var D_omegas = [];
        D_omegas.push(new BN('14788168760825820622209131888203028446852016562542525606630160374691593895118', 10));
        D_omegas.push(new BN('23674694431658770659612952115660802947967373701506253797663184111817857449850', 10));
        D_omegas.push(new BN('3465144826073652318776269530687742778270252468765361963008', 10));
        init_params.push(D_omegas.length);
        init_params = init_params.concat(D_omegas);

        var q = [];
        q.push(0);
        q.push(0);
        q.push(1);
        init_params.push(q.length);
        init_params = init_params.concat(q);

        var eval_points = [];
        eval_points.push([7,]);

        await instance.batched_verify(
            "0x000000000000002034440d6630f9846b27bc05a32f3390d9b84831d6a1e98df9396ba8fc49acecd70000000000000001000000000000000100000000000000000000000000000000000000000000000000000522cc1bdd94000000000000000200000000000000010000000000000002140ed5b5c795283c66164f3c886cbf969fb9c615483eafef8d8cc2fbcbc3de633dbfdc991d20217983afdda8fe7c68f79188b5f6c4d345ba75f27fea3ed527700000000000000003000000000000000112b087a4e0e901a55d17a1c70f873be6caf042998a07ff674e47fcf7f45e0ea3000000000000002034440d6630f9846b27bc05a32f3390d9b84831d6a1e98df9396ba8fc49acecd70000000000000001000000000000000223546505647e19581708d7d8ef9e5ef083afe699fff36cadf640cce8db9af21e5a69273aee19dc15fc4d86fd5d1bc69422c898839a40e375a81526c424ac510800000000000000010000000000000020a74de21bd53d526f56e1b72cb5e9fd6b3552f4328478db514f3af23afe85290a0000000000000003000000000000000100000000000000000000000000000020d4d989de60f96bdc78c34eaefd8541dd578ec961901dfe38406c49995dd2a5a20000000000000001000000000000000100000000000000202549fb1684d4201e9b196ef91e45a909f817f164f214dd3219280dc46f0a22c200000000000000010000000000000001000000000000002085013d1f2744c0da4ecc4fd4bbe969efcb0f7f9a742415184e1408c3045cbf7300000000000000020000000000000001000000000000002034440d6630f9846b27bc05a32f3390d9b84831d6a1e98df9396ba8fc49acecd70000000000000004000000000000000100000000000000000000000000000020c6bb06cb7f92603de181bf256cd16846b93b752a170ff24824098b31aa008a7e0000000000000001000000000000000100000000000000204378ff515889172eba22524c734480b058f489537071dd00da95e76e234f3eda000000000000000100000000000000010000000000000020416bac3de0006da1798cae084cc883aa8b5725961532c3ea97397066834e91d200000000000000010000000000000001000000000000002045b30f8deef10851252d021c3e4dc088f7e506edec85716c0659e5c3bfce29e60000000000000009000000000000002034440d6630f9846b27bc05a32f3390d9b84831d6a1e98df9396ba8fc49acecd700000000000000040000000000000001000000000000000000000000000000208a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b000000000000000100000000000000010000000000000020385e8fcd637daa4c623919aa40f434d90aedfd1ea2ebfaca4c83ea08c15e89800000000000000001000000000000000100000000000000207953f3ef60faf5131eb4991f6573040c270ba2578405427e8f5c88ec41887ccb00000000000000010000000000000000000000000000002010608f5ebbec1730bdb054e8f1acd7438652f248f8c76b34911e296af867d2530000000000000001413fbbe66f8f303eaf3e1d12d93582acfa573fd38e94a3493eb9c605e9fbb6bb0000000000000020a74de21bd53d526f56e1b72cb5e9fd6b3552f4328478db514f3af23afe85290a0000000000000001000000000000000212b087a4e0e901a55d17a1c70f873be6caf042998a07ff674e47fcf7f45e0ea357a29aff227b762b201b4dc338ff6665c483042b89396ed78dff7dd9fceb131800000000000000010000000000000020823ab20226a4ddd6e5b05824b0e6a44697fe2d907f2a46d647dfd67776890b57000000000000000200000000000000010000000000000000000000000000002087f10652c4aa5cf3c9ebd0037211db5e7009f87dec108f6c8bb6141d20a15629000000000000000100000000000000010000000000000020960051d1769a803cc1903c9cc11e5e0c7b9fc2cf82714b07550bc79dd57fe999000000000000000200000000000000010000000000000020a74de21bd53d526f56e1b72cb5e9fd6b3552f4328478db514f3af23afe85290a0000000000000003000000000000000100000000000000000000000000000020d4d989de60f96bdc78c34eaefd8541dd578ec961901dfe38406c49995dd2a5a20000000000000001000000000000000100000000000000202549fb1684d4201e9b196ef91e45a909f817f164f214dd3219280dc46f0a22c200000000000000010000000000000001000000000000002085013d1f2744c0da4ecc4fd4bbe969efcb0f7f9a742415184e1408c3045cbf7300000000000000050000000000000020a74de21bd53d526f56e1b72cb5e9fd6b3552f4328478db514f3af23afe85290a00000000000000030000000000000001000000000000000000000000000000204a184698c428347c90667f1bc576dc42a08e8e9b32748c4c12e9163c59044f610000000000000001000000000000000100000000000000200d05e1d4d947d654b827a8be30ccca8cf90018f05790787ca736f298ca2a2aae00000000000000010000000000000000000000000000002046db96bc75bd4f1f73e384b432495bb48b6a252f721890e0235bc017f8fe0ec600000000000000014a3ca06fd412840b15a0499b93922ea461eeb4218369c634179a43108ceeb6f40000000000000020823ab20226a4ddd6e5b05824b0e6a44697fe2d907f2a46d647dfd67776890b5700000000000000010000000000000002413fbbe66f8f303eaf3e1d12d93582acfa573fd38e94a3493eb9c605e9fbb6bb112866914311959d78d09d3902a2b0138f60f2f67643d042bb1f354b7c03d7e200000000000000000000000000000020202a583dfd7f0000d5ab580000000000182a583dfd7f0000a02c583dfd7f00000000000000000000000000000000000200000000000000010000000000000020823ab20226a4ddd6e5b05824b0e6a44697fe2d907f2a46d647dfd67776890b57000000000000000200000000000000010000000000000000000000000000002087f10652c4aa5cf3c9ebd0037211db5e7009f87dec108f6c8bb6141d20a15629000000000000000100000000000000010000000000000020960051d1769a803cc1903c9cc11e5e0c7b9fc2cf82714b07550bc79dd57fe99900000000000000030000000000000020823ab20226a4ddd6e5b05824b0e6a44697fe2d907f2a46d647dfd67776890b570000000000000002000000000000000100000000000000000000000000000020d72e7045dcca96dcf4c942cf0e1df4e2b269dea39482d903eb71607c044e1549000000000000000100000000000000000000000000000020259945022849f579249ec2927ad0c2e169b5bed4948ba7c2ad96bc3030a03c0a000000000000000100000000000000023ccf2df5f148d9f514761c7c63e2a2a414f746b2c5a09ccac1f24239cc5250c96db9f4c6fbc46e104a8ed14f940f5a91d20ffb81750e7dac227d6d189acabbfa000000000000000300000000000000016384862f23292318091cfaf33b2cab20af3fefc0fa7fd63d6b506892a995a27a000000000000002034440d6630f9846b27bc05a32f3390d9b84831d6a1e98df9396ba8fc49acecd7000000000000000100000000000000025a69273aee19dc15fc4d86fd5d1bc69422c898839a40e375a81526c424ac510823546505647e19581708d7d8ef9e5ef083afe699fff36cadf640cce8db9af21e000000000000000100000000000000209366162c92994e89cb49edae56266920cd873dbe88d1959f97291a270f5a4221000000000000000300000000000000010000000000000000000000000000002012a9cd11acad88276fc82805dee08be034e6671c979fb6c34871b446098fed93000000000000000100000000000000010000000000000020c45589c53ce59cb5ff935a38a0525ddf2cdfb14707aeb38e0d4f9f1df11e0c8e000000000000000100000000000000010000000000000020b848c2bef1e08830f45ab7ce9abd07b34b628bd939d1c3b2605bdc0b7253c8e600000000000000020000000000000009000000000000002034440d6630f9846b27bc05a32f3390d9b84831d6a1e98df9396ba8fc49acecd700000000000000040000000000000001000000000000000000000000000000208a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b000000000000000100000000000000010000000000000020385e8fcd637daa4c623919aa40f434d90aedfd1ea2ebfaca4c83ea08c15e89800000000000000001000000000000000100000000000000207953f3ef60faf5131eb4991f6573040c270ba2578405427e8f5c88ec41887ccb00000000000000010000000000000000000000000000002010608f5ebbec1730bdb054e8f1acd7438652f248f8c76b34911e296af867d2530000000000000001000000000000002034440d6630f9846b27bc05a32f3390d9b84831d6a1e98df9396ba8fc49acecd70000000000000004000000000000000100000000000000000000000000000020c6bb06cb7f92603de181bf256cd16846b93b752a170ff24824098b31aa008a7e0000000000000001000000000000000100000000000000204378ff515889172eba22524c734480b058f489537071dd00da95e76e234f3eda000000000000000100000000000000010000000000000020416bac3de0006da1798cae084cc883aa8b5725961532c3ea97397066834e91d200000000000000010000000000000001000000000000002045b30f8deef10851252d021c3e4dc088f7e506edec85716c0659e5c3bfce29e6000000000000000153bcfe339ef369aee80d2cb953036656ecad47615665d6fdf068bd7b9017425c00000000000000209366162c92994e89cb49edae56266920cd873dbe88d1959f97291a270f5a4221000000000000000100000000000000026384862f23292318091cfaf33b2cab20af3fefc0fa7fd63d6b506892a995a27a42abb2f2da1a2e84e426a72454d39ba5debc977737768fb7031847616ad77f97000000000000000100000000000000204173ed2abfb2f4a0a7c9dbd974fa185eb2f4dc9903fb193323675a4f2a1d4f09000000000000000200000000000000010000000000000000000000000000002004103510e5b24aa68a34b9ff41bd39921b5012cbf270ee22846bba11fe54072c000000000000000100000000000000010000000000000020559fab42398fcdf19a55d6316917b723535bda293586de94aa555dc0e1187aa90000000000000002000000000000000100000000000000209366162c92994e89cb49edae56266920cd873dbe88d1959f97291a270f5a4221000000000000000300000000000000010000000000000000000000000000002012a9cd11acad88276fc82805dee08be034e6671c979fb6c34871b446098fed93000000000000000100000000000000010000000000000020c45589c53ce59cb5ff935a38a0525ddf2cdfb14707aeb38e0d4f9f1df11e0c8e000000000000000100000000000000010000000000000020b848c2bef1e08830f45ab7ce9abd07b34b628bd939d1c3b2605bdc0b7253c8e6000000000000000500000000000000209366162c92994e89cb49edae56266920cd873dbe88d1959f97291a270f5a422100000000000000030000000000000001000000000000000000000000000000208c927e149393ae621f59498d467e7c295bfda8880cbc7f57eb90b3799dcea19f0000000000000001000000000000000100000000000000201cacb68956b524ba08500155ad3b3bb8d73fdc565caa687995ce5a6d4b01fbf7000000000000000100000000000000000000000000000020a08afba31fd20c86b448d62df4d24b927c3bd634357d458eaf299649a4eced5d00000000000000014302e0821f21e92cfd212334d975201796a4ef3450907b1d9f74d520318794d000000000000000204173ed2abfb2f4a0a7c9dbd974fa185eb2f4dc9903fb193323675a4f2a1d4f090000000000000001000000000000000253bcfe339ef369aee80d2cb953036656ecad47615665d6fdf068bd7b9017425c10182e744f2937f04684f666eaade9b9a9080f98f26d8cc26a74d8ed101be94000000000000000000000000000000020202a583dfd7f0000d5ab580000000000182a583dfd7f0000a02c583dfd7f000000000000000000000000000000000002000000000000000100000000000000204173ed2abfb2f4a0a7c9dbd974fa185eb2f4dc9903fb193323675a4f2a1d4f09000000000000000200000000000000010000000000000000000000000000002004103510e5b24aa68a34b9ff41bd39921b5012cbf270ee22846bba11fe54072c000000000000000100000000000000010000000000000020559fab42398fcdf19a55d6316917b723535bda293586de94aa555dc0e1187aa9000000000000000300000000000000204173ed2abfb2f4a0a7c9dbd974fa185eb2f4dc9903fb193323675a4f2a1d4f090000000000000002000000000000000100000000000000000000000000000020165c85dd67521b01034c368a3bc8b4ca3805a0040a7e5c1b38bcf0e46d5d97520000000000000001000000000000000000000000000000205ab52c5a78f8ccece5d7c3a44d7a63f7e287f682a3eb8989072ccacaaacd875e",
            "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            init_params,
            eval_points
        );

    });

    it("Case 3 (batched)", async () => {
        const instance = await Verifier.deployed();

        var leaf_size = 2;

        var init_params = [];
        // 0) modulus
        // 1) r
        // 2) max_degree
        // 3) leaf_size
        // 4) lambda
        init_params.push(new BN('52435875175126190479447740508185965837690552500527637822603658699938581184513', 10));
        init_params.push(3);
        init_params.push(15);
        init_params.push(leaf_size);
        init_params.push(2);

        var D_omegas = [];
        D_omegas.push(new BN('14788168760825820622209131888203028446852016562542525606630160374691593895118', 10));
        D_omegas.push(new BN('23674694431658770659612952115660802947967373701506253797663184111817857449850', 10));
        D_omegas.push(new BN('3465144826073652318776269530687742778270252468765361963008', 10));
        init_params.push(D_omegas.length);
        init_params = init_params.concat(D_omegas);

        var q = [];
        q.push(0);
        q.push(0);
        q.push(1);
        init_params.push(q.length);
        init_params = init_params.concat(q);

        var eval_points = [];
        eval_points.push([7,]);
        eval_points.push([7,]);

        await instance.batched_verify(
            "0x0000000000000020fc4322dd0456ba820ab8699b22f914b51e1df9f9579f1b989985ebf45707c0e50000000000000002000000000000000100000000000000000000000000000000000000000000000000000522cc1bdd94000000000000000100000000000000000000000000000000000000000000000000000522cc1bddbe0000000000000002000000000000000200000000000000026cd65e8913b48261cc63aa7d55108eada08a1c6d1b4455f2172622ee2629632143a08271590ebee64f6f8ff48261d1fff13e0fd003709ad203ce0809e33da61f00000000000000023c1d47337643ac241e1c813b024a7388fe3d837e6d1e7599fd7f4d991d79767343a08271590ebee64f6f8ff48261d1fff13e0fd003709ad203ce0809e33da61f0000000000000003000000000000000212b087a4e0e901a55d17a1c70f873be6caf042998a07ff674e47fcf7f45e0ea355e517a26d15a8afe20a508cc662f8c77c614daddbe07b0e34a127a1ebae21f60000000000000020fc4322dd0456ba820ab8699b22f914b51e1df9f9579f1b989985ebf45707c0e50000000000000002000000000000000223546505647e19581708d7d8ef9e5ef083afe699fff36cadf640cce8db9af21e5a69273aee19dc15fc4d86fd5d1bc69422c898839a40e375a81526c424ac5108000000000000000236f9fd6a28520545c5f2f2ae2ba718a71f7c554994fbb438147f6843fbcc74ca3b84b56f089d40af3235dfbaf9202e9d9a54c9561361aded6e2885d133634d4f00000000000000010000000000000020f6aec140e3e078d96d342550c66e666280f1cf78e5c927dcb596d5e83a27202a00000000000000030000000000000001000000000000000000000000000000202a267c7ed1dab4b1c88a6d48bafe69a085ac443abeae87ecef30f5c35adb11c70000000000000001000000000000000100000000000000201868b90d083dcc7a01ac1e442a3420165c6893b74dc1706fe938bd89321de3d7000000000000000100000000000000010000000000000020bfeea717811bd03206359415f8992a9ed780c68399badc0ccb838ffce2437220000000000000000200000000000000010000000000000020fc4322dd0456ba820ab8699b22f914b51e1df9f9579f1b989985ebf45707c0e50000000000000004000000000000000100000000000000000000000000000020ace3ebf29ad258cd9d8fb774c7906c8de716709e9c593fd414742bc842c8e57f000000000000000100000000000000010000000000000020b6a31ef865227edffcf3942b7b3e34c2b0100ac59ab6a49c8803cb1e9f93cf5b000000000000000100000000000000010000000000000020eff4bcc9260de3e6674d359bf0bd522479497b65ade4e5501be80d5aea71f3f6000000000000000100000000000000010000000000000020d0f5b9bc37a7ae054eafc11ada53ea9c0093ff5914f759bf13d6fcad446a451d00000000000000090000000000000020fc4322dd0456ba820ab8699b22f914b51e1df9f9579f1b989985ebf45707c0e50000000000000004000000000000000100000000000000000000000000000020c5069e24aaadb2addc3e52e868fcf3f4f8acf5a87e24300992fd4540c2a87eed0000000000000001000000000000000100000000000000207b6751a3a86cd1219104cf51d5a3de80bbe8609255b4aa4451a0f05c6589be36000000000000000100000000000000010000000000000020de40dc40a97f6b3ce3d2e3955f01695f15a7fe89f0d944b5f4e996e00e2d2200000000000000000100000000000000000000000000000020b526c1eef0c06cc0b8b1446fbeef95a714a787c4dd923cb071bf3604fb859c76000000000000000259f9446a115b73f50ab7c1cb0779ac83ddc85942c60bd0d281d304e7487bce6c29402d1473ea9db75c709888b4b3915f3b7bc05417e5f07a682c2f923fcbe1be0000000000000020f6aec140e3e078d96d342550c66e666280f1cf78e5c927dcb596d5e83a27202a0000000000000002000000000000000212b087a4e0e901a55d17a1c70f873be6caf042998a07ff674e47fcf7f45e0ea357a29aff227b762b201b4dc338ff6665c483042b89396ed78dff7dd9fceb1318000000000000000255e517a26d15a8afe20a508cc662f8c77c614daddbe07b0e34a127a1ebae21f626e983a9850a9fed71d42480e6394b4122366b3cdb138e7f7458a884f43b266a00000000000000010000000000000020766b37f784c2dbc4b0348cb5916d7b9abfcfcc2c5df96d448ea9420eb1e635d9000000000000000200000000000000010000000000000000000000000000002056392636e9435230490b1d02172a4fdaa86b6cc524227d2bf312e3a09eadc27d000000000000000100000000000000010000000000000020d6274b4150208eee3380bf27787c3abd3eec9c5dcf47a3fe7be8e55f29c8603c000000000000000200000000000000010000000000000020f6aec140e3e078d96d342550c66e666280f1cf78e5c927dcb596d5e83a27202a00000000000000030000000000000001000000000000000000000000000000202a267c7ed1dab4b1c88a6d48bafe69a085ac443abeae87ecef30f5c35adb11c70000000000000001000000000000000100000000000000201868b90d083dcc7a01ac1e442a3420165c6893b74dc1706fe938bd89321de3d7000000000000000100000000000000010000000000000020bfeea717811bd03206359415f8992a9ed780c68399badc0ccb838ffce243722000000000000000050000000000000020f6aec140e3e078d96d342550c66e666280f1cf78e5c927dcb596d5e83a27202a00000000000000030000000000000001000000000000000000000000000000202aaf745d75c7348d0c1f670e6fff1c59228661b4211dcc9e39a5258c2b50ebbe0000000000000001000000000000000100000000000000200d0fd12577c0850151f87423ec9fbf257069ff81a6ca1ec46588bc630fdabc34000000000000000100000000000000000000000000000020b9b6e554f353dd7b914ea4c7bc2c7bf388edf28f3c5178ab60d2e95bfdfea4d400000000000000022935dc17baa5c37b7cf41a88d2aebcadaf4c0c9d17d3bb2013581ae442ebbd026c6a6c1546d26a8601e6c94e898a798e60bd17b169ac36c6f9b1458e3a3bd0550000000000000020766b37f784c2dbc4b0348cb5916d7b9abfcfcc2c5df96d448ea9420eb1e635d90000000000000002000000000000000259f9446a115b73f50ab7c1cb0779ac83ddc85942c60bd0d281d304e7487bce6c2ca45ec22a4fca89fd60439049abb8b5a944003154cf4d49e28a7cbe09fa692f000000000000000229402d1473ea9db75c709888b4b3915f3b7bc05417e5f07a682c2f923fcbe1be6fd8eebfb67c71948252f256008775965ab50b45a6a7c8f0c8e3a768014a7c82000000000000000000000000000000200823d653fe7f00009025d653fe7f000000000000ffffffff2023d653fe7f00000000000000000000000000000000000200000000000000010000000000000020766b37f784c2dbc4b0348cb5916d7b9abfcfcc2c5df96d448ea9420eb1e635d9000000000000000200000000000000010000000000000000000000000000002056392636e9435230490b1d02172a4fdaa86b6cc524227d2bf312e3a09eadc27d000000000000000100000000000000010000000000000020d6274b4150208eee3380bf27787c3abd3eec9c5dcf47a3fe7be8e55f29c8603c00000000000000030000000000000020766b37f784c2dbc4b0348cb5916d7b9abfcfcc2c5df96d448ea9420eb1e635d90000000000000002000000000000000100000000000000000000000000000020a2381cfc05dd06d19449497189427eeb73573864390ec84dfeed1d763ce4c7120000000000000001000000000000000000000000000000203ef64caca9728a7b24bbafd3a44a599b5b7b8be0f34808a39e8d0cb5f92fca930000000000000002000000000000000248c20bd6da0fbcb56c82e81a13d0b4ac8953fa2e59a34b96e1016d924bc3c0a41224d144793493232bd1840dd5624a61bf5a66551f286416d6e2b40c979285070000000000000002159e8ee98126a6428b0277113e0f5fb7eca954948ea91ed30ffa2e252b97725f1224d144793493232bd1840dd5624a61bf5a66551f286416d6e2b40c979285070000000000000003000000000000000257e6f5b583d89e69d256a49228e07a6839ae4b49e3eb685b035c7036ebc4be5224c378c82aef87f6f0d63389531f25739d03a5b018f13b97325530c9cb98700d0000000000000020fc4322dd0456ba820ab8699b22f914b51e1df9f9579f1b989985ebf45707c0e500000000000000020000000000000002325db800d7c1ebaef0c7c5447d7cbd7ff295c3a915170a9b9acf0b9016b24059418fef5251db919a5d15ac60782b2427392de05ed6ed51636532f46ee94dbfae000000000000000266b51ef6dbbc52970a1fb7e064573f339223e56e122dc19c0cf908c3ae267fd30d38885c4de12ab35e6153617d56ac1571a5be9ec5dc9a62f30af73b51d9803400000000000000020000000000000020714f2270627be3b47a98a6fa7a79f981e8bf045571bdd3f8ddf752e3ac525b8d00000000000000030000000000000001000000000000000100000000000000200b72484360df95e9fef7ae3a2e64c973a5fbd041b5f6815acf2410a87e36994b000000000000000100000000000000000000000000000020393f0462a349b79384746ec77efbb91ca4bd9b7f7d70fe48f5204f3a70f18b8a00000000000000010000000000000001000000000000002026222a447339a182105b44d5d5c10c2742f4e552429d048730de91412854c8d00000000000000002000000000000000a0000000000000020fc4322dd0456ba820ab8699b22f914b51e1df9f9579f1b989985ebf45707c0e50000000000000004000000000000000100000000000000010000000000000020ee18c9787bceb2fbedac1d0c1dab17388f9757b24d4be8b3fef22e0bb35b80a60000000000000001000000000000000000000000000000201db746f920bbba6e867906b4017ea8218f6c05105c7e4d58ae6dd681120df0a2000000000000000100000000000000010000000000000020de40dc40a97f6b3ce3d2e3955f01695f15a7fe89f0d944b5f4e996e00e2d2200000000000000000100000000000000000000000000000020b526c1eef0c06cc0b8b1446fbeef95a714a787c4dd923cb071bf3604fb859c7600000000000000020000000000000020fc4322dd0456ba820ab8699b22f914b51e1df9f9579f1b989985ebf45707c0e5000000000000000400000000000000010000000000000001000000000000002079c59c32cc0135658f5a58bb9c7a0fd06078d0b66aa181e4c3082c5de1ced8ba000000000000000100000000000000000000000000000020011b94bc049eda1bd709811587cb563e6a91bf797815666a3f2a4359ad14da9a000000000000000100000000000000010000000000000020eff4bcc9260de3e6674d359bf0bd522479497b65ade4e5501be80d5aea71f3f6000000000000000100000000000000010000000000000020d0f5b9bc37a7ae054eafc11ada53ea9c0093ff5914f759bf13d6fcad446a451d00000000000000022aa5f09dbb03e010cf94431ee80c07674360c5d1d6470c20e4c64f4984e2032e6b701b038bb846e6214daa1e1bec8a77fa73c43b0b4b3b5c13bf0fdb64b5b4ea0000000000000020714f2270627be3b47a98a6fa7a79f981e8bf045571bdd3f8ddf752e3ac525b8d0000000000000002000000000000000257e6f5b583d89e69d256a49228e07a6839ae4b49e3eb685b035c7036ebc4be5226587e5e7b1ab0d1af8000822a4a45604bad567def495814cb4efa0ae078cf32000000000000000224c378c82aef87f6f0d63389531f25739d03a5b018f13b97325530c9cb98700d6722a8c44bcf17a7013967815e2ac87102c054e7244d874ffa47ba9cc04c80ee00000000000000020000000000000020d739cda0b6d30f542c8a958b99863226afbb89749f534b25932fe7e4974dc65700000000000000020000000000000001000000000000000100000000000000203d23e24db99433b665c6d924f9e6c49b2ea34d70160583b9870376e45b71fa800000000000000001000000000000000000000000000000204822fa093babbc4e3975313aa03349cb120d700ca2e2f9e6c4ebe6526ba10236000000000000000200000000000000020000000000000020714f2270627be3b47a98a6fa7a79f981e8bf045571bdd3f8ddf752e3ac525b8d00000000000000030000000000000001000000000000000100000000000000200b72484360df95e9fef7ae3a2e64c973a5fbd041b5f6815acf2410a87e36994b000000000000000100000000000000000000000000000020393f0462a349b79384746ec77efbb91ca4bd9b7f7d70fe48f5204f3a70f18b8a00000000000000010000000000000001000000000000002026222a447339a182105b44d5d5c10c2742f4e552429d048730de91412854c8d000000000000000060000000000000020714f2270627be3b47a98a6fa7a79f981e8bf045571bdd3f8ddf752e3ac525b8d0000000000000003000000000000000100000000000000010000000000000020e542c8c53fd1c0fe4587367b8503bcd929538d2272aafd2bcbae7ca09551ab1c0000000000000001000000000000000000000000000000206bb1a76c5d93da867bafb9dd099a8ffe4cc647dfe0abea44b398870a330e57f500000000000000010000000000000000000000000000002097b765d2628719de774fffd360ef822cafd977a40eca047c5dcac0ee9b57b1fd00000000000000025ae6dd1b53444fd898546c27e932ff0e48ae608378cbafadb7e4219ee35645ab27c3602dfa5b3965b6d3fb1f1371aa19ac03bae9add182e9e6dce231c329f7660000000000000020d739cda0b6d30f542c8a958b99863226afbb89749f534b25932fe7e4974dc657000000000000000200000000000000022aa5f09dbb03e010cf94431ee80c07674360c5d1d6470c20e4c64f4984e2032e5e04ce200af98e2ee8e1709bdd5508e47d57986a7fe35ff29259bd8b0576251600000000000000026b701b038bb846e6214daa1e1bec8a77fa73c43b0b4b3b5c13bf0fdb64b5b4ea2ae15132b21077bc0760ff930793b3efe0acf2d0b4e9332ec1527e1de549d6d1000000000000000000000000000000200823d653fe7f00009025d653fe7f000000000000ffffffff2023d653fe7f00000000000000000000000000000000000200000000000000020000000000000020d739cda0b6d30f542c8a958b99863226afbb89749f534b25932fe7e4974dc65700000000000000020000000000000001000000000000000100000000000000203d23e24db99433b665c6d924f9e6c49b2ea34d70160583b9870376e45b71fa800000000000000001000000000000000000000000000000204822fa093babbc4e3975313aa03349cb120d700ca2e2f9e6c4ebe6526ba1023600000000000000000000000000000020d739cda0b6d30f542c8a958b99863226afbb89749f534b25932fe7e4974dc6570000000000000002000000000000000100000000000000010000000000000020d0a891224d7c9557fa8f7b2af6a7426f53f7ed46686f86e72fb9f15048225494000000000000000100000000000000010000000000000020cb7a054152b14be08691ce5d6febe48d2fb4090e6a116475171a8b12b9ae00f9",
            "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            init_params,
            eval_points
        );

    });

});
