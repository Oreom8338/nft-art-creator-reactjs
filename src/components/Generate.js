import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import JSZip from "jszip";
import FileSaver from "file-saver";
import { generateNFT } from "../modules/generateNFT";
import { Spinner } from "react-bootstrap";
import CongratulationsPopup from "./CongratulationsPopup";
// import downloadIcon from ''

const Generate = ({ props }) => {
  const [dropdownValue, setDropdownValue] = useState("ETHEREUM");
  const [formatValue, setFormatValue] = useState("image/png");

  const [collectionName, setCollectionName] = useState("");
  const [collectionDesc, setCollectionDesc] = useState("");

  const [symbolName, setSymbolName] = useState("");
  const [extUrlName, setExtUrlName] = useState("");
  const [animUrlName, setAnimUrlName] = useState("");
  const [feePoints, setFeePoints] = useState(0);
  const [collectionSize, setCollectionSize] = useState(); // Default to 1 or any sensible default

  const [customWidth, setCustomWidth] = useState(1000); // State hook for custom width
  const [customHeight, setCustomHeight] = useState(1000); // State hook for custom height
  const [startIndex, setStartIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState(false); // State hook for generation success
  const [generateClicked, setGenerateClicked] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [showCongratsPopup, setShowCongratsPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [batches, setBatches] = useState([]);
  const [showBatchDownloadModal, setShowBatchDownloadModal] = useState(false);
  const [splitedResult, setSplitedResult] = useState([]);
  const [resultNft, setResultNft] = useState([]);
  /************/

  const handleDropdownChange = (event) => {
    setDropdownValue(event.target.value);
  };

  /************/

  const handleCustomWidthChange = (e) => {
    setCustomWidth(e.target.value);
  };

  /************/

  const handleCustomHeightChange = (e) => {
    setCustomHeight(e.target.value);
  };

  /************/

  const handleFormatChange = (event) => {
    setFormatValue(event.target.value);
  };

  /************/

  const handleCollectionName = (event) => {
    setCollectionName(event.target.value);
  };

  /************/

  const handleCollectionDesc = (event) => {
    setCollectionDesc(event.target.value);
  };

  /************/

  const handleSymbolChange = (event) => {
    setSymbol(event.target.value);
  };

  /************/

  const handleWalletAddressChange = (event) => {
    setWalletAddress(event.target.value);
  };

  /************/

  const handleSymbolName = (event) => {
    setSymbolName(event.target.value);
  };

  /************/

  const handleExtUrlName = (event) => {
    setExtUrlName(event.target.value);
  };

  /************/

  const handleAnimUrlName = (event) => {
    setAnimUrlName(event.target.value);
  };

  /************/

  const handleGenerationSuccessClose = () => {
    setGenerationSuccess(false);
    setShowCongratsPopup(true);
  };

  /************/

  const handleClose = () => {
    setShowCongratsPopup(false);
  };

  useEffect(() => {
    if (collectionSize > 1) {
      const numberOfBatches = Math.ceil(collectionSize / 100);
      const newBatches = Array.from({ length: numberOfBatches }, (_, index) => {
        const start = index * 100;
        const end =
          (index + 1) * 100 < collectionSize
            ? (index + 1) * 100
            : collectionSize;
        return { start, end };
      });
      setBatches(newBatches);
    }
  }, [collectionSize]);

  // Validate form fields
  const validateForm = () => {
    let tempErrors = {};
    tempErrors.collectionName = collectionName ? "" : "This field is required.";
    tempErrors.collectionDesc = collectionDesc ? "" : "This field is required.";
    tempErrors.symbol = symbol ? "" : "This field is required.";
    tempErrors.walletAddress = walletAddress ? "" : "This field is required.";
    tempErrors.collectionSize = collectionSize > 0 ? "" : "Must be at least 1.";
    tempErrors.customWidth = customWidth
      ? customWidth <= 1200
        ? ""
        : "Width cannot exceed 1200px."
      : "This field is required.";
    tempErrors.customHeight = customHeight
      ? customHeight <= 1200
        ? ""
        : "Height cannot exceed 1200px."
      : "This field is required.";
    setErrors(tempErrors);

    return Object.values(tempErrors).every((x) => x === "");
  };

  // Effect hook to reset errors when user starts typing
  useEffect(() => {
    if (
      collectionName ||
      collectionDesc ||
      collectionSize > 0 ||
      symbol ||
      walletAddress ||
      customWidth ||
      customHeight
    ) {
      validateForm();
    }
  }, [
    collectionName,
    collectionDesc,
    collectionSize,
    symbol,
    walletAddress,
    customWidth,
    customHeight,
  ]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      setShowBatchDownloadModal(true);
    }
  };

  const download = async (batch = null) => {
    const start = batch ? batch.start : 0;
    const end = batch ? batch.end : collectionSize;
    let index = 0;
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);

    let w = customWidth || props.w;
    let h = customHeight || props.h;
    let mime = formatValue;
    let ext = mime.includes("jpeg") ? "jpg" : "png";

    const result = await generateNFT(
      props.images,
      w,
      h,
      mime,
      end - start,
      setSplitedResult,
      setResultNft
    );
    // setResult(result);
  };

  useEffect(() => {
    if (generateClicked) {
      generateZip();
    }
  }, [splitedResult]);

  const generateZip = async (batch = null) => {
    const start = batch ? batch.start : 0;
    const end = batch ? batch.end : collectionSize; // Ensure `collectionSize` and `batch` are correctly defined
    let index = 0; // Consider if `index` is needed and where it's defined
    console.log("start", start);
    console.log("end", end);
    // Assuming setIsLoading, generateNFT, MetaJSON, etc., are accessible
    const zip = new JSZip();
    let w = customWidth || props.w;
    let h = customHeight || props.h;
    let mime = formatValue; // Ensure `formatValue` is defined
    let ext = mime.includes("jpeg") ? "jpg" : "png";

    const metaFolder = zip.folder("Metadata");
    const nftFolder = zip.folder("NFT-Collection");
    // [0][0].original
    for (let i = start; i < splitedResult.length; i++) {
      console.log("splitedResult-->", splitedResult);
      console.log("resultNft-->", resultNft);
      console.log("resultNft-->", resultNft[i - start]);
      console.log(i);

      const imgData = resultNft[i - start].original.split(",")[1];
      console.log("imgData-->", imgData);

      const fileName = `${i + startIndex}.${ext}`; // Ensure `startIndex` is defined
      const meta = await MetaJSON(
        splitedResult[index],
        fileName,
        i + startIndex
      );
      index++;

      nftFolder.file(fileName, imgData, { base64: true });
      metaFolder.file(`${i + startIndex}.json`, JSON.stringify(meta));
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      FileSaver.saveAs(
        content,
        `${collectionName.replaceAll(" ", "-").toLowerCase()}-nft.zip` // Ensure `collectionName` is accessible
      );
    });

    props.setShowGenerate([]);
    setIsLoading(false);
    setGenerationSuccess(true);
    setShowBatchDownloadModal(true);
  };
  /************/

  function MetaJSON(splResult, fileName, index) {
    return new Promise((resolve, reject) => {
      const attributes = [];
      for (let i = 0; i < splResult.length; i++) {
        let matchFound = false; // Initialize matchFound here for each splResult item

        for (let j = 0; j < props.images.data.length && !matchFound; j++) {
          for (
            let k = 0;
            k < props.images.data[j].files.length && !matchFound;
            k++
          ) {
            if (props.images.data[j].files[k].id === splResult[i].id) {
              attributes.push({
                trait_type: props.images.data[j].name, // Assuming this is the correct attribute
                value: splResult[i].id,
              });
              matchFound = true; // Found a match, no need to search further
            }
          }
        }
      }

      const meta = {
        name: `${collectionName} #${index + 1}`,
        symbol: symbol,
        description: collectionDesc,
        image: fileName,
        edition: index + 1,
        attributes: attributes,
        properties: {
          files: [
            {
              uri: fileName,
              type: formatValue,
            },
          ],
          category: "image",
          creators: [walletAddress],
        },
        compiler: "Pandasticals.io",
      };

      resolve(meta);
    });
  }

  /************/

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div>
          <div className="flex flex-col  ">
            <div className="py-2 flex ">
              <img
                className="w-[22px] h-[22.13px] mr-2"
                src="../settings-alt.png"
              />
              <h1 className="sec_heading">Collection Setting</h1>
            </div>
            <label className="collection_label mb-0">Collection Name </label>
            <div className="py-1">
              <input
                type="text"
                placeholder="Enter Collection Name"
                className={`collection_input ${
                  generateClicked && errors.collectionName
                    ? "border-danger"
                    : ""
                }`}
                value={collectionName}
                onChange={handleCollectionName}
              />
              {generateClicked && errors.collectionName && (
                <div className="text-danger">{errors.collectionName}</div>
              )}
            </div>

            <label className="py-2 collection_label ">
              Collection description
            </label>
            <div className="">
              <input
                type="text"
                placeholder="Enter Description"
                className={`collection_input ${
                  generateClicked && errors.collectionDesc
                    ? "border-danger"
                    : ""
                }`}
                maxLength={1000}
                value={collectionDesc}
                onChange={handleCollectionDesc}
              />
              {generateClicked && errors.collectionDesc && (
                <div className="text-danger">{errors.collectionDesc}</div>
              )}
            </div>
            {/* symbol */}
            <div className="py-1">
              <label className="collection_label mb-0">Symbol</label>
              <input
                type="text"
                placeholder="Enter Symbol"
                className={`collection_input ${
                  generateClicked && !symbol ? "border-danger" : ""
                }`}
                value={symbol}
                onChange={handleSymbolChange}
              />
              {generateClicked && !symbol && (
                <div className="text-danger">Symbol is required.</div>
              )}
            </div>

            <div className="py-1">
              <label className="collection_label mb-0">Wallet Address</label>
              <input
                type="text"
                placeholder="Enter Wallet Address"
                className={`collection_input ${
                  generateClicked && !walletAddress ? "border-danger" : ""
                }`}
                value={walletAddress}
                onChange={handleWalletAddressChange}
              />
              {generateClicked && !walletAddress && (
                <div className="text-danger">Wallet Address is required.</div>
              )}
            </div>
            <div className="py-1">
              <label className="py-2 collection_label">
                Start Index (0 or 1):
              </label>
              <input
                type="number"
                className="collection_input"
                value={startIndex}
                onChange={(e) =>
                  setStartIndex(
                    Math.max(0, Math.min(1, parseInt(e.target.value, 10)))
                  )
                }
                min="0"
                max="1"
              />
            </div>
            <div className="flex items-center justify-center gap-4 w-full  ">
              <div className="py-1">
                <label className="py-2 collection_label">Width (px)</label>
                <input
                  type="number"
                  className={`collection_input ${
                    errors.customWidth ? "border-danger" : ""
                  }`}
                  onChange={handleCustomWidthChange}
                  value={customWidth}
                />
              </div>
              <div className="text-lg font-medium mt-[34px]">X</div>
              <div className="py-2">
                <label className="py-2 collection_label">Height (px)</label>
                <input
                  type="number"
                  placeholder=""
                  className={`collection_input ${
                    errors.customHeight ? "border-danger" : ""
                  }`}
                  value={customHeight}
                  onChange={handleCustomHeightChange}
                />
              </div>
            </div>
            <div className="py-1">
              <label className="py-2 collection_label">Collection Size</label>
              <div className="py-1">
                <input
                  type="number"
                  className={`collection_input ${
                    generateClicked && errors.collectionSize
                      ? "border-danger"
                      : ""
                  }`}
                  value={collectionSize}
                  onChange={(e) =>
                    setCollectionSize(
                      Math.max(1, parseInt(e.target.value) || 1)
                    )
                  }
                  min="1"
                />
                {generateClicked && errors.collectionSize && (
                  <div className="text-danger">{errors.collectionSize}</div>
                )}
              </div>

              <Form.Group className="mb-0 hidden">
                <Form.Check
                  style={{ fontSize: "0.75em" }}
                  onChange={handleFormatChange}
                  type="radio"
                  name="radio"
                  inline
                  label="PNG"
                  value={"image/png"}
                  defaultChecked
                />
              </Form.Group>
            </div>
            <button
              type="submit"
              className="bg-[#000] text-white p-2 rounded-md"
              onClick={(e) => setGenerateClicked(true)}
            >
              {isLoading ? "Generating..." : "Generate"}{" "}
              {/* Show loading text */}
            </button>
          </div>
        </div>
      </form>
      {/* Loading modal */}
      <Modal show={isLoading} onHide={() => setIsLoading(false)} centered>
        <Modal.Body className="text-center">
          <Spinner
            animation="border"
            role="status"
            variant="primary"
            className="mb-3"
          />{" "}
          <div className="text-center mt-4">
            <p className="text-lg font-bold">Generating...</p>
            <p className="text-sm font-semibold text-gray-600">
              This may take a few minutes depending on file sizes
            </p>
          </div>
        </Modal.Body>
      </Modal>
      {/* Modal for generation success */}
      <Modal
        show={generationSuccess}
        onHide={handleGenerationSuccessClose}
        centered
      >
        <Modal.Header closeButton className="bg-success text-white">
          {" "}
          <Modal.Title>
            <span role="img" aria-label="success-icon">
              ✨
            </span>{" "}
            Success!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center">
            Your NFT collection has been successfully generated and downloaded.
          </p>
          {/* Add any additional content or styling as needed */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleGenerationSuccessClose}>
            Close
          </Button>
          {/* You can add additional buttons or actions here */}
        </Modal.Footer>
      </Modal>
      {showCongratsPopup && <CongratulationsPopup onClose={handleClose} />}

      {/* Modal Overlay */}
      <div
        className={`${
          showBatchDownloadModal ? "fixed" : "hidden"
        } inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto h-full w-full`}
        onClick={() => setShowBatchDownloadModal(false)}
      >
        {/* Modal Inner */}
        <div
          className="relative w-full mx-auto p-2 border shadow-lg rounded-md bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b">
            <p className="text-2xl font-semibold"></p>
            <button
              className="text-black text-2xl mb-2"
              onClick={() => setShowBatchDownloadModal(false)}
            >
              {/* Assuming you use Heroicons for close icon */}
              &times;{" "}
              {/* This is a simple 'X' character used as a close button */}
            </button>
          </div>

          <div className="flex flex-col items-center  justify-center ">
            <div className="flex flex-col items-center w-[700px]">
              <div className="flex items-center justify-center py-2">
                <img className="w-3/4" src="../hero-top.png" />
              </div>
              <div
                className="bg-white p mx-auto my-4 rounded relative"
                style={{ zIndex: 1001 }}
              >
                <h2 className="text-xl font-bold mb-4">Congratulations!</h2>
                <p className="mb-2">
                  Your NFTs and Metadata files have now been generated and
                  downloaded. Rarity for your collection has been assigned based
                  on our randomized algorithm.*
                </p>

                <p className="mb-2">
                  We’d recommend you review all your NFTs before closing or
                  refreshing the NFT Generator.
                </p>

                <p className="mb-2">
                  For the security and privacy of your collection, we do not
                  store your NFTs or Metadata on our server. These files will
                  only live on your device.
                </p>

                <p className="mb-2">
                  Once you close or refresh, the NFT Generator will be reset and
                  you will need to upload all image files and settings again.
                </p>

                <p className="mb-4 italic">
                  * If you have your own customized Rarity Table, please open a
                  ticket in our Discord server and we’ll assign that to your
                  collection.{" "}
                  <a
                    href="https://discord.gg/nAUFJcvvPE"
                    className="text-blue-500 visited:text-purple-600"
                  >
                    https://discord.gg/nAUFJcvvPE
                  </a>
                </p>
              </div>

              {batches.map((batch, index) => (
                <div className="bg-[#f7f7f7] border border-[#e0e0e0] px-[20px] w-[700px] rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2"></div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-gray-800  text-sm mb-1 flex flex-row items-center">
                      <img
                        className="w-[23px] h-[19.6px] mr-2 "
                        src="../archive.png"
                      />

                     <div className="flex flex-col">
                     <span className="font-semibold">Batch {index + 1}: </span>
                      <span>
                        {" "}
                        Items {batch.start + 1} to {batch.end}
                      </span>
                      </div>
                    </span>
                    <button
                      className="bg-gray-300 text-white px-3 py-2 rounded hover:bg-gray-200 transition"
                      onClick={() => download(batch)}
                    >
                      <img
                        className="w-[23px] h-[19.6px] "
                        src="../download_black.png"
                      />
                    </button>
                  </div>
                </div>
              ))}

              {/* <button className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 transition">
                Create a new collection
              </button> */}
            </div>
          </div>

          {/* Modal Body */}

          {/* Modal Footer */}
        </div>
      </div>
    </>
  );
};

export default Generate;
