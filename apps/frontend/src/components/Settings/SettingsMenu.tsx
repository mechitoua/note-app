import { Settings } from 'lucide-react'
import * as React from 'react'
import { FontSelector } from './FontSelector'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ColorThemeSelector } from './ColorThemeSelector'

export const SettingsMenu = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Settings menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="settings-menu"
      >
        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
      </button>

      {isOpen && (
        <div 
          id="settings-menu"
          role="menu" 
          className="absolute right-0 z-50 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          aria-label="Settings menu"
        >
          <div className="p-4 space-y-4">
            <div role="menuitem">
              <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Theme Mode</h2>
              <ThemeToggle />
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700" role="menuitem">
              <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Color Theme</h2>
              <ColorThemeSelector />
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700" role="menuitem">
              <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Font</h2>
              <FontSelector />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
