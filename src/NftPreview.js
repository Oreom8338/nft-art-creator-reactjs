import React, { useState } from "react";
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
const NftPreview = ({ imageData }) => {
  const [currLayer, setCurrLayer] = useState("layer-1");
  const [images, setImages] = useState({ data: [] });

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const [layerName, setLayerName] = useState("");
  const [nft, setNft] = useState([]);

  const [showGenerate, setShowGenerate] = useState([]);
  const [showPreview, setShowPreview] = useState([]);
  const [showError, setShowError] = useState([]);
  const [showMSG, setShowErrorMSG] = useState([]);

  const defaultList = ["A", "B", "C", "D", "E"];
  const [itemList, setItemList] = useState(defaultList);

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

  /************/

  const handleLayerName = (event) => {
    setLayerName(event.target.value);
  };

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

    // Update the state with the new images array
    setImages(newImages);

    // Optionally, update the current layer to the moved layer
    setCurrLayer(newImages.data[newIndex].name);
  };

  async function readFileAsync(file, json) {
    return new Promise((resolve, reject) => {
      let fileName = file.name;

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

  // UpdateRarity function adjusted for new structure
  const updateRarity = (layerName, imageId, newRarity) => {
    let updatedImages = images.data.map((layer) => {
      if (layer.name === layerName) {
        return {
          ...layer,
          files: layer.files.map((file) => {
            if (file.id === imageId) {
              return { ...file, rarity: parseInt(newRarity, 10) };
            }
            return file;
          }),
        };
      }
      return layer;
    });

    setImages({ data: updatedImages });
  };

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
    let json = JSON.stringify(images);
    json = JSON.parse(json);

    if (!json.data.length) {
      setShowError(["show"]);
      setShowErrorMSG("Add layers to preview");
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

    let w = imageWidth;
    let h = imageHeight;
    let mime = "image/png";

    let result = await generateNFT(images, w, h, mime);
    setNft(result);

    setShowPreview(["show"]);
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
    let currLayerName = e.currentTarget
      .getAttribute("data-id")
      .replace("update-", "");
    let newLayerName = document
      .querySelector('[data-id="edit-text-' + currLayerName + '"]')
      .value.trim();

    let count = 0;

    if (!newLayerName.trim().length) {
      setShowError(["show"]);
      setShowErrorMSG("Invalid layer name input");
      return;
    }

    let json = JSON.stringify(images);
    json = JSON.parse(json);

    for (var i = 0; i < json.data.length; i++) {
      if (
        json.data[i].name == newLayerName &&
        json.data[i].name != currLayerName
      ) {
        setShowError(["show"]);
        setShowErrorMSG(newLayerName + " already exists");
        return;
      } else {
        count++;
      }
    }

    document.querySelector('[data-id="text-' + currLayerName + '"]').value =
      newLayerName;

    document
      .querySelector('[data-id="edit-div-' + currLayerName + '"]')
      .classList.add("d-none");

    document
      .querySelector('[data-id="div-' + currLayerName + '"]')
      .classList.remove("d-none");

    for (var i = 0; i < json.data.length; i++) {
      if (json.data[i].name == currLayerName) {
        json.data[i].name = newLayerName;

        break;
      }
    }

    setCurrLayer(newLayerName);
    setImages(json);
  };

  /************/

  const deleteLayer = (e) => {
    let curr = e.currentTarget.getAttribute("data-id").replace("delete-", "");

    let imagesJSON = JSON.stringify(images);
    imagesJSON = JSON.parse(imagesJSON);

    for (var i = 0; i < imagesJSON.data.length; i++) {
      let keys = Object.values(imagesJSON.data[i]);

      if (keys[0] == curr) {
        imagesJSON.data.splice(i, 1);
        break;
      }
    }

    if (!imagesJSON.data.length)
      imagesJSON = { data: [{ name: "layer-1", files: [] }] };

    setImages(imagesJSON);
    setCurrLayer(imagesJSON.data[0].name);
  };

  /************/

  const addLayer = () => {
    if (!layerName.length) {
      setShowError(["show"]);
      setShowErrorMSG("Invalid Layer Name!");
      return;
    }

    let json = JSON.stringify(images);
    json = JSON.parse(json);

    for (var i = 0; i < json.data.length; i++) {
      if (json.data[i].name == layerName) {
        setShowError(["show"]);
        setShowErrorMSG("Layer " + layerName + " already exists");
        return;
      }
    }

    json.data.push({ name: layerName, files: [] });

    setImages(json);
    setLayerName("");
    setCurrLayer(layerName);

    document.querySelector('[data-id="name_txt"]').value = "";
  };

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

  const handleLayerRename = (e, oldName) => {
    console.log("Here");
    const newName = e.target.value.trim(); // Trim whitespace from the input
    console.log("New name:", newName);
    // Check if newName is unique and not empty and doesn't contain special characters
    const validNameRegex = /^[a-zA-Z0-9_]+$/; // Regex to allow alphanumeric characters and underscore

    if (
      newName &&
      validNameRegex.test(newName) &&
      !images.data.some((layer) => layer.name === newName)
    ) {
      const updatedImages = images.data.map((layer) => {
        if (layer.name === oldName) {
          return { ...layer, name: newName };
        }
        return layer;
      });
      // console.log("Updated images:", updatedImages);
      setImages({ data: updatedImages });
      if (currLayer === oldName) {
        setCurrLayer(newName); // Update current layer if it's the one being renamed
      }
    } else {
      // Handle error or ignore if newName is not valid or unique
      console.log("Invalid or duplicate layer name entered.");
    }
  };

  return (
    <>
      <div className="grid grid-cols-[2fr,5fr,1fr] px-6 h-screen border-r-2 text-black">
        <div>
          {imageData.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={`NFT ${index}`}
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default NftPreview;
