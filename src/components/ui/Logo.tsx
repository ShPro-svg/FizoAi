import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  variant?: 'primary' | 'dark' | 'white';
}

export const LogoIcon: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 28,
  className = '',
}) => {
  return (
    <img
      src="/icon.png"
      alt="Fizo AI"
      width={size}
      height={size}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`object-contain flex-shrink-0 drop-shadow-2xs ${className}`}
    />
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 36 : 28;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className="flex items-center justify-center flex-shrink-0">
        <LogoIcon size={iconSize} />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="font-black text-[15px] tracking-tight text-slate-900 leading-tight">
            Fizo<span className="text-[#0064FA]">AI</span>
          </span>
          <span className="text-[9.5px] font-bold text-slate-400 tracking-wider uppercase">
            Financial Intelligence
          </span>
        </div>
      )}
    </div>
  );
};
