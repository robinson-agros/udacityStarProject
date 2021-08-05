# Project Star --- Robinson Lopez.

This project is for the Build CryptoStar Dapp on Ethereum Project.

## Details.
* Truffle Version: v5.4.1 (core: 5.4.1)
* ERC-721 Token Name: Stars
* ERC-721 Token Symbol: SS
* Contract Address: 0x2Bc99ef31a68331dFC38f34D8f7a5a7d5DA15782

## Considerations
* I've used React for the Fron-End. 
* I've changed the solidity file and added approveBuyer as a function to pre-approve the transfer from the user because last version of OpenZepelling ERC-721 needs that the new onwer will be registered using approve or approveall (for operators)