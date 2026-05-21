-- ============================================================
-- Seed the 10 real team submissions from the Hackathon 2026 form.
-- IDs match src/data/teams.js so client-side scoring inserts work.
-- Idempotent: ON CONFLICT (id) DO NOTHING — safe to re-run.
-- ============================================================

INSERT INTO teams (id, team_name, members, project_title, project_desc, github_url, deck_url) VALUES
  (
    'a0000001-0000-4000-8000-000000000001',
    'Microwave-Cover', '—', 'Yalla-Wassel',
    $$Yalla Wassel is a trust-centered same-day delivery platform designed to improve accountability without relying on intrusive surveillance. Built for delivery teams, drivers, customers, and dispatchers, the platform replaces constant tracking with transparent delivery checkpoints, fair workload distribution, timeline-based updates, and mutual trust mechanisms.$$,
    'https://github.com/anasmutlaq123-ship-it/yalla-wassel/',
    'https://drive.google.com/u/0/open?usp=forms_web&id=1bJSKQJjc_CGNtWCtRwcwc7okQAUsNg2i'
  ),
  (
    'a0000001-0000-4000-8000-000000000002',
    'V60 Coders', '—', 'Yalla Wassel',
    $$We built Yalla Wassel, a gamified logistics platform providing "accountability without surveillance". Replacing intrusive GPS tracking with a Trust Score architecture, drivers self-report updates to earn points and rank on leaderboards. The system includes a real-time dispatcher dashboard for operational oversight and a GPS-free customer tracking interface. It turns delivery into a reward-based competition to boost driver retention and efficiency.$$,
    'https://github.com/MohammedBelalTaharwah/yalla-wassel-',
    'https://drive.google.com/u/0/open?usp=forms_web&id=1mXgB4_RDdr4hQIE8K4Uzinu-BrngdqRD'
  ),
  (
    'a0000001-0000-4000-8000-000000000003',
    'beitlahemmovement', '—', 'sehha plus',
    $$Sehha Plus is a premium, serverless medical booking portal and patient dashboard. Built with Next.js and Supabase PostgreSQL, it enables patients to securely log in via OTP, explore clinics, and dynamically book, cancel, or reschedule appointments in real-time.$$,
    'https://github.com/anzehjenin/DR-AHMADS-CLINIC',
    'https://drive.google.com/u/0/open?usp=forms_web&id=1uWeluN_gxAY8gKhU1ov2tLhjpMSjcE1Q'
  ),
  (
    'a0000001-0000-4000-8000-000000000004',
    'خليها على ال ai', '—', 'يلا وصل',
    $$Live: https://do-it-sahles123awad.replit.app/login

يلا وصل — نظام إدارة توصيل ذكي مبني خصيصاً للسوق الأردني. المنصة تربط ثلاثة أطراف: المدير الذي يرى كل الطلبات ويوزعها بذكاء، السائق الذي يستلم مهامه بوضوح ويحدّث حالتها بنقرة، والزبون الذي يتابع طلبيته لحظة بلحظة عبر رابط مباشر بدون تسجيل. يلا وصل يغطي جميع مناطق الأردن مع نظام تقييم للسائقين ونقاط مكافأة.$$,
    'https://github.com/sahles123awad-cmd/H',
    'https://drive.google.com/u/0/open?usp=forms_web&id=1aMIiewESti2vAHS081WBKntrbOTidGdO'
  ),
  (
    'a0000001-0000-4000-8000-000000000005',
    'L2', '—', 'yalla wassel',
    $$A dispatching system that solves GPS problem for delivery company.$$,
    'https://github.com/Le0291/yalla-wassel-trustops.git',
    'https://drive.google.com/u/0/open?usp=forms_web&id=1v_ma6OSmKW0YMShStrwXIHV59PNy9PkE'
  ),
  (
    'a0000001-0000-4000-8000-000000000006',
    'digital monds', '—', 'sehha plus',
    $$Sehha Plus is a smart clinic management system for a 4-clinic network in Amman. It lets patients book and cancel appointments freely, doctors manage their daily schedules, and clinic managers track no-show rates with real-time analytics — all without punishing patients for missed appointments.$$,
    'https://github.com/motasemalzaatreh/sehha-plus-',
    'https://drive.google.com/u/0/open?usp=forms_web&id=1wPzI0Mxjj2w7yKftdSlu4A9Ze12PfN2F'
  ),
  (
    'a0000001-0000-4000-8000-000000000007',
    'DeepCoders', '—', 'صحة بلس',
    $$"صحّة بلَس" (Sehat Plus) هو نظام طبي تكافلي ذكي، يهدف إلى حل واحدة من أكبر مشاكل إدارة العيادات الطبية وهي تغيب المرضى عن مواعيدهم بصمت (No-Show Rate) والتي تصل نسبتها عالمياً ومحلياً إلى 31%.

الفلسفة: التعاطف بدلاً من العقاب. بدلاً من معاقبة المرضى مادياً بالغرامات أو حظرهم، يفترض النظام حسن النية ويستخدم التعاطف والتكافل الاجتماعي.

الركائز الثلاث:
1) التأخير المرن (Flex-Delay)
2) التبرع بالموعد (Slot Donation)
3) قائمة الأمل (Hope List)

الأثر المتوقع: خفض No-Show من 31% إلى أقل من 5%، رفع إنتاجية الأطباء +25%.$$,
    'https://github.com/BilalMasafeh/Hackathon',
    'https://drive.google.com/u/0/open?usp=forms_web&id=16To-OuhebxrVy7sGt7Gbzjpv4YyJbYwi'
  ),
  (
    'a0000001-0000-4000-8000-000000000008',
    'Lillies', '—', 'Sehha Plus',
    $$Sehha Plus is a smart clinic booking system that reduces no-shows without punishment. Patients can cancel or reschedule in one click. When a slot becomes free, a smart waitlist instantly offers it to another patient. Doctors manage schedules easily, and managers track clinic performance. Positive rewards for on-time visits + optional Google Calendar suggestion.$$,
    'https://github.com/esraaAlkhatib/se7a.git',
    'https://drive.google.com/u/0/open?usp=forms_web&id=18qSlujerm7990s2AUdfMWTctMUHKoxC4'
  ),
  (
    'a0000001-0000-4000-8000-000000000009',
    'بدران', '—', 'يلا وصل',
    $$Yalla Wassel is a web-based delivery management system for small same-day delivery businesses in Amman. Trust-based accountability without GPS surveillance. Three users: customer, driver, dispatcher. Drivers update statuses manually: Picked Up, On the Way, Delivered.

Live: https://linen-tarsier-978622.hostingersite.com/$$,
    'https://linen-tarsier-978622.hostingersite.com/',
    'https://drive.google.com/u/0/open?usp=forms_web&id=1QkxZmCIz6JGvw6lWt1OxI312UrjGxdnR'
  ),
  (
    'a0000001-0000-4000-8000-000000000010',
    'CHAINX', '—', 'sehha plus',
    $$Sehha Plus is a scheduling platform that solves a 31% clinic no-show rate through empathy instead of penalties.
- Guilt-Free Cancellations: a 30-minute reminder lets patients cancel without feeling punished.
- Community Routing: canceled appointments are instantly reassigned to waitlisted patients.
- Consistency Rewards: patients earn points for attending or providing cancellation notice, unlocking priority booking.

Live app: https://urchin-app-x6wf5.ondigitalocean.app/$$,
    'https://github.com/EyadGH1/CHAINX',
    'https://drive.google.com/u/0/open?usp=forms_web&id=1mBYnkQR3dADlr9f2st7HDc2NpfLY9fNN'
  )
ON CONFLICT (id) DO NOTHING;

-- Verify
SELECT id, team_name FROM teams ORDER BY id;
SELECT COUNT(*) AS team_count FROM teams;
