"use client";

import { FormEvent, useState } from "react";
import { CONTACT_EMAIL, practices } from "@/lib/site";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const organization = String(data.get("organization") || "").trim();
    const division = String(data.get("division") || "").trim();
    const message = String(data.get("message") || "").trim();

    const next: Errors = {};
    if (!name) next.name = "Enter your name.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address.";
    }
    if (!message) next.message = "Tell us what you are deciding.";

    if (Object.keys(next).length > 0) {
      event.preventDefault();
      setErrors(next);
      setSent(false);
      return;
    }

    event.preventDefault();
    setErrors({});
    const subject = `Micap inquiry — ${division || "General"}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      organization ? `Organization: ${organization}` : null,
      `Division: ${division || "Not sure yet"}`,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form
      action={`mailto:${CONTACT_EMAIL}`}
      method="post"
      encType="text/plain"
      onSubmit={onSubmit}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label="Name"
          name="name"
          autoComplete="name"
          required
          error={errors.name}
        />
        <Field
          id="email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={errors.email}
        />
      </div>
      <Field
        id="organization"
        label="Organization"
        name="organization"
        autoComplete="organization"
        optional
      />
      <div>
        <label htmlFor="division" className="text-sm font-medium text-ink">
          Division
        </label>
        <select
          id="division"
          name="division"
          defaultValue="Not sure yet"
          className="mt-2 w-full min-h-12 border border-line bg-panel px-3 text-base text-ink"
        >
          <option>Not sure yet</option>
          {practices.map((practice) => (
            <option key={practice.slug}>{practice.nav}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium text-ink">
          What you are deciding
          <span className="text-brass"> *</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="mt-2 w-full border border-line bg-panel px-3 py-3 text-base leading-relaxed text-ink"
        />
        {errors.message ? (
          <p id="message-error" className="mt-2 text-sm text-danger">
            {errors.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center bg-ink px-5 text-sm font-semibold text-cream hover:bg-ink/90"
        >
          Open email to send
        </button>
        <p className="text-sm text-faint">
          This opens your email app. Nothing is stored on the site.
        </p>
      </div>
      {Object.keys(errors).length > 0 ? (
        <p role="alert" className="text-sm text-danger">
          Check the fields above before sending.
        </p>
      ) : null}
      {sent ? (
        <p role="status" className="text-sm text-muted">
          Your email app should open with this message. If it does not, write
          to{" "}
          <a className="font-medium text-brass" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}

function Field({
  id,
  label,
  name,
  type = "text",
  autoComplete,
  required,
  optional,
  error,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-brass"> *</span> : null}
        {optional ? <span className="text-faint"> (optional)</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-2 w-full min-h-12 border border-line bg-panel px-3 text-base text-ink"
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
