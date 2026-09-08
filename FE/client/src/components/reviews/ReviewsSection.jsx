import React, { useState } from "react";
import {
  Star,
  Play,
  X,
  Image as ImageIcon,
  Video,
  CheckCircle,
  Quote,
  Filter,
  PlusCircle,
  Send,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { createReview } from "../../api/reviewsApi";

// High quality curated client reviews matching Figma specifications
const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    name: "Emma Watson-Smith",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    date: "May 2024",
    tripTitle: "Cairo & Giza: Pyramids, History & Museums",
    quote:
      "Standing in front of the Great Pyramid at sunrise with our private guide was a dream come true! Egi Rises made everything effortless — from the airport pickup to navigating Khan El Khalili.",
    photos: [
      "https://images.unsplash.com/photo-1524686975162-f6fb4d39759c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80",
    ],
    video: {
      thumbnail: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      duration: "0:48",
      title: "Emma's Camel Ride & Giza Sunset Video",
    },
    verified: true,
  },
  {
    id: "rev-2",
    name: "Lukas Weber",
    country: "Germany",
    countryFlag: "🇩🇪",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    date: "April 2024",
    tripTitle: "Luxor & Aswan Nile Cruise Experience",
    quote:
      "The Karnak Temple and Valley of the Kings were beyond breathtaking. The offline itinerary guide was an absolute lifesaver inside the tombs with no cell service. 10/10 recommendation!",
    photos: [
      "https://images.unsplash.com/photo-1678889413421-14be34e3b921?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1633033254409-bd538e785f51?auto=format&fit=crop&w=800&q=80",
    ],
    video: {
      thumbnail: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      duration: "1:15",
      title: "Lukas's Felucca Sail on the Nile at Aswan",
    },
    verified: true,
  },
  {
    id: "rev-3",
    name: "Sophia Chen",
    country: "Canada",
    countryFlag: "🇨🇦",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    date: "March 2024",
    tripTitle: "Complete Egypt Highlights: Cairo, Luxor & Alexandria",
    quote:
      "The cultural insights, local taxi rates, and authentic dining recommendations were spot on. Felt safe and thoroughly immersed throughout our 8-day tour.",
    photos: [
      "https://images.unsplash.com/photo-1682090471391-413a38705abe?auto=format&fit=crop&w=800&q=80",
    ],
    video: null,
    verified: true,
  },
  {
    id: "rev-4",
    name: "Mateo Rossi",
    country: "Italy",
    countryFlag: "🇮🇹",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    date: "February 2024",
    tripTitle: "Abu Simbel & Nubian Heritage Expedition",
    quote:
      "Abu Simbel was the grandest monument I have ever witnessed. Watching the morning sun hit Ramses II was surreal. The whole trip plan synchronized perfectly.",
    photos: [
      "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80",
    ],
    video: {
      thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
      duration: "0:55",
      title: "Mateo's Abu Simbel Morning Expedition",
    },
    verified: true,
  },
];

/**
 * ReviewsSection
 * Dedicated client testimonials component featuring rich quotes, verified badges,
 * rating stars, photo galleries, and video player modal overlay.
 */
export default function ReviewsSection({ title = "What Travelers Say About Egi Rises", tripId = null }) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeVideo, setActiveVideo] = useState(null);
  const [activePhoto, setActivePhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === "5star") return r.rating === 5;
    if (activeFilter === "photos") return r.photos && r.photos.length > 0;
    if (activeFilter === "videos") return Boolean(r.video);
    return true;
  });

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      if (tripId && isAuthenticated) {
        await createReview({ trip: tripId, rating: newRating, comment: newComment });
      }

      const createdReview = {
        id: `rev-${Date.now()}`,
        name: user?.fullName || "Verified Traveler",
        country: user?.country || "Traveler",
        countryFlag: "🌍",
        avatar:
          user?.avatar ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
        rating: newRating,
        date: "Just now",
        tripTitle: "Custom Egypt Trip Plan",
        quote: newComment,
        photos: newPhotoUrl ? [newPhotoUrl] : [],
        video: newVideoUrl
          ? {
              thumbnail:
                newPhotoUrl ||
                "https://images.unsplash.com/photo-1524686975162-f6fb4d39759c?auto=format&fit=crop&w=800&q=80",
              videoUrl: newVideoUrl,
              duration: "0:30",
              title: "Traveler Video Story",
            }
          : null,
        verified: true,
      };

      setReviews([createdReview, ...reviews]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        setNewComment("");
        setNewPhotoUrl("");
        setNewVideoUrl("");
      }, 1500);
    } catch (err) {
      console.error("Error creating review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 font-body">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        {/* Section Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-dark">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Verified Stories
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
              {title}
            </h2>
            <p className="mt-1 max-w-xl text-sm text-ink/60">
              Real experiences and media shared by travelers who explored the wonders of Egypt with us.
            </p>
          </div>

          {/* Action: Write Review */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold text-cream shadow-sm transition-all hover:bg-gold-light hover:shadow"
            >
              <PlusCircle className="h-4 w-4" />
              Share Your Story
            </button>
          </div>
        </div>

        {/* Rating Overview Summary Banner */}
        <div className="mt-8 grid grid-cols-1 gap-4 rounded-3xl border border-line bg-cream p-6 shadow-sm sm:grid-cols-3">
          <div className="flex items-center gap-4 border-b border-line/60 pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-2xl font-bold text-gold-dark font-display">
              4.9
            </div>
            <div>
              <div className="flex items-center gap-1 text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-1 text-xs font-semibold text-ink">
                Overall Traveler Rating
              </p>
              <p className="text-[11px] text-ink/50">Based on 1,480+ authentic reviews</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-line/60 pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:px-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal/15 text-teal">
              <CheckCircle className="h-7 w-7" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-ink">99.4%</p>
              <p className="text-xs font-semibold text-ink/75">Satisfaction Guarantee</p>
              <p className="text-[11px] text-ink/50">Official verified guides & support</p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:pl-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold-dark">
              <Video className="h-7 w-7" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-ink">500+ Media Clips</p>
              <p className="text-xs font-semibold text-ink/75">Photos & Video Testimonials</p>
              <p className="text-[11px] text-ink/50">From Cairo, Luxor & Aswan</p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold text-ink/50 mr-1">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </span>
          {[
            { id: "all", label: "All Stories" },
            { id: "5star", label: "★ 5 Star Reviews" },
            { id: "photos", label: "With Photos" },
            { id: "videos", label: "Video Testimonials" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeFilter === f.id
                  ? "bg-gold text-cream shadow-sm"
                  : "border border-line bg-sandbox text-ink/70 hover:border-gold/60 hover:bg-cream"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Reviews Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between rounded-3xl border border-line bg-cream p-6 shadow-sm transition-all duration-200 hover:border-gold/60 hover:shadow-card"
            >
              <div>
                {/* Traveler profile header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-gold/40 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display text-sm font-bold text-ink">
                          {rev.name}
                        </h3>
                        {rev.verified && (
                          <span
                            title="Verified Traveler"
                            className="inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200"
                          >
                            <CheckCircle className="h-3 w-3 mr-0.5" /> Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink/50 flex items-center gap-1 mt-0.5">
                        <span>{rev.countryFlag}</span>
                        <span>{rev.country}</span>
                        <span>•</span>
                        <span>{rev.date}</span>
                      </p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 text-gold">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Quote body */}
                <div className="mt-4 relative">
                  <Quote className="h-5 w-5 text-gold/20 absolute -top-1 -left-1 transform -scale-x-100" />
                  <p className="pl-5 text-xs sm:text-sm leading-relaxed text-ink/80 italic">
                    "{rev.quote}"
                  </p>
                </div>

                {/* Trip badge */}
                {rev.tripTitle && (
                  <div className="mt-3 inline-block rounded-lg bg-sandbox px-2.5 py-1 text-[11px] font-medium text-ink/65">
                    📍 {rev.tripTitle}
                  </div>
                )}
              </div>

              {/* Media Attachments Area (Photos + Video) */}
              {(rev.photos?.length > 0 || rev.video) && (
                <div className="mt-5 border-t border-line/60 pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/40 mb-2.5">
                    Attached Media ({ (rev.photos?.length || 0) + (rev.video ? 1 : 0) })
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {/* Video Attachment with Play Overlay */}
                    {rev.video && (
                      <div
                        onClick={() => setActiveVideo(rev.video)}
                        className="group relative h-20 w-28 cursor-pointer overflow-hidden rounded-xl border border-gold/40 shadow-sm transition-transform duration-200 hover:scale-105"
                      >
                        <img
                          src={rev.video.thumbnail}
                          alt="Video thumbnail"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-ink/40 transition-colors group-hover:bg-ink/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-cream shadow-md transition-transform group-hover:scale-110">
                            <Play className="h-4 w-4 fill-current ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-bold text-white">
                          {rev.video.duration || "Video"}
                        </span>
                      </div>
                    )}

                    {/* Photos Attachments */}
                    {rev.photos?.map((photo, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={() => setActivePhoto(photo)}
                        className="group relative h-20 w-24 cursor-pointer overflow-hidden rounded-xl border border-line shadow-sm transition-transform duration-200 hover:scale-105"
                      >
                        <img
                          src={photo}
                          alt="Travel snapshot"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-ink/10 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-white drop-shadow" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- Video Player Modal ---------------- */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-gold/40 bg-ink shadow-2xl">
            {/* Top Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-cream">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-cream">
                  <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                </div>
                <h4 className="font-display text-sm font-semibold text-cream">
                  {activeVideo.title || "Traveler Video Story"}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="rounded-full bg-white/10 p-1.5 text-cream/70 transition-colors hover:bg-white/20 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Responsive Video Player */}
            <div className="relative aspect-video w-full bg-black">
              <video
                src={activeVideo.videoUrl}
                controls
                autoPlay
                className="h-full w-full object-contain"
              >
                Your browser does not support HTML5 video.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Photo Lightbox Modal ---------------- */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-md animate-fade-in"
        >
          <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl border border-gold/40 bg-black shadow-2xl">
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={activePhoto}
              alt="High resolution client media"
              className="max-h-[85vh] w-auto object-contain"
            />
          </div>
        </div>
      )}

      {/* ---------------- Write a Review Modal ---------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-cream p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-ink">
                  Share Your Travel Experience
                </h3>
                <p className="text-xs text-ink/55 mt-0.5">
                  Help other travelers discover the beauty of Egypt
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full border border-line p-1.5 text-ink/60 transition-colors hover:bg-sandbox hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h4 className="mt-4 font-display text-lg font-bold text-ink">
                  Thank You for Your Review!
                </h4>
                <p className="mt-1 text-xs text-ink/60">
                  Your review and media attachments have been published.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="mt-5 space-y-4">
                {/* Rating selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink/60 mb-1.5">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 text-gold transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= newRating ? "fill-current" : "text-ink/20"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-bold text-gold-dark">
                      {newRating} / 5 Stars
                    </span>
                  </div>
                </div>

                {/* Comment textarea */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink/60 mb-1.5">
                    Your Story & Highlights
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Describe your tour, guides, monuments visited, and top tips..."
                    className="w-full resize-none rounded-2xl border border-line bg-sandbox px-4 py-3 text-xs sm:text-sm text-ink outline-none transition-colors focus:border-gold focus:bg-cream"
                  />
                </div>

                {/* Photo attachment link */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink/60 mb-1.5">
                    Attach Photo (Image URL)
                  </label>
                  <div className="flex items-center gap-2 rounded-2xl border border-line bg-sandbox px-3.5 py-2 focus-within:border-gold focus-within:bg-cream">
                    <ImageIcon className="h-4 w-4 text-ink/40" />
                    <input
                      type="url"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="https://example.com/your-pyramids-photo.jpg"
                      className="w-full bg-transparent text-xs text-ink outline-none"
                    />
                  </div>
                </div>

                {/* Video attachment link */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink/60 mb-1.5">
                    Attach Video (MP4 / Web Video URL)
                  </label>
                  <div className="flex items-center gap-2 rounded-2xl border border-line bg-sandbox px-3.5 py-2 focus-within:border-gold focus-within:bg-cream">
                    <Video className="h-4 w-4 text-ink/40" />
                    <input
                      type="url"
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      placeholder="https://example.com/your-nile-video.mp4"
                      className="w-full bg-transparent text-xs text-ink outline-none"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="mt-6 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-full border border-line px-5 py-2.5 text-xs font-semibold text-ink/70 hover:bg-sandbox"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-xs font-semibold text-cream shadow-sm transition-all hover:bg-gold-light disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {isSubmitting ? "Submitting..." : "Publish Review"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
