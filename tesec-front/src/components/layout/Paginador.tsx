import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  totalRecords,
  onPageChange,
}) => {
  if (totalRecords === 0 || lastPage < 1) return null;

  const getPaginasVisibles = () => {
    const maxBloque = 5;
    let inicio = Math.max(1, currentPage - 2);
    const fin = Math.min(lastPage, inicio + maxBloque - 1);

    if (fin - inicio < maxBloque - 1) {
      inicio = Math.max(1, fin - maxBloque + 1);
    }

    const paginas = [];
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    return paginas;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-6 py-4 border border-gray-200 rounded-xl mt-4 shadow-sm">
      <span className="text-sm text-gray-500 order-2 sm:order-1">
        Mostrando página{" "}
        <span className="font-bold text-gray-900">{currentPage}</span> de{" "}
        <span className="font-bold text-gray-900">{lastPage}</span>
      </span>
      <div className="flex items-center gap-2 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-lg border transition-all duration-200
            enabled:border-gray-200 enabled:text-gray-600 enabled:bg-white
            enabled:hover:border-[#FF7A00] enabled:hover:text-[#FF7A00] enabled:hover:bg-orange-50
            enabled:cursor-pointer

            disabled:border-transparent disabled:text-gray-200 disabled:bg-gray-50
            disabled:cursor-not-allowed"
          title="Página anterior"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex gap-1">
          {getPaginasVisibles().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-200 ${
                currentPage === page
                  ? "bg-[#FF7A00] text-white shadow-md scale-105 border border-[#FF7A00]"
                  : "text-gray-600 bg-white border border-gray-200 hover:border-[#FF7A00] hover:text-[#FF7A00]"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="p-2 rounded-lg border transition-all duration-200
            enabled:border-gray-200 enabled:text-gray-600 enabled:bg-white
            enabled:hover:border-[#FF7A00] enabled:hover:text-[#FF7A00] enabled:hover:bg-orange-50
            enabled:cursor-pointer

            disabled:border-transparent disabled:text-gray-200 disabled:bg-gray-50
            disabled:cursor-not-allowed"
          title="Siguiente página"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
