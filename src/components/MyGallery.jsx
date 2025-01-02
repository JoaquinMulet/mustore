// 📁 src/components/MyGallery.jsx
import React, { useState } from 'react';

export default function MyGallery({ productImages, title }) {
  // Estado para llevar el índice de la imagen actual
  const [currentIndex, setCurrentIndex] = useState(0);

  // Funciones para avanzar o retroceder
  function handlePrev() {
    setCurrentIndex((prev) => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  }

  function handleNext() {
    setCurrentIndex((prev) => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  }

  // Opcional: si quieres “dots” (paginación):
  function handleDotClick(index) {
    setCurrentIndex(index);
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Imagen actual */}
      <div className="flex justify-center items-center bg-white">
        <img
          src={productImages[currentIndex]}
          alt={`${title} - Imagen ${currentIndex + 1}`}
          className="w-[95vw] md:w-full h-[400px] md:h-[500px] object-contain"
        />
      </div>

      {/* Botón Prev */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-transparent px-3 py-2 rounded-full text-sm text-black hover:bg-gray-100 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      {/* Botón Next */}
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-transparent px-3 py-2 rounded-full text-sm text-black hover:bg-gray-100 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

      {/* Opcional: “dots” (paginación) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {productImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`
              w-3 h-3 rounded-full 
              ${idx === currentIndex ? 'bg-blue-600' : 'bg-gray-300'}
            `}
          />
        ))}
      </div>
    </div>
  );
}
