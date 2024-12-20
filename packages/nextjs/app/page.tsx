"use client"
import { useState, useEffect } from "react";


const Home = () => {
  const [nftImages, setNftImages] = useState<string[]>([]);

  useEffect(() => {
    // Dynamically generate NFTs
    const generateNFTs = () => {
      const backgroundColors = [
        "#D9E4F5", "#FFE9C6", "#C6E8E8", "#E8D8FF", "#FFDAC1", "#D5E8D4",
        "#FBE4E1", "#E0D8F3", "#D9F5E4", "#F4E5D4",
      ];
      const leftHalfColors = [
        "#FFFFFF", "#FFEB3B", "#FFD54F", "#FFCDD2", "#F8BBD0", "#DCE775",
        "#FFF59D", "#C8E6C9", "#B2EBF2", "#BBDEFB",
      ];
      const rightHalfColors = [
        "#000000", "#3E2723", "#263238", "#1B5E20", "#B71C1C", "#4A148C",
        "#880E4F", "#311B92", "#0D47A1", "#004D40",
      ];

      const images = [];

      for (let i = 0; i < 12; i++) { // Generate 10 NFTs for the gallery
        const bg = backgroundColors[i % backgroundColors.length];
        const left = leftHalfColors[i % leftHalfColors.length];
        const right = rightHalfColors[(i + 1) % rightHalfColors.length];

        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 600 600">
            <rect width="600" height="600" fill="${right}" />
            <g transform="translate(50,50)">
              <defs>
                <clipPath id="lefhalf-${i}">
                  <rect x="0" y="0" width="250" height="500"/>
                </clipPath>
              </defs>
              <circle cx="250" cy="250" r="250" fill="${left}" clip-path="url(#lefhalf-${i})" />

                 <defs>
                  <filter id="f1" x="-10%" y="-10%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10"/>
                  </filter>
                </defs>
                <circle cx="252" cy="250" r="250" fill="${left}"  filter="url(#f1)"/>



              <defs>
                <clipPath id="righthalf-${i}">
                  <rect x="250" y="0" width="250" height="500"/>
                </clipPath>
              </defs>
              <circle cx="250" cy="250" r="250" fill="${right}" clip-path="url(#righthalf-${i})" />
              
              <circle cx="250" cy="125" r="125" fill="${left}" />
              <circle cx="250" cy="375" r="125" fill="${right}" />
              <circle cx="250" cy="125" r="35" fill="${right}" />
              <circle cx="250" cy="375" r="35" fill="${left}" />

              //ETH Money Symbol
              '<rect x="235" y="109" width="30" height="3" z="10" fill="${left}" />',
              '<rect x="237" y="124" width="26" height="3" z="10" fill="${left}" />',
              '<rect x="235" y="139" width="30" height="3" z="10" fill="${left}" />',

              // Microchip in lower circle
              '<rect x="235" y="360" width="30" height="30" fill="${right}"/>',     
                         
              '<rect x="230" y="366" width="40" height="2" fill="${right}"/>',
              '<rect x="230" y="370" width="40" height="2" fill="${right}"/>',
              '<rect x="230" y="374" width="40" height="2" fill="${right}"/>',
              '<rect x="230" y="378" width="40" height="2" fill="${right}"/>',
              '<rect x="230" y="382" width="40" height="2" fill="${right}"/>',
              
              '<rect x="249" y="355" width="2" height="40" fill="${right}"/>',
              '<rect x="253" y="355" width="2" height="40" fill="${right}"/>',
              '<rect x="257" y="355" width="2" height="40" fill="${right}"/>',
              '<rect x="245" y="355" width="2" height="40" fill="${right}"/>',
              '<rect x="241" y="355" width="2" height="40" fill="${right}"/>',

              '<rect x="240" y="365" width="20" height="20" fill="none" stroke="${left}"/>',
              



              <!-- Define the S-shaped path for the text -->
              <defs>
                <path id="s-curve" d="
                  M290,20
                  A240,240 0 0,1 290,480        
                " fill="none" stroke="none"/>
              </defs>

              <text font-size="28" fill="${left}">
                <textPath href="#s-curve" startOffset="30%">ETH is money</textPath>
              </text>

              <defs>
                <path id="s-curve-reverse" d="
                  M50,350
                  A240,240 0 0,1 300,33
                " fill="none" stroke="none"/>
              </defs>
              <text font-size="24" fill="${right}">
                <textPath href="#s-curve-reverse" startOffset="10%">Ethereum is the world computer</textPath>
              </text>
            </g>
          </svg>
        `;

        images.push(svg);
      }

      setNftImages(images);
    };

    generateNFTs();
  }, []);

  return (
    <div className="flex flex-col items-center py-10">
      <div className="w-full px-5">        
        <h1 className="text-center mb-6">
        <span className="block text-center text-4xl font-bold">What is the Ethereum North Star?</span>
        <span className="block text-center text-2xl">Let's mint your NFT to tell the world.</span>
          <span className="block text-2xl ">7500 Supply. Onchain Data. Free Mint.</span>
          <a href="/myNFTs" className="block text-4xl font-bold underline">Free Mint NOW</a>        
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {nftImages.map((svg, index) => (
            <div
              key={index}
              dangerouslySetInnerHTML={{ __html: svg }}
              className="w-[300px] h-[300px] overflow-hidden rounded-xl border-4 border-primary"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
