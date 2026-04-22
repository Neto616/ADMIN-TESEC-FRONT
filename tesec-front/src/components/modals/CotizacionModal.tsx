"use client";

import { useEffect, useState } from "react";
import { X, Download, Loader2 } from "lucide-react";
import { cotizacionService } from "@/services/cotizacionService";
import Image from "next/image";

interface CotizacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: number | null;
  autoDownload?: boolean;
}

interface Partida {
  id: number;
  cantidad: number;
  total: string;
  productos: {
    nombre: string;
    sku: string;
    clave_sat: string | null;
    descripcion: string;
    marca: string;
    precio: string;
    precio_publico: string;
  };
}

interface CotizacionResponse {
  response: {
    id: number;
    uuid: string;
    titulo: string;
    consideraciones: string;
    useIVA: boolean;
    useISR: boolean;
    estatus: number;
    created_at: string;
    partidas: Partida[];
    clientes?: {
      user: { nombre: string; apellidos: string; telefono: string } | null;
    } | null;
  };
}

const CotizacionModal = ({
  isOpen,
  onClose,
  id,
  autoDownload = false,
}: CotizacionModalProps) => {
  const [data, setData] = useState<CotizacionResponse>();
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchDetalle = async () => {
      if (!isOpen || !id) return;
      setLoading(true);
      try {
        const response = await cotizacionService.obtenerId(id);
        setData(response.response);
      } catch (error) {
        console.error("Error detalle:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalle();
  }, [isOpen, id]);

  const handleDownloadPDF = async () => {
    const element = document.getElementById("print-area");
    if (!element) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const jsPDF = (await import("jspdf")).default;
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "letter",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const img = new window.Image();
      img.src = dataUrl;
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
      });
      const pdfHeight = (img.height * pdfWidth) / img.width;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      const cliente =
        `${data?.clientes?.user?.nombre ?? ""} ${data?.clientes?.user?.apellidos ?? ""}`
          .trim()
          .replace(/\s+/g, "_") || "cliente";
      const ahora = new Date();
      const dia = ahora
        .toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-");
      const hora = ahora
        .toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replace(/:/g, "h");
      pdf.save(`cotizacion-${cliente}-${dia}-${hora}.pdf`);
    } finally {
      setDownloading(false);
    }
  };
  // Auto-descarga cuando los datos están listos
  useEffect(() => {
    if (autoDownload && !loading && data) {
      handleDownloadPDF().then(() => onClose());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDownload, loading, data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto print:static print:bg-white print:p-0">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden my-auto print:my-0 print:shadow-none print:w-full">
        <div className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase">
              Vista Previa Excel
            </span>
          </div>
          <div className="flex gap-3">
            {!loading && (
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="flex items-center gap-2 bg-[#FF7A00] hover:bg-orange-600 disabled:opacity-60 px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
              >
                {downloading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Download size={16} />
                )}
                {downloading ? "Generando..." : "Descargar PDF"}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* ÁREA DE IMPRESIÓN */}
        <div id="print-area" className="p-8 bg-white print:p-0 font-sans">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-orange-600" size={32} />
              <p className="text-sm text-gray-500 italic">
                Generando formato...
              </p>
            </div>
          ) : data ? (
            <div className="border-[1.5px] border-orange-600 p-0.5 flex flex-col min-h-[1000px]">
              {/* Encabezado */}
              <div className="border border-orange-600 flex mb-0.5">
                <div className="w-1/3 border-r border-orange-600 p-4 flex flex-col justify-center items-center">
                  {/*<h1 className="text-4xl font-black text-black leading-none italic">
                    TESEC
                  </h1>
                  <p className="text-[9px] tracking-[0.3em] font-bold text-gray-600">
                    SEGURIDAD Y CONFORT
                  </p>*/}
                  <Image
                    src="/logoT.jpg"
                    width={150}
                    height={500}
                    className="obect-contain"
                    alt="Logo"
                  />
                </div>
                <div className="w-2/3">
                  <div className="bg-[#FCE4D6] border-b border-orange-600 py-1.5 text-center font-bold text-[#843C0C] text-sm italic">
                    {data?.titulo
                      ? data?.titulo.toUpperCase()
                      : "COTIZACIÓN DE SERVICIOS"}
                  </div>
                  <div className="grid grid-cols-4 text-[11px]">
                    <div className="bg-[#FCE4D6] border-r border-b border-orange-600 px-2 py-1 font-bold italic">
                      FECHA
                    </div>
                    <div className="border-r border-b border-orange-600 px-2 py-1 font-semibold">
                      {(() => {
                        const d = new Date(data?.created_at);
                        const dia = d.getDate().toString().padStart(2, "0");
                        const mes = d.toLocaleDateString("es-MX", {
                          month: "long",
                        });
                        const anio = d.getFullYear();
                        return `${dia}/${mes}/${anio}`;
                      })()}
                    </div>
                    <div className="bg-[#FCE4D6] border-r border-b border-orange-600 px-2 py-1 font-bold italic">
                      FOLIO
                    </div>
                    <div className="border-b border-orange-600 px-2 py-1 font-black text-red-600 uppercase">
                      {data?.uuid?.split("-")[0]}
                    </div>
                    <div className="bg-[#FCE4D6] border-r border-orange-600 px-2 py-1 font-bold italic">
                      PROYECTO
                    </div>
                    <div className="col-span-3 px-2 py-1 uppercase font-semibold break-words whitespace-normal">
                      {data?.titulo || "---"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Datos Cliente */}
              <div className="grid grid-cols-6 text-[11px] border-l border-r border-b border-orange-600 bg-white">
                <div className="bg-[#FCE4D6] border-r border-orange-600 px-2 py-1.5 font-bold italic text-[#843C0C]">
                  CLIENTE:
                </div>
                <div className="col-span-3 border-r border-orange-600 px-2 py-1.5 uppercase font-bold text-black">
                  {`${data?.clientes?.user?.nombre ?? ""} ${data?.clientes?.user?.apellidos ?? ""}`}
                </div>
                <div className="bg-[#FCE4D6] border-r border-orange-600 px-2 py-1.5 font-bold italic text-[#843C0C]">
                  TEL:
                </div>
                <div className="px-2 py-1.5 font-semibold text-black">
                  {data?.clientes?.user?.telefono || "---"}
                </div>
              </div>

              {/* Tabla de Partidas + Totales */}
              <div className="flex-1 flex flex-col">
                <table className="w-full border-collapse text-[10px]">
                  <thead>
                    <tr className="bg-[#FCE4D6] text-[#843C0C] font-bold italic text-center">
                      <th className="border border-orange-600 px-2 py-1 w-8">
                        N°
                      </th>
                      <th className="border border-orange-600 px-2 py-1 w-20">
                        CLAVE SAT
                      </th>
                      <th className="border border-orange-600 px-2 py-1">
                        DESCRIPCIÓN DE EQUIPO Y SERVICIOS
                      </th>
                      <th className="border border-orange-600 px-2 py-1 w-16">
                        CANT.
                      </th>
                      <th className="border border-orange-600 px-2 py-1 w-24">
                        P. UNITARIO
                      </th>
                      <th className="border border-orange-600 px-2 py-1 w-24">
                        IMPORTE
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-semibold text-black">
                    {data?.partidas?.map((item: Partida, index: number) => (
                      <tr key={index}>
                        <td className="border border-orange-600 px-2 py-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border border-orange-600 px-2 py-2 text-center text-gray-500">
                          {item.productos.clave_sat || "---"}
                        </td>
                        <td className="border border-orange-600 px-2 py-2 uppercase leading-tight">
                          {item.productos.descripcion || item.productos.nombre}
                        </td>
                        <td className="border border-orange-600 px-2 py-2 text-center">
                          {item.cantidad}
                        </td>
                        <td className="border border-orange-600 px-2 py-2 text-right">
                          ${" "}
                          {Number(item.productos.precio_publico).toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                            },
                          )}
                        </td>
                        <td className="border border-orange-600 px-2 py-2 text-right">
                          ${" "}
                          {Number(item.total).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                    {/* Filas de relleno estético */}
                    {[
                      ...Array(Math.max(0, 6 - (data?.partidas?.length || 0))),
                    ].map((_, i) => (
                      <tr key={`empty-${i}`} className="h-7">
                        <td className="border border-orange-600"></td>
                        <td className="border border-orange-600"></td>
                        <td className="border border-orange-600"></td>
                        <td className="border border-orange-600"></td>
                        <td className="border border-orange-600"></td>
                        <td className="border border-orange-600"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Sección de Totales */}
                <div className="flex justify-end">
                  <div className="w-1/3 text-[10px]">
                    {(() => {
                      const subtotal = (
                        (data?.partidas as Partida[]) ?? []
                      ).reduce((acc, item) => acc + Number(item.total), 0);
                      const iva = data?.useIVA ? subtotal * 0.16 : 0;
                      const isr = data?.useISR ? subtotal * 0.0125 : 0;
                      const total = subtotal + iva + isr;
                      return (
                        <>
                          <div className="flex border-l border-r border-b border-orange-600 font-bold italic">
                            <div className="w-1/2 bg-[#FCE4D6] text-[#843C0C] px-2 py-1 border-r border-orange-600 uppercase">
                              Subtotal
                            </div>
                            <div className="w-1/2 px-2 py-1 text-right text-black">
                              ${" "}
                              {subtotal.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </div>
                          </div>
                          <div className="flex border-l border-r border-b border-orange-600 font-bold italic">
                            <div className="w-1/2 bg-[#FCE4D6] text-[#843C0C] px-2 py-1 border-r border-orange-600 uppercase">
                              Iva (16%)
                            </div>
                            <div className="w-1/2 px-2 py-1 text-right text-black">
                              ${" "}
                              {iva.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </div>
                          </div>
                          <div className="flex border-l border-r border-b border-orange-600 font-bold italic">
                            <div className="w-1/2 bg-[#FCE4D6] text-[#843C0C] px-2 py-1 border-r border-orange-600 uppercase">
                              RET ISR (1.25%)
                            </div>
                            <div className="w-1/2 px-2 py-1 text-right text-black">
                              ${" "}
                              {isr.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </div>
                          </div>
                          <div className="flex border-l border-r border-b border-orange-600 font-bold bg-[#FCE4D6] text-[#843C0C]">
                            <div className="w-1/2 px-2 py-1 border-r border-orange-600 italic uppercase">
                              Total
                            </div>
                            <div className="w-1/2 px-2 py-1 text-right text-black text-sm">
                              ${" "}
                              {total.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
              {/* fin flex-1 tabla+totales */}

              {/* Notas Legales */}
              <div className="p-4 text-[9px] text-gray-700 space-y-1 bg-white">
                <p className="font-bold text-[#843C0C] italic underline">
                  CONSIDERACIONES GENERALES:
                </p>
                {data?.consideraciones &&
                  data?.consideraciones
                    .split("\n")
                    .map((e, i) => <p key={i}>{e}</p>)}
              </div>

              {/* Footer Logo */}
              <div className="flex justify-between items-end p-4 pt-10">
                <div className="border-t border-black w-48 text-center">
                  <p className="text-[9px] font-bold uppercase py-1 text-gray-500">
                    Aceptación de Cotización
                  </p>
                </div>
                <div className="flex flex-col items-end opacity-40 italic">
                  <Image
                    src="/logoT.jpg"
                    width={150}
                    height={500}
                    className="obect-contain"
                    alt="Logo"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-red-500 font-bold">
              Error: No se pudo cargar el detalle.
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          html,
          body {
            height: auto !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden !important;
          }
          #print-area,
          #print-area * {
            visibility: visible !important;
          }
          #print-area {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0.5cm !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          @page {
            size: letter;
            margin: 0;
          }
          tr {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default CotizacionModal;
