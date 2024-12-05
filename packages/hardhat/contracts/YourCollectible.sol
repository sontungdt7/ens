// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract YourCollectible is ERC721 {
    using Strings for uint256;

    constructor() ERC721("YourCollectible", "YC") {}

    function mint(uint256 tokenId) public {
        _safeMint(msg.sender, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");

        string memory svgImage = generateSVG(tokenId);
        string memory imageBase64 = Base64.encode(bytes(svgImage));

        string memory json = Base64.encode(
            bytes(
                abi.encodePacked(
                    '{"name": "Yin Yang NFT #',
                    tokenId.toString(),
                    '", "description": "An on-chain Yin Yang NFT.", "image": "data:image/svg+xml;base64,',
                    imageBase64,
                    '"}'
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function generateSVG(uint256 tokenId) internal pure returns (string memory) {
        // Define color arrays
        string[10] memory backgroundColors = ["#D9E4F5", "#FFE9C6", "#C6E8E8", "#E8D8FF", "#FFDAC1", "#D5E8D4", "#FBE4E1", "#E0D8F3", "#D9F5E4", "#F4E5D4"];
        string[10] memory leftHalfColors = ["#FFFFFF", "#FFEB3B", "#FFD54F", "#FFCDD2", "#F8BBD0", "#DCE775", "#FFF59D", "#C8E6C9", "#B2EBF2", "#BBDEFB"];
        string[10] memory rightHalfColors = ["#000000", "#3E2723", "#263238", "#1B5E20", "#B71C1C", "#4A148C", "#880E4F", "#311B92", "#0D47A1", "#004D40"];

        // Select colors based on tokenId
        string memory backgroundColor = backgroundColors[tokenId % backgroundColors.length];
        string memory leftColor = leftHalfColors[tokenId % leftHalfColors.length];
        string memory rightColor = rightHalfColors[tokenId % rightHalfColors.length];

        // Ensure left and right colors are not the same
        if (keccak256(bytes(leftColor)) == keccak256(bytes(rightColor))) {
            rightColor = rightHalfColors[(tokenId + 1) % rightHalfColors.length];
        }

        // Build the SVG
        return string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">',
                '<rect width="600" height="600" fill="', backgroundColor, '"/>',
                '<g transform="translate(50,50)">',
                // Left Half
                '<defs><clipPath id="lefthalf"><rect x="0" y="0" width="250" height="500"/></clipPath></defs>',
                '<circle cx="250" cy="250" r="250" fill="', leftColor, '" clip-path="url(#lefthalf)"/>',
                // Right Half
                '<defs><clipPath id="righthalf"><rect x="250" y="0" width="250" height="500"/></clipPath></defs>',
                '<circle cx="250" cy="250" r="250" fill="', rightColor, '" clip-path="url(#righthalf)"/>',
                // Small Circles
                '<circle cx="250" cy="125" r="35" fill="', rightColor, '"/>',
                '<circle cx="250" cy="375" r="35" fill="', leftColor, '"/>',
                // Additional elements as needed
                '</g>',
                '</svg>'
            )
        );
    }
}
