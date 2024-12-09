pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@limitbreak/creator-token-standards/src/access/OwnableBasic.sol";
import "@limitbreak/creator-token-standards/src/erc721c/ERC721C.sol";
import "@limitbreak/creator-token-standards/src/programmable-royalties/MinterCreatorSharedRoyalties.sol";

contract EthereumNorthStar is OwnableBasic, ERC721C, MinterCreatorSharedRoyalties {
    using Strings for uint256;

    uint256 public constant MAX_SUPPLY = 7500;
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
        require(mintedTokens[msg.sender] < 10, "Max 10 NFTs per wallet");

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
                '<rect width="600" height="600" fill="', colors.rightHalf, '" />',
                '<g transform="translate(50,50)">',
                // Left Half
                '<defs><clipPath id="lefthalf"><rect x="0" y="0" width="250" height="500"/></clipPath></defs>',
                '<circle cx="250" cy="250" r="250" fill="', colors.leftHalf, '" clip-path="url(#lefthalf)"/>',

                '<defs>',
                    '<filter id="f1" x="-10%" y="-10%">',
                        '<feGaussianBlur in="SourceGraphic" stdDeviation="10"/>',
                    '</filter>',
                '</defs>',
                '<circle cx="252" cy="250" r="250" fill="', colors.leftHalf, '"  filter="url(#f1)"/>',

                // Right Half
                '<defs><clipPath id="righthalf"><rect x="250" y="0" width="250" height="500"/></clipPath></defs>',
                '<circle cx="250" cy="250" r="250" fill="', colors.rightHalf, '" clip-path="url(#righthalf)"/>',
                // Small Circles
                '<circle cx="250" cy="125" r="125" fill="', colors.leftHalf, '"/>',
                '<circle cx="250" cy="375" r="125" fill="', colors.rightHalf, '" />',
                '<circle cx="250" cy="125" r="35" fill="', colors.rightHalf, '"/>',
                // '<circle cx="250" cy="375" r="35" fill="', colors.leftHalf, '"/>',
                

                '<rect x="235" y="109" width="30" height="3" z="10" fill="', colors.leftHalf, '" />',
                '<rect x="237" y="124" width="26" height="3" z="10" fill="', colors.leftHalf, '" />',
                '<rect x="235" y="139" width="30" height="3" z="10" fill="', colors.leftHalf, '" />',

                '<circle cx="250" cy="375" r="35" fill="', colors.leftHalf, '" />',
                '<rect x="235" y="360" width="30" height="30" fill="', colors.rightHalf, '" />',
                '<rect x="230" y="366" width="40" height="2" fill="', colors.rightHalf, '" />',
                '<rect x="230" y="370" width="40" height="2" fill="', colors.rightHalf, '" />',
                '<rect x="230" y="374" width="40" height="2" fill="', colors.rightHalf, '" />',
                '<rect x="230" y="378" width="40" height="2" fill="', colors.rightHalf, '" />',
                '<rect x="230" y="382" width="40" height="2" fill="', colors.rightHalf, '" />',

                '<rect x="249" y="355" width="2" height="40" fill="', colors.rightHalf, '" />',
                '<rect x="253" y="355" width="2" height="40" fill="', colors.rightHalf, '" />',
                '<rect x="257" y="355" width="2" height="40" fill="', colors.rightHalf, '" />',
                '<rect x="245" y="355" width="2" height="40" fill="', colors.rightHalf, '" />',
                '<rect x="241" y="355" width="2" height="40" fill="', colors.rightHalf, '" />',
                '<rect x="241" y="366" width="18" height="18" fill="none" stroke-width="2" stroke="', colors.leftHalf, '"/>',
                

                '<defs><path id="s-curve" d="M290,20 A240,240 0 0,1 290,480"  fill="none" stroke="none" /></defs>',
                   
                '<text font-size="28" fill="', colors.leftHalf, '">',
                '<textPath href="#s-curve" startOffset="30%" >',
                    'ETH is money',
                '</textPath>',
                '</text>',
                
                '<defs>',
                    '<path id="s-curve-reverse" d="M50,350 A240,240 0 0,1 300,33"  fill="none" stroke="none" />',
                '</defs>',
                
                '<text font-size="24" fill="', colors.rightHalf, '">',
                '<textPath href="#s-curve-reverse" startOffset="10%">',
                    'Ethereum is the world computer',
                '</textPath>',
                '</text>',


                '</g>',
                '</svg>'
            )
        );

        string memory imageBase64 = Base64.encode(bytes(svgImage));
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Ethereum North Star #',
                        tokenId.toString(),
                        '", "description": "An onchain Ethereum North Star NFT.", "image": "data:image/svg+xml;base64,',
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
