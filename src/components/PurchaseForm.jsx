// PurchaseForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import regionesData from '../data/chile_regiones_comunas.json';

export default function PurchaseForm({ productTitle, productPrice }) {
  // Estados para cada input
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('Región Metropolitana de Santiago');
  const [comuna, setComuna] = useState('');
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [nota, setNota] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [hasDiscount, setHasDiscount] = useState(false);
  const CURRENCY = 'CLP';

  // Calcular precios con descuento
  const calculatePrices = () => {
    const basePrice = productPrice;
    if (hasDiscount) {
      const discount = basePrice * 0.1; // 10% de descuento
      return {
        subtotal: basePrice,
        discount: discount,
        total: basePrice - discount
      };
    }
    return {
      subtotal: basePrice,
      discount: 0,
      total: basePrice
    };
  };

  // Función para manejar el cierre del formulario
  const handleCloseForm = () => {
    if (!hasDiscount) {
      setShowExitPopup(true);
    } else {
      // Si ya tiene descuento, cerrar directamente
      const modal = document.getElementById('purchaseModal');
      if (modal) {
        modal.style.display = 'none';
      }
    }
  };

  // Función para aplicar el descuento
  const applyDiscount = () => {
    setHasDiscount(true);
    setShowExitPopup(false);
  };

  // Función para cerrar el popup y el formulario
  const closeAll = () => {
    setShowExitPopup(false);
    const modal = document.getElementById('purchaseModal');
    if (modal) {
      modal.style.display = 'none';
    }
  };

  // Función segura para llamar a fbq
  const trackFacebookEvent = (eventName, data) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq(eventName, data);
    }
  };

  // Para mostrar comunas filtradas con base en la región seleccionada
  const [filteredComunas, setFilteredComunas] = useState([]);
  const [filteredRegiones, setFilteredRegiones] = useState([]);
  const [regionSearch, setRegionSearch] = useState('');
  const [comunaSearch, setComunaSearch] = useState('');

  // Estados para controlar si se despliega o no cada dropdown
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showComunaDropdown, setShowComunaDropdown] = useState(false);

  // Refs para detectar clics fuera de los dropdowns
  const regionListRef = useRef(null);
  const comunaListRef = useRef(null);

  // Expresiones regulares para validación
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(\+?56)?[9][0-9]{8}$/;

  // Al cambiar la región, actualizamos la lista de comunas
  useEffect(() => {
    updateComunas(region);
  }, [region]);

  // Forzar la región por defecto una vez al montar
  useEffect(() => {
    updateComunas('Región Metropolitana de Santiago');
    setFilteredRegiones(regionesData.regiones.map(r => r.region));
  }, []);

  // Filtrar regiones cuando se escribe
  useEffect(() => {
    const filtered = regionesData.regiones
      .map(r => r.region)
      .filter(r => r.toLowerCase().includes(regionSearch.toLowerCase()));
    setFilteredRegiones(filtered);
  }, [regionSearch]);

  // Filtrar comunas cuando se escribe
  useEffect(() => {
    const filtered = filteredComunas.filter(c => 
      c.toLowerCase().includes(comunaSearch.toLowerCase())
    );
    setFilteredComunas(filtered);
  }, [comunaSearch]);

  // Exponer la función handleCloseForm globalmente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.handleFormClose = handleCloseForm;
    }
  }, [hasDiscount]);

  // Funciones auxiliares
  function updateComunas(selectedRegion) {
    const regionData = regionesData.regiones.find((r) => r.region === selectedRegion);
    if (regionData) {
      setFilteredComunas(regionData.comunas);
      setComuna('');
      setComunaSearch('');
    } else {
      setFilteredComunas([]);
    }
  }

  // Cuando seleccionamos una región de la lista
  function handleRegionSelect(selectedRegion) {
    setRegion(selectedRegion);
    setRegionSearch(selectedRegion);
    setShowRegionDropdown(false);
    updateComunas(selectedRegion);
  }

  // Cuando seleccionamos una comuna de la lista
  function handleComunaSelect(selectedComuna) {
    setComuna(selectedComuna);
    setComunaSearch(selectedComuna);
    setShowComunaDropdown(false);
  }

  // Restablecer lista de comunas original
  function resetComunasList() {
    const regionData = regionesData.regiones.find((r) => r.region === region);
    if (regionData) {
      setFilteredComunas(regionData.comunas);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Prevenir múltiples envíos
    if (isSubmitting) return;

    // Validaciones mejoradas
    if (!nombre.trim()) {
      alert('Por favor, ingresa tu nombre');
      return;
    }

    if (!apellido.trim()) {
      alert('Por favor, ingresa tu apellido');
      return;
    }

    if (!email.trim() || !emailRegex.test(email)) {
      alert('Por favor, ingresa un email válido');
      return;
    }

    if (!phone.trim() || !phoneRegex.test(phone)) {
      alert('Por favor, ingresa un número de teléfono válido (9 dígitos comenzando con 9)');
      return;
    }

    if (!region.trim()) {
      alert('Por favor, selecciona una región');
      return;
    }

    if (!comuna.trim()) {
      alert('Por favor, selecciona una comuna');
      return;
    }

    if (!calle.trim()) {
      alert('Por favor, ingresa una calle válida');
      return;
    }

    if (!numero.trim()) {
      alert('Por favor, ingresa un número válido');
      return;
    }

    const subtotal = calculatePrices().subtotal;
    const total = calculatePrices().total;

    // Limpieza de espacios en blanco y formato
    const formData = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      region: region.trim(),
      comuna: comuna.trim(),
      calle: calle.trim(),
      numero: numero.trim(),
      nota: nota.trim(),
      product: productTitle,
      quantity: 1,
      subtotal,
      shipping: 0,
      total
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(
        'https://primary-production-d2694.up.railway.app/webhook/2a5c1728-4ea6-4307-84c9-9d41c75c4f45',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workflow_data: {
              titulo: 'Nueva Orden de Compra - MuStore',
              nombre: formData.nombre,
              apellido: formData.apellido,
              email: formData.email,
              telefono: formData.phone,
              region: formData.region,
              comuna: formData.comuna,
              calle: formData.calle,
              numero: formData.numero,
              nota: formData.nota,
              producto: formData.product,
              cantidad: formData.quantity,
              subtotal: `$${formData.subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
              envio: `$${formData.shipping.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
              total: `$${formData.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
            }
          })
        }
      );

      // Evento de Facebook Pixel - Compra Completada
      trackFacebookEvent('track', 'Purchase', {
        content_name: productTitle,
        content_ids: [productTitle],
        content_type: 'product',
        value: total,
        currency: CURRENCY,
        num_items: 1
      });

      // Cerrar el modal del formulario
      const modal = document.getElementById('purchaseModal');
      if (modal) {
        modal.style.display = 'none';
      }

      // Crear y mostrar el modal de éxito
      const successModal = document.createElement('div');
      successModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]';
      successModal.innerHTML = `
        <div class="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-4 text-center relative transform transition-all duration-300">
          <div class="mb-6">
            <svg class="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-4 text-green-600">¡Hemos recibido tu compra!</h3>
          <div class="bg-green-50 p-4 rounded-lg mb-6">
            <p class="text-lg text-green-700 font-medium mb-2">
              Nos pondremos en contacto contigo pronto para coordinar la entrega
            </p>
            <p class="text-3xl animate-pulse">📦</p>
          </div>
          <button class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105">
            ¡Entendido!
          </button>
        </div>
      `;

      document.body.appendChild(successModal);

      // Manejar el cierre del modal de éxito
      const closeSuccessModal = () => {
        successModal.remove();
        // Resetear el formulario
        setNombre('');
        setApellido('');
        setEmail('');
        setPhone('');
        setRegion('Región Metropolitana de Santiago');
        setComuna('');
        setCalle('');
        setNumero('');
        setNota('');
        setHasDiscount(false);
      };

      // Agregar evento al botón de cerrar
      const closeButton = successModal.querySelector('button');
      if (closeButton) {
        closeButton.addEventListener('click', closeSuccessModal);
      }

      // Cerrar al hacer clic fuera del modal
      successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
          closeSuccessModal();
        }
      });

    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      // Mostrar un mensaje de error más amigable
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]';
      errorMessage.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4 text-center">
          <svg class="mx-auto h-12 w-12 text-red-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <h3 class="text-lg font-bold mb-2 text-red-600">Ha ocurrido un error</h3>
          <p class="text-gray-600 mb-4">Tu pedido se ha enviado correctamente, pero hubo un problema técnico. No te preocupes, nos pondremos en contacto contigo pronto.</p>
          <button class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">Cerrar</button>
        </div>
      `;

      document.body.appendChild(errorMessage);

      // Manejar el cierre del mensaje de error
      const closeError = () => {
        errorMessage.remove();
      };

      // Agregar evento al botón de cerrar
      const errorButton = errorMessage.querySelector('button');
      if (errorButton) {
        errorButton.addEventListener('click', closeError);
      }

      // Cerrar al hacer clic fuera del mensaje
      errorMessage.addEventListener('click', (e) => {
        if (e.target === errorMessage) {
          closeError();
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Manejar clics fuera de los dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (regionListRef.current && !regionListRef.current.contains(event.target)) {
        setShowRegionDropdown(false);
      }
      if (comunaListRef.current && !comunaListRef.current.contains(event.target)) {
        setShowComunaDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 pt-8 space-y-4 bg-white rounded-md shadow" id="purchaseForm">
        <button
          type="button"
          onClick={handleCloseForm}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="my-6 text-center transform hover:scale-105 transition-all duration-300">
          <div className="bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100 p-4 rounded-xl shadow-lg border-2 border-yellow-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shine"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-yellow-800 mb-2">
                ¡Finalizar Compra! 🎉
              </h3>
              <p className="text-green-600 font-bold">
                ¡Ahora no pagas nada, solo pagas al recibir el producto! 💰
              </p>
            </div>
          </div>
        </div>
        
        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            id="nombre"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Juan"
          />
        </div>

        {/* Apellido */}
        <div>
          <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
            Apellido *
          </label>
          <input
            type="text"
            id="apellido"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            placeholder="Ej: Pérez"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ej: juan@email.com"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono *
          </label>
          <input
            type="tel"
            id="phone"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ej: 912345678"
          />
        </div>

        {/* Región (dropdown) */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Región *</label>
          <input
            type="text"
            value={regionSearch}
            required
            onChange={(e) => {
              setRegionSearch(e.target.value);
              setShowRegionDropdown(true);
            }}
            onClick={() => {
              setRegionSearch('');
              setShowRegionDropdown(true);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Buscar región..."
          />

          {showRegionDropdown && (
            <div
              ref={regionListRef}
              className="absolute z-50 bg-white border border-gray-300 rounded mt-1 w-full max-h-52 overflow-auto shadow"
            >
              {regionesData.regiones
                .filter((r) => r.region.toLowerCase().includes(regionSearch.toLowerCase()))
                .map((r) => (
                  <div
                    key={r.region}
                    onClick={() => handleRegionSelect(r.region)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {r.region}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Comuna (dropdown) */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Comuna *</label>
          <input
            type="text"
            value={comunaSearch}
            required
            onChange={(e) => {
              setComunaSearch(e.target.value);
              const filtered = filteredComunas.filter(c => 
                c.toLowerCase().includes(e.target.value.toLowerCase())
              );
              setFilteredComunas(filtered);
              setShowComunaDropdown(true);
            }}
            onClick={() => {
              setComunaSearch('');
              resetComunasList();
              setShowComunaDropdown(true);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Buscar comuna..."
          />

          {showComunaDropdown && filteredComunas.length > 0 && (
            <div
              ref={comunaListRef}
              className="absolute z-50 bg-white border border-gray-300 rounded mt-1 w-full max-h-52 overflow-auto shadow"
            >
              {filteredComunas.map((com) => (
                <div
                  key={com}
                  onClick={() => handleComunaSelect(com)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {com}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calle */}
        <div>
          <label htmlFor="calle" className="block text-sm font-medium text-gray-700 mb-1">
            Calle *
          </label>
          <input
            type="text"
            id="calle"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={calle}
            onChange={(e) => setCalle(e.target.value)}
            placeholder="Ej: Av. Principal"
          />
        </div>

        {/* Número */}
        <div>
          <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
            Número *
          </label>
          <input
            type="text"
            id="numero"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            placeholder="Ej: 123"
          />
        </div>

        {/* Nota */}
        <div>
          <label htmlFor="nota" className="block text-sm font-medium text-gray-700 mb-1">
            Nota (opcional)
          </label>
          <textarea
            id="nota"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px]"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ej: No estaré disponible desde las 9 hasta las 18 horas"
          />
          <p className="mt-1 text-sm text-gray-500">
            Puedes dejar instrucciones especiales para la entrega
          </p>
        </div>

        {/* Resumen de costos */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Resumen de tu pedido</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Producto:</span>
              <span className="font-medium">${calculatePrices().subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
            </div>
            {hasDiscount && (
              <div className="flex justify-between items-center text-green-600">
                <span>Descuento (10%):</span>
                <span>-${calculatePrices().discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Envío:</span>
              <span className="font-medium text-green-600">Gratis</span>
            </div>
            <div className="pt-2 mt-2 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold text-red-600">${calculatePrices().total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-8 rounded-full text-xl font-bold transition-all duration-300 transform 
            ${isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl'
            } 
            text-white relative overflow-hidden`}
        >
          <div className="flex items-center justify-center space-x-2">
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Procesando pedido...</span>
              </>
            ) : (
              <>
                <span>Confirmar Pedido</span>
                <span className="text-2xl">🎁</span>
              </>
            )}
          </div>
        </button>
      </form>
      {showExitPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-4 relative transform transition-all duration-300">
            {/* Icono de regalo animado */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
              <div className="animate-bounce">
                <span className="text-6xl">🎁</span>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                ¡Espera! Tenemos un regalo para ti
              </h3>
              
              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <p className="text-lg text-gray-700 mb-2">
                  Porque apreciamos tu interés en nuestros productos, queremos recompensarte con un
                </p>
                <p className="text-3xl font-bold text-red-600 animate-pulse">
                  10% DE DESCUENTO
                </p>
              </div>
              
              <p className="text-gray-600 mb-6">
                ¡Aprovecha esta oportunidad única para ahorrar en tu compra!
              </p>

              <div className="space-y-4">
                <button
                  onClick={applyDiscount}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transform transition-all duration-300 hover:scale-105 animate-bounce shadow-lg hover:shadow-xl"
                >
                  ¡SÍ! QUIERO MI DESCUENTO 🎉
                </button>
                
                <button
                  onClick={closeAll}
                  className="w-full text-gray-500 hover:text-gray-700 font-medium py-2"
                >
                  No, gracias. Prefiero pagar precio completo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

<style jsx>{`
  @keyframes shine {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(100%);
    }
  }
  .animate-shine {
    animation: shine 2s infinite linear;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.8) 50%,
      transparent 100%
    );
  }
`}</style>