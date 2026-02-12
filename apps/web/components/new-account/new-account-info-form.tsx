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

    const firstName = getValue("firstName");
    const lastName = getValue("lastName");

    if (!firstName || !lastName) {
      setError("First and last name are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      await upsertUser({
        firstName,
        lastName,
        nickname: getValue("nickname"),
        pronouns: getValue("pronouns"),
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
            Get started by entering some facts about yourself. Only{" "}
            <span className="text-red-500 font-bold">*</span> fields are
            required. Most information is optional and all information can be changed later.
          </FieldDescription>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="first-name">
                  First Name<span className="text-red-500 font-bold">*</span>
                </FieldLabel>
                <Input
                  id="first-name"
                  name="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  maxLength={50}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="last-name">
                  Last Name<span className="text-red-500 font-bold">*</span>
                </FieldLabel>
                <Input
                  id="last-name"
                  name="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  maxLength={50}
                  required
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="nickname">Nickname</FieldLabel>
                <Input
                  id="nickname"
                  name="nickname"
                  type="text"
                  placeholder="Optional preferred name"
                  maxLength={50}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="pronouns">Pronouns</FieldLabel>
                <Input
                  id="pronouns"
                  name="pronouns"
                  type="text"
                  placeholder="e.g. she/her"
                  maxLength={30}
                />
              </Field>
            </div>
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
