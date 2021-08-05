//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 {
    struct Star {
        string name;
    }

    constructor() ERC721("Stars", "SS") {}

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;

    function createStar(string memory _name, uint256 _tokenId) public {
        Star memory newStar = Star(_name);
        tokenIdToStarInfo[_tokenId] = newStar;
        _mint(msg.sender, _tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "No puedes vender una estrella que no posees");
        starsForSale[_tokenId] = _price;
    }

    function _make_payable(address x) internal pure returns (address payable) {        
        return payable(x);
    }

    function approveBuyer(address buyer, uint256 _tokenId) public{                
        approve(buyer, _tokenId);
    }

    function nameCall() public view returns (string memory) {
        return name();
    }

    function symbolCall() public view returns (string memory){
        return symbol();
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0, "La estrella no esta a la venta"); //Verifica que exista el map con el tokenId
        uint256 starCost = starsForSale[_tokenId]; //Si existe el map sacamos el precio
        address ownerAddress = ownerOf(_tokenId); //Funcion heredada, que busca en el Map _owners y devuelve el address
        require(msg.value > starCost, "Te falta ether!"); // Confirma que que el valor de la transaccion sea mayor al precio. 
        transferFrom(ownerAddress, msg.sender, _tokenId); //Transfiere del owner, el token. 
        //1.- Revisa si el Owner es el mismo que el comprador, o si el comprador tiene aprobación, o si el owner acepta
        //    venderlo a todos. Si alguna de estas 3 condiciones está activa procede.
        //2.- Realiza un _safeTransfer, que transfiere el token del actual dueño al nuevo dueño (owner)
        address payable ownerAddressPayable = _make_payable(ownerAddress); //se asegura que el owner address sea "payable"
        ownerAddressPayable.transfer(starCost); //El contrato le transfiere al dueño el costo del token
        if(msg.value > starCost) {
            payable(msg.sender).transfer(msg.value - starCost); // Si hay un saldo en la transaccion vuelve al comprador.
        }
    }

    function lookuptokenIdToStarInfo (uint _tokenId) public view returns (string memory){
        require(bytes(tokenIdToStarInfo[_tokenId].name).length != 0);
        return tokenIdToStarInfo[_tokenId].name;
    }

    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
        //1. Passing to star tokenId you will need to check if the owner of _tokenId1 or _tokenId2 is the sender
        //2. You don't have to check for the price of the token (star)
        //3. Get the owner of the two tokens (ownerOf(_tokenId1), ownerOf(_tokenId1)
        //4. Use _transferFrom function to exchange the tokens.
        address ownerAddress1 = ownerOf(_tokenId1);
        address ownerAddress2 = ownerOf(_tokenId2);
        require(msg.sender == ownerAddress1 || msg.sender == ownerAddress2, "No tienes ningun token del intercambio");        
        transferFrom(ownerAddress1, ownerAddress2, _tokenId1);
        transferFrom(ownerAddress2, ownerAddress1, _tokenId2);        
    }

    function transferStar(address _to1, uint256 _tokenId) public {
        //1. Check if the sender is the ownerOf(_tokenId)
        //2. Use the transferFrom(from, to, tokenId); function to transfer the Star
        address ownerAddress = ownerOf(_tokenId);
        require(ownerAddress == msg.sender, "No tienes autorizacion ");
        transferFrom(msg.sender, _to1, _tokenId);
    }
}