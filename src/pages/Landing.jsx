import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import {
  IconBuild,
  IconShip,
  IconSpark,
  IconArrow,
  IconBolt,
} from '../components/Icons.jsx';
import { useT } from '../i18n/index.jsx';

const TRACK_ICONS = [IconSpark, IconBuild, IconShip];

export default function Landing() {
  const { t } = useT();
  const L = t.landing;

  return (
    <Layout status={t.status.open}>
      {/* HERO */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 pb-20">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="eyebrow mb-6">{L.eyebrow}</div>
              <h1 className="font-display font-black tracking-[-0.03em] leading-[0.85] text-[16vw] sm:text-[14vw] lg:text-[10.5rem]">
                {L.headline[0]}<br />{L.headline[1]}<br />
                <span className="italic text-ieee">{L.headline[2]}</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg sm:text-xl text-ink/80">{L.subhead}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/submit" className="btn-primary">
                  {L.ctaSubmit} <IconArrow width="20" height="20" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="card-brut p-6 bg-paper-dark">
                <div className="eyebrow mb-3">{L.glance.title}</div>
                <dl className="space-y-3">
                  <Glance label={L.glance.teams} value="24" />
                  <Glance label={L.glance.judges} value="03" />
                  <Glance label={L.glance.criteria} value="04" />
                  <Glance label={L.glance.maxScore} value="100" last />
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE CHALLENGE */}
      <section className="section-rule">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="eyebrow mb-3">{L.challenge.eyebrow}</div>
            <h2 className="font-display font-black text-5xl sm:text-6xl leading-none">
              {L.challenge.titleA}
              {L.challenge.titleB && <><br /><span className="italic">{L.challenge.titleB}</span></>}
            </h2>
          </div>
          <div className="lg:col-span-8">
            <p className="text-xl sm:text-2xl leading-snug">{L.challenge.body}</p>
            <p className="mt-6 text-base text-ink/70 max-w-2xl">{L.challenge.footnote}</p>
          </div>
        </div>
      </section>

      {/* WHAT TO BUILD */}
      <section className="section-rule bg-paper-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <div className="eyebrow mb-3">{L.tracks.eyebrow}</div>
              <h2 className="font-display font-black text-5xl sm:text-6xl leading-none">
                {L.tracks.titleA} <span className="italic">{L.tracks.titleB}</span>
              </h2>
            </div>
            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-ink/70 max-w-xs">
              {L.tracks.caption}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {L.tracks.items.map((track, i) => {
              const Icon = TRACK_ICONS[i] ?? IconBolt;
              return (
                <div key={i} className="card-brut p-6 bg-paper flex flex-col">
                  <Icon className="text-ieee mb-4" />
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/70">
                    {L.tracks.trackLabel}
                  </div>
                  <div className="font-display font-black text-3xl mt-1 leading-tight">
                    {track.title}
                  </div>
                  <p className="mt-4 text-ink/80">{track.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RULES & TIMELINE */}
      <section className="section-rule">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="eyebrow mb-3">{L.timeline.eyebrow}</div>
            <h2 className="font-display font-black text-5xl sm:text-6xl leading-none">
              {L.timeline.titleA}<br />
              <span className="italic">{L.timeline.titleB}</span>
            </h2>
            <p className="mt-6 text-ink/70 max-w-sm">{L.timeline.sub}</p>
          </div>
          <ol className="lg:col-span-8 space-y-4">
            {L.timeline.items.map(([time, label], i) => (
              <li
                key={i}
                className="flex items-start gap-6 border-b-2 border-ink/20 pb-4"
              >
                <span className="font-mono font-bold text-2xl tabular-nums w-20 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-ieee font-bold text-2xl tabular-nums w-24 shrink-0">
                  {time}
                </span>
                <span className="text-lg leading-snug">{label}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* JUDGING CRITERIA */}
      <section className="section-rule bg-ink text-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-20">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-paper/60 mb-3">
                {L.criteria.eyebrow}
              </div>
              <h2 className="font-display font-black text-5xl sm:text-7xl leading-[0.9]">
                {L.criteria.titleA}<br />
                <span className="italic text-ieee">{L.criteria.titleB}</span>
              </h2>
            </div>
            <div className="flex items-center gap-3 font-mono uppercase tracking-[0.18em] text-xs text-paper/70">
              <IconBolt className="text-ieee" /> {L.criteria.formula}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {L.criteria.items.map((c) => (
              <div
                key={c.n}
                className="border-2 border-paper bg-ink p-6 shadow-[6px_6px_0_0_#00629B]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="font-mono text-[12px] uppercase tracking-[0.22em] text-paper/70">
                    {c.n}
                  </div>
                  <div className="font-display italic font-black text-ieee text-5xl leading-none">
                    25
                    <span className="text-paper/60 text-2xl"> {L.criteria.ptsLabel}</span>
                  </div>
                </div>
                <div className="font-display font-black text-3xl mt-4 leading-tight">
                  {c.title}
                </div>
                <p className="mt-3 text-paper/80">{c.desc}</p>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ieee">
                  {c.look}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-rule">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-20 text-center">
          <h2 className="font-display font-black text-6xl sm:text-8xl leading-none">
            {L.finalCta.titleA} <span className="italic text-ieee">{L.finalCta.titleB}</span>
          </h2>
          <p className="mt-6 text-ink/70 max-w-xl mx-auto">{L.finalCta.sub}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/submit" className="btn-primary">
              {L.finalCta.ctaSubmit}
            </Link>
            <Link to="/login" className="btn-ghost">
              {L.finalCta.ctaLogin}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Glance({ label, value, last }) {
  return (
    <div className={`flex items-baseline justify-between ${last ? '' : 'border-b border-ink/30 pb-2'}`}>
      <dt className="font-mono text-[11px] uppercase tracking-wider text-ink/70">{label}</dt>
      <dd className="font-display italic font-black text-4xl">{value}</dd>
    </div>
  );
}
