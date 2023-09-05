const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_link",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_username",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_password",
				"type": "string"
			}
		],
		"name": "addPassword",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_link",
				"type": "string"
			}
		],
		"name": "getDatasByLink",
		"outputs": [
			{
				"internalType": "string",
				"name": "username",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "password",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPasswordsByAddress",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "link",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "username",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "password",
						"type": "string"
					}
				],
				"internalType": "struct PasswordManager.WebsiteInfo[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
const contractAddress = "0xc3631AA8efcEb01690cA39AC36D86Bb01254Bb32";

// events listener
const btnLogIn = document.getElementById("btnLogIn");
btnLogIn.addEventListener("click", connectMetaMask);


// MetaMask connection
async function connectMetaMask() {
    if (typeof window.ethereum !== "undefined") {
        try{
            const response = await window.ethereum.request({ method: "eth_requestAccounts" });
            const userAddress = response[0]
            //await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{chainId : '0x1'}] });

            const provider = new ethers.providers.Web3Provider(window.ethereum)
            await provider.send("eth_requestAccounts", []);            
            const signer = provider.getSigner()
            
            document.getElementById('btnLogIn').innerHTML = userAddress

            return [userAddress, provider, signer]

        } catch(e) {
            document.getElementById('btnLogIn').innerHTML = "Log in"
        }

    } else {
        alert("Meta Mask is not installed");
    }
}




const addPasswordForm = document.getElementById("addPasswordForm");
addPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const siteLink = document.getElementById("siteLink").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;    
    
    const a = await connectMetaMask();
    const signer = a[2];
    const contract = new ethers.Contract(contractAddress, abi, signer);


    try {
        const transaction = await contract.connect(signer).addPassword(siteLink, username, password);
        await transaction.wait();
        // Create a charging page here
        addPasswordForm.reset();
        alert("Your password has been successfully added !")
        await getPasswordsByAddress()
  
    } catch (error) {
        addPasswordForm.reset();
        alert("Error during the transaction")
    }
});


async function getPasswordsByAddress() { 

    const a = await connectMetaMask();
    const signer = a[2];
    const contract = new ethers.Contract(contractAddress, abi, signer);
    
    try {
        const userPasswordsList = document.getElementById("userPasswordsList");
        userPasswordsList.innerHTML = "";
    
        const passwordList = await contract.getPasswordsByAddress();
        const list = passwordList.map((passwordId) => passwordId.toString());
    
        // If list is empty : QUIT function et say that the user no have password yet
    
        for (let i = 0; i < list.length; i++) {
            const listIndex = list[i].split(",");

            const siteLinkElt = listIndex[0]
            const usernameElt = listIndex[1]
            const passwordElt = listIndex[2]

            // Create a div that include li and button to make a better style
            const siteLinkItem = document.createElement("li");
            siteLinkItem.textContent = `Website link : ${siteLinkElt}`;
            userPasswordsList.appendChild(siteLinkItem);
    
            const usernameItem = document.createElement("li");
            usernameItem.textContent = `Username : ${usernameElt}`;
            userPasswordsList.appendChild(usernameItem);
    
            const passwordItem = document.createElement("li");
            passwordItem.textContent = `Password : ${passwordElt}`;
            userPasswordsList.appendChild(passwordItem);
    
    
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete this password";
            deleteButton.addEventListener("click", async function () {
                // code here or call a function to delete this password
            });
            userPasswordsList.appendChild(deleteButton);
        }
    } catch (error) {
        console.log(error);
    }
}

await getPasswordsByAddress();