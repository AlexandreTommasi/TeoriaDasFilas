import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  fullWidth = false,
}) => {
  const baseClasses = 'font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 shadow-md hover:shadow-lg';

  const variantClasses = {
    primary: 'bg-wine-700 hover:bg-wine-800 text-white focus:ring-wine-300',
    secondary: 'bg-dark-700 hover:bg-dark-800 text-white focus:ring-dark-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${disabledClass}`}
    >
      {children}
    </button>
  );
};
