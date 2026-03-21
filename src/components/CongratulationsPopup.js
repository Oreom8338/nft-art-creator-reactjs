import React from 'react';

export default function CongratulationsPopup({ onClose }) {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" 
      style={{ zIndex: 1000 }} // Ensure the overlay is on top of other content
    >
      <div className="bg-white p-6 max-w-3xl mx-auto my-10 rounded shadow-lg relative" style={{ zIndex: 1001 }}>
        <button 
          onClick={onClose} 
          className="absolute top-0 right-0 m-4 text-lg font-bold" 
          aria-label="Close"
        >
          &times; {/* This is a simple 'X' character used as a close button */}
        </button>
        <h2 className="text-xl font-bold mb-4">Congratulations!</h2>
        <p className="mb-4">Your NFTs and Metadata files have now been generated and downloaded. Rarity for your collection has been assigned based on our randomized algorithm.*</p>
        
        <p className="mb-4">We’d recommend you review all your NFTs before closing or refreshing the NFT Generator.</p>
        
        <p className="mb-4">For the security and privacy of your collection, we do not store your NFTs or Metadata on our server. These files will only live on your device.</p>
        
        <p className="mb-4">Once you close or refresh, the NFT Generator will be reset and you will need to upload all image files and settings again.</p>
        
        <p className="mb-4 italic">* If you have your own customized Rarity Table, please open a ticket in our Discord server and we’ll assign that to your collection. <a href="" className="text-blue-500 visited:text-purple-600">https://discord.gg/nAUFJcvvPE</a></p>
      </div>
    </div>
  );
}
