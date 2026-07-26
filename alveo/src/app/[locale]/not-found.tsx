import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20">
      <h1 className="text-4xl font-semibold tracking-tight">Niet gevonden · Not found</h1>
      <p className="mt-3 text-soft prose-measure">
        Deze pagina bestaat niet. Misschien zocht je een meelsoort of een vergelijking die we nog niet
        hebben — laat het weten, dan zetten we hem erbij.
      </p>
      <p className="mt-2 text-soft prose-measure">
        This page does not exist. Perhaps you were after a flour or a comparison we do not have yet —
        tell us and we will add it.
      </p>
      <p className="mt-6">
        <Link href="/nl" className="text-accent underline underline-offset-2">Alveo</Link>
      </p>
    </div>
  );
}
