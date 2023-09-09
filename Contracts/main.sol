// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PasswordManager {

    struct WebsiteInfo {
        string link;
        string username;
        string password;
    }

    mapping(address => WebsiteInfo[]) private userPasswords;


    function addPassword(string memory _link, string memory _username, string memory _password) public {
        require(bytes(_link).length > 0 && bytes(_username).length > 0 && bytes(_password).length > 0, "Link, username or password can't be null");
        WebsiteInfo memory newPassword = WebsiteInfo(_link, _username, _password);
        userPasswords[msg.sender].push(newPassword);
    }


    function getPasswordsByAddress() public view returns (WebsiteInfo[] memory) {
        return userPasswords[msg.sender];
    }


    function getDatasByLink(address _userAddress, string memory _link) public view returns (string memory username , string memory password){
        require(msg.sender == _userAddress, "You can only access your own passwords");
        
        WebsiteInfo[] memory userWebsites = userPasswords[_userAddress];
        for (uint256 i = 0; i < userWebsites.length; i++) {
            if (keccak256(abi.encodePacked(userWebsites[i].link)) == keccak256(abi.encodePacked(_link))) {
                // Correspondance trouvée pour le lien, renvoyer le nom d'utilisateur et le mot de passe
                return (userWebsites[i].username, userWebsites[i].password);
            }
        }
        revert("This link doesn't exists");
    }


    function deleteWebsite(string memory _link, string memory _username, string memory _password) public {
        WebsiteInfo[] storage userWebsites = userPasswords[msg.sender];
        uint256 indexToDelete = userWebsites.length;

        // Parcourir les sites de l'utilisateur pour trouver le bon à supprimer
        for (uint256 i = 0; i < userWebsites.length; i++) {
            if (
                keccak256(abi.encodePacked(userWebsites[i].link)) == keccak256(abi.encodePacked(_link)) &&
                keccak256(abi.encodePacked(userWebsites[i].username)) == keccak256(abi.encodePacked(_username)) &&
                keccak256(abi.encodePacked(userWebsites[i].password)) == keccak256(abi.encodePacked(_password))
            ) {
                indexToDelete = i;
                break;
            }
        }

        // Vérifier si le site a été trouvé et peut être supprimé
        require(indexToDelete < userWebsites.length, "Website not found or credentials do not match");

        // Supprimer le site en décalant les éléments à droite du tableau
        for (uint256 j = indexToDelete; j < userWebsites.length - 1; j++) {
            userWebsites[j] = userWebsites[j + 1];
        }

        // Réduire la taille du tableau d'un élément
        userWebsites.pop();
    }

}