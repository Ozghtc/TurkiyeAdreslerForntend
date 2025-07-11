import React from 'react';

interface CustomInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel';
  className?: string;
  disabled?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  disabled = false
}) => {
  // Otomatik büyük harf kuralı - istisnalar: email, tc kimlik, telefon
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Email ve telefon tipleri için büyük harf dönüşümü yapma
    if (type === 'email' || type === 'tel') {
      onChange(inputValue);
    } else {
      // Diğer tüm input'lar için otomatik büyük harf
      onChange(inputValue.toUpperCase());
    }
  };

  return (
    <div className={`input-container ${className}`}>
      <label className="input-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className="custom-input"
      />
    </div>
  );
};

export default CustomInput; 