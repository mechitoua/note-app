import { Feather } from 'lucide-react';

interface MobileHeaderProps {
  title?: string;
}

export const MobileHeader = ({ title = 'Notes' }: MobileHeaderProps) => {
  return (
    <div className="border-b border-border px-4 py-3">
      <div className="flex items-center space-x-2">
        <Feather className="h-5 w-5 text-blue-500" />
        <span className="font-medium">{title}</span>
      </div>
    </div>
  );
};
