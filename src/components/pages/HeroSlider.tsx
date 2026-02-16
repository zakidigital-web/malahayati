'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface Slide {
  id: string
  title: string
  subtitle: string
  description: string | null
  buttonText: string | null
  buttonUrl: string | null
  imageUrl: string | null
}

interface HeroSliderProps {
  onConsultClick: () => void
}

export default function HeroSlider({ onConsultClick }: HeroSliderProps) {
  const [slides, setSlides] = useState<Slide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchSlides()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (slides.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 5000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [slides.length])

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/admin/slides', { cache: 'no-store' })
      const result = await response.json()
      if (result.success && result.data.length > 0) {
        setSlides(result.data)
      } else {
        // Default slides if no slides exist
        setSlides([
          {
            id: 'default-1',
            title: 'Pendampingan Hukum',
            subtitle: 'Profesional & Terpercaya',
            description: 'Kami memberikan solusi hukum yang komprehensif untuk individu dan perusahaan dengan pendekatan profesional dan transparan.',
            buttonText: 'Konsultasi Gratis',
            buttonUrl: '',
            imageUrl: null,
          },
        ])
      }
    } catch (error) {
      console.error('Error fetching slides:', error)
      setSlides([
        {
          id: 'default-1',
          title: 'Pendampingan Hukum',
          subtitle: 'Profesional & Terpercaya',
          description: 'Kami memberikan solusi hukum yang komprehensif untuk individu dan perusahaan.',
          buttonText: 'Konsultasi Gratis',
          buttonUrl: '',
          imageUrl: null,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    // Reset interval on manual navigation
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
  }

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length)
  }

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length)
  }

  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white text-center">Memuat...</div>
      </section>
    )
  }

  const slide = slides[currentSlide]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {slide.imageUrl ? (
          <img 
            src={slide.imageUrl} 
            alt="" 
            className="w-full h-full object-cover opacity-30"
          />
        ) : null}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="min-h-[300px] flex flex-col items-center justify-center">
            <p className="text-amber-400 text-xs sm:text-sm font-medium tracking-widest uppercase mb-4 sm:mb-6">
              {slide.subtitle}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight px-2">
              {slide.title.split(' ').slice(0, -1).join(' ')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                {slide.title.split(' ').slice(-1).join(' ')}
              </span>
            </h1>
            {slide.description && (
              <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
                {slide.description}
              </p>
            )}
            {slide.buttonText && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Button 
                  size="lg" 
                  className="bg-white text-slate-900 hover:bg-slate-100 text-base px-6 sm:px-8 py-5 h-auto font-medium w-full sm:w-auto"
                  onClick={onConsultClick}
                >
                  {slide.buttonText}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-amber-400 w-8'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
