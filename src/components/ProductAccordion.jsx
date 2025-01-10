import React from 'react';
import { marked } from 'marked';

export default function ProductAccordion({ descriptionParagraphs, specifications, shipping, warranty }) {
  // Configurar marked para procesar negritas y otros elementos markdown
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  const renderMarkdown = (text) => {
    return { __html: marked.parse(text) };
  };

  const toggleAccordion = (e) => {
    const button = e.currentTarget;
    const content = button.nextElementSibling;
    const icon = button.querySelector('span:last-child');

    content.classList.toggle('hidden');
    if (content.classList.contains('hidden')) {
      icon.style.transform = 'rotate(0deg)';
    } else {
      icon.style.transform = 'rotate(180deg)';
    }
  };

  return (
    <div className="mt-12 space-y-4">
      {/* Descripción */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
          onClick={toggleAccordion}
        >
          <span className="text-lg font-semibold">Descripción</span>
          <span className="transform transition-transform duration-200">▼</span>
        </button>
        <div className="px-6 py-4 border-t border-gray-200 hidden">
          {descriptionParagraphs.map((paragraph, index) => (
            <p key={index} className="text-gray-600 mb-4" dangerouslySetInnerHTML={renderMarkdown(paragraph)} />
          ))}
        </div>
      </div>

      {/* Especificaciones */}
      {specifications && specifications.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
            onClick={toggleAccordion}
          >
            <span className="text-lg font-semibold">Especificaciones</span>
            <span className="transform transition-transform duration-200">▼</span>
          </button>
          <div className="px-6 py-4 border-t border-gray-200 hidden">
            {specifications.map((spec, index) => (
              <p key={index} className="text-gray-600 mb-4" dangerouslySetInnerHTML={renderMarkdown(spec)} />
            ))}
          </div>
        </div>
      )}

      {/* Envío */}
      {shipping && shipping.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
            onClick={toggleAccordion}
          >
            <span className="text-lg font-semibold">Información de Envío</span>
            <span className="transform transition-transform duration-200">▼</span>
          </button>
          <div className="px-6 py-4 border-t border-gray-200 hidden">
            {shipping.map((item, index) => (
              <p key={index} className="text-gray-600 mb-4" dangerouslySetInnerHTML={renderMarkdown(item)} />
            ))}
          </div>
        </div>
      )}

      {/* Garantía */}
      {warranty && warranty.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
            onClick={toggleAccordion}
          >
            <span className="text-lg font-semibold">Garantía</span>
            <span className="transform transition-transform duration-200">▼</span>
          </button>
          <div className="px-6 py-4 border-t border-gray-200 hidden">
            {warranty.map((item, index) => (
              <p key={index} className="text-gray-600 mb-4" dangerouslySetInnerHTML={renderMarkdown(item)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
