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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la respuesta del servidor');
      }

      // Evento de Facebook Pixel - Compra Completada
      trackFacebookEvent('track', 'Purchase', {
        content_name: productTitle,
        content_ids: [productTitle],
        content_type: 'product',
        value: total,
        currency: CURRENCY,
        num_items: 1
      });

      // Cerrar el modal
      const modal = document.getElementById('purchaseModal');
      if (modal) {
        modal.style.display = 'none';
      }

      // Mostrar mensaje de éxito como un modal independiente
      const successModal = document.createElement('div');
      successModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]';
      successModal.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4 text-center">
          <svg class="mx-auto h-12 w-12 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <h3 class="text-lg font-bold mb-2">¡Hemos recibido tu compra!</h3>
          <p class="text-gray-600 mb-4">Te enviaremos un correo con los detalles de tu pedido.</p>
          <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Aceptar
          </button>
        </div>
      `;

      document.body.appendChild(successModal);

      // Manejar el cierre del modal de éxito
      const closeSuccessModal = () => {
        successModal.remove();
      };

      // Agregar evento al botón de aceptar
      successModal.querySelector('button').addEventListener('click', closeSuccessModal);

      // También cerrar al hacer clic fuera del modal
      successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
          closeSuccessModal();
        }
      });

      // Resetear el formulario solo después de cerrar el modal
      setNombre('');
      setApellido('');
      setEmail('');
      setPhone('');
      setRegion('Región Metropolitana de Santiago');
      setComuna('');
      setCalle('');
      setNumero('');
      setNota('');
    } catch (error) {
      console.error('Error detallado:', error);
      alert('Lo sentimos, hubo un error al procesar tu pedido. Por favor, intenta nuevamente.');
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4 bg-white rounded-md shadow" id="purchaseForm">
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
      <h2 className="text-2xl font-bold mb-2">Finalizar Compra</h2>
      <p className="text-green-600 text-sm mb-6">
        <strong>¡Ahora no pagas nada, solo pagas al recibir el producto!</strong> 
      </p>
      
      {/* Nombre */}
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre *
        </label>
        <input
          type="text"
          id="nombre"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ej: juan@gmail.com"
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
          pattern="[0-9]{9}"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
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
              <span className="text-lg font-bold text-blue-600">${calculatePrices().total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Popup de descuento */}
      {showExitPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-center">¡No queremos que te vayas!</h3>
            <p className="text-center mb-6">
              Por lo cual te regalamos un 10% de descuento extra en tu compra.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={closeAll}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={applyDiscount}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                ¡Quiero mi descuento!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-6 rounded-full text-lg font-semibold transition-colors ${
          isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {isSubmitting ? 'Enviando...' : 'Confirmar Compra'}
      </button>
    </form>
  );
}
