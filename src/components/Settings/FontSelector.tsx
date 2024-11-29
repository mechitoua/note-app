import { Check, ChevronDown } from 'lucide-react'
import * as React from 'react'
import { useFontStore, fontThemes, FontTheme } from '@/store/useFontStore'
import { cn } from '@/lib/utils'

export const FontSelector = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { currentFont, setFont } = useFontStore()
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const handleKeyDown = (event: React.KeyboardEvent, font: FontTheme) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setFont(font)
      setIsOpen(false)
      buttonRef.current?.focus()
    }
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
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        aria-label="Select font"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="font-listbox"
      >
        <span style={{ fontFamily: currentFont.fontFamily }}>
          {currentFont.displayName}
        </span>
        <ChevronDown className="w-4 h-4 ml-2" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          id="font-listbox"
          role="listbox"
          aria-label="Available fonts"
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto"
          tabIndex={-1}
        >
          {Object.entries(groupedFonts).map(([category, fonts]) => (
            <div key={category} role="group" aria-label={category}>
              <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {category}
              </div>
              {fonts.map((font) => (
                <div
                  key={font.displayName}
                  role="option"
                  aria-selected={currentFont.displayName === font.displayName}
                  tabIndex={0}
                  onClick={() => {
                    setFont(font)
                    setIsOpen(false)
                    buttonRef.current?.focus()
                  }}
                  onKeyDown={(e) => handleKeyDown(e, font)}
                  className={cn(
                    'flex items-center justify-between w-full px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700',
                    currentFont.displayName === font.displayName && 'bg-gray-50 dark:bg-gray-700'
                  )}
                  style={{ fontFamily: font.fontFamily }}
                >
                  <span>{font.displayName}</span>
                  {currentFont.displayName === font.displayName && (
                    <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-500" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
