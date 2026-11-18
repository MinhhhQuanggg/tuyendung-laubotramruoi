"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Branch } from "@/types/branch";
import {
  ExternalLink,
  Plus,
  Minus,
  LocateFixed,
} from "lucide-react";

interface BranchMapClientProps {
  branches?: Branch[];
}

export default function BranchMapClient({ branches: propBranches }: BranchMapClientProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const [branches, setBranches] = useState<Branch[]>(propBranches || []);

  useEffect(() => {
    if (propBranches && propBranches.length > 0) {
      setBranches(propBranches);
    } else {
      fetch(`/api/branches?t=${Date.now()}`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.branches) {
            setBranches(data.branches);
          }
        })
        .catch(() => {});
    }
  }, [propBranches]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Initialize Leaflet map with Google Maps default view on TP.HCM
    const map = L.map(mapContainerRef.current, {
      center: [10.815, 106.685],
      zoom: 12,
      zoomControl: false, // Custom Google Maps zoom buttons
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // Google Maps Roadmap tile layer (in Vietnamese)
    const googleRoadmap = L.tileLayer(
      "https://mt{s}.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}",
      {
        subdomains: ["0", "1", "2", "3"],
        attribution: '&copy; Google Maps',
        maxZoom: 20,
      }
    ).addTo(map);

    tileLayerRef.current = googleRoadmap;
  }, []);

  // Update markers whenever branches data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    const markersGroup: L.Marker[] = [];

    // Add authentic Google Maps red teardrop markers for all branches
    branches.forEach((b) => {
      if (!b.lat || !b.lng) return;

      const labelText = String(b.cnNumber);

      // Authentic Google Maps Red Pin SVG
      const googlePinHtml = `
        <div class="google-pin-container group relative cursor-pointer" style="width: 32px; height: 42px; transform: translate(-16px, -42px);">
          <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 3px 5px rgba(0,0,0,0.35)); transition: transform 0.2s ease;">
            <!-- Red Teardrop Body -->
            <path d="M16 0C7.16344 0 0 7.16344 0 16C0 26.5 16 42 16 42C16 42 32 26.5 32 16C32 7.16344 24.8366 0 16 0Z" fill="#EA4335"/>
            <!-- Inner Red Border Ring -->
            <circle cx="16" cy="15" r="10.5" fill="#C5221F"/>
            <!-- White Center Circle -->
            <circle cx="16" cy="15" r="9" fill="#FFFFFF"/>
          </svg>
          
          <!-- Badge Text inside the white circle: CN number -->
          <div style="position: absolute; top: 7px; left: 0; width: 32px; text-align: center; font-size: 10px; font-weight: 900; color: #B31412; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; pointer-events: none;">
            ${labelText}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "google-maps-custom-marker",
        html: googlePinHtml,
        iconSize: [32, 42],
        iconAnchor: [16, 42],
        popupAnchor: [0, -42],
      });

      // Google Maps InfoWindow Card
      const popupHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; min-width: 250px; max-width: 300px; padding: 4px; color: #202124;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 3px;">
            <span style="background: #EA4335; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 6px; border-radius: 4px;">
              CN ${b.cnNumber}
            </span>
            <div style="font-size: 14px; font-weight: 800; color: #1a73e8; line-height: 1.3;">
              Lẩu Bò Trăm Rưỡi - ${b.name}
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: #e37400; margin-bottom: 6px; font-weight: 600;">
            <span>★ 4.9</span>
            <span style="color: #70757a; font-weight: 400;">(1.200+ đánh giá) • Quán lẩu</span>
          </div>
          <div style="font-size: 12px; color: #3c4043; margin-bottom: 10px; line-height: 1.4;">
            📍 <b>${b.district}:</b> ${b.address}
          </div>
          <div style="display: flex; gap: 8px; align-items: center; border-top: 1px solid #dadce0; padding-top: 8px;">
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                "Lẩu Bò Trăm Rưỡi " + b.address
              )}" 
              target="_blank" 
              rel="noopener noreferrer" 
              style="display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; background: #1a73e8; color: #ffffff; border-radius: 18px; font-size: 12px; font-weight: 700; text-decoration: none; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"
            >
              <span>Chỉ đường</span>
            </a>
            ${
              b.phone
                ? `<a 
                    href="tel:${b.phone}" 
                    style="display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; background: #e8f0fe; color: #1a73e8; border-radius: 18px; font-size: 12px; font-weight: 700; text-decoration: none; border: 1px solid #d2e3fc;"
                  >
                    <span>Gọi ${b.phone}</span>
                  </a>`
                : ""
            }
          </div>
        </div>
      `;

      const marker = L.marker([b.lat, b.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(popupHtml, {
          closeButton: true,
          className: "google-maps-infowindow",
        });

      markersRef.current[b.id] = marker;
      markersGroup.push(marker);
    });

    // Tự động căn góc nhìn tập trung vào vị trí địa lý TP.HCM
    const hcmBranches = branches.filter((b) => b.city === "Hồ Chí Minh" || (b.lat && b.lat < 10.9));
    const hcmMarkers = hcmBranches
      .map((b) => markersRef.current[b.id])
      .filter(Boolean);

    if (hcmMarkers.length > 0) {
      const hcmGroup = L.featureGroup(hcmMarkers);
      map.fitBounds(hcmGroup.getBounds(), {
        padding: [32, 32],
        maxZoom: 13,
      });
    } else if (markersGroup.length > 0) {
      const featureGroup = L.featureGroup(markersGroup);
      map.fitBounds(featureGroup.getBounds(), {
        padding: [30, 30],
        maxZoom: 13,
      });
    }
  }, [branches]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    const hcmMarkers = branches
      .filter((b) => b.city === "Hồ Chí Minh" || (b.lat && b.lat < 10.9))
      .map((b) => markersRef.current[b.id])
      .filter(Boolean);

    if (mapInstanceRef.current && hcmMarkers.length > 0) {
      const hcmGroup = L.featureGroup(hcmMarkers);
      mapInstanceRef.current.fitBounds(hcmGroup.getBounds(), {
        padding: [32, 32],
        maxZoom: 13,
      });
    } else {
      mapInstanceRef.current?.setView([10.810, 106.690], 12);
    }
  };

  return (
    <div className="relative w-full h-[360px] sm:h-[440px] md:h-[500px] rounded-2xl overflow-hidden border border-brand-800/80 shadow-2xl bg-neutral-900">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Google Maps Style Custom Controls (Top Right) */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 p-1">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Phóng to bản đồ"
          className="w-7 h-7 flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-100 rounded transition"
        >
          <Plus className="w-4 h-4" />
        </button>
        <div className="w-full h-[1px] bg-gray-200" />
        <button
          type="button"
          onClick={handleZoomOut}
          title="Thu nhỏ bản đồ"
          className="w-7 h-7 flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-100 rounded transition"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="w-full h-[1px] bg-gray-200" />
        <button
          type="button"
          onClick={handleResetView}
          title="Tập trung về khu vực TP.HCM"
          className="w-7 h-7 flex items-center justify-center text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded transition"
        >
          <LocateFixed className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Bottom Left Card: Open full Google Maps */}
      <div className="absolute bottom-3 left-3 z-[1000] pointer-events-auto">
        <a
          href="https://www.google.com/maps/search/L%E1%BA%A3u+B%C3%B2+Tr%C4%83m+R%C6%B0%E1%BB%A1i"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/95 hover:bg-white text-gray-800 text-xs font-bold shadow-lg border border-gray-200 transition-all hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span>Mở Google Maps tìm quán</span>
          <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
        </a>
      </div>
    </div>
  );
}
