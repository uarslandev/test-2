import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2">
          <Globe size={20} />
          <span className="text-sm font-semibold uppercase">{i18n.language}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#1e1e1e] border-gray-700">
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className={`cursor-pointer text-gray-300 hover:text-white hover:bg-white/10 ${
            i18n.language === 'en' ? 'bg-white/10 text-white' : ''
          }`}
        >
          <span className="mr-2">🇬🇧</span> English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('de')}
          className={`cursor-pointer text-gray-300 hover:text-white hover:bg-white/10 ${
            i18n.language === 'de' ? 'bg-white/10 text-white' : ''
          }`}
        >
          <span className="mr-2">🇩🇪</span> Deutsch
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
