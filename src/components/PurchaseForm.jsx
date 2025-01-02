// PurchaseForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import regionesData from '../data/chile_regiones_comunas.json';

export default function PurchaseForm({ productTitle, productPrice }) {
  // Estados para cada input
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('Región Metropolitana de Santiago');
  const [comuna, setComuna] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const CURRENCY = 'CLP';

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
    if (!fullName.trim()) {
      alert('Por favor, ingresa tu nombre completo');
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

    if (!address.trim()) {
      alert('Por favor, ingresa una dirección válida');
      return;
    }

    const subtotal = productPrice;
    const total = subtotal;

    // Limpieza de espacios en blanco y formato
    const formData = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      region: region.trim(),
      comuna: comuna.trim(),
      address: address.trim(),
      product: productTitle,
      quantity: 1,
      subtotal,
      shipping: 0,
      total
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(
        'https://primary-production-d2694.up.railway.app/webhook/45d5bcf9-298b-4517-b39d-c9834be36925',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workflow_data: {
              titulo: 'Nueva Orden de Compra - MuStore',
              cliente: formData.fullName,
              email: formData.email,
              telefono: formData.phone,
              region: formData.region,
              comuna: formData.comuna,
              direccion: formData.address,
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

      // Reset de campos
      setFullName('');
      setEmail('');
      setPhone('');
      setRegion('Región Metropolitana de Santiago');
      setComuna('');
      setAddress('');

      // Mostrar mensaje de éxito
      const successModal = document.createElement('div');
      successModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      successModal.innerHTML = `
        <div class="bg-white rounded-2xl w-full max-w-md m-4 p-8 text-center relative transform transition-all">
          <div class="mb-6">
            <svg class="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold mb-4">¡Compra Recibida!</h2>
          <p class="text-gray-600 mb-6">
            Gracias por tu compra. Hemos recibido tu pedido y pronto nos pondremos en contacto contigo para entregarte la información de tu envío.
          </p>
          <button
            class="bg-blue-600 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
            onclick="this.parentElement.parentElement.remove(); document.body.style.overflow = 'auto'; window.location.href = '/';"
          >
            Entendido
          </button>
        </div>
      `;
      document.body.appendChild(successModal);
      document.body.style.overflow = 'hidden';

      // Cerrar el modal de compra
      const purchaseModal = document.getElementById('purchaseModal');
      if (purchaseModal) {
        purchaseModal.classList.remove('flex');
        purchaseModal.classList.add('hidden');
      }

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
      <h2 className="text-2xl font-bold mb-2">Finalizar Compra</h2>
      <p className="text-green-600 text-sm mb-6">
        <strong>¡Ahora no pagas nada, solo pagas al recibir el producto!</strong> 
      </p>
      
      {/* Nombre completo */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre Completo *
        </label>
        <input
          type="text"
          id="fullName"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ej: Juan Pérez"
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

      {/* Dirección */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Dirección *
        </label>
        <input
          type="text"
          id="address"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Ej: Av. Principal 123, Depto 45"
        />
      </div>

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
