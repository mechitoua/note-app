import { useThemeStore, defaultThemes } from '@/store/useThemeStore'
import { Check } from 'lucide-react'

export const ColorThemeSelector = () => {
  const { currentTheme, setCurrentTheme } = useThemeStore()

  return (
    <div className="grid grid-cols-6 gap-1.5 px-1">
      {Object.entries(defaultThemes).map(([key, theme]) => (
        <button
          key={key}
          onClick={() => setCurrentTheme(key)}
          className={`
            w-7 h-7 rounded-full flex items-center justify-center
            ${theme.colors.primary}
            transition-all duration-200 ease-in-out
            hover:scale-105
            ${currentTheme === key 
              ? 'ring-1.5 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 ring-gray-900 dark:ring-white' 
              : 'hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600'
            }
          `}
          aria-label={`Select ${theme.name} theme`}
          title={theme.name}
        >
          {currentTheme === key && (
            <Check className="w-3 h-3 text-white" />
          )}
        </button>
      ))}
    </div>
  )
}
