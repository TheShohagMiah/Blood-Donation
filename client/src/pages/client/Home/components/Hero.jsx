import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  HeartPulse,
  Activity,
  ShieldCheck,
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "../../../../ui/Button";
import CreateBloodRequest from "./CreateBloodRequest";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    id: 1,
    tag: "Trusted by 50+ Hospitals",
    headline: ["Giving Blood", "Is Giving Life."],
    sub: "Experience the fastest way to connect with blood donors. Our platform ensures a seamless, secure, and instant response for every emergency.",
    accent: "text-red-500",
    accentHex: "#ef4444",
    badge: { label: "O−  Emergency · DMCH", color: "bg-red-600" },
    stat: { value: "2 min", label: "Avg. donor response time" },
    cta: { primary: "Join as a Donor", secondary: "Search Donors" },
    bgImage:
      "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1600&q=80",
  },
  {
    id: 2,
    tag: "Real-time Location Matching",
    headline: ["Find the Right", "Donor, Right Now."],
    sub: "Filter by blood group, district, and upazila. Our geo-aware matching surfaces the closest available donor in seconds.",
    accent: "text-orange-400",
    accentHex: "#fb923c",
    badge: { label: "A+  Required · Apollo", color: "bg-orange-500" },
    stat: { value: "12,000+", label: "Registered donors nationwide" },
    cta: { primary: "Find a Donor", secondary: "Learn How It Works" },
    bgImage:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1600&q=80",
  },
  {
    id: 3,
    tag: "Verified & Safe",
    headline: ["Every Donor,", "Screened & Certified."],
    sub: "All donors go through identity verification and health screening. Donate and receive with full confidence in every step of the process.",
    accent: "text-emerald-400",
    accentHex: "#34d399",
    badge: { label: "B+  Scheduled · Square", color: "bg-emerald-600" },
    stat: { value: "98%", label: "Successful donation matches" },
    cta: { primary: "Become a Donor", secondary: "View Safety Standards" },
    bgImage:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1600&q=80",
  },
];

const Hero = () => {
  const navigate = useNavigate();
  const [createBloodRequest, setCreateBloodRequest] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const bgSwiperRef = useRef(null);
  const fgSwiperRef = useRef(null);

  const current = slides[activeIndex];

  const syncBg = (swiper) => {
    const idx = swiper.realIndex;
    setActiveIndex(idx);
    if (bgSwiperRef.current && bgSwiperRef.current.realIndex !== idx) {
      bgSwiperRef.current.slideToLoop(idx, 700);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* ── Background image Swiper ── */}
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={false}
          loop
          allowTouchMove={false}
          speed={700}
          onSwiper={(swiper) => {
            bgSwiperRef.current = swiper;
          }}
          className="w-full h-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="w-full h-full">
              <div
                className="w-full h-full bg-cover bg-center scale-105"
                style={{ backgroundImage: `url(${slide.bgImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-800/70 via-neutral-950/70 " />

              {/* Top fade */}
              <div className="absolute inset-0 bg-gradient-to-b from-orange-950/40 via-neutral-950/70  to-transparent" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Base scrim */}
        <div className="absolute inset-0 bg-neutral-950/60" />
        {/* Per-slide accent colour wash */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 70% 50%, ${current.accentHex}22 0%, transparent 65%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
          />
        </AnimatePresence>

        {/* Noise grain */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px",
          }}
        />
      </div>

      {/* ── Custom nav buttons ── */}
      <button
        ref={prevRef}
        aria-label="Previous slide"
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-border-default bg-surface-card backdrop-blur-sm flex items-center justify-center text-content-muted transition-all"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        ref={nextRef}
        aria-label="Next slide"
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-border-default bg-surface-card backdrop-blur-sm flex items-center justify-center text-content-muted transition-all"
      >
        <ChevronRight size={18} />
      </button>

      {/* ── Foreground content Swiper ── */}
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          el: ".hero-pagination",
          bulletClass: "hero-bullet",
          bulletActiveClass: "hero-bullet-active",
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        onSlideChange={syncBg}
        onSwiper={(swiper) => {
          fgSwiperRef.current = swiper;
        }}
        loop
        speed={700}
        className="w-full min-h-[92vh] z-10"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={slide.id}>
            <div className="min-h-[92vh] flex items-center">
              <div className="container max-w-7xl mx-auto px-6 lg:px-16 grid  items-center py-24 lg:py-0">
                <div className="max-w-3xl mx-auto flex flex-col gap-6 lg:gap-8 items-center text-center">
                  {/* Tag */}
                  <AnimatePresence mode="wait">
                    {activeIndex === i && (
                      <motion.div
                        key={`tag-${i}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-card/80 backdrop-blur-sm border border-border-default text-content-muted"
                      >
                        <Activity
                          size={13}
                          className="animate-pulse text-red-400"
                        />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          {slide.tag}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Headline */}
                  <AnimatePresence mode="wait">
                    {activeIndex === i && (
                      <motion.h1
                        key={`h-${i}`}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.5, delay: 0.07 }}
                        className="text-5xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.05] text-content-muted text-center"
                      >
                        {slide.headline[0]}{" "}
                        <span className={slide.accent}>
                          {slide.headline[1]}
                        </span>
                      </motion.h1>
                    )}
                  </AnimatePresence>

                  {/* Sub */}
                  <AnimatePresence mode="wait">
                    {activeIndex === i && (
                      <motion.p
                        key={`sub-${i}`}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45, delay: 0.14 }}
                        className="text-base text-content-muted/60 max-w-md leading-relaxed"
                      >
                        {slide.sub}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* CTAs */}
                  <AnimatePresence mode="wait">
                    {activeIndex === i && (
                      <motion.div
                        key={`cta-${i}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
                      >
                        <Button
                          onClick={() => navigate("/register")}
                          variant="primary"
                          className="w-full sm:w-auto px-8 py-3 flex items-center justify-center gap-2 font-bold text-sm"
                        >
                          {slide.cta.primary} <ArrowRight size={15} />
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => navigate("/search")}
                          className=" border border-border-default backdrop-blur-sm "
                        >
                          {slide.cta.secondary}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ── Slide counter + progress bar ── */}
      <div className="absolute bottom-20 left-6 lg:left-16 z-30 hidden lg:flex items-center gap-4 bg-surface-card/20 backdrop-blur-sm py-3 px-4 rounded-full">
        <span className="text-primary-600 text-xs font-black tabular-nums">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(slides.length).padStart(2, "0")}
        </span>
        <div className="w-24 h-px bg-surface-card/80 relative overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-primary-600"
            key={activeIndex}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5.5, ease: "linear" }}
          />
        </div>
      </div>

      {/* ── Pagination dots ── */}
      <div className="hero-pagination absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2" />

      <style>{`
        .hero-bullet {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.25);
          cursor: pointer;
          transition: all 0.35s ease;
        }
        .hero-bullet-active {
          width: 24px;
          background: rgba(255, 255, 255, 0.85);
        }
      `}</style>

      {createBloodRequest && (
        <CreateBloodRequest onClose={() => setCreateBloodRequest(false)} />
      )}
    </section>
  );
};

export default Hero;
