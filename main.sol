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


    function getPasswordsByAddress(address _userAddress) public view returns (WebsiteInfo[] memory) {
        require(msg.sender == _userAddress, "You can only access your own passwords");
        return userPasswords[_userAddress];
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
}