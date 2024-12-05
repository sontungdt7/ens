// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract ENS is ERC721, ERC721Enumerable {
    using Strings for uint256;

    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public tokenCounter = 0;

    mapping(address => uint256) public mintedTokens;

    constructor() ERC721("ENS", "ENS") {}

    function mint() public {
        require(tokenCounter < MAX_SUPPLY, "Max supply reached");
        require(mintedTokens[msg.sender] < 3, "Max 3 NFTs per wallet");

        uint256 tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);

        tokenCounter += 1;
        mintedTokens[msg.sender] += 1;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");

        string memory svgImage = generateSVG(tokenId);
        string memory imageBase64 = Base64.encode(bytes(svgImage));

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Yin Yang NFT #',
                        tokenId.toString(),
                        '", "description": "An on-chain Yin Yang NFT.", "image": "data:image/svg+xml;base64,',
                        imageBase64,
                        '"}'
                    )
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function generateSVG(uint256 tokenId) internal pure returns (string memory) {
        // Define color arrays
        string[10] memory backgroundColors = [
            "#D9E4F5", "#FFE9C6", "#C6E8E8", "#E8D8FF", "#FFDAC1",
            "#D5E8D4", "#FBE4E1", "#E0D8F3", "#D9F5E4", "#F4E5D4"
        ];
        string[10] memory leftHalfColors = [
            "#FFFFFF", "#FFEB3B", "#FFD54F", "#FFCDD2", "#F8BBD0",
            "#DCE775", "#FFF59D", "#C8E6C9", "#B2EBF2", "#BBDEFB"
        ];
        string[10] memory rightHalfColors = [
            "#000000", "#3E2723", "#263238", "#1B5E20", "#B71C1C",
            "#4A148C", "#880E4F", "#311B92", "#0D47A1", "#004D40"
        ];

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
                '<circle cx="250" cy="125" r="125" fill="', leftColor, '" />',
                '<circle cx="250" cy="375" r="125" fill="', rightColor,'" />',
                '<circle cx="250" cy="125" r="35" fill="', rightColor, '"/>',
                '<circle cx="250" cy="375" r="35" fill="', leftColor, '"/>',
                
                //ETH Money Symbol
                '<rect x="235" y="109" width="30" height="3" z="10" fill="', leftColor, '" />',
                '<rect x="237" y="124" width="26" height="3" z="10" fill="', leftColor, '" />',
                '<rect x="235" y="139" width="30" height="3" z="10" fill="', leftColor, '" />',

                // Microchip in lower circle
                '<rect x="235" y="360" width="30" height="30" fill="', rightColor, '"/>',                
                '<rect x="225" y="366" width="50" height="2" fill="', rightColor, '"/>',
                '<rect x="225" y="370" width="50" height="2" fill="', rightColor, '"/>',
                '<rect x="225" y="374" width="50" height="2" fill="', rightColor, '"/>',
                '<rect x="225" y="378" width="50" height="2" fill="', rightColor, '"/>',
                '<rect x="225" y="382" width="50" height="2" fill="', rightColor, '"/>',
                
                '<rect x="249" y="350" width="2" height="50" fill="', rightColor, '"/>',
                '<rect x="253" y="350" width="2" height="50" fill="', rightColor, '"/>',
                '<rect x="257" y="350" width="2" height="50" fill="', rightColor, '"/>',
                '<rect x="245" y="350" width="2" height="50" fill="', rightColor, '"/>',
                '<rect x="241" y="350" width="2" height="50" fill="', rightColor, '"/>',

                '<rect x="240" y="365" width="20" height="20" fill="none" stroke="', leftColor, '"/>',

                '<defs> <path id="s-curve" d="M280,20 A240,240 0 0,1 150,500" fill="none" stroke="none"/> </defs>',                    
                '<defs> <path id="s-curve-reverse" d="M50,350 A240,240 0 0,1 300,30" fill="none" stroke="none"/></defs>',
                
                '<text font-size="30" fill="', leftColor, '">',
                '<textPath href="#s-curve" startOffset="30%">ETH is money</textPath>',
                '</text>',
                '<text font-size="24" fill="', rightColor, '">',
                '<textPath href="#s-curve-reverse" startOffset="10%">Ethereum is the world computer</textPath>',
                '</text>',

                // Additional elements as needed
                '</g>',
                '</svg>'
            )
        );
    }

    // The following functions are overrides required by Solidity.

	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 tokenId,
		uint256 quantity
	) internal override(ERC721, ERC721Enumerable) {
		super._beforeTokenTransfer(from, to, tokenId, quantity);
	}

	function _burn(
		uint256 tokenId
	) internal override(ERC721) {
		super._burn(tokenId);
	}

    function supportsInterface(
		bytes4 interfaceId
	)
		public
		view
		override(ERC721, ERC721Enumerable)
		returns (bool)
	{
		return super.supportsInterface(interfaceId);
	}
}
