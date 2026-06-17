import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-emerald-400 text-emerald-950 active:bg-emerald-300 shadow-lg shadow-emerald-900/40',
  secondary: 'bg-white/10 text-white border border-white/25 active:bg-white/20',
  ghost: 'bg-transparent text-white/80 active:text-white',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-2xl px-5 py-3 font-bold tracking-wide transition-colors disabled:opacity-40 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
