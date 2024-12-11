"use client";

import { MyHoldings } from "./_components";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { addToIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
import nftsMetadata from "~~/utils/simpleNFT/nftsMetadata";
import { useState } from "react";

const MyNFTs: NextPage = () => {
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();
  const [leftColor, setLeftColor] = useState("#ffffff");
  const [rightColor, setRightColor] = useState("#000000");

  const { writeContractAsync } = useScaffoldWriteContract("EthereumNorthStar");

  const { data: tokenIdCounter } = useScaffoldReadContract({
    contractName: "EthereumNorthStar",
    functionName: "tokenCounter",
    watch: true,
  });
  console.log("handleMintItem", tokenIdCounter);

  const handleMintItem = async () => {    
    const notificationId = notification.loading("Minting...");
    try {
      // const uploadedItem = await addToIPFS(currentTokenMetaData);      

      await writeContractAsync({
        functionName: "mint", 
        args: [leftColor, rightColor],       
      });
      // First remove previous loading notification and then show success notification
      notification.remove(notificationId);
      notification.success("Mint Success");

    } catch (error) {
      notification.remove(notificationId);
      console.error(error);
    }

    
  };

  return (
    <>      
      <div className="card w-full max-w-3xl mx-auto ">
      <div className="card-body">        
        <h2 className="card-title text-center justify-center">Design your Ethereum North Star</h2>
        <div className="flex flex-col  items-center justify-between gap-1">
          
          {/* Yin Yang Symbol */}
          <div className="w-full flex justify-center">
            <div className="">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="350" height="350">
                
                <rect width="600" height="600" fill={rightColor} />
                <g transform="translate(50,50)">
                  
                  <defs>
                    <clipPath id="lefhalf">
                      <rect x="0" y="0" width="250" height="500"/>
                    </clipPath>
                  </defs>
                  
                  <circle cx="250" cy="250" r="250" fill={leftColor} clip-path="url(#lefhalf)" />

                  <defs>
                    <filter id="f1" x="-10%" y="-10%" xmlns="http://www.w3.org/2000/svg">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="10"/>
                    </filter>
                  </defs>
                  <circle cx="252" cy="250" r="250" fill={leftColor} filter="url(#f1)"/>

                  
                  <defs>
                    <clipPath id="righthalf">
                      <rect x="250" y="0" width="250" height="500"/>
                    </clipPath>
                  </defs>
                  
                  <circle cx="250" cy="250" r="250" fill={rightColor} clip-path="url(#righthalf)"/>

                  <circle cx="250" cy="125" r="125" fill={leftColor} />
                  <circle cx="250" cy="375" r="125" fill={rightColor} />
                  <circle cx="250" cy="125" r="35" fill={rightColor} />

                  <rect x="235" y="109" width="30" height="3" z="10" fill={leftColor} />
                  <rect x="237" y="124" width="26" height="3" z="10" fill={leftColor} />
                  <rect x="235" y="139" width="30" height="3" z="10" fill={leftColor} />

                  <circle cx="250" cy="375" r="35" fill={leftColor} />
                  <rect x="235" y="360" width="30" height="30" fill={rightColor} />

                  <rect x="230" y="366" width="40" height="2" fill={rightColor} />
                  <rect x="230" y="370" width="40" height="2" fill={rightColor} />
                  <rect x="230" y="374" width="40" height="2" fill={rightColor} />
                  <rect x="230" y="378" width="40" height="2" fill={rightColor} />
                  <rect x="230" y="382" width="40" height="2" fill={rightColor} />

                  <rect x="249" y="355" width="2" height="40" fill={rightColor} />
                  <rect x="253" y="355" width="2" height="40" fill={rightColor} />
                  <rect x="257" y="355" width="2" height="40" fill={rightColor} />
                  <rect x="245" y="355" width="2" height="40" fill={rightColor} />
                  <rect x="241" y="355" width="2" height="40" fill={rightColor} />
                  <rect x="241" y="366" width="18" height="18" fill="none" stroke-width="2" stroke={leftColor}/>

                  <defs>
                    <path id="s-curve-left" d="
                      M250,50
                      A200,200 0 0,1 250,250
                      A100,100 0 0,0 250,150
                    " fill="none" stroke="none"/>
                  </defs>

                  <defs>
                    <path id="s-curve" d="
                      M290,20
                      A240,240 0 0,1 290,480        
                    " fill="none" stroke="none"/>
                  </defs>

                  <text font-size="28" fill={leftColor}>
                    <textPath href="#s-curve" startOffset="30%">
                      ETH is money
                    </textPath>
                  </text>

                  <defs>
                    <path id="s-curve-reverse" d="
                      M50,350
                      A240,240 0 0,1 300,33
                    " fill="none" stroke="none"/>
                  </defs>

                  <text font-size="24" fill={rightColor}>
                    <textPath href="#s-curve-reverse" startOffset="10%">
                      Ethereum is the world computer
                    </textPath>
                  </text>
                </g>
              </svg>
            </div>
          </div>

          <div className="w-full flex justify-center">
            {/* Light Color Input */}
            <div className="form-control text-center w-full md:w-1/4">
              <label className="label justify-center" htmlFor="leftColor">
                <span className="label-text text-center">Left Color</span>
              </label>
              <div className="flex flex-column items-center space-x-2">
                <input
                  type="color"
                  id="leftColor"
                  value={leftColor}
                  onChange={(e) => setLeftColor(e.target.value)}
                  className="input h-10 w-full"
                />              
              </div>
              <div className="text-sm font-mono">{leftColor}</div>
            </div>

            {/* Dark Color Input */}
            <div className="form-control w-full md:w-1/4">
              <label className="label justify-center" htmlFor="rightColor">
                <span className="label-text">Right Color</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  id="rightColor"
                  value={rightColor}
                  onChange={(e) => setRightColor(e.target.value)}
                  className="input h-10 w-full"
                />              
              </div>
              <span className="text-sm font-mono text-center">{rightColor}</span>
            </div>
          </div> 
          <div className="flex justify-center w-full">
            {/* {!isConnected || isConnecting ? (
              <RainbowKitCustomConnectButton />
            ) : ( */}
              <button className="btn btn-secondary w-full" onClick={handleMintItem}>
                Free Mint NFT
              </button>
            {/* )} */}
          </div>        
        </div>        
        
        <span className="block text-xl text-center">Minted: {tokenIdCounter?.toLocaleString()}/7500 </span>
        </div>
         
      </div>
    
      {/* <MyHoldings /> */}
    </>
  );
};

export default MyNFTs;
