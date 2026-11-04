"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
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
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const validImages = (images || []).filter((src) => Boolean(src && src.trim() !== ""));
  if (validImages.length === 0) return null;

  const displayImages = validImages;

  return (
    <>
      {/* CÁC KHUNG ẢNH THỰC TẾ: TỈ LỆ DỌC 3:4 */}
      <div className={`grid gap-3 sm:gap-4 ${
        displayImages.length === 1 ? "grid-cols-1" : "grid-cols-2"
      }`}>
        {displayImages.map((src, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedPhoto(src)}
            className="group cursor-pointer relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-gray-100 border border-gray-100"
          >
            <Image
              src={src}
              alt={`Hình ảnh việc làm thực tế ${idx + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 400px"
              unoptimized={src.startsWith("http") || src.startsWith("data:")}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      {/* MODAL XEM ẢNH LỚN */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-xl w-full max-h-[90vh] bg-black rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-full aspect-[3/4] max-h-[85vh]">
              <Image
                src={selectedPhoto}
                alt="Hình ảnh phóng to"
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                unoptimized={
                  selectedPhoto.startsWith("http") ||
                  selectedPhoto.startsWith("data:")
                }
                className="object-contain"
              />
            </div>
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
