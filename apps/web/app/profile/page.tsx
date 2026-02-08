"use client";

import ProfileInfo, {
  type ProfileInfoData,
} from "@/components/profile/profile-info";
import Navbar from "@/components/navbar";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../backend/convex/_generated/api";
import ContentContainer from "@/components/content-container";

export default function Page() {
  const profile = useQuery(api.users.getCurrentUser);

  const content = (() => {
    if (profile === undefined) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      );
    }

    if (!profile) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No profile found.</p>
        </div>
      );
    }

    const profileData: ProfileInfoData = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      nickname: profile.nickname,
      collegeYear: profile.collegeYear,
      major: profile.major,
      minor: profile.minor,
      concentration: profile.concentration,
      bio: profile.bio,
      visibility: profile.visibility,
      location: profile.location,
    };

    return <ProfileInfo profile={profileData} />;
  })();

  return (
    <ContentContainer className="p-8">
      <Navbar />
      {content}
    </ContentContainer>
  );
}
