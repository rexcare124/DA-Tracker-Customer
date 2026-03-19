"use client";

/**
 * Video testimonial step using react-media-recorder. Records camera + mic,
 * then uploads to Firebase Storage via /api/smrc/upload-video. The returned
 * URL is stored on the SMRC review (videoUrl) and can be displayed anywhere.
 * When defaultSmrc is set (viewing a submitted review), the step is read-only.
 */
import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useReactMediaRecorder } from "react-media-recorder";
import type { SMRCFormInputFields } from "./helper";
import type { SMRCDocument } from "@/lib/firebase/smrc-types";

const SMRC_BUTTON_PRIMARY =
  "cursor-pointer rounded-[5px] border border-[#0b83e6] bg-[#0b83e6] px-6 py-2.5 text-white hover:opacity-90 disabled:opacity-50";
const SMRC_BUTTON_SECONDARY =
  "cursor-pointer rounded-[5px] border border-[#838080] bg-transparent px-6 py-2.5 text-[#838080] hover:border-black hover:text-black disabled:opacity-50";
const SMRC_BUTTON_DANGER =
  "cursor-pointer rounded-[5px] border border-red-600 bg-red-600 px-6 py-2.5 text-white hover:opacity-90";

export interface VideoTestimonialStepProps {
  defaultSmrc?: SMRCDocument | null;
}

const VideoTestimonialStep: React.FC<VideoTestimonialStepProps> = ({ defaultSmrc }) => {
  const { setValue, watch } = useFormContext<SMRCFormInputFields>();
  const hasRecordedVideo = watch("hasRecordedVideo");
  const videoUrl = watch("videoUrl");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const isReadOnly = !!defaultSmrc;

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    previewStream,
    clearBlobUrl,
    error: recorderError,
  } = useReactMediaRecorder({
    video: { width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: true,
    blobPropertyBag: { type: "video/webm" },
  });

  // Attach preview stream to video element
  useEffect(() => {
    if (!videoRef.current || !previewStream) return;
    videoRef.current.srcObject = previewStream;
    return () => {
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [previewStream]);

  const handleStartRecording = () => {
    setUploadError(null);
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleRetake = () => {
    clearBlobUrl();
    setUploadError(null);
  };

  const handleUseThisVideo = async () => {
    if (!mediaBlobUrl) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      const response = await fetch(mediaBlobUrl);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("video", blob, "testimonial.webm");
      const res = await fetch("/api/smrc/upload-video", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }
      const videoUrl = data.videoUrl;
      if (videoUrl) {
        setValue("hasRecordedVideo", true, { shouldDirty: true });
        setValue("videoUrl", videoUrl, { shouldDirty: true });
      }
      setShowRecorder(false);
      clearBlobUrl();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    if (status === "recording") stopRecording();
    clearBlobUrl();
    setShowRecorder(false);
    setUploadError(null);
  };

  const isPermissionDenied =
    status === "permission_denied" ||
    recorderError === "permission_denied" ||
    status === "media_aborted";

  if (isReadOnly) {
    return (
      <div className="flex flex-col items-center">
        <div className="flex w-full max-w-2xl flex-1 flex-col">
          <p className="text-center text-[#38464d] text-lg leading-snug">
            Video testimonial (read-only — this review has been submitted).
          </p>
          <div className="flex flex-1 flex-col items-center justify-center py-6">
            {videoUrl || hasRecordedVideo ? (
              <div className="rounded-[5px] border border-[#38464d]/30 bg-muted/30 p-4 text-center text-[#38464d] w-full max-w-lg">
                <p className="font-medium text-lg">Video testimonial on file.</p>
                {videoUrl && (
                  <video
                    src={videoUrl}
                    controls
                    playsInline
                    className="mt-3 w-full max-h-[360px] rounded-[5px] bg-black"
                  />
                )}
              </div>
            ) : (
              <p className="text-[#757575] text-center">No video was submitted with this review.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full max-w-2xl flex-1 flex-col">
        <p className="text-center text-[#38464d] text-lg leading-snug">
          Optionally, record a video testimonial. You may skip this step.
        </p>

        {isPermissionDenied && (
          <div className="rounded-[5px] border border-amber-500 bg-amber-50 p-4 text-center text-amber-800 text-sm space-y-2 mt-4">
            <p className="font-medium">Camera and microphone are not allowed in this context.</p>
            <p>
              If you&apos;re viewing this inside an <strong>embedded preview or iframe</strong>{" "}
              (e.g. in an editor or dashboard), the browser blocks camera/microphone there. Open the
              app in a<strong> normal browser tab</strong>: go to{" "}
              <strong>http://localhost:3000/dashboard/got-smrc</strong> in Chrome or Edge, then try
              &quot;Record video testimonial&quot; again.
            </p>
            <p>
              If you&apos;re already in a normal tab, allow access via the lock icon → Site settings
              → Camera and Microphone → Allow, then reload and try again.
            </p>
          </div>
        )}

        {uploadError && (
          <div className="rounded-[5px] border border-amber-500 bg-amber-50 p-3 text-center text-amber-800 text-sm mt-4">
            {uploadError}
          </div>
        )}

        <div className="flex flex-1 flex-col items-center justify-center py-6">
          {hasRecordedVideo && !showRecorder ? (
            <div className="rounded-[5px] border border-[#0b83e6] bg-[#0b83e610] p-4 text-center text-[#38464d]">
              <p className="font-medium text-lg">You have recorded a video testimonial.</p>
              <p className="mt-1 text-sm text-[#38464d]/80">
                You can record again below to replace it, or click Next to continue.
              </p>
              <button
                type="button"
                onClick={() => setShowRecorder(true)}
                className={`mt-3 ${SMRC_BUTTON_SECONDARY}`}
              >
                Record again
              </button>
            </div>
          ) : showRecorder ? (
            <div className="flex w-full max-w-lg flex-col items-center space-y-4">
              <div className="relative flex w-full items-center rounded-[5px] overflow-hidden bg-black aspect-video">
                {status === "recording" && previewStream && (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="max-w-full max-h-full w-full h-full object-contain"
                      style={{ transform: "scaleX(-1)" }}
                    />
                    <div className="absolute top-2 left-2 rounded bg-red-600 text-white text-sm font-medium px-2 py-1 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      Recording
                    </div>
                  </>
                )}
                {mediaBlobUrl && status !== "recording" && (
                  <video
                    src={mediaBlobUrl}
                    controls
                    playsInline
                    className="max-w-full max-h-full w-full h-full object-contain"
                  />
                )}
                {!mediaBlobUrl &&
                  status !== "recording" &&
                  status !== "acquiring_media" &&
                  status !== "stopping" && (
                    <div className="absolute inset-0 flex items-center justify-center text-white/80 text-sm">
                      Click &quot;Start recording&quot; to begin
                    </div>
                  )}
                {(status === "acquiring_media" || status === "stopping") && (
                  <div className="absolute inset-0 flex items-center justify-center text-white/80 text-sm">
                    {status === "acquiring_media"
                      ? "Requesting camera and microphone…"
                      : "Stopping…"}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {!mediaBlobUrl && (
                  <>
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      disabled={status === "recording" || status === "acquiring_media"}
                      className={SMRC_BUTTON_PRIMARY}
                    >
                      Start recording
                    </button>
                    <button
                      type="button"
                      onClick={handleStopRecording}
                      disabled={status !== "recording"}
                      className={SMRC_BUTTON_DANGER}
                    >
                      Stop recording
                    </button>
                    <button type="button" onClick={handleCancel} className={SMRC_BUTTON_SECONDARY}>
                      Cancel
                    </button>
                  </>
                )}
                {mediaBlobUrl && (
                  <>
                    <button
                      type="button"
                      onClick={handleUseThisVideo}
                      disabled={isUploading}
                      className={SMRC_BUTTON_PRIMARY}
                    >
                      {isUploading ? "Uploading…" : "Use this video"}
                    </button>
                    <button
                      type="button"
                      onClick={handleRetake}
                      disabled={isUploading}
                      className={SMRC_BUTTON_SECONDARY}
                    >
                      Record again
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isUploading}
                      className={SMRC_BUTTON_SECONDARY}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowRecorder(true)}
              className="cursor-pointer rounded-[5px] border border-[#0b83e6dc] bg-[#0b83e6dc] px-8 py-3 text-center text-lg text-white hover:bg-[#0b83e6]"
            >
              Record video testimonial
            </button>
          )}
        </div>

        <p className="text-center text-sm text-[#757575]">
          Recording uses your camera and microphone on this page. After you stop recording, you can
          preview the video and upload it. The video will be saved and linked to your review.
        </p>
      </div>
    </div>
  );
};

export default VideoTestimonialStep;
