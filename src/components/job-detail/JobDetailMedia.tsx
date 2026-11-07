"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { extractFirstFrameFromVideo } from "@/lib/video-thumbnail";

const DEFAULT_IMAGES = [
  "/images/jobs/all_img_1.jpg",
  "/images/jobs/all_img_2.jpg",
  "/images/jobs/all_img_3.jpg",
  "/images/jobs/all_img_4.jpg",
];

const DEFAULT_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";

interface JobDetailImagesProps {
  images?: string[];
}

export function JobDetailImages({ images }: JobDetailImagesProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const validImages = (images || []).filter((src) => Boolean(src && src.trim() !== ""));
  const displayImages = validImages.length > 0 ? validImages : (images === undefined ? DEFAULT_IMAGES : []);

  // Xử lý phím tắt (Escape, ArrowLeft, ArrowRight) và khóa cuộn trang khi mở modal
  useEffect(() => {
    if (selectedPhotoIndex === null) return;

    // Khóa cuộn trang khi đang xem ảnh full
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPhotoIndex(null);
      } else if (e.key === "ArrowRight") {
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev + 1) % displayImages.length : null
        );
      } else if (e.key === "ArrowLeft") {
        setSelectedPhotoIndex((prev) =>
          prev !== null
            ? (prev - 1 + displayImages.length) % displayImages.length
            : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedPhotoIndex, displayImages.length]);

  if (displayImages.length === 0) return null;

  return (
    <>
      {/* 2 CỘT ẢNH THỰC TẾ: TỈ LỆ DỌC 3:4, KHUNG THUMBNAIL NHỎ GỌN (~50% SO VỚI TRƯỚC) */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
        {displayImages.map((src, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedPhotoIndex(idx)}
            className="group cursor-pointer relative w-full aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 bg-gray-100 border border-gray-100"
            title="Nhấn để xem ảnh gốc phóng to"
          >
            {/* Ảnh thumbnail tối ưu hóa dung lượng nhẹ, sắc nét không bị vỡ */}
            <Image
              src={src}
              alt={`Hình ảnh việc làm thực tế ${idx + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
              quality={85}
              loading="lazy"
              unoptimized={src.startsWith("data:")}
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {/* Hiệu ứng overlay khi hover để người dùng biết có thể click mở full */}
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-white/95 text-gray-900 flex items-center justify-center shadow-lg transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL XEM ẢNH FULL (HIỂN THỊ ẢNH GỐC ĐỘ PHÂN GIẢI CAO NHẤT) */}
      {selectedPhotoIndex !== null && displayImages[selectedPhotoIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200 select-none"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] bg-black/90 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút đóng modal */}
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/95 hover:scale-105 active:scale-95 transition border border-white/20 shadow-lg cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Nút lùi về ảnh trước */}
            {displayImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex((prev) =>
                    prev !== null ? (prev - 1 + displayImages.length) % displayImages.length : null
                  );
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/95 hover:scale-105 active:scale-95 transition border border-white/20 shadow-lg cursor-pointer"
                aria-label="Ảnh trước"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Nút chuyển ảnh tiếp theo */}
            {displayImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex((prev) =>
                    prev !== null ? (prev + 1) % displayImages.length : null
                  );
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/95 hover:scale-105 active:scale-95 transition border border-white/20 shadow-lg cursor-pointer"
                aria-label="Ảnh tiếp"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Khung hiển thị ảnh gốc: unoptimized=true đảm bảo load đúng file gốc chất lượng cao */}
            <div className="relative w-full h-[75vh] sm:h-[85vh] flex items-center justify-center p-2">
              <Image
                src={displayImages[selectedPhotoIndex]}
                alt={`Hình ảnh việc làm thực tế ${selectedPhotoIndex + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 1200px"
                quality={95}
                priority
                unoptimized={true}
                className="object-contain"
              />
            </div>

            {/* Bộ đếm vị trí ảnh */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold tracking-wide border border-white/10 shadow">
                {selectedPhotoIndex + 1} / {displayImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

interface JobDetailVideoProps {
  videoUrl?: string;
  videoPoster?: string;
  fallbackPoster?: string;
}

export function JobDetailVideo({
  videoUrl,
  videoPoster,
}: JobDetailVideoProps) {
  const hasVideo = Boolean(videoUrl && videoUrl.trim() !== "");
  if (!hasVideo) return null;

  const currentVideo = videoUrl || DEFAULT_VIDEO;
  const videoSrcWithFragment = currentVideo.includes("#t=")
    ? currentVideo
    : `${currentVideo}#t=0.001`;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [extractedPoster, setExtractedPoster] = useState<string | null>(null);

  // Tự động trích xuất ảnh đầu tiên từ video làm ảnh thumbnail
  useEffect(() => {
    let isCancelled = false;
    if (!currentVideo) return;

    extractFirstFrameFromVideo(currentVideo)
      .then((dataUrl) => {
        if (!isCancelled && dataUrl) {
          setExtractedPoster(dataUrl);
        }
      })
      .catch(() => {
        // Nếu canvas bị giới hạn CORS, trình duyệt vẫn tự hiển thị khung hình đầu tiên qua #t=0.001
      });

    return () => {
      isCancelled = true;
    };
  }, [currentVideo]);

  // Trích xuất khung hình trực tiếp qua sự kiện tải dữ liệu thẻ video
  const handleLoadedData = () => {
    if (extractedPoster) return;
    const video = videoRef.current;
    if (!video) return;
    try {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
          if (dataUrl && dataUrl.length > 200) {
            setExtractedPoster(dataUrl);
          }
        }
      }
    } catch {
      // Bỏ qua nếu có lỗi CORS
    }
  };

  // Chỉ dùng videoPoster nếu là thumbnail tùy chỉnh thực sự (không dùng ảnh placeholder món ăn/tiệm)
  const isDefaultJobPhoto =
    videoPoster &&
    (videoPoster.includes("/images/jobs/") || videoPoster.includes("all_img_"));
  const validProvidedPoster = videoPoster && !isDefaultJobPhoto ? videoPoster : undefined;

  const activePoster = extractedPoster || validProvidedPoster || undefined;

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4] shadow-sm group border border-gray-100">
      <video
        ref={videoRef}
        controls
        playsInline
        preload="metadata"
        poster={activePoster}
        onLoadedData={handleLoadedData}
        onSeeked={handleLoadedData}
        className="w-full h-full object-cover"
        key={currentVideo}
      >
        <source src={videoSrcWithFragment} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ thẻ video.
      </video>
    </div>
  );
}

interface JobDetailMediaProps {
  images?: string[];
  videoUrl?: string;
  videoPoster?: string;
}

export default function JobDetailMedia({
  images,
  videoUrl,
  videoPoster,
}: JobDetailMediaProps) {
  const hasVideo = Boolean(videoUrl && videoUrl.trim() !== "");
  const validImages = (images || []).filter((src) => Boolean(src && src.trim() !== ""));
  const hasImages = validImages.length > 0;

  if (!hasVideo && !hasImages) return null;

  return (
    <div className="space-y-4">
      {hasVideo && (
        <JobDetailVideo
          videoUrl={videoUrl}
          videoPoster={videoPoster}
        />
      )}
      {hasImages && <JobDetailImages images={validImages} />}
    </div>
  );
}
