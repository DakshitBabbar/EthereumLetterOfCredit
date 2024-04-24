pragma solidity ^0.8.4;

contract LetterOfCredit 
{
    enum Status { Pending, Approved, Fulfilled, Rejected }

    struct LOC {
        uint id;
        address buyer;
        address seller;
        uint amnt;
        Status status; 
    }
    LOC[] public locs; 
    mapping(uint => address) public locToOwner;

    event LOCRequested(uint locId, address buyer, address seller, uint amnt);
    event LOCApproved(uint locId);
    event LOCFulfilled(uint locId);
    event LOCRejected(uint locId);


    function requestLOC(address _seller, uint _amnt) external 
    {
        uint id = locs.length;
        locs.push(LOC(id, msg.sender, _seller, _amnt, Status.Pending));
        locToOwner[id] = msg.sender;
        emit LOCRequested(id, msg.sender, _seller, _amnt);
    }

    function approveLOC(uint _locId) external 
    {
        require(_locId < locs.length, "This LOC does not exist");
        require(locs[_locId].seller == msg.sender, "Only seller bank can approve the LOC");
        locs[_locId].status = Status.Approved;
        emit LOCApproved(_locId);
    }
    function rejectLOC(uint _locId) external 
    {
        require(_locId < locs.length, "This LOC does not exist");
        require(locs[_locId].seller == msg.sender, "Only the seller bank can reject the LOC.");
        require(locs[_locId].status == Status.Approved, "LOC is not approvd yet, contact Seller bank to approve it");
        locs[_locId].status = Status.Rejected;
        emit LOCRejected(_locId);
    }

    function fulfillLOC(uint _locId) external
    {
        require(_locId < locs.length, "This LOC does not exist");
        require(locs[_locId].buyer == msg.sender, "Only the buyer bank can fulfill the LOC.");
        require(locs[_locId].status == Status.Approved, "LOC is not approvd yet, contact Seller bank to approve it");
        locs[_locId].status = Status.Fulfilled;
        emit LOCFulfilled(_locId);
    }

//to get the details of LOC given the loc id
    function getLOC(uint _locId) public view returns (uint, address, address, uint, Status) 
    {
        require(_locId < locs.length, "This LOC does not exist");
        LOC storage loc = locs[_locId];
        return (loc.id, loc.buyer, loc.seller, loc.amnt, loc.status);
    }
}
