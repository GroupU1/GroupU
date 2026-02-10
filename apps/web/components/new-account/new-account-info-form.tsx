"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { api } from "../../../backend/convex/_generated/api";

export default function NewAccountInfoForm() {
  const router = useRouter();
  const upsertUser = useMutation(api.users.upsertUser);

  const [collegeYear, setCollegeYear] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const getValue = (key: string) => {
      const value = formData.get(key);
      if (typeof value !== "string") return undefined;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    };

    try {
      await upsertUser({
        firstName: getValue("firstName"),
        lastName: getValue("lastName"),
        nickname: getValue("nickname"),
        collegeYear: getValue("collegeYear"),
        major: getValue("major"),
        minor: getValue("minor"),
        concentration: getValue("concentration"),
        bio: getValue("bio"),
      });
      router.replace("/home");
    } catch (err) {
      setError("Unable to save your profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="w-full max-w-120" onSubmit={handleSubmit}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend className="text-2xl! font-bold">
            Welcome to GroupU
          </FieldLegend>
          <FieldDescription>
            Get started by entering some facts about yourself. All information
            is optional and can be changed later.
          </FieldDescription>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                <Input
                  id="first-name"
                  name="firstName"
                  type="text"
                  placeholder="Enter your first name"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                <Input
                  id="last-name"
                  name="lastName"
                  type="text"
                  placeholder="Enter your last name"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="nickname">Nickname</FieldLabel>
              <Input
                id="nickname"
                name="nickname"
                type="text"
                placeholder="Enter an alternative name if you prefer"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="year">College Year</FieldLabel>
              <Select value={collegeYear} onValueChange={setCollegeYear}>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select your college year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="freshman">Freshman</SelectItem>
                    <SelectItem value="sophmore">Sophmore</SelectItem>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <input type="hidden" name="collegeYear" value={collegeYear} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="major">Major</FieldLabel>
                <Input
                  id="major"
                  name="major"
                  type="text"
                  placeholder="Enter your major"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="minor">Minor</FieldLabel>
                <Input
                  id="minor"
                  name="minor"
                  type="text"
                  placeholder="Enter your minor"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="concentration">Concentration</FieldLabel>
              <Input
                id="concentration"
                name="concentration"
                type="text"
                placeholder="Enter your concentration"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="bio">About Me</FieldLabel>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself"
                className="resize-none"
              />
            </Field>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </FieldGroup>
        </FieldSet>
        <Field orientation="horizontal">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Continue"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
