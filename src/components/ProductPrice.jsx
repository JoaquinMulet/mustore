import React from 'react';

export default function ProductPrice({ price, oldPrice }) {
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-baseline flex-wrap gap-2">
        <span className="text-3xl md:text-4xl font-bold text-red-600">
          ${price.toLocaleString('es-CL')}
        </span>
        {oldPrice && (
          <>
            <span className="text-xl text-gray-500 line-through">
              ${oldPrice.toLocaleString('es-CL')}
            </span>
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm font-bold">
              {discount}% OFF
            </span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2 bg-red-50 border-2 border-red-200 rounded-lg px-4 py-2">
        <span className="text-red-600 font-bold">🚚</span>
        <span className="text-red-600 font-bold tracking-wide">¡ENVÍO EXPRESS!</span>
      </div>
    </div>
  );
}
