"use client";

import ContentContainer from "@/components/content-container";
import AddActivity from "@/components/home/add-activity";
import HomeSearch from "@/components/home/home-search";
import Map from "@/components/home/map/map";
import MapListToggle from "@/components/home/map-list-toggle";
import List from "@/components/home/list/list";
import SetStatus from "@/components/home/set-status";
import VisibilitySwitch from "@/components/home/visibility-switch";
import Navbar from "@/components/navbar";
import { ButtonGroup } from "@/components/ui/button-group";
import React from "react";

export default function Page() {
  const [showMap, setShowMap] = React.useState(true);

  return (
    <ContentContainer>
      <div className="absolute bottom-2 top-auto left-2 md:bottom-auto md:top-2 z-10 flex gap-x-2">
        <div className="flex flex-col-reverse md:flex-row space-x-2">
          <ButtonGroup className="hidden md:block">
            <MapListToggle
              isMap={showMap}
              onToggle={() => setShowMap((prev) => !prev)}
            />
            <VisibilitySwitch />
          </ButtonGroup>
          <ButtonGroup>
            <SetStatus />
          </ButtonGroup>
        </div>
      </div>
      <div className="absolute flex flex-col items-end top-2 right-2 md:right-auto md:left-1/2 md:-translate-x-1/2 space-y-2">
        <HomeSearch />
        <ButtonGroup orientation="vertical" className="md:hidden">
          <MapListToggle
            isMap={showMap}
            onToggle={() => setShowMap((prev) => !prev)}
          />
          <VisibilitySwitch />
        </ButtonGroup>
      </div>
      <div className="absolute bottom-2 top-auto right-2 flex items-start gap-x-8 md:bottom-auto md:top-2">
        <AddActivity />
      </div>
      {showMap ? <Map className="w-full h-full" /> : <List className="w-full h-full"/>}
      <Navbar />
    </ContentContainer>
  );
}
