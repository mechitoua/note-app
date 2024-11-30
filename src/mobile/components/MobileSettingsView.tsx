import { defaultThemes, useThemeStore } from '@/store/useThemeStore';
import { fontThemes, useFontStore } from '@/store/useFontStore';
import { Moon, Sun } from 'lucide-react';
import { MobileHeader } from './MobileHeader';

export const MobileSettingsView = () => {
  const { isDark, setIsDark, currentTheme, setCurrentTheme } = useThemeStore();
  const { currentFont, setFont } = useFontStore();

  return (
    <div className="flex h-full flex-col">
      <MobileHeader title="Settings" />
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-4">
          {/* Dark Mode Toggle */}
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground">Appearance</h2>
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex w-full items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
            >
              <div className="flex items-center space-x-3">
                {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <span className="font-medium">Dark Mode</span>
              </div>
              <div
                className={`h-6 w-11 rounded-full p-1 transition-colors ${
                  isDark ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`h-4 w-4 rounded-full bg-white transition-transform ${
                    isDark ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Color Theme Selection */}
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground">Color Theme</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(defaultThemes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => setCurrentTheme(key)}
                  className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-accent/50 ${
                    currentTheme === key ? 'border-blue-500' : 'border-border dark:border-border'
                  }`}
                >
                  <div className={`h-4 w-4 rounded-full ${theme.colors.primary.split(' ')[0]}`} />
                  <span className="font-medium">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Selection */}
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground">Font</h2>
            <div className="space-y-2">
              {fontThemes.map(font => (
                <button
                  key={font.displayName}
                  onClick={() => setFont(font)}
                  className={`w-full rounded-lg border p-4 text-left transition-colors hover:bg-accent/50 ${
                    currentFont.displayName === font.displayName ? 'border-blue-500' : 'border-border dark:border-border'
                  }`}
                  style={{ fontFamily: font.fontFamily }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{font.displayName}</span>
                    <span className="text-xs text-muted-foreground">{font.category}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    The quick brown fox jumps over the lazy dog
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
