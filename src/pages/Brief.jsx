import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { IconBack } from '../components/Icons.jsx';
import { useT } from '../i18n/index.jsx';

// Judge-only Hackathon 2026 briefing — Arabic RTL, read-only.
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
      { key: 'customer',   label: 'العميل'         },
      { key: 'rider',      label: 'السائق'         },
      { key: 'dispatcher', label: 'مدير العمليات'  },
    ],
    seed: '6 سائقين · 5 طلبات تجريبية',
    outOfScope: ['تتبّع GPS حقيقي', 'دفعات حقيقية', 'تطبيق هاتف أصلي'],
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
      { key: 'patient', label: 'المريض' },
      { key: 'doctor',  label: 'الطبيب'  },
      { key: 'manager', label: 'المدير'  },
    ],
    seed: '6 أطباء · 6 حجوزات تجريبية',
    outOfScope: ['سجلات طبية حقيقية', 'تكامل التأمين الصحّي', 'إرسال SMS حقيقي'],
  },
];

const SUBMISSION_FIELDS = [
  { key: 'live_url',            label: 'رابط الموقع المباشر',          required: true,  hint: 'لا يُقبل localhost' },
  { key: 'repo_url',            label: 'رابط المستودع (GitHub/GitLab)', required: true,  hint: 'عام أو وصول للحكّام' },
  { key: 'db_schema_url',       label: 'مخطّط قاعدة البيانات',          required: true,  hint: 'صورة أو ملف SQL أو PDF' },
  { key: 'demo_accounts',       label: 'حسابات تجريبية لكل دور',        required: true,  hint: 'حساب واحد على الأقل لكل دور' },
  { key: 'tech_stack',          label: 'التقنيات المستخدمة',           required: true,  hint: 'Frontend · Backend · DB' },
  { key: 'deployment_platform', label: 'منصّة الاستضافة',              required: false, hint: 'Vercel · Netlify · Render …' },
];

const CRITERIA = [
  {
    n: 1,
    weight: 25,
    titleAr: 'فهم المشكلة وتلامس الإنسان',
    titleEn: 'Problem Understanding & Human Empathy',
    intentAr: 'هل الفريق فهم القصة الحقيقية وراء المشكلة؟ هل الحلّ يحترم الناس الموجودين فيها؟',
    bands: [
      { range: '21 – 25', label: 'ممتاز',    en: 'Excellent', descAr: 'أمسكوا التوتّر الأساسي في القصة (المراقبة مقابل الكرامة، الفعالية مقابل الإنسانية). الحلّ يحلّ المشكلة الحقيقية.' },
      { range: '16 – 20', label: 'جيد جداً', en: 'Very Good', descAr: 'فهموا المشكلة المعلَنة، الحلّ منطقي، لكن قد فاتهم بعض التفاصيل الإنسانية.' },
      { range: '11 – 15', label: 'مقبول',    en: 'Acceptable', descAr: 'حلّوا "المشكلة على الورق" بدون عمق.' },
      { range: '0 – 10',  label: 'ضعيف',     en: 'Weak',      descAr: 'بنوا شيئاً تقنياً لا علاقة له بالقصة، أو ناقضوا روحها.' },
    ],
  },
  {
    n: 2,
    weight: 20,
    titleAr: 'اكتمال الأدوار الثلاثة',
    titleEn: 'Three-Role Completeness',
    intentAr: 'كل سيناريو يحدّد ثلاثة أدوار. هل بنى الفريق تجربة كاملة لكل دور؟',
    bands: [
      { range: '17 – 20', label: 'ممتاز',    en: 'Excellent', descAr: 'الأدوار الثلاثة مبنية بعناية، كل واحد له واجهة مناسبة، التدفّق سلس بينها.' },
      { range: '13 – 16', label: 'جيد جداً', en: 'Very Good', descAr: 'كل الأدوار موجودة، لكن واحد منها أضعف.' },
      { range: '8 – 12',  label: 'مقبول',    en: 'Acceptable', descAr: 'اكتفوا بدورين، أو دور واحد متطوّر مع دورين سطحيين.' },
      { range: '0 – 7',   label: 'ضعيف',     en: 'Weak',      descAr: 'دور واحد فقط، أو الأدوار غير متمايزة فعلياً.' },
    ],
  },
  {
    n: 3,
    weight: 20,
    titleAr: 'جودة التنفيذ الـ Full-Stack',
    titleEn: 'Full-Stack Execution Quality',
    intentAr: 'هاكاثون Full-Stack — أربع طبقات مطلوبة: Frontend, Backend, Database, Deployment. غياب أيّ طبقة = العمل غير مكتمل.',
    bands: [
      { range: '17 – 20', label: 'ممتاز',    en: 'Excellent', descAr: 'الطبقات الأربع موجودة وتعمل: Frontend مستجيب، Backend بـ API نظيف، Database بمخطّط منطقي، نشر حيّ.' },
      { range: '13 – 16', label: 'جيد جداً', en: 'Very Good', descAr: 'الطبقات الأربع موجودة لكن واحدة أضعف (Backend في نفس مشروع Frontend، أو DB بدون indexes).' },
      { range: '8 – 12',  label: 'مقبول',    en: 'Acceptable', descAr: 'ثلاث طبقات فقط (front-only مع localStorage، أو front+back بدون نشر).' },
      { range: '0 – 7',   label: 'ضعيف',     en: 'Weak',      descAr: 'طبقتان أو أقل. أعطال خلال العرض، الكود لا يعمل خارج جهاز المتسابق.' },
    ],
  },
  {
    n: 4,
    weight: 15,
    titleAr: 'تصميم الواجهة والتجربة (UX/UI)',
    titleEn: 'UX/UI Design',
    intentAr: 'ليس عن الجمال البصري فقط — هل القرارات البصرية تخدم المحتوى؟',
    bands: [
      { range: '13 – 15', label: 'ممتاز',    en: 'Excellent', descAr: 'تصميم نظيف، تسلسل بصري واضح، تايبوغرافيا مدروسة، RTL مضبوط.' },
      { range: '9 – 12',  label: 'جيد جداً', en: 'Very Good', descAr: 'تصميم جيد بشكل عام لكن مع تفاصيل غير متّسقة.' },
      { range: '5 – 8',   label: 'مقبول',    en: 'Acceptable', descAr: 'اعتماد على bootstrap الافتراضي بدون لمسة خاصة.' },
      { range: '0 – 4',   label: 'ضعيف',     en: 'Weak',      descAr: 'تصميم فوضوي، صعب القراءة، أو يكسر RTL.' },
    ],
  },
  {
    n: 5,
    weight: 10,
    titleAr: 'العرض التقديمي والقصة',
    titleEn: 'Pitch & Storytelling',
    intentAr: 'هل الفريق يقدر يشرح القرارات؟ هل يجاوب على الأسئلة الصعبة؟',
    bands: [
      { range: '9 – 10', label: 'ممتاز',    en: 'Excellent', descAr: 'عرض واضح، قصة متماسكة، إجابات دقيقة، اعتراف بحدود الحلّ.' },
      { range: '7 – 8',  label: 'جيد جداً', en: 'Very Good', descAr: 'عرض جيد لكن فيه إطالة أو نقص.' },
      { range: '4 – 6',  label: 'مقبول',    en: 'Acceptable', descAr: 'ضعيف الترابط، يدخل في تفاصيل تقنية بدل القصة.' },
      { range: '0 – 3',  label: 'ضعيف',     en: 'Weak',      descAr: 'مرتبك، لا يقدر يشرح القرارات، يتجنّب الأسئلة.' },
    ],
  },
  {
    n: 6,
    weight: 10,
    titleAr: 'الإبداع والقرارات غير المتوقّعة',
    titleEn: 'Creativity & Unexpected Decisions',
    intentAr: 'هل قدّم الفريق فكرة لم نتوقّعها؟',
    bands: [
      { range: '9 – 10', label: 'ممتاز',    en: 'Excellent', descAr: 'ميزة أو قرار تصميمي مفاجئ، مبني فعلياً، يخدم المشكلة.' },
      { range: '7 – 8',  label: 'جيد جداً', en: 'Very Good', descAr: 'محاولة إبداعية واضحة لكن غير مكتملة.' },
      { range: '4 – 6',  label: 'مقبول',    en: 'Acceptable', descAr: 'تنفيذ تقليدي وآمن، بدون لحظة لافتة.' },
      { range: '0 – 3',  label: 'ضعيف',     en: 'Weak',      descAr: 'تنفيذ مقلَّد، أو "gimmick" لا يخدم المشكلة.' },
    ],
  },
];

const SCORING_RULES = [
  'كل حكم يقيّم كل معيار بشكل مستقل.',
  'النتيجة النهائية لكل معيار = متوسّط درجات الحكّام.',
  'إذا اختلف حكمان بأكثر من 20 نقطة على نفس المعيار، يتمّ النقاش قبل التثبيت.',
  'في حالة التعادل، المعيار رقم 1 (فهم المشكلة) هو الذي يحسم.',
];

const BAND_TONE = {
  'ممتاز':    { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-200' },
  'جيد جداً': { dot: 'bg-ieee',         text: 'text-ieee-700',    bg: 'bg-ieee-50',     border: 'border-ieee-100'    },
  'مقبول':    { dot: 'bg-accent',       text: 'text-amber-700',   bg: 'bg-amber-50',    border: 'border-amber-200'   },
  'ضعيف':     { dot: 'bg-petra',        text: 'text-petra-700',   bg: 'bg-petra-50',    border: 'border-petra-100'   },
};

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
              مرجع كامل للسيناريوهات الستة معايير ومتطلبات التسليم.
              مرئي للحكّام فقط، غير متاح للجمهور ولا للمشاركين.
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
                        f.required ? 'bg-petra-50 text-petra-700' : 'bg-slate-100 text-slate-600'
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

          {/* Six criteria with full rubric bands */}
          <section className="mt-16">
            <div className="flex items-baseline justify-between gap-4 mb-6">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                المعايير الستة
              </h2>
              <span className="text-xs font-semibold text-slate-500" dir="ltr">
                100 points total
              </span>
            </div>

            <div className="space-y-6">
              {CRITERIA.map((c) => (
                <article key={c.n} className="card-brut">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4">
                      <span className="badge-mono shrink-0" dir="ltr">
                        {String(c.n).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight leading-snug">
                          {c.titleAr}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-slate-500" dir="ltr">
                          {c.titleEn}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-extrabold text-4xl text-ieee leading-none">
                        {c.weight}<span className="text-slate-400 text-base font-semibold">%</span>
                      </div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-1" dir="ltr">
                        weight
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 text-slate-700 leading-relaxed">
                    <span className="font-semibold text-slate-900">القصد: </span>
                    {c.intentAr}
                  </p>

                  <div className="mt-5 grid sm:grid-cols-2 gap-3">
                    {c.bands.map((b) => {
                      const tone = BAND_TONE[b.label] ?? BAND_TONE['مقبول'];
                      return (
                        <div
                          key={b.label}
                          className={`rounded-xl border ${tone.border} ${tone.bg} p-4`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className={`inline-block w-2 h-2 rounded-full ${tone.dot}`} />
                              <span className={`font-bold text-base ${tone.text}`}>{b.label}</span>
                              <span className="text-xs text-slate-500" dir="ltr">· {b.en}</span>
                            </div>
                            <span className="font-mono text-xs font-semibold text-slate-600" dir="ltr">
                              {b.range}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-slate-700 leading-relaxed">{b.descAr}</p>
                        </div>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Scoring rules */}
          <section className="mt-16">
            <div className="mb-6">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                قواعد التقييم
              </h2>
            </div>
            <div className="card-brut">
              <ol className="space-y-3">
                {SCORING_RULES.map((rule, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="badge-mono shrink-0 mt-0.5" dir="ltr">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-slate-700 leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Footer note */}
          <section className="mt-16 mb-8">
            <div className="rounded-2xl bg-ieee-50/50 border border-ieee-100 p-5 text-sm text-slate-700 leading-relaxed">
              <strong className="font-semibold text-ieee-700">ملاحظة للحكّام: </strong>
              صفحة التقييم الحالية في المنصة تستخدم 4 معايير كل واحد من 25 نقطة
              (الابتكار · التنفيذ · العرض · الأثر). هذه الصفحة هي المرجع
              المعتمد لمعايير هاكاثون 2026 الستة — اقرأها قبل أن تبدأ
              تقييم الفرق، وضع الدرجات في صفحة التقييم بناءً على فهمك
              لهذه المعايير.
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
