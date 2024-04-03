import "./App.css";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import "cropperjs/dist/cropper.css";
import SketchField, { ReactSketchCanvas } from 'react-sketch-canvas';
function App() {
  const [showPopOver, setShowPopOver] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [fullScreen, setFullScreen] = useState(null);
  const [selecting, isSelecting] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
  const [customModal, setCustomModal] = useState(false);
  const [initiateTicketModal, setInitiateTicketModal] = useState(false);
  const [selectedButton ,setSelectedButton] = useState(false);
  const [eraserMode ,setEraserMode] = useState(false);
  const [zoom ,setZoom ] = useState(1);
  const [selectTool,setSelectTool] = useState(false)


  const canvasRef = useRef(null);

  const [isDragging,setIsDragging] = useState(false);

  // console.log(canvasRef.current)
  const startSelecting = () => {
    isSelecting(true);
  };

  // For Full Sreen
  const captureScreenshot = () => {
    
    html2canvas(document.documentElement, {
      x: window.scrollX,
      y: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight,
    }).then((canvas) => {
      const screenshot = canvas.toDataURL("image/png");
      console.log(screenshot);
      setInitiateTicketModal(true);
      setFullScreen(screenshot);
      setShowOptions(false);
      // setShowPopOver(false);
    });
  };

  const handleTakeScreenShot = () => {
    setShowOptions(true);
    setShowPopOver(false);
  };
  const togglePopOver = () => {
    setShowPopOver(!showPopOver);
  };
  const closePopover = () => {
    setShowPopOver(false);
  };
  // Till Here , the code goes for full Screen ScreenShot

  // Now Code Starts for Custom Screen Shot

  const handleMouseDown = (e) => {
      setIsDragging(true);
      const startX = e.clientX;
      const startY = e.clientY;
      setStartCoords({ x: startX, y: startY });
      setEndCoords({ x: startX, y: startY });

    isSelecting(true);


  };

  const handleMouseMove = (e) => {
    if (selecting) {
      
      setEndCoords({
        x: Math.min(e.clientX, window.innerWidth),
        y: Math.min(e.clientY, window.innerHeight),
      });
    }
  };

  const handleMouseUp = () => {
    if (selecting) {
      isSelecting(false);
    }
    setIsDragging(false);
    const startX = Math.min(startCoords.x, endCoords.x);
    const startY = Math.min(startCoords.y, endCoords.y);
    const endX = Math.max(startCoords.x, endCoords.x);
    const endY = Math.max(startCoords.y, endCoords.y);
    html2canvas(document.documentElement, {
      x: startX + window.scrollX,
      y: startY + window.scrollY,
      width: endX - startX,
      height: endY - startY,
      useCORS: true,
    }).then((canvas) => {
      const image = canvas.toDataURL("image/png");
      setFullScreen(image);
      setCustomModal(true);
      setShowOptions(false);
      console.log(fullScreen);
    });
  };

  const retakeScreenShot = () => {
    setCustomModal(false);
    setShowOptions(true);
  };
  const closeShowOptions = () => {
    setShowOptions(false);
  };
  const closeCustomModal = () => {
    setCustomModal(false);
  };

  const selectButton = (buttonId)=>{
    setSelectedButton(buttonId);
  }

  const handlePenClick = ()=>{
      setEraserMode(false);
      canvasRef.current?.eraseMode(false);
  }
  const handleEraserClick = () => {
    setEraserMode(true);
    canvasRef.current?.eraseMode(true);
  };
  const handleClearClick = () => {
    canvasRef.current?.clearCanvas();
  };
  const handleZoomIn = ()=>{
    setZoom(prevZoom => prevZoom + 0.1);
  }
  const handleZoomOut = ()=>{
    setZoom(prevZoom =>prevZoom - 0.1)
  }
  const canvasStyle = {
    transform: `scale(${zoom})`, // Apply zoom using CSS scale property
    // transformOrigin: '0 0', // Set origin to top-left corner
    overflow:"hidden"
  };
  const containerStyle = {
    overflow: 'hidden', // Hide overflow to prevent image from exceeding the area
    width: '600px', // Set container width
    height: '300px', // Set container height
  };
  return (
    <>
      <div className="App">
        {/* <img src={fullScreen} /> */}
        {/* <canvas ref={canvasRef}/> */}
        
        <div className="floating-icon" onClick={togglePopOver}>
          <img src="robot.png" alt="Blue Icon" />
        </div>
        {/* on clciking robot icon, this showPopper will pop */}
        {showPopOver && (
          <div className="popover">
            <div className="popover-content">
              <div>
                <div>Facing Problem</div>
                <div>
                  <h6>
                    Our web support team is here to help! Feel free to reach out
                    with any questions or issues you're facing while navigating
                    our website{" "}
                  </h6>
                </div>
                <h6>Report an Issue :</h6>
              </div>
              <div className="ticketImg">
                <img src="ticket.png" />
              </div>
              <div className="close-icon" onClick={closePopover}>
                <img src="close.png" alt="Close" />
              </div>
            </div>
            <div className="reportIssue">
              <button className="ssBtn" onClick={handleTakeScreenShot}>
                {" "}
                Take a Screenshot
              </button>
            </div>
          </div>
        )}
        {/* tesing for custom area */}
        {selecting && isDragging && (
          <>
            <div
              style={{
                position: "fixed",
                border: "1px dashed red",
                left: Math.min(startCoords.x, endCoords.x),
                top: Math.min(startCoords.y, endCoords.y),
                width: Math.abs(endCoords.x - startCoords.x),
                height: Math.abs(endCoords.y - startCoords.y),
              }}
            />
          </>
        )}
        {selecting && (
          <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                cursor: "crosshair",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />
        )}

        {/* modal opens showing what type of screenshot to take */}
        {showOptions && (
          <div className="options">
            <button onClick={startSelecting}>Custom Area </button>
            <button onClick={()=>{
              captureScreenshot()
              }}>Full Screen</button>
            <div className="closeModal">
              {" "}
              <button onClick={closeShowOptions}>X</button>
            </div>
          </div>
        )}
        {/* After taking custom screenshot , save ,retake or cancel modal */}
        {customModal && (
          <>
            <div className="customScreenshotImagePopUp">
              <img src={fullScreen} className="" />
            </div>
            <div className="options addOn">
              <button
                onClick={() => {
                  setInitiateTicketModal(true);
                  setCustomModal(false);
                }}
              >
                Save
              </button>
              <button onClick={retakeScreenShot}>Retake</button>
              <div className="closeModal">
                <button onClick={closeCustomModal}>X</button>
              </div>
            </div>
          </>
        )}

        {/* Last Modal to initiate a ticket with image ,description etc */}
        {initiateTicketModal && (
          <div className="initiateTicketModal">
            <div className="leftBox">
              <div className="headingInfo">
              <div className="groupedBtn"> 
              <button style={{
                backgroundColor:"red",
                color:"white",
                cursor:"pointer"
              }}
              onClick={()=>setInitiateTicketModal(false)}
              >X</button>
              <button style={{
                backgroundColor:"rgb(75, 69, 69)",
                color:"white",
                cursor:"pointer"
              }}
                onClick={()=>{
                  setInitiateTicketModal(false);
                  setCustomModal(true);
                }}
              
              > Prev Page</button>
              </div>
              
                <h4>Screenshot Based Ticket</h4>
                {/* <h6>
                  Please use the button &#9645; below to mask any PII
                  information in the screenshot
                </h6> */}
              </div>
              <div className="imgFinal" style={containerStyle}>
              <div style={canvasStyle}>
                {/* <img src={fullScreen} /> */}
                <ReactSketchCanvas 
                ref={canvasRef}
                  backgroundImage={fullScreen}
                  width={600}
                 height={300}
                />
                </div>
              </div>

              <div className="editingModal" >
                <button onClick={()=>{
                  handlePenClick()
                  setSelectTool("pen")
                  }} 
                style={{
                  backgroundColor: selectTool =="pen"  ? "rgb(31, 31, 170)" : "" ,
                  color: selectTool=="pen" ? "white" : "black",
                }}
                >&#9998;</button>
                <button onClick={()=>{
                  handleEraserClick()
                  setSelectTool("eraser")
                  }}
                  style={{
                  backgroundColor: selectTool =="eraser"  ? "rgb(31, 31, 170)" : "" ,
                  color: selectTool=="eraser" ? "white" : "black",
                }} 

                  >&#9645;</button>
                {/* <button>&#9671;</button> */}
                <button onClick={()=>{
                  handleClearClick()
                  setSelectTool("clear")
                  }}
                  style={{
                  backgroundColor: selectTool =="clear"  ? "rgb(31, 31, 170)" : "" ,
                  color: selectTool=="clear" ? "white" : "black",
                }} 
                  >Clear</button>
                <button onClick={()=>{
                handleZoomIn()
                setSelectTool("zoom-in")
                }}
                style={{
                  backgroundColor: selectTool =="zoom-in"  ? "rgb(31, 31, 170)" : "" ,
                  color: selectTool=="zoom-in" ? "white" : "black",
                }} 
                >&#128930;</button>
                <button onClick={()=>{
                  handleZoomOut()
                  setSelectTool('zoom-out')
                  }}
                 style={{
                  backgroundColor: selectTool =="zoom-out"  ? "rgb(31, 31, 170)" : "" ,
                  color: selectTool=="zoom-out" ? "white" : "black",
                }} 
                >-</button>
              </div>
            </div>
            <div className="rightBox">
              <div className="general">
                <h4>Issue Type</h4>
                <div className="selectIssueType">
                  <button
                  style={{
                    backgroundColor: selectedButton=="button1"  ? "rgb(197, 174, 72)" : "" ,
                    color: selectedButton=="button1" ? "white" : "black",
                    border: selectedButton=="button1" ? "2px solid darkgoldenrod" :""
                    
                  }}
                  onClick={()=> selectButton('button1')}
                  >Bug</button>
                  <button
                  style={{
                    backgroundColor: selectedButton=="button2"  ? "rgb(197, 174, 72)" : "" ,
                    color: selectedButton=="button2"  ? "white" : "black",
                    border: selectedButton=="button2" ? "2px solid darkgoldenrod" :""
                  }}
                  onClick={()=> selectButton("button2")}
                  >Enhancement</button>
                </div>
              </div>
              <div className="general">
                <h4>Impact</h4>
                <span className="dropdown">
                  <select>
                    <option>Stopped working</option>
                    <option>Payment gateway didnt worked properly</option>
                    <option>Application Stopped Suddenly</option>
                  </select>
                </span>
              </div>
              <div className="general">
                <h4>Title</h4>
                <input />
              </div>
              <div className="general">
                <h4>Description</h4>
                <input style={{ height: "10vh" }} />
              </div>
              <div className="general">
                <h4>Section</h4>
                <span className="dropdown">
                  <select>
                    <option>Loan</option>
                    <option>Insurance</option>
                    <option>Application Stopped Suddenly</option>
                  </select>
                </span>
              </div>
              <div className="general">
                <h4>Sub-Section</h4>
                <span className="dropdown">
                  <select>
                    <option>Home Page</option>
                    <option>Insurance</option>
                    <option>Application Stopped Suddenly</option>
                  </select>
                </span>
              </div>
              <div className="raiseTicketRow">
              <button onClick={()=>setInitiateTicketModal(false)}>Cancel</button>
              <button className="raise"
              onClick={()=>{
                alert("Ticket Raised Successfully");
                setInitiateTicketModal(false);
              }}
              >Raise Ticket</button>
              </div>
            </div>
          </div>
        )}

        <header className="header">
          <nav>
            <h2>FinacPlus Assessment</h2>
          </nav>
        </header>

        <section id="hero" className="hero">
          <div className="hero-content">
            <h1>Welcome to My Landing Page</h1>
          </div>
        </section>
        <section id="testimonials" className="testimonials">
          <h2>Testimonials</h2>
          <div className="testimonial">
            <p>
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi,
              commodi."
            </p>
            <cite>- John Doe</cite>
          </div>
          <div className="testimonial">
            <p>
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi,
              commodi."
            </p>
            <cite>- Jane Doe</cite>
          </div>
        </section>

        <section id="contact" className="contact">
          <h2>Contact Us</h2>
          <form>
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <textarea placeholder="Your Message"></textarea>
            <button type="submit">Submit</button>
          </form>
        </section>

        <footer className="footer">
          <p>Contact us at example@example.com</p>
        </footer>
      </div>
    </>
  );
}

export default App;
