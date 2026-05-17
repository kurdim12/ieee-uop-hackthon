import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import {
  IconBuild,
  IconShip,
  IconSpark,
  IconArrow,
  IconBolt,
} from '../components/Icons.jsx';

const TRACKS = [
  {
    icon: IconSpark,
    title: 'WILD IDEAS',
    body:
      'AI agents, weird hardware hacks, civic tools, anything that makes a professor raise an eyebrow. Originality is the currency here.',
  },
  {
    icon: IconBuild,
    title: 'SOLID BUILDS',
    body:
      'A working demo beats a deck. Show the API call, click the button, ship the bug. Half-finished is fine — pretend-finished is not.',
  },
  {
    icon: IconShip,
    title: 'CLEAR PITCHES',
    body:
      'Five minutes to convince four judges. Tell us the problem, the build, the moment of truth, and what happens next. No filler.',
  },
];

const TIMELINE = [
  ['08:00', 'Doors open, coffee, team check-in at the front desk.'],
  ['09:00', 'Opening keynote and challenge brief. Clocks start.'],
  ['13:00', 'Lunch and the optional API workshop in Lab 2.'],
  ['18:00', 'Code freeze. Push to main. No more npm installs.'],
  ['18:30', 'Demos begin. Five minutes per team, two minutes Q&A.'],
  ['21:00', 'Leaderboard locks. Winners on the main stage.'],
];

const CRITERIA = [
  {
    n: '01',
    title: 'INNOVATION & ORIGINALITY',
    weight: 25,
    desc: 'Is the idea novel? Does it solve a real problem in a fresh way?',
    look: 'Look for new angles, not new logos.',
  },
  {
    n: '02',
    title: 'TECHNICAL EXECUTION',
    weight: 25,
    desc: 'Quality of build, working demo, technical depth.',
    look: 'Look for the moment the code actually runs.',
  },
  {
    n: '03',
    title: 'PRESENTATION & COMMUNICATION',
    weight: 25,
    desc: 'Clarity of pitch, demo flow, ability to explain.',
    look: 'Look for a story you can repeat to your roommate.',
  },
  {
    n: '04',
    title: 'IMPACT & FEASIBILITY',
    weight: 25,
    desc: 'Real-world potential, scalability, viability.',
    look: 'Look for the day-two question: would anyone use this?',
  },
];

export default function Landing() {
  return (
    <Layout status="OPEN">
      {/* HERO */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 pb-20">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="eyebrow mb-6">
                <span className="text-ieee">IEEE</span> · <span className="text-petra">UNIVERSITY OF PETRA STUDENT BRANCH</span> PRESENTS · DEMO DAY 2026
              </div>
              <h1 className="font-display font-black tracking-[-0.03em] leading-[0.85] text-[16vw] sm:text-[14vw] lg:text-[10.5rem]">
                BUILD.<br />SHIP.<br />
                <span className="italic text-ieee">JUDGE.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg sm:text-xl text-ink/80">
                One day. One room. One leaderboard. The IEEE UoP Student
                Branch hackathon — bring a team, bring a build, leave with
                a verdict. We are not here for slide decks; we are here
                for the moment the demo works.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/submit" className="btn-primary">
                  Submit your idea <IconArrow width="20" height="20" />
                </Link>
                <Link to="/leaderboard" className="btn-ghost">
                  View leaderboard
                </Link>
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="card-brut p-6 bg-paper-dark">
                <div className="eyebrow mb-3">AT A GLANCE</div>
                <dl className="space-y-3">
                  <div className="flex items-baseline justify-between border-b border-ink/30 pb-2">
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-ink/70">
                      Teams
                    </dt>
                    <dd className="font-display italic font-black text-4xl">
                      24
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between border-b border-ink/30 pb-2">
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-ink/70">
                      Judges
                    </dt>
                    <dd className="font-display italic font-black text-4xl">
                      03
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between border-b border-ink/30 pb-2">
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-ink/70">
                      Criteria
                    </dt>
                    <dd className="font-display italic font-black text-4xl">
                      04
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-ink/70">
                      Max score
                    </dt>
                    <dd className="font-display italic font-black text-4xl">
                      100
                    </dd>
                  </div>
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
            <div className="eyebrow mb-3">§ 01</div>
            <h2 className="font-display font-black text-5xl sm:text-6xl leading-none">
              THE<br />
              <span className="italic">CHALLENGE</span>
            </h2>
          </div>
          <div className="lg:col-span-8">
            <p className="text-xl sm:text-2xl leading-snug">
              Build something that <em className="font-display italic">did
              not exist this morning.</em> Pick a real problem on campus, in
              your city, or in a corner of the internet nobody is looking
              at, and ship the smallest useful version of a fix. Use any
              stack you like. Use AI if it helps. Use a notebook and a
              microcontroller if that helps more.
            </p>
            <p className="mt-6 text-base text-ink/70 max-w-2xl">
              Replace this copy with your own challenge brief before the
              event. The block is intentionally short — judges read it
              before scoring.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT TO BUILD */}
      <section className="section-rule bg-paper-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <div className="eyebrow mb-3">§ 02</div>
              <h2 className="font-display font-black text-5xl sm:text-6xl leading-none">
                WHAT TO <span className="italic">BUILD</span>
              </h2>
            </div>
            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-ink/70 max-w-xs">
              Three tracks. Pick one. Or ignore all three and surprise us.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TRACKS.map((t) => (
              <div key={t.title} className="card-brut p-6 bg-paper flex flex-col">
                <t.icon className="text-ieee mb-4" />
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/70">
                  Track
                </div>
                <div className="font-display font-black text-3xl mt-1 leading-tight">
                  {t.title}
                </div>
                <p className="mt-4 text-ink/80">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RULES & TIMELINE */}
      <section className="section-rule">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="eyebrow mb-3">§ 03</div>
            <h2 className="font-display font-black text-5xl sm:text-6xl leading-none">
              RULES &<br />
              <span className="italic">TIMELINE</span>
            </h2>
            <p className="mt-6 text-ink/70 max-w-sm">
              The clock is a feature, not a bug. Hit every checkpoint and
              we will keep the coffee coming.
            </p>
          </div>
          <ol className="lg:col-span-8 space-y-4">
            {TIMELINE.map(([time, label], i) => (
              <li
                key={time}
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
                § 04
              </div>
              <h2 className="font-display font-black text-5xl sm:text-7xl leading-[0.9]">
                JUDGING<br />
                <span className="italic text-ieee">CRITERIA</span>
              </h2>
            </div>
            <div className="flex items-center gap-3 font-mono uppercase tracking-[0.18em] text-xs text-paper/70">
              <IconBolt className="text-ieee" /> 25 + 25 + 25 + 25 = 100
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {CRITERIA.map((c) => (
              <div
                key={c.n}
                className="border-2 border-paper bg-ink p-6 shadow-[6px_6px_0_0_#ff6b1a]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="font-mono text-[12px] uppercase tracking-[0.22em] text-paper/70">
                    {c.n}
                  </div>
                  <div className="font-display italic font-black text-ieee text-5xl leading-none">
                    {c.weight}
                    <span className="text-paper/60 text-2xl"> pts</span>
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
            STILL <span className="italic text-ieee">HERE?</span>
          </h2>
          <p className="mt-6 text-ink/70 max-w-xl mx-auto">
            Lock in your team, write a one-line project pitch, and we will
            see you in the room.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/submit" className="btn-primary">
              Submit your idea
            </Link>
            <Link to="/login" className="btn-ghost">
              Judge login
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
