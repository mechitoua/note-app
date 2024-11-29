import { ButtonHTMLAttributes, forwardRef } from 'react';
import { useThemeStore, defaultThemes } from '@/store/useThemeStore';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {
    const { currentTheme } = useThemeStore();
    const theme = defaultThemes[currentTheme] || defaultThemes.navy;

    const baseStyles = cn(
      'inline-flex items-center justify-center',
      'rounded-lg',
      'font-medium',
      'transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
      'select-none'
    );

    const variantClassNames = {
      primary: cn(
        'shadow-sm',
        'active:scale-[0.98] active:translate-y-[0.5px]',
        theme.colors.primary,
        'text-white dark:text-white', // Always white text for primary buttons
        'focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900'
      ),
      secondary: cn(
        'bg-white dark:bg-slate-800',
        'border border-slate-200 dark:border-slate-700',
        'text-slate-900 dark:text-slate-100',
        'hover:bg-slate-50 dark:hover:bg-slate-700',
        'active:scale-[0.98] active:translate-y-[0.5px]',
        'focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900'
      ),
      ghost: cn(
        'text-slate-700 dark:text-slate-300',
        'hover:bg-slate-100 dark:hover:bg-slate-800',
        'active:scale-[0.98] active:translate-y-[0.5px]',
        'focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900'
      ),
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-11 px-6 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantClassNames[variant],
          sizes[size],
          fullWidth && 'w-full',
          'focus-visible:ring-opacity-50',
          variant === 'primary' && `focus-visible:ring-${theme.colors.accent.split('-')[1]}-500`,
          variant === 'secondary' && `focus-visible:ring-${theme.colors.accent.split('-')[1]}-400`,
          className
        )}
        {...props}
      />
    );
  }
);
