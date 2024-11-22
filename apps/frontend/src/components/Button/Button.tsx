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

    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variantClassNames = {
      primary: cn(
        'inline-flex items-center justify-center',
        'rounded-md px-4 py-2',
        'font-medium',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'transition-colors duration-200',
        theme.colors.primary,
        'text-white dark:text-slate-900' // Light text on rich bg (light mode), dark text on pastel bg (dark mode)
      ),
      secondary: cn(
        'inline-flex items-center justify-center',
        'rounded-md px-4 py-2',
        'font-medium',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'transition-colors duration-200',
        theme.colors.secondary,
        'text-white dark:text-slate-900' // Light text on rich bg (light mode), dark text on pastel bg (dark mode)
      ),
      ghost: cn(
        'inline-flex items-center justify-center',
        'rounded-md px-4 py-2',
        'font-medium',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'transition-colors duration-200',
        theme.colors.hover,
        theme.colors.accent // Using theme accent color which is already contrast-optimized
      ),
    };

    const sizes = {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-6 py-3',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantClassNames[variant],
          sizes[size],
          fullWidth && 'w-full',
          'focus:ring-opacity-50',
          variant === 'primary' && `focus:ring-${theme.colors.accent.split('-')[1]}-500`,
          variant === 'secondary' && `focus:ring-${theme.colors.accent.split('-')[1]}-400`,
          className
        )}
        {...props}
      />
    );
  }
);
