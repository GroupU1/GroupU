import HomeCard from "@/components/home/home-card";
import HomeSearch from "@/components/home/home-search";
import SetStatus from "@/components/home/set-status";


export default function Home() {
  return (
    <div>
      <HomeSearch/>
      <HomeCard/>
      <SetStatus/>
    </div>
  );
}
