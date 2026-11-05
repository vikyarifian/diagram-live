import React, { useState } from 'react';

interface NetworkNode {
  id: string;
  name: string;
  type: 'server' | 'router' | 'database' | 'service';
  status: 'online' | 'warning' | 'offline';
  ipAddress: string;
  lokasi: string;
  x: number;
  y: number;
}

interface NodeConnection {
  from: string;
  to: string;
}

const INITIAL_NODES: NetworkNode[] = [
  { id: '1', name: 'Server Pusat HQ', type: 'server', status: 'online', ipAddress: '10.10.1.5', lokasi: 'Jakarta Center', x: 250, y: 100 },
  { id: '2', name: 'DB Absensi & Lembur', type: 'database', status: 'online', ipAddress: '10.10.1.12', lokasi: 'Jakarta Center', x: 100, y: 250 },
  { id: '3', name: 'Gateway Surat Jalan', type: 'service', status: 'warning', ipAddress: '10.10.2.20', lokasi: 'Cabang Cikarang', x: 400, y: 250 },
  { id: '4', name: 'Server PPh21 Engine', type: 'server', status: 'online', ipAddress: '10.10.1.8', lokasi: 'Jakarta Center', x: 250, y: 380 },
  { id: '5', name: 'Router Utama Branch', type: 'router', status: 'offline', ipAddress: '10.10.3.1', lokasi: 'Cabang Surabaya', x: 550, y: 380 },
];

const INITIAL_CONNECTIONS: NodeConnection[] = [
  { from: '1', to: '2' },
  { from: '1', to: '3' },
  { from: '1', to: '4' },
  { from: '3', to: '5' },
];

export default function App() {
  const [nodes, setNodes] = useState<NetworkNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('1');
  const [filter, setFilter] = useState<string>('all');
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  // Workaround for React SVG synthetic event limitation where dragging elements fast misses container mousemove updates
  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedNodeId) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = Math.max(40, Math.min(rect.width - 40, e.clientX - rect.left));
    const y = Math.max(40, Math.min(rect.height - 40, e.clientY - rect.top));

    setNodes((prevNodes) =>
      prevNodes.map((node) => (node.id === draggedNodeId ? { ...node, x, y } : node))
    );
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const filteredNodes = nodes.filter((node) => {
    if (filter === 'all') return true;
    return node.status === filter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-slate-950 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white">
            DL
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide">DiagramLive IT Topology</h1>
            <p className="text-xs text-slate-400">Internal Network & Infrastructure Monitor</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300">WITA / WIB: UTC+7</span>
          <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">System Normal</span>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase text-slate-400">Filter Status:</span>
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Semua ({nodes.length})
              </button>
              <button
                onClick={() => setFilter('online')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  filter === 'online' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Online ({nodes.filter((n) => n.status === 'online').length})
              </button>
              <button
                onClick={() => setFilter('warning')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  filter === 'warning' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Warning ({nodes.filter((n) => n.status === 'warning').length})
              </button>
              <button
                onClick={() => setFilter('offline')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  filter === 'offline' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Offline ({nodes.filter((n) => n.status === 'offline').length})
              </button>
            </div>
            <div className="text-xs text-slate-400">
              Drag nodes to reposition topology
            </div>
          </div>

          <div className="flex-1 bg-slate-950 relative overflow-hidden">
            <svg
              className="w-full h-full cursor-crosshair select-none"
              onMouseMove={handleSvgMouseMove}
              onMouseUp={handleMouseUp}
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {INITIAL_CONNECTIONS.map((conn, idx) => {
                const source = nodes.find((n) => n.id === conn.from);
                const target = nodes.find((n) => n.id === conn.to);
                if (!source || !target) return null;
                return (
                  <line
                    key={idx}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="#475569"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {filteredNodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                let statusColor = '#10b981';
                if (node.status === 'warning') statusColor = '#f59e0b';
                if (node.status === 'offline') statusColor = '#ef4444';

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer"
                    onMouseDown={() => {
                      setDraggedNodeId(node.id);
                      setSelectedNodeId(node.id);
                    }}
                  >
                    <circle
                      r="28"
                      fill="#0f172a"
                      stroke={isSelected ? '#3b82f6' : statusColor}
                      strokeWidth={isSelected ? '3' : '2'}
                    />
                    <circle r="6" fill={statusColor} />
                    <text
                      y="42"
                      textAnchor="middle"
                      fill="#cbd5e1"
                      fontSize="12"
                      fontWeight="500"
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="w-80 border-l border-slate-800 bg-slate-900 p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Node Information
            </h2>
            {selectedNode ? (
              <div className="space-y-4">
                <div className="bg-slate-800 p-3 rounded-lg">
                  <div className="text-xs text-slate-400 mb-1">Nama Perangkat</div>
                  <div className="font-medium text-slate-100">{selectedNode.name}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800 p-3 rounded-lg">
                    <div className="text-xs text-slate-400 mb-1">Status</div>
                    <span
                      className={`inline-block px-2 py-0.5 text-xs rounded font-medium ${
                        selectedNode.status === 'online'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : selectedNode.status === 'warning'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {selectedNode.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="bg-slate-800 p-3 rounded-lg">
                    <div className="text-xs text-slate-400 mb-1">Tipe</div>
                    <div className="text-xs text-slate-200 capitalize">{selectedNode.type}</div>
                  </div>
                </div>

                <div className="bg-slate-800 p-3 rounded-lg">
                  <div className="text-xs text-slate-400 mb-1">IP Address</div>
                  <div className="font-mono text-sm text-slate-200">{selectedNode.ipAddress}</div>
                </div>

                <div className="bg-slate-800 p-3 rounded-lg">
                  <div className="text-xs text-slate-400 mb-1">Lokasi Server</div>
                  <div className="text-xs text-slate-200">{selectedNode.lokasi}</div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Pilih node untuk melihat detail.</p>
            )}
          </div>

          <div className="border-t border-slate-800 pt-4 text-xs text-slate-500">
            <div>Internal Infrastructure Tool</div>
            <div>Departemen IT Enterprise © 2026</div>
          </div>
        </div>
      </main>
    </div>
  );
}
