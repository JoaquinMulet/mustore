import React, { useState } from 'react';

export default function ProductReviewsPreview({ reviews, price_1, price_2, price_3 }) {
  console.log('Received prices:', { price_1, price_2, price_3 });
  
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  
  if (!price_1 || !price_2 || !price_3) {
    console.error('Missing prices:', { price_1, price_2, price_3 });
    return null;
  }
  
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  const handleQuantitySelect = (quantity, price) => {
    setSelectedQuantity(quantity);
    window.setQuantityPrice?.(quantity, price);
  };

  const getButtonClass = (quantity) => {
    const baseClass = "flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 border min-w-[90px] h-[90px]";
    const selectedClass = "bg-red-50 text-red-600 border-red-200 shadow-md scale-105 border-2";
    const normalClass = "bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700 hover:shadow-sm hover:scale-102";
    
    return `${baseClass} ${quantity === selectedQuantity ? selectedClass : normalClass}`;
  };

  return (
    <div className="mb-8">
      {/* Botones de cantidad */}
      <div className="flex flex-row justify-center gap-3 my-4 flex-wrap">
        <button
          onClick={() => handleQuantitySelect(1, price_1)}
          className={getButtonClass(1)}
        >
          <div className="flex flex-col items-center">
            <span className="font-semibold text-lg mb-0.5">1</span>
            <span className="text-xs opacity-75 mb-1">unidad</span>
            <span className="font-medium">${price_1.toLocaleString('es-CL')}</span>
          </div>
        </button>
        <button
          onClick={() => handleQuantitySelect(2, price_2)}
          className={getButtonClass(2)}
        >
          <div className="flex flex-col items-center">
            <span className="font-semibold text-lg mb-0.5">2</span>
            <span className="text-xs opacity-75 mb-1">unidades</span>
            <span className="font-medium">${price_2.toLocaleString('es-CL')}</span>
          </div>
        </button>
        <button
          onClick={() => handleQuantitySelect(3, price_3)}
          className={getButtonClass(3)}
        >
          <div className="flex flex-col items-center">
            <span className="font-semibold text-lg mb-0.5">3</span>
            <span className="text-xs opacity-75 mb-1">unidades</span>
            <span className="font-medium">${price_3.toLocaleString('es-CL')}</span>
          </div>
        </button>
      </div>
      
      <button
        onClick={() => window.openPurchaseModal?.()}
        className="group w-full text-white py-4 px-8 rounded-lg text-xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-500 hover:from-red-600 hover:via-red-700 hover:to-red-600 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 animate-shine"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shine" style={{ animationDuration: '1.5s' }}></div>
        
        <div className="relative flex flex-col items-center">
          <div className="flex items-center gap-3">
            <span className="animate-bounce-x">🛒</span>
            <span className="relative">
              <span className="animate-pulse-soft">¡COMPRAR AHORA!</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 animate-shine-fast blur-sm"></div>
            </span>
            <span className="animate-bounce-x">🎁</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1 opacity-90">
            <span className="animate-pulse">⚡</span>
            <span className="font-medium">¡Últimas unidades!</span>
            <span className="animate-pulse">⚡</span>
          </div>
        </div>
      </button>

      {reviews.length > 0 && (
        <div className="flex items-center justify-center gap-4 mt-6 py-3 px-4 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50 rounded-lg hover:shadow-sm transition-all duration-300">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-400">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-200'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-sm">
              <span className="font-medium text-gray-700">{reviews.length}</span>
              <span className="text-gray-500 ml-1">{reviews.length === 1 ? 'opinión' : 'opiniones'} validadas</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
