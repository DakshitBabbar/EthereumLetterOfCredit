// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract LetterOfCredit {
    enum Status { Pending, Approved, Fulfilled, Rejected }

    struct LOC {
        uint id;
        address buyerBank;
        address sellerBank;
        uint amount;
        Status status;
    }

    LOC[] public locs;
    mapping(uint => address) public locToOwner;

    event LOCRequested(uint locId, address buyerBank, address sellerBank, uint amount);
    event LOCApproved(uint locId);
    event LOCFulfilled(uint locId);
    event LOCRejected(uint locId);

    function requestLOC(address _sellerBank, uint _amount) external {
        uint id = locs.length;
        locs.push(LOC(id, msg.sender, _sellerBank, _amount, Status.Pending));
        locToOwner[id] = msg.sender;
        emit LOCRequested(id, msg.sender, _sellerBank, _amount);
    }

    function approveLOC(uint _locId) external {
        require(_locId < locs.length, "Invalid locId");
        require(locs[_locId].sellerBank == msg.sender, "Only the seller bank can approve this LOC.");
        locs[_locId].status = Status.Approved;
        emit LOCApproved(_locId);
    }

    function fulfillLOC(uint _locId) external {
        require(_locId < locs.length, "Invalid locId");
        require(locs[_locId].buyerBank == msg.sender, "Only the buyer bank can fulfill this LOC.");
        require(locs[_locId].status == Status.Approved, "LOC must be approved before it can be fulfilled.");
        locs[_locId].status = Status.Fulfilled;
        emit LOCFulfilled(_locId);
    }

    function rejectLOC(uint _locId) external {
        require(_locId < locs.length, "Invalid locId");
        require(locs[_locId].sellerBank == msg.sender, "Only the seller bank can reject this LOC.");
        require(locs[_locId].status == Status.Approved, "LOC must be approved before it can be rejected.");
        locs[_locId].status = Status.Rejected;
        emit LOCRejected(_locId);
    }

    function getLOC(uint _locId) public view returns (uint, address, address, uint, Status) {
        require(_locId < locs.length, "Invalid locId");
        LOC storage loc = locs[_locId];
        return (loc.id, loc.buyerBank, loc.sellerBank, loc.amount, loc.status);
    }
}
