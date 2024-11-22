import { Check, ChevronDown } from 'lucide-react'
import * as React from 'react'
import { useFontStore, fontThemes, FontTheme } from '@/store/useFontStore'
import { cn } from '@/lib/utils'

export const FontSelector = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { currentFont, setFont } = useFontStore()

  const handleFontSelect = (font: FontTheme) => {
    setFont(font)
    setIsOpen(false)
  }

  const groupedFonts = React.useMemo(() => {
    const groups = {
      'sans-serif': fontThemes.filter(font => font.category === 'sans-serif'),
      'monospace': fontThemes.filter(font => font.category === 'monospace'),
      'decorative': fontThemes.filter(font => font.category === 'decorative'),
    }
    return groups
  }, [])

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <span style={{ fontFamily: currentFont.fontFamily }}>
          {currentFont.displayName}
        </span>
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="py-1">
            {Object.entries(groupedFonts).map(([category, fonts]) => (
              <div key={category} className="px-2 py-1.5">
                <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {category}
                </div>
                {fonts.map((font) => (
                  <button
                    key={font.displayName}
                    onClick={() => handleFontSelect(font)}
                    className={cn(
                      'flex items-center justify-between w-full px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700',
                      currentFont.displayName === font.displayName && 'bg-gray-50 dark:bg-gray-700'
                    )}
                    style={{ fontFamily: font.fontFamily }}
                  >
                    <span>{font.displayName}</span>
                    {currentFont.displayName === font.displayName && (
                      <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-500" />
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
