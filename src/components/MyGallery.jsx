// 📁 src/components/MyGallery.jsx
import React, { useState, useEffect } from 'react';

export default function MyGallery({ productImages, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Precargar la siguiente imagen
  useEffect(() => {
    const nextIndex = currentIndex === productImages.length - 1 ? 0 : currentIndex + 1;
    const img = new Image();
    img.src = productImages[nextIndex];
    img.onload = () => {
      setLoadedImages(prev => ({...prev, [nextIndex]: true}));
    };
  }, [currentIndex, productImages]);

  // Precargar la imagen actual cuando el componente se monta
  useEffect(() => {
    const img = new Image();
    img.src = productImages[currentIndex];
    img.onload = () => {
      setLoadedImages(prev => ({...prev, [currentIndex]: true}));
      setIsLoading(false);
    };
  }, []);

  function handlePrev() {
    setIsLoading(true);
    setCurrentIndex((prev) => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  }

  function handleNext() {
    setIsLoading(true);
    setCurrentIndex((prev) => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  }

  function handleDotClick(index) {
    setIsLoading(true);
    setCurrentIndex(index);
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Contenedor de imagen con skeleton loader */}
      <div className="flex justify-center items-center bg-white relative max-w-full">
        {/* Skeleton loader */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        
        {/* Imagen actual */}
        <img
          src={productImages[currentIndex]}
          alt={`${title} - Imagen ${currentIndex + 1}`}
          className={`w-full max-w-[95vw] md:max-w-full h-[400px] md:h-[500px] object-contain transition-opacity duration-300 ${
            loadedImages[currentIndex] && !isLoading ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => {
            setLoadedImages(prev => ({...prev, [currentIndex]: true}));
            setIsLoading(false);
          }}
        />

        {/* Precargar siguiente imagen */}
        <img
          src={productImages[(currentIndex + 1) % productImages.length]}
          alt="Preload next"
          className="hidden"
          onLoad={() => {
            setLoadedImages(prev => ({...prev, [(currentIndex + 1) % productImages.length]: true}));
          }}
        />
      </div>

      {/* Contenedor de navegación */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative h-full max-w-full mx-auto">
          {/* Botón Prev */}
          <button
            onClick={handlePrev}
            className="pointer-events-auto absolute top-1/2 left-1 md:left-2 -translate-y-1/2 bg-white/80 hover:bg-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-black transition-colors duration-300 shadow-lg z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          {/* Botón Next */}
          <button
            onClick={handleNext}
            className="pointer-events-auto absolute top-1/2 right-1 md:right-2 -translate-y-1/2 bg-white/80 hover:bg-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-black transition-colors duration-300 shadow-lg z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Puntos de navegación */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-[1]">
        {productImages.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-blue-600 w-4'
                : 'bg-gray-400 hover:bg-gray-600'
            }`}
            aria-label={`Ir a la imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
