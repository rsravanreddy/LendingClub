pragma solidity ^0.4.17;

contract Chits {

struct Stake{
    address from;
    uint amount;
}

struct Pool {
    uint maxContributors;
    uint maxLoan;
    uint maxFunds;
    uint duration; //expires in seconds
    uint stakeAmount; // token*price
    mapping(address=>uint) funders;
    mapping(address=>Stake) Stakers;
}

uint numberPools;
mapping(uint=>Pool) pools;

event  PoolCreated(uint poolId,uint mc,uint ml,uint mf,uint duration,uint sm);

function newPool(uint mc,uint ml,uint mf,uint duration,uint sm) public returns(uint poolId){
    numberPools = numberPools+1;
    poolId = numberPools;
    pools[poolId] = Pool(mc,ml,mf,duration,sm);
    pools[poolId].funders[msg.sender] = 0;
    PoolCreated(poolId,mc,ml,mf,duration,sm);
}

function stakeForAddress(uint id,address toAddr) public {
    //check for token balance and hold funds subtract tokens from address
    pools[id].Stakers[toAddr] = Stake(msg.sender,pools[id].stakeAmount);
}

function particiapte(uint id) public{
    //we only accept a staker or a person who was staked to 

    //check if there is a staker supporting this address
    require(pools[id].Stakers[msg.sender].from!=0);
    pools[id].funders[msg.sender] = 0;
}

function getPools() public view returns (uint) {
    return numberPools;
}

function getPool(uint poolId) public view returns (uint mc,uint ml,uint mf,uint duration,uint sm) {
    return (pools[poolId].maxContributors,pools[poolId].maxLoan,pools[poolId].maxFunds,pools[poolId].duration, pools[poolId].stakeAmount);
}


}