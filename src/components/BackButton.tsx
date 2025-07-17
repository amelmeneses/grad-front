// src/components/BackButton.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

interface BackButtonProps {
  /** Ruta fija a la que navegar en lugar de -1 */
  to?: string;
  /** Texto alternativo y tooltip */
  label?: string;
  /** Clases CSS adicionales */
  className?: string;
  /** Forzar deshabilitado desde el padre */
  disabled?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({
  to,
  label = 'Volver',
  className = '',
  disabled = false,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Deshabilitar también si estamos en la ruta inicial de la sesión
  const initialPath = sessionStorage.getItem('initialPath') || '';
  const isAtInitial = pathname === initialPath;
  const isDisabled = disabled || isAtInitial;

  const handleClick = () => {
    if (isDisabled) return;
    to ? navigate(to) : navigate(-1);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      title={label}
      className={`
        flex items-center p-2 rounded-md transition
        ${isDisabled
          ? 'opacity-50 cursor-not-allowed'
          : 'bg-transparent hover:bg-gray-100'}
        text-black
        ${className}
      `}
    >
      <FaArrowLeft className="w-5 h-5" />
    </button>
  );
};

export default BackButton;
