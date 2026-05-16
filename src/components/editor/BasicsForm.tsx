import { useResumeStore } from '@/store/resume-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import type { ChangeEvent } from 'react';
import type { Basics } from '@/schema/basics';

/**
 * Basics form — uncontrolled inputs bound to the Zustand store via a
 * 120ms debounced commit. Each field is its own commit (so a partial
 * email like "j" doesn't trigger validation until the user pauses).
 *
 * We use react-hook-form-style discipline (separate field state) without
 * pulling in the library for this simple flat form. Per-section item
 * editors (M4+) will use react-hook-form for nested array shapes.
 */
export function BasicsForm() {
  const basics = useResumeStore((s) => s.resume.basics);
  const setBasics = useResumeStore((s) => s.setBasics);
  const lastError = useResumeStore((s) => s.lastError);

  // One debounced setter shared across all inputs — they pass distinct patches.
  const debouncedSet = useDebouncedCallback((patch: Partial<Basics>) => {
    setBasics(patch);
  }, 120);

  const setLocation = useDebouncedCallback((patch: Partial<Basics['location']>) => {
    setBasics({ location: { ...basics.location, ...patch } });
  }, 120);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      aria-labelledby="basics-heading"
    >
      <h2
        id="basics-heading"
        className="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
      >
        Basics
      </h2>

      <Field id="name" label="Full name">
        <Input
          id="name"
          defaultValue={basics.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => debouncedSet({ name: e.target.value })}
          autoComplete="name"
          placeholder="Avery Chen"
        />
      </Field>

      <Field id="headline" label="Headline">
        <Input
          id="headline"
          defaultValue={basics.headline}
          onChange={(e) => debouncedSet({ headline: e.target.value })}
          placeholder="Staff Software Engineer · Distributed Systems"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="email" label="Email">
          <Input
            id="email"
            type="email"
            defaultValue={basics.email}
            onChange={(e) => debouncedSet({ email: e.target.value })}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </Field>
        <Field id="phone" label="Phone">
          <Input
            id="phone"
            type="tel"
            defaultValue={basics.phone}
            onChange={(e) => debouncedSet({ phone: e.target.value })}
            autoComplete="tel"
            placeholder="+1 555-555-5555"
          />
        </Field>
      </div>

      <Field id="url" label="Website">
        <Input
          id="url"
          type="url"
          defaultValue={basics.url}
          onChange={(e) => debouncedSet({ url: e.target.value })}
          autoComplete="url"
          placeholder="https://your-site.example.com"
        />
      </Field>

      <Field id="summary" label="Summary">
        <Textarea
          id="summary"
          defaultValue={basics.summary}
          onChange={(e) => debouncedSet({ summary: e.target.value })}
          rows={3}
          placeholder="One paragraph that sets the tone of your resume."
        />
      </Field>

      <fieldset className="space-y-3 rounded-md border border-border p-4">
        <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Location
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="city" label="City">
            <Input
              id="city"
              defaultValue={basics.location.city}
              onChange={(e) => setLocation({ city: e.target.value })}
              autoComplete="address-level2"
            />
          </Field>
          <Field id="region" label="State / region">
            <Input
              id="region"
              defaultValue={basics.location.region}
              onChange={(e) => setLocation({ region: e.target.value })}
              autoComplete="address-level1"
            />
          </Field>
          <Field id="postalCode" label="Postal code">
            <Input
              id="postalCode"
              defaultValue={basics.location.postalCode}
              onChange={(e) => setLocation({ postalCode: e.target.value })}
              autoComplete="postal-code"
            />
          </Field>
          <Field id="countryCode" label="Country">
            <Input
              id="countryCode"
              defaultValue={basics.location.countryCode}
              onChange={(e) => setLocation({ countryCode: e.target.value })}
              autoComplete="country"
              placeholder="US"
            />
          </Field>
        </div>
      </fieldset>

      {lastError && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {lastError}
        </p>
      )}
    </form>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
