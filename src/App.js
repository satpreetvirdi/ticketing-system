import "./App.css";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

function App() {
  const [showPopOver, setShowPopOver] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [fullScreen, setFullScreen] = useState(null);
  const [selecting, isSelecting] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });

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
      setFullScreen(screenshot);
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

  const handleMouseDown = e => {
    const startX = e.clientX;
    const startY = e.clientY;
    setStartCoords({ x: startX, y: startY });
    setEndCoords({ x: startX, y: startY });
    isSelecting(true);
  };

  const handleMouseMove = e => {
    if (selecting) {
      setEndCoords({
        x: Math.max(0, Math.min(e.clientX, window.innerWidth)),
        y: Math.max(0, Math.min(e.clientY, window.innerHeight)),
      });
    }
  };

  const handleMouseUp = () => {
    if (selecting) {
      isSelecting(false);
    }
  };

  const handleCaptureScreenshot = () => {
    isSelecting(false);

    // if (!selectionCoords) return;

    html2canvas(document.documentElement, {
      x: Math.max(0, Math.min(startCoords.x, endCoords.x)),
      y: Math.max(0, Math.min(startCoords.y, endCoords.y)),
      width: Math.abs(endCoords.x - startCoords.x),
      height: Math.abs(endCoords.y - startCoords.y),
      useCORS: true,
    }).then(canvas => {
      const image = canvas.toDataURL('image/png');
      setFullScreen(image);
      console.log(fullScreen)
    });
  };



  return (
    <>
    <div className="App">
      <img src={fullScreen} />
      <div className="floating-icon" onClick={togglePopOver}>
        <img src="robot.png" alt="Blue Icon" />
      </div>
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
      {
        selecting && (
          <>
          <div
           style={{
              position: 'fixed',
              border: '1px dashed red',
              left: Math.min(startCoords.x, endCoords.x),
              top: Math.min(startCoords.y, endCoords.y),
              width: Math.abs(endCoords.x - startCoords.x),
              height: Math.abs(endCoords.y - startCoords.y),
            }}
          />
          <button onClick={handleCaptureScreenshot}>Capture Screenshot</button>
          <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            cursor: 'crosshair',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
        </>
        )
      }
      


      {/*  */}
      {showOptions && (
        <div className="options">
          <button onClick={startSelecting}>Custom Area </button>
          <button onClick={captureScreenshot}>Full Screen</button>
          <div className="closeModal">
            {" "}
            <button>X</button>
          </div>
        </div>
      )}
      <header className="header">
        <nav>
          <h2>Assessment</h2>
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
