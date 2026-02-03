import HomeCard from "@/components/home/home-card";
import HomeSearch from "@/components/home/home-search";
import Navbar from "@/components/home/navbar";
import SetStatus from "@/components/home/set-status";


export default function HomePage() {
  return (
    <div>
      <Navbar />
      <HomeSearch/>
      <HomeCard/>
      <SetStatus/>
    </div>
  );
}
