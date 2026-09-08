import React, { useEffect, useState } from "react";
import { Star, MessageSquare, Send, User, Image } from "lucide-react";
import { getAllReviews, createReview } from "../api/reviewsApi";

export default function TripReviews({ tripId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [mediaFile, setMediaFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // 1. جلب التقييمات
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await getAllReviews();
      if (data) {
        const list = Array.isArray(data) ? data : data.data || [];
        setReviews(list);
      } else {
        console.error("Error fetching reviews:", error);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // دالة الفحص الصارمة: تضمن أن الـ ID مكون من 24 حرفاً هكسا ديسيمال فقط
  const isValidObjectId = (id) => {
    return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
  };

  // 2. إرسال تقييم جديد مع الميديا
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);

    try {
      const formData = new FormData();

      // ⚠️ الحماية الرئيسية: يتم إرسال trip فقط إذا كان ObjectId صالحاً ومقبولاً من Joi
      if (isValidObjectId(tripId)) {
        formData.append("trip", tripId);
      }

      formData.append("rating", rating);
      formData.append("comment", comment.trim());

      if (userName.trim()) {
        formData.append("userName", userName.trim());
      }

      if (mediaFile) {
        formData.append("media", mediaFile);
      }

      const res = await createReview(formData);

      if (res && !res.error) {
        setComment("");
        setUserName("");
        setRating(5);
        setMediaFile(null);
        await fetchReviews();
      } else {
        alert(res?.error || res?.message || "Failed to submit review.");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("An unexpected error occurred while posting your review.");
    } finally {
      setSubmitting(false);
    }
  };

  // دالة لمعرفة هل الرابط فيديو أم صورة
  const isVideoUrl = (url) => {
    if (!url) return false;
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
    return (
      videoExtensions.some((ext) => url.toLowerCase().endsWith(ext)) ||
      url.includes("/video/upload/")
    );
  };

  // دالة لتنظيف وتجهيز رابط الميديا
  const getMediaUrl = (item) => {
    if (!item) return "";
    if (item.startsWith("http://") || item.startsWith("https://")) {
      return item;
    }
    return `https://egy-backend.vercel.app/${item.replace(/\\/g, "/")}`;
  };

  return (
    <div className="rounded-2xl border border-[#EBE4D8] bg-[#FAF7F2] p-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EBE4D8] pb-4">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-[#2B2319]">
            <MessageSquare className="h-5 w-5 text-[#C59B27]" />
            Community Reviews & Feedback
          </h3>
          <p className="mt-0.5 text-xs text-[#8C7A6B]">
            See what other travelers say about their trips across Egypt.
          </p>
        </div>
        <span className="rounded-full bg-[#EBE4D8] px-3 py-1 text-xs font-bold text-[#5A4D41]">
          {reviews.length} Reviews
        </span>
      </div>

      {/* Row Layout Structure */}
      <div className="mt-6 flex flex-col gap-6">
        {/* Row 1: Form Section */}
        <div className="w-full">
          <form
            onSubmit={handleSubmitReview}
            className="rounded-xl border border-[#EBE4D8] bg-white p-5 shadow-2xs"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B2319]">
              Leave a Review
            </h4>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-[11px] font-medium text-[#7A6B5D]">
                  Rating
                </label>
                <div className="mt-1 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          star <= rating
                            ? "fill-[#C59B27] text-[#C59B27]"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full rounded-lg border border-[#EBE4D8] bg-[#FAF7F2] px-3 py-2 text-xs text-[#2B2319] outline-none focus:border-[#C59B27]"
                />
              </div>
            </div>

            <div className="mt-3 space-y-3">
              <textarea
                rows={2}
                required
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-lg border border-[#EBE4D8] bg-[#FAF7F2] p-2.5 text-xs text-[#2B2319] outline-none focus:border-[#C59B27]"
              />

              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <label className="flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#C59B27] bg-[#FAF7F2] px-4 py-2 text-xs font-medium text-[#8C7A6B] hover:bg-[#F3ECE0]">
                  <Image className="h-4 w-4 text-[#C59B27]" />
                  <span>{mediaFile ? mediaFile.name : "Attach Media"}</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setMediaFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#C59B27] px-6 py-2 text-xs font-bold text-white transition-all hover:bg-[#B08A20] disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  {submitting ? "Posting..." : "Post Review"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Row 2: Reviews List Section */}
        <div className="w-full space-y-3">
          {loading ? (
            <div className="py-8 text-center text-xs text-[#8C7A6B]">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#8C7A6B]">
              No community reviews available yet. Be the first to post one!
            </div>
          ) : (
            reviews.map((rev, index) => (
              <div
                key={rev._id || index}
                className="rounded-xl border border-[#EBE4D8] bg-white p-4 text-xs transition-all hover:border-[#D9CEBF]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF7F2] border border-[#EBE4D8] text-[#8C7A6B]">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-[#2B2319] block">
                        {rev.userName ||
                          rev.user?.fullName ||
                          rev.user?.name ||
                          rev.user?.userName ||
                          "Traveler"}
                      </span>
                      {rev.trip?.title && (
                        <span className="text-[10px] text-[#C59B27]">
                          Trip: {rev.trip.title}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < (rev.rating || 5)
                            ? "fill-[#C59B27] text-[#C59B27]"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-2.5 leading-relaxed text-[#5A4D41]">
                  {rev.comment || rev.reviewText}
                </p>

                {/* Display Attached Media (Images & Videos) */}
                {rev.media && rev.media.length > 0 && (
                  <div className="mt-3 flex gap-3 overflow-x-auto">
                    {rev.media.map((item, idx) => {
                      const url = getMediaUrl(item);
                      const isVideo = isVideoUrl(url);

                      return isVideo ? (
                        <video
                          key={idx}
                          src={url}
                          controls
                          className="h-40 max-w-xs rounded-lg border border-[#EBE4D8] object-cover bg-black"
                        />
                      ) : (
                        <img
                          key={idx}
                          src={url}
                          alt="Review Attachment"
                          className="h-28 w-28 rounded-lg object-cover border border-[#EBE4D8]"
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}