import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { IconBack } from '../components/Icons.jsx';
import { useT } from '../i18n/index.jsx';

// Judge-only Hackathon 2026 briefing — Arabic, RTL, read-only.
// Protected at the route level by <RequireJudge>. No DB writes.

const SCENARIOS = [
  {
    n: '01',
    slug: 'yalla-wassel',
    name: 'يلا وصّل',
    nameLatin: 'Yalla Wassel',
    domain: 'لوجستيات — توصيل في اليوم نفسه — عمّان',
    domainTag: 'Logistics',
    centralProblem:
      'ابنِ نظاماً يحاسب سائقي التوصيل على التسليم في الوقت المحدّد وبشكل كامل، بدون أن يحوّل يوم عملهم إلى سجن. الثقة لازم تمشي بالاتجاهين.',
    roles: [
      { key: 'customer',   label: 'العميل'      },
      { key: 'rider',      label: 'السائق'      },
      { key: 'dispatcher', label: 'مدير العمليات' },
    ],
    seed: '6 سائقين · 5 طلبات تجريبية',
    outOfScope: [
      'تتبّع GPS حقيقي',
      'دفعات حقيقية',
      'تطبيق هاتف أصلي',
    ],
  },
  {
    n: '03',
    slug: 'sehha-plus',
    name: 'صحّة بلَس',
    nameLatin: 'Sehha Plus',
    domain: 'رعاية صحية — شبكة 4 عيادات — الصويفية',
    domainTag: 'Healthcare',
    centralProblem:
      'قلّل نسبة الـ no-show بدون أن تجعل المريض يحسّ أنه يُعاقَب. الحلول السهلة — الرسوم، الحظر، التهديد — خارج الطاولة.',
    roles: [
      { key: 'patient', label: 'المريض'  },
      { key: 'doctor',  label: 'الطبيب'   },
      { key: 'manager', label: 'المدير'   },
    ],
    seed: '6 أطباء · 6 حجوزات تجريبية',
    outOfScope: [
      'سجلات طبية حقيقية',
      'تكامل التأمين الصحّي',
      'إرسال SMS حقيقي',
    ],
  },
];

const CRITERIA = [
  { n: 1, title: 'فهم المشكلة وتلامس الإنسان', weight: 25 },
  { n: 2, title: 'اكتمال الأدوار الثلاثة',    weight: 20 },
  { n: 3, title: 'جودة التنفيذ الـ Full-Stack', weight: 20 },
  { n: 4, title: 'تصميم الواجهة والتجربة (UX/UI)', weight: 15 },
  { n: 5, title: 'العرض التقديمي والقصة',       weight: 10 },
  { n: 6, title: 'الإبداع والقرارات غير المتوقّعة', weight: 10 },
];

const SUBMISSION_FIELDS = [
  { key: 'live_url',            label: 'رابط الموقع المباشر',        required: true,  hint: 'لا يُقبل localhost' },
  { key: 'repo_url',            label: 'رابط المستودع (GitHub/GitLab)', required: true,  hint: 'عام أو وصول للحكّام' },
  { key: 'db_schema_url',       label: 'مخطّط قاعدة البيانات',         required: true,  hint: 'صورة أو ملف SQL أو PDF' },
  { key: 'demo_accounts',       label: 'حسابات تجريبية لكل دور',       required: true,  hint: 'حساب واحد على الأقل لكل دور' },
  { key: 'tech_stack',          label: 'التقنيات المستخدمة',          required: true,  hint: 'Frontend · Backend · DB' },
  { key: 'deployment_platform', label: 'منصّة الاستضافة',             required: false, hint: 'Vercel · Netlify · Render …' },
];

const RUBRIC_BANDS = [
  { label: 'ممتاز',    range: '90 – 100%' },
  { label: 'جيد جداً', range: '70 – 89%'  },
  { label: 'مقبول',    range: '50 – 69%'  },
  { label: 'ضعيف',     range: '0 – 49%'   },
];

export default function Brief() {
  const { t } = useT();

  // Force RTL on this page regardless of the global language toggle —
  // the scenario content is Arabic and must be read RTL.
  return (
    <Layout status={t.status.signedInPrefix}>
      <div dir="rtl" lang="ar" className="font-arabic">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
          {/* Back link */}
          <Link
            to="/judge"
            dir="ltr"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 hover:text-ieee"
          >
            <IconBack width="16" height="16" /> back to judge desk
          </Link>

          {/* Hero */}
          <div className="mt-8">
            <div className="badge-mono inline-flex" dir="ltr">
              HACKATHON 2026 · JUDGE BRIEF
            </div>
            <h1 className="mt-4 font-display font-extrabold text-5xl sm:text-6xl leading-tight tracking-tight text-slate-900">
              ملف <span className="text-ieee">الحَكَم</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-2xl">
              مرجع سريع للسيناريوهات الستة معايير ومتطلبات التسليم.
              مرئي للحكّام فقط، غير متاح للجمهور أو للمشاركين.
            </p>
          </div>

          {/* Scenarios */}
          <section className="mt-12">
            <div className="flex items-baseline justify-between gap-4 mb-6">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                السيناريوهات
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                يختار الفريق سيناريو واحدًا
              </span>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              {SCENARIOS.map((s) => (
                <article key={s.slug} className="card-brut">
                  <div className="flex items-start justify-between gap-3">
                    <span className="badge-mono" dir="ltr">{s.n} · {s.domainTag}</span>
                    <span className="text-xs font-semibold text-slate-400" dir="ltr">{s.nameLatin}</span>
                  </div>
                  <h3 className="mt-4 font-display font-extrabold text-3xl text-slate-900 tracking-tight">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">{s.domain}</p>

                  <div className="mt-6">
                    <div className="eyebrow mb-2">المشكلة المركزية</div>
                    <p className="text-slate-700 leading-relaxed">{s.centralProblem}</p>
                  </div>

                  <div className="mt-6">
                    <div className="eyebrow mb-2">الأدوار الثلاثة</div>
                    <ul className="flex flex-wrap gap-2">
                      {s.roles.map((r) => (
                        <li key={r.key} className="badge-mono">{r.label}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    <div className="eyebrow mb-2">بيانات أولية</div>
                    <p className="text-sm font-semibold text-slate-700">{s.seed}</p>
                  </div>

                  <div className="mt-6">
                    <div className="eyebrow mb-2">خارج النطاق</div>
                    <ul className="space-y-1 text-sm text-slate-600">
                      {s.outOfScope.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-petra font-bold mt-0.5">×</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Submission requirements */}
          <section className="mt-16">
            <div className="flex items-baseline justify-between gap-4 mb-6">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                متطلبات التسليم
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                Full-Stack · أربع طبقات
              </span>
            </div>
            <div className="card-brut">
              <ul className="divide-y divide-slate-100">
                {SUBMISSION_FIELDS.map((f) => (
                  <li key={f.key} className="py-3 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{f.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{f.hint}</div>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        f.required
                          ? 'bg-petra-50 text-petra-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {f.required ? 'إلزامي' : 'اختياري'}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                المعيار رقم 3 (التنفيذ الـ Full-Stack) يقيّم أربع طبقات:
                واجهة أمامية مستجيبة، API منفصل، قاعدة بيانات حقيقية،
                وموقع منشور بشكل مباشر. تأكّد من فتح الرابط المباشر
                وفتح المستودع قبل وضع الدرجة.
              </p>
            </div>
          </section>

          {/* Criteria reference */}
          <section className="mt-16">
            <div className="flex items-baseline justify-between gap-4 mb-6">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                المعايير الستة
              </h2>
              <span className="text-xs font-semibold text-slate-500" dir="ltr">
                Reference · 100 points total
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {CRITERIA.map((c) => (
                <div key={c.n} className="card-brut">
                  <div className="flex items-start justify-between gap-3">
                    <span className="badge-mono" dir="ltr">{String(c.n).padStart(2, '0')}</span>
                    <span className="font-display font-extrabold text-3xl text-ieee leading-none">
                      {c.weight}<span className="text-slate-400 text-base font-semibold">%</span>
                    </span>
                  </div>
                  <h3 className="mt-4 font-display font-bold text-xl text-slate-900 leading-snug">
                    {c.title}
                  </h3>
                </div>
              ))}
            </div>

            {/* Rubric bands */}
            <div className="mt-8 card-brut">
              <div className="eyebrow mb-3">سُلّم التقييم لكل معيار</div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {RUBRIC_BANDS.map((b) => (
                  <div key={b.label} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="font-display font-extrabold text-lg text-slate-900">{b.label}</div>
                    <div className="mt-1 text-xs font-mono text-slate-500" dir="ltr">{b.range}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer note */}
          <section className="mt-16 mb-8">
            <div className="rounded-2xl bg-ieee-50/50 border border-ieee-100 p-5 text-sm text-slate-700 leading-relaxed">
              <strong className="font-semibold text-ieee-700">ملاحظة للحكّام:</strong>{' '}
              صفحة التقييم الحالية تستخدم 4 معايير (الابتكار · التنفيذ ·
              العرض · الأثر) كل واحد من 25 نقطة. هذه الصفحة مرجع
              للسيناريوهات والمعايير الستة المعتمدة لهاكاثون 2026 — استخدمها
              للقراءة فقط قبل أن تبدأ تقييم الفرق.
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
