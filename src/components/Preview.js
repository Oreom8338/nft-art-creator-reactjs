import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Navbar from "react-bootstrap/Navbar";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const Preview = ({ props }) => {
  console.log("props in preview", props);
  // const firstTenImages = props.nft.slice(0, 10);

  const handleBtnClick = () => {
    document.querySelector("#transFS").style.opacity = 0;
    document.querySelector("#transFS").style.pointerEvents = "none";
  };
  return (
    <>
      <div className="preview_component">
        <div className="w-full h-12 bg-[#fff] flex items-center justify-end">
          <button
            className="bg-gray-200 rounded-lg p-2  w-[40px] text-xl font-medium text-black"
            onClick={handleBtnClick}
          >
            <i class="fa-solid fa-xmark"></i>{" "}
          </button>
        </div>
        <div className="w-full  -mt-4   p-4">
          <div className="sec_heading  flex ">
            <img
              className="w-[23px] h-[19.6px] mr-2 "
              src="../preview-alt.png"
            />
            <p className="">Collection preview</p>
          </div>
          <div class="flex gap-4 flex-wrap">
            {props.nft.map((file, index) => (
              <div className="shadow-lg rounded-lg" key={index}>
                <img
                  class="object-cover object-center w-full h-40 max-w-full rounded-lg"
                  src={file.original}
                  alt={`Preview ${index}`}
                />
                <div className="text-center mt-1 pb-1">{index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <Modal show={true} style={{ backgroundColor: "black" }} fullscreen={true}>
        <Navbar bg="dark" variant="dark">
          <Container style={{ float: "right" }}>
            <Navbar.Brand>NFT Collection Generator - Preview</Navbar.Brand>
            <Button
              size="lg"
              variant="outline-info"
              style={{ color: "#fff", float: "right" }}
              onClick={() => props.setShowPreview([])}
            >
              x
            </Button>
          </Container>
        </Navbar>

        <Modal.Body
          className="show-grid"
          style={{ backgroundColor: "#272D37" }}
        >
          <Container style={{ maxWidth: "100%", backgroundColor: "#272D37" }}>
            <Row style={{ width: "100%" }}>
              <Col style={{ maxWidth: "100%" }}>
                <Carousel>
                  {firstTenImages.map((image, index) => (
                    <div key={index}>
                      <img src={image.original} alt={`Preview ${index}`} />
                    </div>
                  ))}
                </Carousel>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal> */}
    </>
  );
};

export default Preview;
