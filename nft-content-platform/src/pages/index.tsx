import Hero from "@/components/ui/hero";
import Navbar from "@/components/ui/navbar";
import NFTSlider from "@/components/ui/nft/slider";
import CreatorSlider from "@/components/ui/creator/slider";
import SearchBar from "@/components/ui/searchbar";
import Footer from "@/components/ui/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="bg-white min-h-[100vh]">
        <Hero />
        <NFTSlider />
        <SearchBar />
        <CreatorSlider />
      </div>
      <Footer />
    </>
  );
}
