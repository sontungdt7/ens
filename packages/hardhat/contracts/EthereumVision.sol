pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@limitbreak/creator-token-standards/src/access/OwnableBasic.sol";
import "@limitbreak/creator-token-standards/src/erc721c/ERC721C.sol";
import "@limitbreak/creator-token-standards/src/programmable-royalties/MinterCreatorSharedRoyalties.sol";

contract EthereumVision is OwnableBasic, ERC721C, MinterCreatorSharedRoyalties {
    using Strings for uint256;

    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public tokenCounter = 0;

    mapping(address => uint256) public mintedTokens;

    struct Colors {
        string leftHalf;
        string rightHalf;
    }

    mapping(uint256 => Colors) private tokenColors;
    mapping(bytes32 => bool) private colorCombinations; // To track existing combinations

    constructor(
        uint256 royaltyFeeNumerator_,
        uint256 minterShares_,
        uint256 creatorShares_,
        address creator_,
        address paymentSplitterReference_,
        string memory name_,
        string memory symbol_
    )
        ERC721OpenZeppelin(name_, symbol_)
        MinterCreatorSharedRoyalties(royaltyFeeNumerator_, minterShares_, creatorShares_, creator_, paymentSplitterReference_)
    {}

    function mint(string memory leftColor, string memory rightColor) public {
        require(tokenCounter < MAX_SUPPLY, "Max supply reached");
        require(mintedTokens[msg.sender] < 3, "Max 3 NFTs per wallet");

        bytes32 colorHash = keccak256(abi.encodePacked(leftColor, rightColor));
        require(!colorCombinations[colorHash], "Color combination already exists");

        uint256 tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);

        tokenColors[tokenId] = Colors(leftColor, rightColor);
        colorCombinations[colorHash] = true; // Mark the combination as used

        tokenCounter += 1;
        mintedTokens[msg.sender] += 1;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");

        Colors memory colors = tokenColors[tokenId];
        string memory svgImage = string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">',
                '<g transform="translate(50,50)">',
                // Left Half
                '<defs><clipPath id="lefthalf"><rect x="0" y="0" width="250" height="500"/></clipPath></defs>',
                '<circle cx="250" cy="250" r="250" fill="', colors.leftHalf, '" clip-path="url(#lefthalf)"/>',
                // Right Half
                '<defs><clipPath id="righthalf"><rect x="250" y="0" width="250" height="500"/></clipPath></defs>',
                '<circle cx="250" cy="250" r="250" fill="', colors.rightHalf, '" clip-path="url(#righthalf)"/>',
                // Small Circles
                '<circle cx="250" cy="125" r="125" fill="', colors.leftHalf, '"/>',
                '<circle cx="250" cy="375" r="125" fill="', colors.rightHalf, '" />',
                '<circle cx="250" cy="125" r="35" fill="', colors.rightHalf, '"/>',
                '<circle cx="250" cy="375" r="35" fill="', colors.leftHalf, '"/>',
                '</g>',
                '</svg>'
            )
        );

        string memory imageBase64 = Base64.encode(bytes(svgImage));
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Ethereum Vision #',
                        tokenId.toString(),
                        '", "description": "An on-chain Ethereum Vision NFT.", "image": "data:image/svg+xml;base64,',
                        imageBase64,
                        '"}'
                    )
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function getColors(uint256 tokenId) public view returns (Colors memory) {
        require(_exists(tokenId), "Token does not exist");
        return tokenColors[tokenId];
    }

    // The following functions are overrides required by Solidity.
    function burn(uint256 tokenId) external {
        _burn(tokenId);

        Colors memory colors = tokenColors[tokenId];
        bytes32 colorHash = keccak256(abi.encodePacked(colors.leftHalf, colors.rightHalf));
        delete colorCombinations[colorHash]; // Free up the color combination
    }

    function _mint(address to, uint256 tokenId) internal virtual override {
        _onMinted(to, tokenId);
        super._mint(to, tokenId);
    }

    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);
        _onBurned(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721C, MinterCreatorSharedRoyaltiesBase) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
