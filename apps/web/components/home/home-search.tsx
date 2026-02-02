import React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import HomeSearchFilter from "./home-search-filter";

export default function HomeSearch() {
  return (
    <div className="w-lvw flex justify-center gap-4 mt-6">
      <InputGroup className="w-80">
        <InputGroupInput placeholder="Cal Poly" />
        <InputGroupAddon>Campus</InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Search />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup className="w-80">
        <InputGroupInput placeholder="People or tags" />
        <InputGroupAddon>Search</InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <HomeSearchFilter />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
