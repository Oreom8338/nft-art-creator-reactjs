import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { generateNFT } from "./modules/generateNFT";
import Preview from "./components/Preview";
import Error from "./components/Error";
import Generate from "./components/Generate";
import { IoCaretUpSharp } from "react-icons/io5";
import { IoCaretDownSharp } from "react-icons/io5";
import { IoLayers } from "react-icons/io5";

const NFTGenerator = () => {
  const [currLayer, setCurrLayer] = useState("Background");
  const [images, setImages] = useState({
    data: [],
  });

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const [layerName, setLayerName] = useState("");
  const [nft, setNft] = useState([]);

  const [showGenerate, setShowGenerate] = useState([]);
  const [showPreview, setShowPreview] = useState([]);
  const [showError, setShowError] = useState([]);
  const [showMSG, setShowErrorMSG] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingGen, setIsLoadingGen] = useState(false);
  const [isTraitClicked, setIsTraitClicked] = useState(true);
  const [isRarityClicked, setIsRarityClicked] = useState(false);
  const [rarity, setRarity] = useState(50);

  const defaultList = ["A", "B", "C", "D", "E"];
  const [itemList, setItemList] = useState(defaultList);
  const [isClicked, SetIsClicked] = useState(false);
  const [showRenameError, setShowRenameError] = useState(false);
  const tooltip = (
    <Tooltip id="tooltip">
      Click to select layer. <br />
      Press to drag.
    </Tooltip>
  );

  const handleDrop = (droppedItem) => {
    if (!droppedItem.destination) return;
    var updatedList = [...images.data];

    const fromIndex = droppedItem.source.index;
    const toIndex = droppedItem.destination;

    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);

    let json = { data: [] };

    for (var i = 0; i < updatedList.length; i++) json.data.push(updatedList[i]);

    setImages(json);
  };

  const hadleLayerClick = () => {
    SetIsClicked(true);
  };
  /************/

  const handleLayerName = (event) => {
    setLayerName(event.target.value);
  };

  console.log("testing", images);
  /************/

  const moveLayer = (currentIndex, direction) => {
    // Clone the current state to avoid direct mutation
    let newImages = { ...images };
    let newIndex;

    // Calculate new index based on direction
    if (direction === "up") {
      newIndex = currentIndex - 1;
    } else if (direction === "down") {
      newIndex = currentIndex + 1;
    } else {
      return; // If the direction is not recognized, do nothing
    }

    // Check if the new index is within the bounds of the array
    if (newIndex < 0 || newIndex >= newImages.data.length) {
      return; // Do nothing if the new index is out of bounds
    }

    // Swap the elements
    [newImages.data[currentIndex], newImages.data[newIndex]] = [
      newImages.data[newIndex],
      newImages.data[currentIndex],
    ];

    setImages(newImages);
    setCurrLayer(newImages.data[newIndex].name);
  };

  async function readFileAsync(file, json) {
    return new Promise((resolve, reject) => {
      let fileName = file.name;
      console.log(file.name);

      let reader = new FileReader();

      reader.onload = async (e) => {
        let [w, h] = await getImageDimensions(e.target.result);

        if (imageWidth < w) setImageWidth(w);

        if (imageHeight < h) setImageHeight(h);

        for (var i = 0; i < json.data.length; i++) {
          if (json.data[i].name === currLayer) {
            json.data[i].files.push({
              id: fileName,
              src: e.target.result,
              rarity: 1, // Initialize with a default rarity value
            });
            resolve(json);
            break;
          }
        }
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /************/

  function getImageDimensions(result) {
    return new Promise((resolve, reject) => {
      var image = new Image();
      image.src = result;
      image.onload = function () {
        resolve([image.width, image.height]);
      };
    });
  }

  /************/

  const generate = async () => {
    let json = JSON.stringify(images);
    json = JSON.parse(json);

    if (!json.data.length) {
      setShowError(["show"]);
      setShowErrorMSG("Add layers to generate nft");
      return;
    }

    let filesExists = false;

    for (var i = 0; i < json.data.length; i++) {
      if (json.data[i].files.length > 0) {
        filesExists = true;
        break;
      }
    }

    if (filesExists == false) {
      setShowError(["show"]);
      setShowErrorMSG("Cannot proceed with empty layers!");
      return;
    }

    setShowGenerate(["show"]);
  };

  /************/

  const preview = async () => {
    setLoading(true); // Start loading
    let json = JSON.stringify(images);
    json = JSON.parse(json);

    if (!json.data.length) {
      setShowError(["show"]);
      setShowErrorMSG("Add layers to preview");
      setLoading(false); // Stop loading if there's an error
      return;
    }

    let filesExists = false;
    for (var i = 0; i < json.data.length; i++) {
      if (json.data[i].files.length > 0) {
        filesExists = true;
        break;
      }
    }

    if (!filesExists) {
      setShowError(["show"]);
      setShowErrorMSG("Cannot proceed with empty layers!");
      setLoading(false);
      return;
    }
    // console.log("😏");
    try {
      let w = imageWidth;
      let h = imageHeight;
      let mime = "image/png";
      // console.log("👍");
      console.log("👍 images", images);
      console.log("S/-----------------");
      let size = 1;
      images.data.map((i) => {
        size = size * i.files.length;
      });
      let result = await generateNFT(
        images,
        w,
        h,
        mime,
        size < 100 ? size : 100
      );
      console.log("result", result);
      // console.log("👉");
      setNft(result);
      setShowPreview(["show"]);
      console.log("nft in  NFTGenerator: ", result);
      document.querySelector("#transFS").style.opacity = 1;
      document.querySelector("#transFS").style.pointerEvents = "auto";
    } catch (error) {
      console.error("Preview generation failed:", error);
      setShowError(["show"]);
      setShowErrorMSG("Failed to generate preview");
    } finally {
      setLoading(false);
    }
  };

  /************/

  const selectLayer = (e) => {
    let curr = e.currentTarget.getAttribute("data-id").replace("text-", "");

    setCurrLayer(curr);
  }; //selectLayer

  /************/

  const editLayer = (e) => {
    let curr = e.currentTarget
      .getAttribute("data-id")
      .replace("edit-", "")
      .trim();

    document
      .querySelector('[data-id="edit-div-' + curr + '"]')
      .classList.remove("d-none");
    document
      .querySelector('[data-id="div-' + curr + '"]')
      .classList.add("d-none");
    document.querySelector('[data-id="edit-text-' + curr + '"]').focus();
  }; //editLayer

  /************/

  const cancelLayer = (e) => {
    let curr = e.currentTarget.getAttribute("data-id").replace("cancel-", "");

    document
      .querySelector('[data-id="edit-div-' + curr + '"]')
      .classList.add("d-none");
    document
      .querySelector('[data-id="div-' + curr + '"]')
      .classList.remove("d-none");
  };

  /************/

  const updateLayer = (e) => {
    const currLayerName = e.currentTarget
      .getAttribute("data-id")
      .replace("update-", "");
    const newLayerNameInput = document
      .querySelector(`[data-id="edit-text-${currLayerName}"]`)
      .value.trim();
    const capitalizedNewLayerName = capitalizeFirstLetter(newLayerNameInput);

    if (!capitalizedNewLayerName) {
      setShowRenameError(true); // Show error message
      return; // Abort the operation if the new name is empty
    }

    setShowRenameError(false);

    let json = JSON.stringify(images);
    json = JSON.parse(json);

    const nameExists = json.data.some(
      (layer) =>
        layer.name === capitalizedNewLayerName && layer.name !== currLayerName
    );

    if (nameExists) {
      setShowError(["show"]);
      setShowErrorMSG(`${capitalizedNewLayerName} already exists`);
      return;
    }

    // Find the layer to update and change its name
    const layerIndex = json.data.findIndex(
      (layer) => layer.name === currLayerName
    );
    if (layerIndex !== -1) {
      json.data[layerIndex].name = capitalizedNewLayerName;
    }

    setImages(json);
    setCurrLayer(capitalizedNewLayerName); // Update the current layer to the new, capitalized name
  };

  /************/

  const deleteLayer = (e) => {
    let curr = e.currentTarget.getAttribute("data-id").replace("delete-", "");

    let imagesJSON = JSON.stringify(images);
    imagesJSON = JSON.parse(imagesJSON);

    for (var i = 0; i < imagesJSON.data.length; i++) {
      let keys = Object.values(imagesJSON.data[i]);
      // console.log(keys);
      // console.log(curr);

      if (keys[0] == curr) {
        imagesJSON.data.splice(i, 1);
        break;
      }
    }

    if (!imagesJSON.data.length) imagesJSON = { data: [] };
    // console.log(currLayer);
    setImages(imagesJSON);

    setCurrLayer(imagesJSON.data[0].name);
  };

  /************/

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const addLayer = () => {
    let capitalizedLayerName = capitalizeFirstLetter(layerName);
    if (!capitalizeFirstLetter.length) {
      setShowError(["show"]);
      setShowErrorMSG("Layer Name should not be empty!");
      return;
    }

    let json = JSON.stringify(images);
    json = JSON.parse(json);

    for (var i = 0; i < json.data.length; i++) {
      if (json.data[i].name == capitalizedLayerName) {
        setShowError(["show"]);
        setShowErrorMSG("Layer " + capitalizedLayerName + " already exists");
        return;
      }
    }
    json.data.push({ name: capitalizedLayerName, files: [] });
    setImages(json);
    setCurrLayer(capitalizedLayerName);
    setLayerName("");
    document.querySelector('[data-id="name_txt"]').value = "";
  };

  useEffect(() => {
    if (images.data.length === 0) {
      setImages({
        data: [{ name: "Background", files: [] }],
      });
    } else if (images.data.length > 0) {
      setCurrLayer(images.data[0].name);
    }
  }, []);

  /************/

  const deleteImage = (e) => {
    let curr = 0;
    let imageName = e.currentTarget
      .getAttribute("data-id")
      .replace("delete-", "");
    let json = JSON.stringify(images);
    json = JSON.parse(json);

    for (var i = 0; i < json.data.length; i++) {
      if (json.data[i].name == currLayer) {
        curr = i;
        break;
      }
    }

    for (var i = 0; i < json.data[curr].files.length; i++) {
      if (json.data[curr].files[i].id == imageName) {
        json.data[curr].files.splice(i, 1);
        break;
      }
    }

    setImages(json);
  };

  /************/

  async function initiateUpload() {
    let json = JSON.stringify(images);
    json = JSON.parse(json);

    if (!json.data.length) {
      setShowError(["show"]);
      setShowErrorMSG("Add layers to upload files");
      return;
    }

    document.querySelector('[id="uploader"]').click();
  }

  /************/

  async function handleUpload(event) {
    let data = Array.from(event.target.files);

    for (var i = 0; i < data.length; i++) {
      if (
        data[i].type != "image/jpeg" &&
        data[i].type != "image/png" &&
        data[i].type != "image/jpg"
      ) {
        event.target.value = "";
        setShowError(["show"]);
        setShowErrorMSG("Only jpg & png files allowed");
        return;
      }
    }

    let folderName = data[0].webkitRelativePath.split("/")[0].trim();

    let json = JSON.stringify(images);
    json = JSON.parse(json);

    for (var j = 0; j < data.length; j++)
      await readFileAsync(data[j], json, folderName);

    setImages(json);

    event.target.value = "";
  }

  /************/

  const handleLayerRename = (newName, oldName) => {
    // Trim whitespace from the input
    newName = newName.trim();

    // Check if newName is unique and not empty and doesn't contain special characters
    const validNameRegex = /^[a-zA-Z0-9_]+$/; // Regex to allow alphanumeric characters and underscore

    // if (newName && validNameRegex.test(newName)) {
    setImages((prevState) => {
      const newData = prevState.data.map((layer) => {
        if (
          layer.name !== "" &&
          validNameRegex.test(layer.name) &&
          layer.name === oldName
        ) {
          return { ...layer, name: newName };
        }
        return layer;
      });

      return { ...prevState, data: newData };
    });
    if (currLayer === oldName) {
      setCurrLayer(newName);
    }
  };

  // Function to update rarity for a specific file within a layer
  const updateRarity = (layerName, fileSrc, newRarity) => {
    setImages((prevState) => {
      const newData = prevState.data.map((layer) => {
        if (layer.name === layerName) {
          const updatedFiles = layer.files.map((file) => {
            if (file.src === fileSrc) {
              return { ...file, rarity: parseInt(newRarity, 10) };
            }
            return file;
          });
          return { ...layer, files: updatedFiles };
        }
        return layer;
      });
      return { ...prevState, data: newData };
    });
  };

  useEffect(() => {
    if (images.data.length === 0) {
      let json = JSON.stringify(images);
      json = JSON.parse(json);
      json.data.push({ name: "Background", files: [] });
      setImages(json);
      setCurrLayer(layerName);
      setLayerName("");
    }
  }, []);

  useEffect(() => {
    if (isLoadingGen) {
      console.log("isLoadingGen", isLoadingGen);
      document.getElementById("transFSGen").style.opacity = 1;
    } else {
      // document.getElementById("transFSGen").style.opacity = 0;
    }
  }, [isLoadingGen]);

  return (
    <>
      <main className="w-[100%] ">
        <div id="transFS">
          {showPreview.length > 0 && (
            <>
              <Preview
                props={{
                  nft: nft,
                  setNft: setNft,
                  setShowPreview: setShowPreview,
                }}
              />
            </>
          )}
        </div>
        <div id="transFSGen">
          <div className="generate_loding bg-[#fff] w-[100%] h-screen flex  flex-col items-center justify-center ">
            <img
              src="../generation-illustration.svg"
              className="w-[60%] "
            ></img>
            <h1 className="text-black text-[15px] font-medium">
              {" "}
              Your collection is being created, please wait...
            </h1>
            {/* progress bar */}
            <div className="w-[70%] h-[12px] bg-gray-300 rounded ">
              <div className="progress"></div>
            </div>
          </div>
        </div>

        {/* <div className="w-[100%] flex  md:grid md:grid-cols-[2fr,5fr,1fr] lg:grid-cols-[1fr,5fr,1fr] px-6 h-screen border-r-2 text-black"> */}
        <div className="main_sec ">
          <div className="left">
            <Row>
              <Col className="">
                <div className="flex  ">
                  <img className="w-[22px] h-[22px] mr-2" src="../layers.png" />
                  <h3 className="sec_heading">Layers</h3>
                </div>
                {images.data.length > 0 && (
                  <>
                    <DragDropContext onDragEnd={handleDrop}>
                      <Droppable droppableId="droppable">
                        {(provided) => (
                          <div
                            className="droppable  "
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {images.data.map((image, index) => (
                              <Draggable
                                key={image.name}
                                draggableId={`draggable-${image.name}`}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex hover:border-black items-center justify-between text-[18px] text-base font-bold bg-white shadow-sm rounded-xl mb-3"
                                    style={{
                                      border: "2px solid",
                                      borderColor:
                                        currLayer === image.name
                                          ? "#00008b"
                                          : "#e2e6ea",
                                    }}
                                  >
                                    <div
                                      className="gap-23 "
                                      data-id={`div-${image.name}`}
                                      style={{
                                        width: "100%",
                                        marginBottom: "0px",
                                        padding: "0px",
                                        border:
                                          currLayer == image.name
                                            ? "dashed 0px"
                                            : "0px",
                                        borderColor:
                                          currLayer == image.name ? "" : "",
                                        borderRadius: "8px",
                                        opacity:
                                          currLayer == image.name ? "1" : "1",
                                      }}
                                    >
                                      <InputGroup
                                        style={{}}
                                        className="mb-0 flex flex-nowrap w-full justify-between "
                                        data-id={`text-${image.name}`}
                                        onClick={selectLayer}
                                      >
                                        <OverlayTrigger
                                          placement="right"
                                          overlay={tooltip}
                                        >
                                          <span
                                            data-id={`text-${image.name}`}
                                            className="ml-2 px-2 list_span"
                                            style={{
                                              width: "70%",
                                              height: "55px",
                                              backgroundColor: "",
                                              display: "flex",
                                              alignItems: "center",
                                              color: "black",
                                            }}
                                            onClick={() =>
                                              setCurrLayer(image.name)
                                            } // Set the clicked layer as current layer
                                          >
                                            {image.name}
                                          </span>
                                        </OverlayTrigger>
                                        <div className="flex items-center gap-2 w-[75px] ">
                                          <div className="flex items-center gap-2">
                                            <img
                                              className="w-[16px] h-[14.9px] "
                                              src="../layers_alt.png"
                                            />
                                            <span className="mr-4">
                                              {
                                                images?.data[index]?.files
                                                  ?.length
                                              }
                                            </span>
                                          </div>
                                          <div className="w-full h-[55px] py-[5px] m-0 flex justify-between border-l-2  border-gray-400 hover:border-black flex-col">
                                            <IoCaretUpSharp
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                moveLayer(index, "up");
                                              }}
                                              className="cursor-pointer ml-2 text-gray-400 "
                                            />
                                            <div className="w-[100%] h-[1.5px] bg-gray-400 "></div>
                                            <IoCaretDownSharp
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                moveLayer(index, "down");
                                              }}
                                              className="cursor-pointer border-b ml-2 text-gray-400 hover:text-black"
                                            />
                                          </div>
                                        </div>
                                      </InputGroup>
                                    </div>

                                    <div
                                      className="d-grid gap-23 d-none"
                                      data-id={`edit-div-${image.name}`}
                                      style={{
                                        width: "100%",
                                        marginBottom: "0px",
                                      }}
                                    >
                                      <InputGroup className="mb-0">
                                        <Form.Control
                                          type="text"
                                          placeholder="Layer Name"
                                          defaultValue={image.name}
                                          data-id={`edit-text-${image.name}`}
                                          onClick={selectLayer}
                                          style={{
                                            height: "40px",
                                            backgroundColor: "white",
                                            color: "black",
                                          }}
                                          maxLength={20}
                                        />
                                        <Button
                                          style={{ color: "white" }}
                                          variant="danger"
                                          data-id={`cancel-${image.name}`}
                                          onClick={cancelLayer}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            fill="currentColor"
                                            class="bi bi-x-square-fill"
                                            viewBox="0 0 16 16"
                                          >
                                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
                                          </svg>
                                        </Button>
                                        <Button
                                          style={{ color: "white" }}
                                          variant="outline-secondary"
                                          data-id={`update-${image.name}`}
                                          onClick={updateLayer}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            fill="currentColor"
                                            class="bi bi-check-square"
                                            viewBox="0 0 16 16"
                                          >
                                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z" />
                                          </svg>
                                        </Button>
                                      </InputGroup>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </>
                )}

                <hr></hr>

                <div className="flex mt-[50px]">
                  <img className="w-[22px] h-[22px] mr-2" src="../add.png" />
                  <h3 className="sec_heading">Create new layer</h3>
                </div>

                <div className="py-2">
                  <label className="collection_label ">Layer name</label>
                  <input
                    onChange={handleLayerName}
                    type="text"
                    value={layerName}
                    placeholder="Enter layer name"
                    className="collection_input "
                  />
                </div>
                <button
                  className="bg-[#000] w-[110px]  text-white font-bold py-[10px] rounded-lg mt-2 hover:-translate-y-1 transition-transform  ease-in-out duration-300 shadow-md "
                  onClick={addLayer}
                >
                  Add layer
                </button>
                <div className="mt-10">
                  <Button
                    size=""
                    style={{ width: "100%", marginBottom: "5px" }}
                    variant="warning"
                    onClick={preview}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Preview"}
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
          <div className="middle">
            <Col className="">
              <div
                className="flex flex-row gap-10 items-center justify-center  p-2 "
                style={{ width: "100%", padding: "0px 0px" }}
              >
                {/* {console.log(images.data[0].name)} */}
                {images.data
                  .filter((image) => image.name === currLayer)
                  .map((image, index) => (
                    <React.Fragment key={index}>
                      <div className="w-full flex flex-row items-center justify-between mt-4 mb-4">
                        <div
                          className="w-[22%] flex items-center"
                          style={{ borderBottom: "2px solid #e2dcdc" }}
                        >
                          <img
                            className="w-[16px] h-[16px]"
                            src="../pencil.svg"
                          />
                          <input
                            type="text"
                            value={image.name}
                            onChange={(e) =>
                              handleLayerRename(e.target.value, image.name)
                            }
                            className="mt-1 block px-3 py-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            style={{
                              border: "none",
                              borderRadius: 0,
                            }}
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="%"
                            className="mt-1 block text-center py-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>

                        <button
                          className="w-[15%] py-2 underline text-[16px] text-red-500 flex"
                          data-id={`delete-${image.name}`}
                          onClick={deleteLayer}
                        >
                          <img
                            className="w-[16px] h-[16px] mt-1 mr-[3px]"
                            src="../trash.png"
                          />
                          Delete Layer
                        </button>
                      </div>
                    </React.Fragment>
                  ))}
              </div>

              {/* <div className="border-b-2"></div>  */}
              <form className="space-y-3 " action="#" method="POST">
                <div className="grid space-y-2 pt-2 ">
                  <div className="flex items-center">
                    <img
                      className="w-[22px] h-[21.5px] mr-2"
                      src="../upload.png"
                    />
                    <label className="sec_heading  ">Upload</label>
                  </div>

                  <div className="flex items-center justify-center w-full upload_area">
                    <label className="flex flex-col rounded-lg  w-full h-60 p-10 group text-center">
                      <div className="h-full w-full text-center  text-black font-bold flex flex-col justify-center items-center">
                        <p className="pointer-none  ">
                          <span className="text-sm">
                            Click to upload image files here…
                          </span>{" "}
                          {/* or{" "} */}
                          <label
                            htmlFor="fileInput"
                            className="text-blue-600 hover:underline hidden"
                          >
                            select a file
                          </label>{" "}
                          <br />
                          (Image/png, max file size: 2MB per image)
                        </p>
                      </div>
                      <input
                        type="file"
                        multiple
                        id="uploader"
                        onChange={handleUpload}
                        onClick={initiateUpload}
                        accept="image/png" // Restrict to .png images only
                        className=" hidden"
                      />
                    </label>
                  </div>
                </div>
                <p className="text-sm text-gray-300">
                  <span className="hidden">File type: PNG</span>
                </p>
              </form>

              <div className="w-full">
                <div className="w-full border-b-4 border-gray-200 mb-4 mt-4 flex items-center gap-3 ">
                  {/* traits */}
                  <button
                    className={`sec_heading ${
                      isTraitClicked ? "custom-underline" : ""
                    }`}
                    onClick={() => {
                      setIsRarityClicked(false);
                      setIsTraitClicked(true);
                    }}
                  >
                    Traits
                    {images.data.map((img, index) => {
                      // data[index]?.files?.length;
                      // console.log(img);
                      // console.log(currLayer);

                      if (img.name === currLayer && img.files.length >= 0) {
                        return (
                          <span
                            key={img.index}
                            className="sec_heading mb-2 ml-1"
                          >
                            ({img.files.length})
                          </span>
                        );
                      }
                    })}
                  </button>

                  {/* rarity portion */}

                  <button
                    className={`sec_heading ${
                      isRarityClicked ? "custom-underline" : ""
                    }`}
                    onClick={() => {
                      setIsTraitClicked(false);
                      setIsRarityClicked(true);
                    }}
                  >
                    Rarity Setting
                  </button>
                </div>
                {isTraitClicked &&
                  images.data.map(
                    (image) =>
                      image.name === currLayer &&
                      image.files.length > 0 && (
                        <>
                          {image.files.map((file) => (
                            <div className="inline-block w-1/4 max-w-[25%] h-auto relative m-1 bg-white rounded-lg border-2 border-white mr-2 mb-5 shadow">
                              <img
                                src={file.src}
                                className="p-[2px] max-w-full max-h-[200px] overflow-hidden rounded-lg"
                              />

                              {/* image name */}
                              <div>
                                <p className="collection_label pt-2 pl-2">
                                  {file.id.replace(/\.[^.]+$/, "")}
                                </p>
                              </div>
                              <div
                                className="hidden"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span
                                  className="hidden"
                                  style={{ marginRight: "10px" }}
                                ></span>
                                <Form.Range
                                  className="hidden"
                                  value={file.rarity || 0}
                                  onChange={(e) =>
                                    updateRarity(
                                      image.name,
                                      file.id,
                                      e.target.value
                                    )
                                  }
                                  min="0" // Start of the range
                                  max="100" // End of the range
                                  step="1" // Step value
                                />
                              </div>
                              <Button
                                size="sm"
                                className="w-full bg-white  "
                                style={{
                                  border: "none",
                                  borderTop: "1px solid #e2dcdc",
                                  borderRadius: 0,
                                }}
                                variant="primary"
                                data-id={`delete-${file.id}`}
                                onClick={deleteImage}
                              >
                                <p className="text-red-600 text m-0">
                                  Delete trait
                                </p>
                              </Button>
                            </div>
                          ))}
                        </>
                      )
                  )}
                {isRarityClicked &&
                  images.data.map(
                    (image) =>
                      image.name === currLayer &&
                      image.files.length > 0 && (
                        <>
                          {image.files.map((file, index) => (
                            <div
                              key={file.src}
                              className=" w-full  h-auto relative m-1 bg-white rounded-lg border-2 border-white mr-2 mb-2 shadow flex items-center justify-between p-2"
                            >
                              <img
                                src={file.src}
                                className="p-[2px] max-w-[10%] max-h-[200px] overflow-hidden rounded-lg"
                              />
                              <div className="flex flex-col items-center justify-center text-base font-medium mt-1">
                                <span>Rarity index </span>
                                <span>{file.rarity}</span>
                              </div>
                              {console.log(file)}
                              {console.log(images)}

                              <input
                                type="range"
                                className="w-[70%] h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                                min="1"
                                max="100"
                                value={file.rarity}
                                onChange={(e) =>
                                  updateRarity(
                                    image.name,
                                    file.src,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          ))}
                        </>
                      )
                  )}
              </div>
            </Col>
          </div>
          <div className="right">
            {" "}
            <Generate
              props={{
                w: imageWidth,
                h: imageWidth,
                images: images,
                setShowGenerate: setShowGenerate,
              }}
            />
          </div>

          <div>
            {showError.length > 0 && (
              <>
                <Error
                  props={{ showMSG: showMSG, setShowError: setShowError }}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default NFTGenerator;