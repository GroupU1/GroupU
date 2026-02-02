import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";

const locations: string[] = [
  "Library",
  "UU / Center",
  "Dorms",
  "Engineering",
  "Rec",
  "Dining",
  "Downtown",
  "Poly Canyon",
  "On Campus",
];

export default function HomeCard() {
  return (
    <div className="w-lvw flex justify-center mt-16">
      <div className="w-1/2">
        <Tabs defaultValue="map">
          <div className="flex w-full justify-between items-end mb-2">
            <p>
              Live Now: <span className="font-bold">0</span>
            </p>
            <TabsList className="flex gap-2">
              <TabsTrigger value="map">Map</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="map">
            <Card>
              <CardContent className="grid grid-cols-2 gap-2">
                {locations.map((location) => (
                  <Item key={location} variant="muted">
                    <ItemContent>
                      <ItemTitle>{location}</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <Badge>0</Badge>
                    </ItemActions>
                  </Item>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="live">
            <Card>
              <CardContent className="h-96"></CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
