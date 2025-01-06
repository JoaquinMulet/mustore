import React from 'react';

export default function CollaboratorsBanner() {
  const collaborators = [
    { src: '/colaboradores/cuentarut.png', alt: 'Cuenta Rut' },
    { src: '/colaboradores/bluexpress.png', alt: 'Bluexpress' },
    { src: '/colaboradores/mercadopago.jpg', alt: 'MercadoPago' },
    { src: '/colaboradores/visa_master.png', alt: 'Visa y Mastercard' },
    { src: '/colaboradores/cmr.png', alt: 'CMR' },
    { src: '/colaboradores/tenpo.svg', alt: 'Tenpo' }
  ];

  return (
    <div className="bg-gray-50 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">
          Nuestros Colaboradores de Confianza
        </h3>
        <div className="overflow-hidden relative">
          <div className="marquee-container">
            <div className="marquee-content">
              {collaborators.map((collaborator, index) => (
                <div
                  key={`original-${index}`}
                  className="flex-shrink-0 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mx-6"
                  style={{ width: '200px' }}
                >
                  <img
                    src={collaborator.src}
                    alt={collaborator.alt}
                    className="h-16 object-contain mx-auto filter hover:brightness-110 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
            <div className="marquee-content">
              {collaborators.map((collaborator, index) => (
                <div
                  key={`duplicate-${index}`}
                  className="flex-shrink-0 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mx-6"
                  style={{ width: '200px' }}
                >
                  <img
                    src={collaborator.src}
                    alt={collaborator.alt}
                    className="h-16 object-contain mx-auto filter hover:brightness-110 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .marquee-container {
          display: flex;
          width: 100%;
        }

        .marquee-content {
          display: flex;
          animation: marquee 8s linear infinite;
          white-space: nowrap;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}