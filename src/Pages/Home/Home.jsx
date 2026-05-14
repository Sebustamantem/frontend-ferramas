import Hero from "./Hero"
import Categories from "../../components/home/Categories"
import PromoBanner from "../../components/home/PromoBanner"
import FeaturedProducts from "../../components/home/FeaturedProducts"

const Home = () => {
  return (
    <div className="bg-gray-50">
      <Hero />
      <PromoBanner />
      <Categories />
      <FeaturedProducts />
    </div>
  )
}

export default Home