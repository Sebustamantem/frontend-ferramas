import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const Hero = () => {
  const [index, setIndex] = useState(0)
  //Imagenes
  const heroSlides = [
    { url: "/images/Bienvenido.png" },
    { url: "/images/Herramienta.png" },

  ]

  const bannerTop = "/images/BannerTop.png"
  const bannerBottom = "/images/Banner.png"


  //----- Slider ----
  const next = () => {
    setIndex((prev) => (prev + 1) % heroSlides.length)
  }

  const prev = () => {
    setIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <section className="w-full">
      <div className="w-full sm:max-w-[1450px] sm:mx-auto sm:px-6 lg:px-8 xl:px-10 flex flex-col md:flex-row gap-4 lg:gap-6 pt-0 md:pt-4">

        {/* Hero Slider */}

        <div className="relative w-full md:w-[58%] lg:flex-1 h-[220px] md:h-[320px] lg:h-[400px] xl:h-[450px] overflow-hidden rounded-none sm:rounded-3xl shadow-2xl bg-black">


          {/* Boton izquierdo*/}
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white backdrop-blur-sm hidden md:block">
            <ChevronLeft size={30} strokeWidth={3} />
          </button>

          {/* Boton derecho */}
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white backdrop-blur-sm hidden md:block">
            <ChevronRight size={30} strokeWidth={3} />
          </button>

          {/* Slides */}
          <div
            className="flex h-full w-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >

            {heroSlides.map((slide, i) => (
              <div key={i} className="min-w-full h-full">
                <img src={slide.url} alt="hero" className="w-full h-full object-cover select-none" />
              </div>
            ))}
          </div>

          {/*Indicadores*/}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">

            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-white" : "w-2 bg-white/40"
                  }`}
              />
            ))}

          </div>
        </div>

        {/*Benners Derecha*/}
        <div className="hidden md:flex flex-col gap-3 lg:gap-4 w-full md:w-[42%] lg:w-[450px]">

          <div className="flex-1 rounded-3xl overflow-hidden shadow-lg bg-gray-900">
            <img src={bannerTop} alt="banner" className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 rounded-3xl overflow-hidden shadow-lg bg-gray-900">
            <img src={bannerBottom} alt="banner" className="w-full h-full object-cover" />
          </div>

        </div>
      </div>

    </section>
  )
}

export default Hero