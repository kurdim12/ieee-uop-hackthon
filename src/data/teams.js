// Hardcoded fallback for the 10 Hackathon 2026 submissions.
// IDs are stable and match supabase/seed-real-teams.sql — so when a
// judge scores a team, the team_id sent to the scores table matches a
// real row in the teams table (assuming the seed SQL has been run).

export const HACKATHON_TEAMS = [
  {
    id: 'a0000001-0000-4000-8000-000000000001',
    team_name: 'Microwave-Cover',
    project_title: 'Yalla-Wassel',
    members: '—',
    project_desc:
      'Yalla Wassel is a trust-centered same-day delivery platform designed to improve accountability without relying on intrusive surveillance. Built for delivery teams, drivers, customers, and dispatchers, the platform replaces constant tracking with transparent delivery checkpoints, fair workload distribution, timeline-based updates, and mutual trust mechanisms.',
    github_url: 'https://github.com/anasmutlaq123-ship-it/yalla-wassel/',
    deck_url: 'https://drive.google.com/u/0/open?usp=forms_web&id=1bJSKQJjc_CGNtWCtRwcwc7okQAUsNg2i',
  },
  {
    id: 'a0000001-0000-4000-8000-000000000002',
    team_name: 'V60 Coders',
    project_title: 'Yalla Wassel',
    members: '—',
    project_desc:
      'We built Yalla Wassel, a gamified logistics platform providing "accountability without surveillance". Replacing intrusive GPS tracking with a Trust Score architecture, drivers self-report updates to earn points and rank on leaderboards. The system includes a real-time dispatcher dashboard for operational oversight and a GPS-free customer tracking interface. It turns delivery into a reward-based competition to boost driver retention and efficiency.',
    github_url: 'https://github.com/MohammedBelalTaharwah/yalla-wassel-',
    deck_url: 'https://drive.google.com/u/0/open?usp=forms_web&id=1mXgB4_RDdr4hQIE8K4Uzinu-BrngdqRD',
  },
  {
    id: 'a0000001-0000-4000-8000-000000000003',
    team_name: 'beitlahemmovement',
    project_title: 'sehha plus',
    members: '—',
    project_desc:
      'Sehha Plus is a premium, serverless medical booking portal and patient dashboard. Built with Next.js and Supabase PostgreSQL, it enables patients to securely log in via OTP, explore clinics, and dynamically book, cancel, or reschedule appointments in real-time.',
    github_url: 'https://github.com/anzehjenin/DR-AHMADS-CLINIC',
    deck_url: 'https://drive.google.com/u/0/open?usp=forms_web&id=1uWeluN_gxAY8gKhU1ov2tLhjpMSjcE1Q',
  },
  {
    id: 'a0000001-0000-4000-8000-000000000004',
    team_name: 'خليها على ال ai',
    project_title: 'يلا وصل',
    members: '—',
    project_desc:
      'Live: https://do-it-sahles123awad.replit.app/login\n\nيلا وصل — نظام إدارة توصيل ذكي مبني خصيصاً للسوق الأردني. المنصة تربط ثلاثة أطراف في تجربة واحدة متكاملة: المدير الذي يرى كل الطلبات ويوزعها بذكاء، السائق الذي يستلم مهامه بوضوح ويحدّث حالتها بنقرة، والزبون الذي يتابع طلبيته لحظة بلحظة عبر رابط مباشر بدون تسجيل. يلا وصل يغطي جميع مناطق الأردن بالتفصيل من شوارع عمّان إلى المحافظات، مع نظام تقييم للسائقين ونقاط مكافأة.',
    github_url: 'https://github.com/sahles123awad-cmd/H',
    deck_url: 'https://drive.google.com/u/0/open?usp=forms_web&id=1aMIiewESti2vAHS081WBKntrbOTidGdO',
  },
  {
    id: 'a0000001-0000-4000-8000-000000000005',
    team_name: 'L2',
    project_title: 'yalla wassel',
    members: '—',
    project_desc:
      'A dispatching system that solves GPS problem for delivery company.',
    github_url: 'https://github.com/Le0291/yalla-wassel-trustops.git',
    deck_url: 'https://drive.google.com/u/0/open?usp=forms_web&id=1v_ma6OSmKW0YMShStrwXIHV59PNy9PkE',
  },
  {
    id: 'a0000001-0000-4000-8000-000000000006',
    team_name: 'digital monds',
    project_title: 'sehha plus',
    members: '—',
    project_desc:
      'Sehha Plus is a smart clinic management system for a 4-clinic network in Amman. It lets patients book and cancel appointments freely, doctors manage their daily schedules, and clinic managers track no-show rates with real-time analytics — all without punishing patients for missed appointments.',
    github_url: 'https://github.com/motasemalzaatreh/sehha-plus-',
    deck_url: 'https://drive.google.com/u/0/open?usp=forms_web&id=1wPzI0Mxjj2w7yKftdSlu4A9Ze12PfN2F',
  },
  {
    id: 'a0000001-0000-4000-8000-000000000007',
    team_name: 'DeepCoders',
    project_title: 'صحة بلس',
    members: '—',
    project_desc:
      '"صحّة بلَس" (Sehat Plus) هو نظام طبي تكافلي ذكي، يهدف إلى حل واحدة من أكبر مشاكل إدارة العيادات الطبية وهي تغيب المرضى عن مواعيدهم بصمت (No-Show Rate) والتي تصل نسبتها عالمياً ومحلياً إلى حوالي 31%.\n\nالفلسفة الجوهرية (التعاطف بدلاً من العقاب): بدلاً من معاقبة المرضى مادياً بالغرامات أو حظرهم من النظام عند التأخر أو التغيب، يفترض النظام حسن النية ويستخدم التعاطف والتكافل الاجتماعي كأداة تنظيمية.\n\nالركائز الثلاث:\n1) التأخير المرن (Flex-Delay): بضغطة زر يبلّغ المريض العيادة أنه متأخر فيُعاد جدولة الطبيب ديناميكياً.\n2) التبرع بالموعد (Slot Donation): يمنح المريض موعده لقائمة الانتظار ويحصل على نقاط أولوية لحجزه القادم.\n3) قائمة الأمل (Hope List): قائمة انتظار ذكية تطابق الموعد المُتبرَّع به مع المريض المناسب وترسل SMS فوراً.\n\nالأثر المتوقع: خفض No-Show من 31% إلى أقل من 5%، رفع إنتاجية الأطباء +25%، وتعزيز الرضا بنسبة 100%.',
    github_url: 'https://github.com/BilalMasafeh/Hackathon',
    deck_url: 'https://drive.google.com/u/0/open?usp=forms_web&id=16To-OuhebxrVy7sGt7Gbzjpv4YyJbYwi',
  },
  {
    id: 'a0000001-0000-4000-8000-000000000008',
    team_name: 'Lillies',
    project_title: 'Sehha Plus',
    members: '—',
    project_desc:
      'Sehha Plus is a smart clinic booking system that reduces no-shows without punishment.\n\nPatients can cancel or reschedule in one click. When a slot becomes free, a smart waitlist instantly offers it to another patient. Doctors manage schedules easily, and managers track clinic performance.\n\nIt also includes positive rewards for on-time visits and optionally uses Google Calendar to suggest better appointment times.',
    github_url: 'https://github.com/esraaAlkhatib/se7a.git',
    deck_url: 'https://drive.google.com/u/0/open?usp=forms_web&id=18qSlujerm7990s2AUdfMWTctMUHKoxC4',
  },
  {
    id: 'a0000001-0000-4000-8000-000000000009',
    team_name: 'بدران',
    project_title: 'يلا وصل',
    members: '—',
    project_desc:
      'Yalla Wassel is a web-based delivery management system for small same-day delivery businesses in Amman. It solves the problem of managing drivers through WhatsApp, shouting, and paper notes by creating a clear digital workflow for orders, drivers, customers, and dispatchers. Trust-based accountability without GPS surveillance. Three users: customer, driver, dispatcher.\n\nLive: https://linen-tarsier-978622.hostingersite.com/',
    github_url: 'https://linen-tarsier-978622.hostingersite.com/',
    deck_url: 'https://drive.google.com/u/0/open?usp=forms_web&id=1QkxZmCIz6JGvw6lWt1OxI312UrjGxdnR',
  },
  {
    id: 'a0000001-0000-4000-8000-000000000010',
    team_name: 'CHAINX',
    project_title: 'sehha plus',
    members: '—',
    project_desc:
      'Sehha Plus is a scheduling platform that solves a 31% clinic no-show rate through empathy instead of penalties.\n- Guilt-Free Cancellations: a 30-minute reminder lets patients cancel without feeling punished.\n- Community Routing: canceled appointments are instantly reassigned to waitlisted patients.\n- Consistency Rewards: patients earn points for attending or providing cancellation notice, unlocking priority booking.\n\nLive app: https://urchin-app-x6wf5.ondigitalocean.app/',
    github_url: 'https://github.com/EyadGH1/CHAINX',
    deck_url: 'https://drive.google.com/u/0/open?usp=forms_web&id=1mBYnkQR3dADlr9f2st7HDc2NpfLY9fNN',
  },
];

export function findHardcodedTeam(teamId) {
  return HACKATHON_TEAMS.find((t) => t.id === teamId) || null;
}
