import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { stores, Store } from "../data/stores";
import { MapPin, Phone, Clock, Navigation, Search, Filter } from "lucide-react";
import L from 'leaflet';

// Fix for leaflet markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

export default function MapScreen() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(stores[0]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([12.9716, 77.5946]);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h2 className="font-display font-bold text-lg text-slate-800">Store Locator</h2>
          <p className="text-xs text-slate-500">Jan-Aushadhi Kendras within 10km</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-full bg-slate-50 text-slate-400">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="relative h-64 w-full flex-shrink-0 z-10">
        <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {stores.map(store => (
            <Marker 
              key={store.id} 
              position={[store.lat, store.lng]}
              eventHandlers={{
                click: () => {
                  setSelectedStore(store);
                  setMapCenter([store.lat, store.lng]);
                }
              }}
            >
              <Popup>
                <div className="p-1">
                  <p className="font-bold text-slate-800">{store.name}</p>
                </div>
              </Popup>
            </Marker>
          ))}
          <ChangeView center={mapCenter} />
        </MapContainer>
        
        {/* Overlay Search */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4/5 z-[1000] shadow-xl">
           <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-slate-100 outline-none">
              <Search size={16} className="text-slate-400" />
              <input type="text" placeholder="Search area..." className="text-sm bg-transparent outline-none w-full" />
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {stores.map(store => (
          <StoreCard 
            key={store.id} 
            store={store} 
            isSelected={selectedStore?.id === store.id}
            onClick={() => {
              setSelectedStore(store);
              setMapCenter([store.lat, store.lng]);
            }}
          />
        ))}
        
        <div className="p-6 text-center">
          <p className="text-slate-400 text-xs italic">
            Note: Store availability is simulated based on government data.
          </p>
        </div>
      </div>
    </div>
  );
}

function StoreCard({ store, isSelected, onClick }: { key?: string | number, store: Store, isSelected: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
        isSelected 
          ? "border-teal-500 bg-teal-50/50 shadow-md ring-2 ring-teal-500/20" 
          : "border-slate-100 bg-white hover:border-teal-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-800 leading-tight">{store.name}</h4>
            {store.openNow ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                Open
              </span>
            ) : (
              <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                Closed
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 flex items-start gap-1">
            <MapPin size={12} className="mt-0.5 flex-shrink-0" />
            {store.address}
          </p>
        </div>
        <div className="p-2 rounded-full bg-teal-500 text-white shadow-lg shadow-teal-200 flex-shrink-0">
          <Navigation size={18} />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
           <a href={`tel:${store.phone}`} className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-teal-600">
             <Phone size={14} className="text-teal-500" />
             Call
           </a>
           <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
             <Clock size={14} className="text-teal-500" />
             9 AM - 8 PM
           </div>
        </div>
        <span className="text-[10px] font-bold text-slate-400 italic">2.4 km away</span>
      </div>
    </div>
  );
}
