const contractAddress = '0x1A4c2B30DcE529C5970eeCBE0e7869618c5bf7d7';
const abi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "locId",
                "type": "uint256"
            }
        ],
        "name": "LOCApproved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "locId",
                "type": "uint256"
            }
        ],
        "name": "LOCFulfilled",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "locId",
                "type": "uint256"
            }
        ],
        "name": "LOCRejected",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "locId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "buyerBank",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "sellerBank",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "LOCRequested",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_locId",
                "type": "uint256"
            }
        ],
        "name": "approveLOC",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_locId",
                "type": "uint256"
            }
        ],
        "name": "fulfillLOC",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_locId",
                "type": "uint256"
            }
        ],
        "name": "rejectLOC",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_sellerBank",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "requestLOC",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_locId",
                "type": "uint256"
            }
        ],
        "name": "getLOC",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "buyerBank",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "sellerBank",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum LetterOfCredit.Status",
                        "name": "status",
                        "type": "uint8"
                    }
                ],
                "internalType": "struct LetterOfCredit.LOC",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "locs",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "buyerBank",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "sellerBank",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "enum LetterOfCredit.Status",
                "name": "status",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "locToOwner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let contract;
let web3;

async function initWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
            initContract();
        } catch (error) {
            console.error("User denied account access")
        }
    } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
        initContract();
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
}

function initContract() {
    contract = new web3.eth.Contract(abi, contractAddress);
}

async function requestLOC() {
    const sellerBankAddress = document.getElementById('sellerBankAddress').value;
    if (!web3.utils.isAddress(sellerBankAddress) || sellerBankAddress === "0x0000000000000000000000000000000000000000") {
        alert("Invalid bank address. Please check the address and try again.");
        return;
    }
    
    const docAmount = document.getElementById('amount').value;
    if (docAmount <= 0) {
        console.log("Amount must be greater than zero.");
        alert("Amount must be greater than zero.");
        return;
    }

    const amount = web3.utils.toWei(docAmount, 'ether');

    const accounts = await web3.eth.getAccounts();
    contract.methods.requestLOC(sellerBankAddress, amount).send({from: accounts[0]})
    .then(receipt => {
        console.log('LOC Requested Successfully!\nTransaction Hash: ', receipt.transactionHash, '\nLOC ID: ', receipt.events.LOCRequested.returnValues.locId);
        alert('LOC Requested Successfully!\nTransaction Hash: ' + receipt.transactionHash + '\nLOC ID: ' + receipt.events.LOCRequested.returnValues.locId);
    }).catch(error => {
        console.error(error);
        alert('Error requesting LOC: ' + error.message);
    });
}

async function approveLOC() {
    const locId = document.getElementById('locIdApprove').value;

    const accounts = await web3.eth.getAccounts();
    contract.methods.approveLOC(locId).send({from: accounts[0]})
    .then(function(result) {
        console.log('LOC Approved!');
        alert('LOC Approved!');
    }).catch(function(error) {
        console.error(error);
        alert(error.message);
    });
}

async function fulfillLOC() {
    const locId = document.getElementById('locIdFulfill').value;

    const accounts = await web3.eth.getAccounts();
    contract.methods.fulfillLOC(locId).send({from: accounts[0]})
    .then(function(result) {
        console.log('LOC Fulfilled!');
        alert('LOC Fulfilled!');
    }).catch(function(error) {
        console.error(error);
        alert(error.message);
    });
}

async function rejectLOC() {
    const locId = document.getElementById('locIdReject').value;

    const accounts = await web3.eth.getAccounts();
    contract.methods.rejectLOC(locId).send({from: accounts[0]})
    .then(function(result) {
        console.log('LOC Rejected!');
        alert('LOC Rejected!');
    }).catch(function(error) {
        console.error(error);
        alert(error.message);
    });
}

async function getLOC() {
    const locId = document.getElementById('locIdGet').value;

    const accounts = await web3.eth.getAccounts();
    contract.methods.getLOC(locId).send({from: accounts[0]})
    .then(function(result) {
        console.log('Following is the LOC Information\nLOC ID: ', result.id, '\nBuyer Address: ', result.buyerBank, '\nSeller Address: ', result.sellerBank, '\nAmount: ', result.amount, '\nStatus: ', result.status);
        alert('Following is the LOC Information\nLOC ID: ' + result.id + '\nBuyer Address: ' + result.buyerBank + '\nSeller Address: ' + result.sellerBank + '\nAmount: ' + result.amount + '\nStatus: ' + result.status);
    }).catch(function(error) {
        console.error(error);
        alert(error.message);
    });
}

window.addEventListener('load', function() {
    initWeb3();
});
