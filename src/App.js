import "./css/App.css";
import Header from "./components/Header";
import NFTGenerator from "./NFTGenerator";
import React, { useState } from "react";
import Generate from "./components/Generate";
import { selectCurrentStep } from "./stepper/stepperSlice";
import { useSelector } from "react-redux";
import NftPreview from "./NftPreview";
import Preview from "./components/Preview";

function App() {
  const [nftData, setNftData] = useState([]);
  const currentStep = useSelector(selectCurrentStep);
  return (
    <div className="App">
      <Header />

      <header className="App-header">
        {currentStep === 1 && <NFTGenerator onGenerate={setNftData} />}
        {currentStep === 2 && <NftPreview imageData={nftData} />}
        {currentStep === 3 && <h2>hi pt-3</h2>}

        {/* <Generate/> */}
      </header>
    </div>
  );
}

export default App;
