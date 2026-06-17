import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-b from-emerald-300 to-emerald-500 text-emerald-950 shadow-lg shadow-emerald-900/40 ring-1 ring-white/40 ring-inset active:from-emerald-400 active:to-emerald-500 active:shadow-md',
  secondary: 'bg-white/10 text-white border border-white/25 shadow-sm active:bg-white/20',
  ghost: 'bg-transparent text-white/80 active:text-white',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-2xl px-5 py-3 font-bold tracking-wide transition-all duration-100 active:scale-95 disabled:opacity-40 disabled:active:scale-100 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
