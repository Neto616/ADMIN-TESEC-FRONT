"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Package,
  Tag,
  MoreVertical,
} from "lucide-react";
import { productoService } from "@/services/productoService";
import { Pagination } from "@/components/layout/Paginador";
import { useDelete } from "@/hooks/DeleteHook";
import Image from "next/image";

interface Producto {
  id: number;
  nombre: string;
  sku: string;
  marca: string;
  link: string;
  precio: number;
  precio_publico: number;
  proveedores?: { nombre: string };
  inventario?: { cantidad: number };
  imagen?: { url: string };
  estatus: number;
}

export default function ProductosPage() {
  const [productosFetch, setProductosFetch] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const itemsPerPage = 8;

  const productFetch = useCallback(async (page: number) => {
    try {
      const response = await productoService.obtener({
        page,
        per_page: itemsPerPage,
      });
      setProductosFetch(response.response.data);
      setCurrentPage(response.response.current_page);
      setLastPage(response.response.last_page);
      setTotalRecords(response.response.total);
    } catch (error) {}
  }, []);

  useEffect(() => {
    productFetch(currentPage);
  }, [productFetch, currentPage]);

  const handleDelete = (id: number) => {
    useDelete(
      id,
      () => productFetch(currentPage),
      (idToDelete) => productoService.eliminar(idToDelete),
    );
    setOpenMenuId(null);
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Catálogo de Productos
          </h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Gestiona el inventario, precios y existencias.
          </p>
        </div>

        <Link
          href="/productos/nuevo"
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#FF7A00] text-white px-5 py-3 md:py-2 rounded-lg hover:bg-orange-600 transition-all shadow-md shadow-orange-200 font-medium"
        >
          <Plus size={20} />
          <span className="text-sm">Agregar Producto</span>
        </Link>
      </div>

      {/* Grid de Productos */}
      {productosFetch.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {productosFetch.map((producto) => (
            <div
              key={producto.id}
              className={`group rounded-xl border transition-all duration-300 flex flex-col overflow-hidden ${
                producto.estatus === 0
                  ? "bg-gray-100 border-gray-300 grayscale opacity-80 shadow-none"
                  : "bg-white border-gray-200 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Imagen */}
              <div className="h-40 md:h-48 bg-gray-100 relative flex items-center justify-center overflow-hidden">
                {producto.imagen ? (
                  <Image
                    src={producto.imagen.url} // Usamos la URL que viene en el JSON
                    alt={producto.nombre || "Producto"}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain p-2" // object-contain para que no se corte el logo
                    priority={false}
                  />
                ) : (
                  <Package
                    size={48}
                    className="text-gray-300 group-hover:scale-110 transition-transform duration-500"
                  />
                )}

                {/* Badge de Estatus Inactivo */}
                {producto.estatus === 0 && (
                  <div className="absolute top-3 left-3 bg-gray-600 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase z-10">
                    Inactivo
                  </div>
                )}

                {/* Badge de Stock */}
                <div
                  className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold ${
                    (producto.inventario?.cantidad ?? 0) > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {(producto.inventario?.cantidad ?? 0) > 0
                    ? `${Number(producto.inventario?.cantidad).toLocaleString(
                        "es-MX",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                      )} en stock`
                    : "Agotado"}
                </div>

                {/* Menú móvil - solo visible en móvil */}
                <div className="md:hidden absolute top-3 left-3">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === producto.id ? null : producto.id,
                        )
                      }
                      className="p-1.5 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white transition-colors shadow-sm"
                      aria-label="Menú de opciones"
                      title="Más opciones"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {openMenuId === producto.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute left-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                          <Link href={`/productos/editar/${producto.id}`}>
                            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors text-left">
                              <Edit3 size={16} className="text-blue-600" />
                              <span>Editar</span>
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(producto.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left border-t border-gray-100"
                          >
                            <Trash2 size={16} />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Contenido de la Card */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <span className="text-xs font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                    #{producto.sku}
                  </span>
                  <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Tag size={12} /> {producto.marca}
                  </span>
                </div>

                <h3
                  className={`font-bold line-clamp-2 mb-2 text-sm md:text-base transition-colors ${
                    producto.estatus === 0
                      ? "text-gray-500"
                      : "text-gray-900 group-hover:text-[#FF7A00]"
                  }`}
                >
                  {producto.nombre}
                </h3>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span
                    className={`text-lg md:text-xl font-bold ${
                      producto.estatus === 0 ? "text-gray-400" : "text-gray-900"
                    }`}
                  >
                    $
                    {Number(producto.precio).toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              {/* Acciones - visible solo en desktop */}
              <div className="hidden md:flex bg-gray-50 px-4 py-3 gap-2 border-t border-gray-100">
                <Link
                  href={`/productos/editar/${producto.id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-1.5 rounded-lg text-sm font-medium hover:border-[#FF7A00] hover:text-[#FF7A00] transition-colors"
                >
                  <Edit3 size={16} /> Editar
                </Link>
                <button
                  onClick={() => handleDelete(producto.id)}
                  className="px-3 py-1.5 bg-white border border-gray-200 text-red-500 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                  title="Eliminar producto"
                  aria-label="Eliminar producto"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Search size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No se encontraron productos</p>
        </div>
      )}

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        totalRecords={totalRecords}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
