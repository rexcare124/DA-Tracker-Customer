"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Person } from "@/types/person";
import Loading from "@/components/Loading";

export default function PersonDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [person, setPerson] = useState<Person | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    api
      .get<Person>(`persons/${encodeURIComponent(id)}`)
      .then((res) => {
        if (!cancelled) setPerson(res.data);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load person");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <Loading />;
  if (error || !person) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-lg text-muted-foreground">{error ?? "Person not found."}</p>
      </div>
    );
  }

  const fullName = [person.prefix, person.firstName, person.middleName, person.lastName, person.suffix]
    .filter(Boolean)
    .join(" ") || "—";

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">{fullName}</h1>
      <dl className="grid gap-3 text-sm">
        <div>
          <dt className="font-medium text-muted-foreground">Email</dt>
          <dd>{person.email ?? "—"}</dd>
        </div>
        <div>
          <dt className="font-medium text-muted-foreground">Username</dt>
          <dd>{person.username ?? "—"}</dd>
        </div>
        <div>
          <dt className="font-medium text-muted-foreground">Location</dt>
          <dd>
            {[person.cityOfResidence, person.stateOfResidence, person.zipCode].filter(Boolean).join(", ") || "—"}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-muted-foreground">Onboarding complete</dt>
          <dd>{person.onboardingComplete == null ? "—" : person.onboardingComplete ? "Yes" : "No"}</dd>
        </div>
      </dl>
    </div>
  );
}
