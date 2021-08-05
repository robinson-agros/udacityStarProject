const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract("StarNotary", (accs) =>{
    accounts = accs;
    owner = accs[0];
})

it("Creación de Estrellas", async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar("Estrellita, estrellita...", tokenId, {from: accounts[0]});
    assert.equal("Estrellita, estrellita...", await instance.tokenIdToStarInfo.call(tokenId));
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.approveBuyer(user2, starId, {from:user1}); //user2 needs approval based on ERC721 last version.
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
});

it('can add the star name and star symbol properly', async() => {
    // 1. create a Star with different tokenId
    //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
    let instance = await StarNotary.deployed();
    await instance.createStar("Testing Star", 6, {from: accounts[1]})
    let name = await instance.nameCall();
    let symbol = await instance.symbolCall();
    assert.equal("Stars", name);
    assert.equal("SS", symbol);
});

it('lets 2 users exchange stars', async() => {
    // 1. create 2 Stars with different tokenId
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    // 3. Verify that the owners changed
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId1 = 10;
    let starId2 = 11;    
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('Interchangable Star 01', starId1, {from: user1});
    await instance.createStar('Interchangable Star 02', starId2, {from: user2});
    await instance.putStarUpForSale(starId1, starPrice, {from: user1});
    await instance.putStarUpForSale(starId2, starPrice, {from: user2});
    await instance.approveBuyer(user2, starId1, {from:user1});
    await instance.approveBuyer(user1, starId2, {from:user2});
    await instance.exchangeStars(starId1, starId2, {from:user1});
    assert.equal(user1, await instance.ownerOf(starId2));
    assert.equal(user2, await instance.ownerOf(starId1));
});

it('lets a user transfer a star', async() => {
    // 1. create a Star with different tokenId
    // 2. use the transferStar function implemented in the Smart Contract
    // 3. Verify the star owner changed.
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    await instance.createStar('Transferable Star', starId, {from: user1});
    await instance.transferStar(user2, starId, {from: user1});
    assert.equal(user2, await instance.ownerOf(starId));
});

it('lookUptokenIdToStarInfo test', async() => {
    // 1. create a Star with different tokenId
    // 2. Call your method lookUptokenIdToStarInfo
    // 3. Verify if you Star name is the same
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];    
    let starId = 20;
    starName = "LookUp Star"
    await instance.createStar(starName, starId, {from: user1});
    let name = await instance.lookuptokenIdToStarInfo(starId);
    assert.equal(starName, name);
});