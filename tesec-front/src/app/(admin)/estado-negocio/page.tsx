'use client';

import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';
import { Download, TrendingUp, Calendar, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// ejemplo

const dataVentas = [
  { name: 'Lun', venta: 4000 },
  { name: 'Mar', venta: 3000 },
  { name: 'Mie', venta: 5000 },
  { name: 'Jue', venta: 2780 },
  { name: 'Vie', venta: 1890 },
  { name: 'Sab', venta: 6390 },
  { name: 'Dom', venta: 3490 },
];

const dataProductos = [
  { name: 'Electrónica', value: 400 },
  { name: 'Hogar', value: 300 },
  { name: 'Moda', value: 300 },
  { name: 'Otros', value: 200 },
];

const dataGastos = [
  { name: 'Sem 1', gasto: 2400 },
  { name: 'Sem 2', gasto: 1398 },
  { name: 'Sem 3', gasto: 9800 },
  { name: 'Sem 4', gasto: 3908 },
];

const topClientes = [
  { id: 1, nombre: 'Empresa ABC S.A.', compras: 12500, fecha: '29 Nov' },
  { id: 2, nombre: 'Juan Pérez', compras: 9800, fecha: '28 Nov' },
  { id: 3, nombre: 'Tech Solutions', compras: 8750, fecha: '28 Nov' },
  { id: 4, nombre: 'Consultora Global', compras: 6200, fecha: '27 Nov' },
  { id: 5, nombre: 'Maria González', compras: 5400, fecha: '26 Nov' },
];

const COLORES_DONA = ['#000000', '#FF7A00', '#A3A3A3', '#E5E5E5'];

export default function DashboardPage() {
  const [periodoVenta, setPeriodoVenta] = useState('Semana');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ENCABEZADO Y KPI PRINCIPAL  */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estado del Negocio</h1>
          <p className="text-gray-500 text-sm mt-1">Resumen general de rendimiento y operaciones.</p>
        </div>
        
        {/* KPI: Probabilidad de Valor */}
        <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-2 bg-orange-50 rounded-lg text-[#FF7A00]">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase">Probabilidad de Valor</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">85%</span>
              <span className="text-xs font-medium text-green-600 flex items-center bg-green-50 px-1.5 py-0.5 rounded">
                <ArrowUpRight size={12} className="mr-0.5" /> +2.4%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* VENTAS Y PRODUCTOS*/}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Venta por Semana  */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Ventas</h2>
              <p className="text-sm text-gray-500">Comportamiento de ingresos en el tiempo</p>
            </div>
            
            {/* Filtros de Tiempo */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {['Día', 'Semana', 'Mes', 'Año'].map((periodo) => (
                <button
                  key={periodo}
                  onClick={() => setPeriodoVenta(periodo)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    periodoVenta === periodo 
                      ? 'bg-white text-[#FF7A00] shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {periodo}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataVentas}>
                <defs>
                  <linearGradient id="colorVenta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#FF7A00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#FF7A00', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="venta" 
                  stroke="#FF7A00" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVenta)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 10 Productos  */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Top Productos</h2>
          <p className="text-sm text-gray-500 mb-6">Distribución de ventas por categoría</p>
          
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataProductos}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataProductos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORES_DONA[index % COLORES_DONA.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
               <span className="text-2xl font-bold text-gray-800">Top 10</span>
            </div>
          </div>
        </div>
      </div>

      {/* GASTOS Y CLIENTES  */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gasto por*/}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Gastos Operativos</h2>
            <button 
              className="text-gray-400 hover:text-[#FF7A00]"
              aria-label="Filtrar gastos"
              title="Filtrar gastos"
            >
              <Filter size={18} />
            </button>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataGastos}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="gasto" fill="#000000" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LISTA: Top 10 Clientes + Exportar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Top Clientes</h2>
            <button className="flex items-center gap-2 text-sm font-medium text-[#FF7A00] hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors border border-orange-100">
              <Download size={16} />
              Exportar
            </button>
          </div>

          <div className="overflow-y-auto max-h-[250px] pr-2 custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="font-medium py-2">Cliente</th>
                  <th className="font-medium py-2 text-right">Total Compra</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {topClientes.map((cliente) => (
                  <tr key={cliente.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-3 border-b border-gray-50 group-last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                          {cliente.nombre.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{cliente.nombre}</p>
                          <p className="text-xs text-gray-400">{cliente.fecha}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right font-bold text-gray-800 border-b border-gray-50 group-last:border-0">
                      ${cliente.compras.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Link ver más */}
          <div className="mt-auto pt-4 border-t border-gray-100 text-center">
            <a href="/clientes" className="text-sm text-gray-500 hover:text-[#FF7A00] transition-colors">Ver todos los clientes</a>
          </div>
        </div>
      </div>
    </div>
  );
}