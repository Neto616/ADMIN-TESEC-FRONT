"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Minus,
  FileText,
  ShoppingCart,
  Save,
  XCircle,
  Package,
} from "lucide-react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

import { productoService } from "../../../services/productoService";
import { catalogoService } from "@/services/catalogoService";
import { Pagination } from "../../../components/layout/Paginador";
import SearchBar from "@/components/layout/SearchBar";
import { cotizacionService } from "@/services/cotizacionService";
import TextArea from "@/components/layout/TextArea";

interface Producto {
  id: string;
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

interface Cliente {
  value: number;
  label: string;
}

interface ItemCotizacion extends Producto {
  cantidad: number;
}

interface CotizacionData {
  titulo: string;
  id_cliente: number;
  productos: Array<ItemCotizacion>;
  useIVA: boolean;
  useISR: boolean;
  consideraciones: string;
}

const ITEMS_POR_PAGINA = 6;

export default function CotizarPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [items, setItems] = useState<ItemCotizacion[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [cotizacionData, setCotizacionData] = useState<CotizacionData>({
    id_cliente: 0,
    productos: [],
    titulo: "",
    useISR: false,
    useIVA: false,
    consideraciones: "",
  });

  const handleTextAreaChange = (name: string, value: string) => {
    setCotizacionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const productosFetch = useCallback(
    async (page: number, searchTerm: string) => {
      try {
        const response = await productoService.obtener({
          page,
          per_page: ITEMS_POR_PAGINA,
          buscar: searchTerm,
        });
        setProductos(response.response.data);
        setCurrentPage(response.response.current_page);
        setLastPage(response.response.last_page);
        setTotalRecords(response.response.total);
      } catch (error) {
        console.log(error);
      }
    },
    [],
  );

  useEffect(() => {
    const getClientes = async () => {
      try {
        const resultado = await catalogoService.getClientes();
        setClientes(resultado.response);
      } catch (error) {
        console.log(error);
      }
    };
    getClientes();
  }, []);

  useEffect(() => {
    productosFetch(currentPage, "");
  }, [currentPage, productosFetch]);

  const agregarProducto = (producto: Producto) => {
    setItems((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const quitarUno = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, cantidad: Math.max(1, item.cantidad - 1) };
        }
        return item;
      }),
    );
  };

  const eliminarItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const calcularTotal = () => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.precio_publico * item.cantidad,
      0,
    );
    const iva = cotizacionData.useIVA ? subtotal * 0.16 : 0;
    const total = subtotal + iva;
    const costoTotal = items.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0,
    );
    const ganancia = subtotal - costoTotal;

    return { subtotal, iva, total, ganancia };
  };

  const { subtotal, iva, total, ganancia } = calcularTotal();

  const handleGuardarCotizacion = async () => {
    if (items.length === 0) {
      MySwal.fire({
        icon: "error",
        title: "Cotización vacía",
        text: "Agrega productos.",
        confirmButtonColor: "#000",
      });
      return;
    }
    if (!cotizacionData?.id_cliente) {
      MySwal.fire({
        icon: "warning",
        title: "Falta Cliente",
        text: "Selecciona un cliente.",
        confirmButtonColor: "#FF7A00",
      });
      return;
    }

    try {
      await cotizacionService.crear({ ...cotizacionData, productos: items });
      setItems([]);
      setCotizacionData({
        id_cliente: 0,
        productos: [],
        titulo: "",
        useISR: false,
        useIVA: false,
        consideraciones:
          "1. Costos netos expresados en pesos mexicanos, más IVA, en caso de requerir factura.",
      });
      MySwal.fire({
        icon: "success",
        title: "Cotización guardada",
        confirmButtonColor: "#000000",
      });
    } catch (error) {
      console.log(error);
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al guardar.",
        confirmButtonColor: "#000",
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] pb-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-6 h-full items-start">
        {/* Catálogo (Columna Izquierda) */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden w-full">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package size={18} className="text-[#FF7A00]" />
                </div>
                Catálogo
              </h2>
              <SearchBar
                label_txt="Buscar producto..."
                title_txt="Buscar"
                fnSearch={productosFetch}
              />
            </div>
          </div>

          <div className="p-5 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {productos.map((producto) => (
                <div
                  key={producto.id}
                  onClick={() => agregarProducto(producto)}
                  className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-[#FF7A00] cursor-pointer transition-all flex flex-col relative"
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded uppercase tracking-tighter">
                      {producto.marca}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${(producto.inventario?.cantidad ?? 0) > 0 ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}
                    >
                      Stock: {producto.inventario?.cantidad ?? 0}
                    </span>
                  </div>

                  <div className="relative h-28 bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {producto.imagen?.url ? (
                      <Image
                        src={producto.imagen.url}
                        alt={producto.nombre}
                        fill
                        unoptimized
                        className="object-contain p-2"
                      />
                    ) : (
                      <Package size={32} className="text-gray-300" />
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-gray-800 line-clamp-2 min-h-[2.5rem] mb-3 uppercase">
                    {producto.nombre}
                  </h3>

                  <div className="flex justify-between items-end mt-auto pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-lg font-black text-gray-900">
                        $
                        {Number(producto.precio_publico).toLocaleString(
                          "es-MX",
                          { minimumFractionDigits: 2 },
                        )}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium italic">
                        Precio unitario MXN
                      </p>
                    </div>
                    <button className="bg-gray-900 text-white p-2 rounded-lg group-hover:bg-[#FF7A00] transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            totalRecords={totalRecords}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>

        {/* Panel de Cotización Unificado (Columna Derecha) */}
        <div className="w-full lg:w-[400px] xl:w-[450px] lg:sticky lg:top-4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col">
            {/* Header y Cliente */}
            <div className="p-5 bg-gradient-to-br from-gray-900 to-black text-white">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase tracking-wider">
                <FileText size={20} className="text-[#FF7A00]" />
                Cotización
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Título del Proyecto
                  </label>
                  <input
                    type="text"
                    value={cotizacionData.titulo}
                    onChange={(e) =>
                      setCotizacionData({
                        ...cotizacionData,
                        titulo: e.target.value,
                      })
                    }
                    placeholder="Ej. Instalación Eléctrica TESEC"
                    className="w-full p-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white outline-none focus:border-[#FF7A00] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Cliente *
                  </label>
                  <select
                    value={cotizacionData.id_cliente}
                    onChange={(e) =>
                      setCotizacionData({
                        ...cotizacionData,
                        id_cliente: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white outline-none focus:border-[#FF7A00]"
                  >
                    <option value="0" className="text-black">
                      Seleccionar...
                    </option>
                    {clientes.map((c) => (
                      <option
                        key={c.value}
                        value={c.value}
                        className="text-black"
                      >
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Lista de Items (Scrollable) */}
            <div className="flex-1 overflow-y-auto max-h-[300px] p-4 bg-gray-50/50 min-h-[150px]">
              {items.length > 0 ? (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate uppercase">
                          {item.nombre}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          ${item.precio_publico.toLocaleString()} / pza
                        </p>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                        <button
                          onClick={() => quitarUno(item.id)}
                          className="p-1 hover:bg-white hover:text-red-500 rounded transition-all"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => agregarProducto(item)}
                          className="p-1 hover:bg-white hover:text-[#FF7A00] rounded transition-all"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => eliminarItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 py-8">
                  <ShoppingCart size={40} className="opacity-20 mb-2" />
                  <p className="text-xs font-bold uppercase tracking-widest">
                    Carrito Vacío
                  </p>
                </div>
              )}
            </div>

            {/* Consideraciones */}
            <div className="p-4 bg-white border-t border-gray-100">
              <TextArea
                name={"consideraciones"}
                hasLabel={true}
                labelText="Consideraciones de la cotización"
                options={{
                  valueProp:
                    "1. Costos netos expresados en pesos mexicanos, más IVA, en caso de requerir factura.",
                }}
                onChange={handleTextAreaChange}
              />
            </div>

            {/* Footer: Impuestos y Acciones */}
            <div className="p-5 bg-gray-50 border-t border-gray-200">
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={cotizacionData.useIVA}
                    onChange={() =>
                      setCotizacionData({
                        ...cotizacionData,
                        useIVA: !cotizacionData.useIVA,
                      })
                    }
                    className="w-4 h-4 accent-[#FF7A00]"
                  />
                  <span className="text-[10px] font-bold text-gray-500 group-hover:text-black transition-colors">
                    APLICAR IVA
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={cotizacionData.useISR}
                    onChange={() =>
                      setCotizacionData({
                        ...cotizacionData,
                        useISR: !cotizacionData.useISR,
                      })
                    }
                    className="w-4 h-4 accent-[#FF7A00]"
                  />
                  <span className="text-[10px] font-bold text-gray-500 group-hover:text-black transition-colors">
                    RETENCIÓN ISR
                  </span>
                </label>
              </div>

              <div className="space-y-1 mb-4 border-t border-gray-200 pt-3">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                {cotizacionData.useIVA && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>IVA (16%)</span>
                    <span className="font-bold">${iva.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-black text-gray-900 pt-1">
                  <span>Total</span>
                  <span className="text-[#FF7A00]">
                    $
                    {total.toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <p className="text-[9px] text-green-600 font-bold text-right italic">
                  Ganancia est. ${ganancia.toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setItems([])}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-xs hover:bg-gray-100 transition-all"
                >
                  <XCircle size={16} /> LIMPIAR
                </button>
                <button
                  onClick={handleGuardarCotizacion}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FF7A00] text-white font-bold text-xs hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all"
                >
                  <Save size={16} /> GUARDAR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
