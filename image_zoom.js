document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.panzoom-element');
  
    elements.forEach((elem) => {

      const panzoom = Panzoom(elem, {

        animate: false,
        canvas: false, // Whether the element is a canvas
        contain: 'outside', // How to contain the element (false, 'inside', 'outside')
       
        cursor: 'move', // Cursor style for the element
        pinchAndPan: false, //Set to true to enable panning during pinch zoom.
        disablePan: false, // Disable panning
        disableZoom: false, // Disable zooming
        duration: 200, // Duration of animations in milliseconds
        easing: 'ease-in-out', // Easing function for animations
       
        exclude: [], // Elements to exclude from pan/zoom
        excludeClass: 'panzoom-exclude', // Class name to exclude from pan/zoom
        
        handleStartEvent: (e) => e.preventDefault(), // Function to handle start event
       
        maxScale: 3, // Maximum scale factor
        minScale: 1, // Minimum scale factor
        overflow: 'hidden', // CSS overflow property
       
        panOnlyWhenZoomed: false, // Only allow panning when zoomed in
        relative: false, // Use relative pan/zoom
      
        // setTransform: (elem, { x, y, scale }) => {
        //   elem.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        // }, // Function to set transform
     
        startX: 0, // Initial x position
        startY: 0, // Initial y position
        startScale: 1, // Initial scale
        step: 0.3, // Step size for zooming
        touchAction: 'none', // CSS touch-action property
       
        wheel: true, // Enable wheel zooming
        wheelFactor: 0.1, // Factor for wheel zooming
        wheelStep: 0.2, // Step size for wheel zooming
      });
  
      // Example of initial pan and zoom
      panzoom.pan(10, 10);
      panzoom.zoom(1, { animate: true });
  
      // Bind zoom in functionality to a button (if you have one)
      // Assuming you have a button with id 'zoom-in-button'
      const button = document.getElementById('zoom-in-button');
      if (button) {
        button.addEventListener('click', panzoom.zoomIn);
      }
  
      // Bind zoom with wheel functionality
      elem.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);
    });
  });