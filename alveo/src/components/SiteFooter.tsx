import Link from 'next/link';
import { path, type Locale } from '@/i18n/routing';

export function SiteFooter({ locale }: { locale: Locale }) {
  const nl = locale === 'nl';
  return (
    <footer className="mt-20 border-t-2 border-ink no-print">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 font-mono text-[0.7rem] leading-relaxed text-faint">
        <div className="grid gap-6 md:grid-cols-3 max-w-4xl">
          <div>
            <p className="text-soft mb-1">{nl ? 'Over de getallen' : 'About the numbers'}</p>
            <p>
              {nl
                ? 'Vrijwel elk meelrecord hier staat als "geschat". Asgetallen zijn wettelijk vastgelegd en dus feiten; eiwit en maling van een specifieke zak zijn typische waarden voor een klasse. Doen alsof dat hetzelfde is, is precies de oneerlijkheid die dit product wil corrigeren.'
                : 'Almost every flour record here is marked "estimated". Ash bands are defined in law and are therefore facts; protein and milling for a given bag are typical values for a class. Pretending those are the same thing is exactly the dishonesty this product exists to correct.'}
            </p>
          </div>
          <div>
            <p className="text-soft mb-1">{nl ? 'Auteursrecht' : 'Copyright'}</p>
            <p>
              {nl
                ? 'Formules — ingrediënten, percentages, tijden, temperaturen — zijn feiten en niet auteursrechtelijk beschermd. De instructieteksten eromheen wel. Elke methodetekst op deze site is origineel geschreven; inspiratie wordt met naam en link vermeld.'
                : 'Formulas — ingredients, percentages, times, temperatures — are facts and are not copyrightable. The instructional prose around them is. Every word of method text on this site is written originally; inspiration is credited by name and link.'}
            </p>
          </div>
          <div>
            <p className="text-soft mb-1">{nl ? 'Voorbehoud' : 'Disclaimer'}</p>
            <p>
              {nl
                ? 'Fermentatietijden zijn richtlijnen, geen garanties: beoordeel het deeg, niet de klok. Recepten kunnen gluten, melk, ei en noten bevatten — controleer de ingrediënten bij allergieën.'
                : 'Fermentation timings are guidance, not guarantees: judge the dough, not the clock. Recipes may contain gluten, milk, egg and nuts — check the ingredients if you have allergies.'}
            </p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-rule flex flex-wrap gap-x-5 gap-y-1">
          <Link href={path('calibration', locale)} className="hover:text-accent">
            {nl ? 'Kalibratie' : 'Calibration'}
          </Link>
          <Link href={path('tools', locale)} className="hover:text-accent">
            {nl ? 'Gereedschap' : 'Tools'}
          </Link>
          <span>Alveo</span>
        </div>
      </div>
    </footer>
  );
}
