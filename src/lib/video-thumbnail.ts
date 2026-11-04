/**
 * Tiện ích trích xuất khung hình đầu tiên của video làm ảnh thumbnail
 */

/**
 * Trích xuất ảnh đầu tiên từ đường dẫn video (videoUrl) dưới dạng Base64 Data URL (JPEG).
 */
export function extractFirstFrameFromVideo(videoUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !videoUrl) {
      return reject(new Error("Video extraction only supported in browser environment"));
    }

    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const cleanSrc = videoUrl.includes("#t=")
      ? videoUrl
      : `${videoUrl}#t=0.001`;

    video.src = cleanSrc;

    let timeoutId: ReturnType<typeof setTimeout>;

    const cleanup = () => {
      clearTimeout(timeoutId);
      video.removeEventListener("seeked", capture);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("error", onError);
      video.removeAttribute("src");
      video.load();
    };

    const capture = () => {
      try {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
            cleanup();
            if (dataUrl && dataUrl.length > 200) {
              resolve(dataUrl);
            } else {
              reject(new Error("Captured empty frame"));
            }
            return;
          }
        }
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    const onLoadedData = () => {
      try {
        video.currentTime = 0.001;
      } catch {
        capture();
      }
    };

    const onError = (e: any) => {
      cleanup();
      reject(e);
    };

    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("seeked", capture);
    video.addEventListener("error", onError);

    timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error("Timeout extracting video frame"));
    }, 4000);
  });
}

/**
 * Trích xuất khung hình đầu tiên trực tiếp từ file video được tải lên từ máy tính.
 */
export async function extractFirstFrameFromFile(file: File): Promise<string> {
  if (typeof window === "undefined" || !file) {
    throw new Error("Only available in browser with a valid file");
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    return await extractFirstFrameFromVideo(objectUrl);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
