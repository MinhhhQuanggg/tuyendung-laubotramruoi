"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { extractFirstFrameFromVideo } from "@/lib/video-thumbnail";

const DEFAULT_IMAGES = [
  "/images/jobs/hoc-viec-bep-1.webp",
  "/images/jobs/hoc-viec-bep-2.webp",
  "/images/jobs/hoc-viec-bep-3.webp",
  "/images/jobs/hoc-viec-bep-4.webp",
];

const DEFAULT_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";

interface JobDetailImagesProps {
  images?: string[];
}

export function JobDetailImages({ images }: JobDetailImagesProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

            {/* Logo web gắn ở góc trên bên trái của ảnh đầu tiên (ẩn trên mobile/ipad, chỉ hiện từ lg desktop trở lên) */}
            {idx === 0 && (
              <div
                className="hidden lg:block absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 pointer-events-none select-none transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 opacity-80 drop-shadow-[0_3px_10px_rgba(0,0,0,0.75)]"
                title="Lẩu Bò Trăm Rưỡi"
              >
                <div className="relative w-9 h-9 sm:w-11 sm:h-11">
                  <Image
                    src="/logo.webp"
                    alt="Logo Lẩu Bò Trăm Rưỡi"
                    fill
                    sizes="44px"
                    priority
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {/* Hiệu ứng overlay khi hover để người dùng biết có thể click mở full */}
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-white/95 text-gray-900 flex items-center justify-center shadow-lg transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL XEM ẢNH FULL BẰNG REACT PORTAL - HOÀN TOÀN TÁCH RỜI KHỎI STACKING CONTEXT CỦA CỘT STICKY & HEADER */}
      {selectedPhotoIndex !== null && displayImages[selectedPhotoIndex] && mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/92 backdrop-blur-md p-2 sm:p-4 select-none animate-in fade-in duration-200"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            {/* Nút đóng modal góc trên bên phải màn hình - hoàn toàn không bị khuất bởi menu */}
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="fixed top-3 right-3 sm:top-5 sm:right-5 z-[100000] w-11 h-11 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center border border-white/30 shadow-2xl transition hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Logo web gắn ở góc trên bên trái khi xem ảnh đầu tiên trong modal (ẩn trên mobile/ipad) */}
            {selectedPhotoIndex === 0 && (
              <div className="hidden lg:block fixed top-3 left-3 sm:top-5 sm:left-5 z-[100000] pointer-events-none select-none opacity-80 drop-shadow-[0_4px_14px_rgba(0,0,0,0.85)]">
                <div className="relative w-11 h-11 sm:w-14 sm:h-14">
                  <Image
                    src="/logo.webp"
                    alt="Logo Lẩu Bò Trăm Rưỡi"
                    fill
                    sizes="56px"
                    priority
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {/* Nút lùi về ảnh trước */}
            {displayImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex((prev) =>
                    prev !== null ? (prev - 1 + displayImages.length) % displayImages.length : null
                  );
                }}
                className="fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 z-[100000] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center border border-white/25 shadow-2xl transition hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="Ảnh trước"
              >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
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
                className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-[100000] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center border border-white/25 shadow-2xl transition hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="Ảnh tiếp"
              >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            )}

            {/* Khung hiển thị ảnh gốc: Vừa vặn hoàn hảo trong màn hình, không bị thừa hoặc khuất */}
            <div
              className="relative w-full max-w-5xl h-[80vh] sm:h-[86vh] max-h-[88vh] flex items-center justify-center p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={displayImages[selectedPhotoIndex]}
                alt={`Hình ảnh việc làm thực tế ${selectedPhotoIndex + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 1400px"
                quality={95}
                priority
                unoptimized={true}
                className="object-contain drop-shadow-2xl"
              />
            </div>

            {/* Bộ đếm vị trí ảnh */}
            {displayImages.length > 1 && (
              <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-[100000] px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-xs sm:text-sm font-semibold tracking-wide border border-white/20 shadow-xl">
                {selectedPhotoIndex + 1} / {displayImages.length}
              </div>
            )}
          </div>,
          document.body
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
