import { useState, useCallback, useRef } from "react";
import { Search } from 'lucide-react';

interface SearchBarProps {
    label_txt: string;
    title_txt: string;
    fnSearch: (page: number, search: string) => Promise<void>;
}

export default function SearchBar({ label_txt, title_txt, fnSearch }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const timeRef = useRef<NodeJS.Timeout | null>(null);

    const busqueda = useCallback(async (search: string) => {
        try {
            if(timeRef.current){
                clearTimeout(timeRef.current);
            }

            timeRef.current = setTimeout(async () => {
                await fnSearch(1, search)
            }, 500);
        } catch (error: any) { console.log(error); }
    }, [fnSearch]);

    return (
        <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder={title_txt} 
                value={searchTerm}
                onChange={(e) => {
                    const value = e.target.value;
                    setSearchTerm(value);
                    busqueda(value);
                }}
                
                className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#FF7A00] transition-all text-sm"
                  aria-label={label_txt}
                  title={title_txt}
                />
              </div>
    );
}