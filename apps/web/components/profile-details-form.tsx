"use client";

import * as React from "react";
import { UserRound, Upload, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
  InputGroupText,
} from "@/components/ui/input-group";

export default function ProfileDetailsForm() {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextUrl;
    });
  }

  function clearPhoto() {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <form className="grid gap-6">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>
            Everything here is optional. Add what you want others to see.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <FieldSet>
            <FieldLegend>Profile Picture</FieldLegend>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="profile-photo">Upload a photo</FieldLabel>
                <FieldContent>
                  <div className="flex flex-wrap items-center gap-4">
                    <Avatar size="lg">
                      <AvatarImage
                        src={previewUrl ?? undefined}
                        alt="Profile preview"
                      />
                      <AvatarFallback>
                        <UserRound className="size-5" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-wrap gap-2">
                      <input
                        ref={fileInputRef}
                        id="profile-photo"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="size-4" />
                        Upload
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="gap-2"
                        onClick={clearPhoto}
                      >
                        <X className="size-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </FieldContent>
                <FieldDescription>
                  JPG or PNG up to 5MB. Optional.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldGroup className="gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="nickname">Nickname</FieldLabel>
                  <FieldContent>
                    <InputGroup>
                      <InputGroupInput
                        id="nickname"
                        name="nickname"
                        placeholder="e.g. Will"
                      />
                    </InputGroup>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="year">Year</FieldLabel>
                  <FieldContent>
                    <InputGroup>
                      <InputGroupInput
                        id="year"
                        name="year"
                        placeholder="e.g. 2026"
                      />
                    </InputGroup>
                  </FieldContent>
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldGroup className="gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="major">Major</FieldLabel>
                  <FieldContent>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>Major</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="major"
                        name="major"
                        placeholder="e.g. Computer Science"
                      />
                    </InputGroup>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="concentration">Concentration</FieldLabel>
                  <FieldContent>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>Focus</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="concentration"
                        name="concentration"
                        placeholder="e.g. AI & ML"
                      />
                    </InputGroup>
                  </FieldContent>
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="about">Bio</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupTextarea
                      id="about"
                      name="about"
                      placeholder="Share a few lines about your interests, projects, or goals."
                      rows={4}
                    />
                  </InputGroup>
                </FieldContent>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>

        <CardFooter className="justify-end gap-2">
          <Button type="button" variant="ghost">
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
