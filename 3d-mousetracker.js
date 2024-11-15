// Not used on this page

// 3D mouse tracker and image rotation
document.querySelectorAll('.interactive-3d').forEach(container => {
    const image = container.querySelector('img');
  
    container.addEventListener('mousemove', (event) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left; // Mouse position relative to the container
      const y = event.clientY - rect.top;
  
      // Calculate rotation values
      const rotateX = ((y / rect.height) - 0.5) * -40; // Rotate up to 20 degrees
      const rotateY = ((x / rect.width) - 0.5) * 40; // Rotate up to 20 degrees
  
      // Apply the transformation
      image.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  
    container.addEventListener('mouseleave', () => {
      // Reset the transformation when the mouse leaves the container
      image.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  });