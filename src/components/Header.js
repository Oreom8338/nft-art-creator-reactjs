import { useDispatch, useSelector } from "react-redux";
import { selectCurrentStep, setStep } from "../stepper/stepperSlice";
// import { nextStep } from "../action/nextStep";

const Header = ({}) => {
  const dispatch = useDispatch();

  const handleClick = (step) => {
    dispatch(setStep(step));
  };

  const totalSteps = 2;

  const handleNextStep = () => {
    const nextStep = currentStep < totalSteps ? currentStep + 1 : currentStep;
    dispatch(setStep(nextStep));
  };

  const currentStep = useSelector(selectCurrentStep);

  return (
    <>
      <div className=" top-0 left-0 right-0 border-b z-[100] bg-[#fff] shadow-md backdrop-blur-xl flex flex-col md:flex-row justify-between items-center px-3 py-2">
        {/* <div className="w-20 md:w-20 h- mb-2 md:mb-0 md:mr-5 bg-black"> */}
        <a href="/">
          <div className="w-24 md:w-24 h- mb-2 md:mb-0 md:mr-5 ">
            {/* <img src="../logo.png" className="w-full h-full " alt="Logo" /> */}
           
          </div>
          <h2 className="text-black">Logo</h2>
        </a>

        {/* </div> */}
        <div className="flex flex-col">
          <div>
            <h1 className="text-2xl text-center font-bold">NFT GENERATOR</h1>
          </div>

          <div>
           
            <span
              className="font-bold "
              style={{ color: currentStep === 1 ? "black" : "gray" }}
            >
              Create Layers -----
            </span>

           
            <span
              className="font-bold ml-1"
              style={{ color: currentStep === 1 ? "black" : "gray" }}
            >
              Upload Image Files -----
            </span>

          
            <span
              className="font-bold ml-2 "
              style={{ color: currentStep === 1 ? "black" : "gray" }}
            >
              Preview -----{" "}
            </span>

            <span
              className="font-bold "
              style={{ color: currentStep === 1 ? "black" : "gray" }}
            >
             Generate Collection 
            </span>

            
          </div>
        </div>
        <div>

        </div>
      </div>
    </>
  );
};

export default Header;
