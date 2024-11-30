import { CurrentView } from '@/types';
import { Archive, Home, Plus, Search, Settings } from 'lucide-react';

interface MobileNavigationProps {
  currentView: CurrentView;
  onNavigate: (view: CurrentView) => void;
}

export const MobileNavigation = ({ currentView, onNavigate }: MobileNavigationProps) => {
  const navItems = [
    {
      icon: Home,
      label: 'Home',
      view: 'all-notes' as const,
    },
    {
      icon: Search,
      label: 'Search',
      view: 'search' as const,
    },
    {
      icon: Plus,
      label: 'New',
      view: 'new-note' as const,
    },
    {
      icon: Archive,
      label: 'Archive',
      view: 'archived' as const,
    },
    {
      icon: Settings,
      label: 'Settings',
      view: 'settings' as const,
    },
  ];

  return (
    <nav className="border-t border-border bg-background">
      <div className="flex items-center justify-around">
        {navItems.map(({ icon: Icon, label, view }) => {
          const isActive = currentView === view;
          return (
            <button
              key={view}
              onClick={() => onNavigate(view)}
              className={`relative flex flex-1 flex-col items-center py-3 transition-colors ${
                isActive
                  ? 'text-blue-500'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/20'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="mt-1 text-xs">{label}</span>
              {isActive && <div className="absolute bottom-0 h-0.5 w-1/2 bg-blue-500" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
