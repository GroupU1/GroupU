import ContentContainer from "@/components/content-container";
import AddActivity from "@/components/home/add-activity";
import HomeSearch from "@/components/home/home-search";
import MapButtonsLeft from "@/components/home/map-buttons-left";
import Navbar from "@/components/navbar";
import React from "react";

export default function Page() {
  return (
    <ContentContainer>
      <div className="absolute top-2 left-2 z-10 flex gap-x-2">
        <MapButtonsLeft />
      </div>
      <HomeSearch className="absolute top-2 left-1/2 -translate-x-1/2" />
      <div className="absolute top-2 right-2 flex items-start gap-x-8">
        <AddActivity />
      </div>
      <Navbar />
    </ContentContainer>
  );
}
