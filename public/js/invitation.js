/* =====================================================================
   Engagement invitation — single source of truth.
   Everything the couple might change lives here, in both languages:
   names, date, time, venue, location, the message, the RSVP wiring,
   the map link, the practical details and the story.
   ===================================================================== */

const INVITATION = {
  couple: {
    bride: { en: "Alaa Hassan",     ar: "آلاء حسن" },
    groom: { en: "Ali Abdelhadi",  ar: "علي عبد الهادي" },
    /* short forms for the big lettering */
    brideShort: { en: "Alaa", ar: "آلاء" },
    groomShort: { en: "Ali",  ar: "علي" }
  },

  /* 16 Oct 2026 falls on a Friday — change every date field together. */
  date:      { en: "Friday, October 16, 2026",   ar: "الجمعة، ١٦ تشرين الأول ٢٠٢٦" },
  dateBig:   { en: "16 October 2026",            ar: "١٦ تشرين الأول ٢٠٢٦" },
  dateShort: { en: "16 / 10 / 2026",             ar: "١٦ / ١٠ / ٢٠٢٦" },
  /* the pieces of the big date block */
  dateParts: {
    en: { weekday: "Friday",  day: "16", month: "October",     year: "2026" },
    ar: { weekday: "الجمعة",  day: "١٦", month: "تشرين الأول", year: "٢٠٢٦" }
  },
  /* the moment the countdown runs to — doors open, Lebanon time (UTC+3 in October) */
  dateISO:    "2026-10-16T18:00:00+03:00",
  /* end of the evening, for the calendar entry */
  dateEndISO: "2026-10-16T23:00:00+03:00",
  time:     { en: "6:00 PM",                    ar: "الساعة ٦:٠٠ مساءً" },
  venue:    { en: "Diamond Wedding Venue",      ar: "قاعة دايموند للأفراح" },
  dinner:   { en: "Dinner will be served",      ar: "يُقام العشاء" },
  location: { en: "Barja · Zarout, Lebanon",    ar: "برجا · زاروت، لبنان" },

  message: {
    en: "With love and joy, we invite you to celebrate our engagement with us.",
    ar: "بكل الحب والفرح، ندعوكم لمشاركتنا فرحة خطوبتنا."
  },

  invite: {
    head: { en: "Together with our families",  ar: "برفقة عائلتينا" },
    body: { en: "we invite you to celebrate this beautiful beginning with us over dinner.",
            ar: "ندعوكم لمشاركتنا الاحتفال بهذه البداية الجميلة على مأدبة عشاء." }
  },

  story: {
    en: "It began quietly — a long table, a borrowed chair, a conversation that outlasted the evening. We have been finishing each other's sentences ever since, and now we would like to begin the rest of it in front of the people we love.",
    ar: "بدأت بهدوء — طاولة طويلة، وكرسي مستعار، وحديث امتدّ إلى ما بعد المساء. ومنذ ذلك الحين ونحن نكمل جُمل بعضنا البعض، واليوم نودّ أن نبدأ بقية الحكاية أمام من نحب."
  },

  rsvpPlate: {
    head: { en: "Kindly reply",     ar: "نرجو التكرّم بالردّ" },
    body: { en: "so we may keep a seat for you at our table.",
            ar: "كي نحفظ لكم مقعداً على طاولتنا." }
  },

  closing: { en: "We can't wait to celebrate with you.",
             ar: "لا نطيق انتظار الاحتفال معكم." },

  /* what the calendar entry is called */
  eventTitle: { en: "Engagement of Ali & Alaa", ar: "خطوبة علي وآلاء" },

  /* ------------------------------------------------------------------
     RSVP.  The form is answered on the page itself and posted straight to
     a Google Sheet.  Two ways to wire it up — see README:

       mode "script"  endpoint = an Apps Script web-app /exec URL.
                      Deploy tools/rsvp/Code.gs against your sheet.
       mode "form"    endpoint = a Google Form .../formResponse URL, with
                      the entry ids of its two questions.

     Leave `endpoint` empty and the form explains it is not connected yet
     rather than pretending to send.
     ------------------------------------------------------------------ */
  rsvp: {
    mode: "script",           // "script" | "form"
    endpoint: "https://script.google.com/macros/s/AKfycbxFRFgqxwX3oBO1x8Ubijc7_Nx7M8CPZZRN5kNrCms2C1vFJ6JmaJewQEPgyP5ZZvPQ/exec",
    formFields: { name: "entry.000000000", guests: "entry.000000000" },
    maxGuests: 12
  },

  mapUrl: "https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg70gEINjI4NmowajeoAgiwAgE&um=1&ie=UTF-8&fb=1&gl=lb&sa=X&geocode=KZ93ZS4A4x4VMXqpGEZmrBzU&daddr=JCXC%2BF44%D8%8C+%D8%A8%D8%B1%D8%AC%D8%A7",

  /* Practical notes — add or remove rows freely. */
  details: [
    { icon: "dress",  label: { en: "Dress code",   ar: "الزي" },
      value: { en: "Formal · garden elegant",        ar: "رسمي · أناقة الحدائق" } },
    { icon: "car",    label: { en: "Parking",      ar: "الوقوف" },
      value: { en: "Valet at the main gate",         ar: "خدمة صف السيارات عند البوابة" } }
  ]
};

/* ---- UI chrome, one entry per string ---- */
const UI = {
  en: {
    dir: "ltr", label: "English", switchTo: "العربية",
    siteTitle: "Our Engagement",
    kicker: "A journey of love begins",
    subKicker: "An engagement dinner · Lebanon · Autumn 2026",
    countdown: "Countdown", until: "Until the doors open", days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec",
    today: "Tonight's the night!",
    joinUs: "Join us for the engagement party of",
    scrollHint: "Scroll to open the doors",
    sound: "Music",
    keepScrolling: "Keep scrolling",
    seaCaption: "By the sea, in Barja",
    invitation: "The Invitation",
    theDate: "The Date", theCelebration: "The Celebration", theVenue: "The Venue",
    doorsOpen: "Doors open",
    mapButton: "Open in Maps",
    addGoogle: "Google Calendar", addApple: "Apple / Outlook",
    theDetails: "The Details",
    ourStory: "Our Story",
    rsvp: "RSVP",
    rsvpBody: "We would be honoured to have you with us. Kindly confirm your attendance.",
    rsvpButton: "Confirm Attendance",
    rsvpName: "Full name",
    rsvpNamePlaceholder: "Your full name",
    rsvpGuests: "Number of guests",
    rsvpFewer: "fewer guests", rsvpMore: "more guests",
    rsvpSending: "Sending…",
    rsvpThanks: "Thank you — your seat is saved.",
    rsvpErrName: "Please enter your full name.",
    rsvpErrGuests: "Please give the number of guests.",
    rsvpErrSend: "That didn't send. Please try again.",
    rsvpOffline: "The reply form is not connected yet.",
    withLove: "With love",
    amp: "&",
    footer: "Made with love for our engagement"
  },
  ar: {
    dir: "rtl", label: "العربية", switchTo: "English",
    siteTitle: "خطوبتنا",
    kicker: "رحلة حب تبدأ",
    subKicker: "عشاء خطوبة · لبنان · خريف ٢٠٢٦",
    countdown: "العدّ التنازلي", until: "حتى فتح الأبواب", days: "يوم", hours: "ساعة", minutes: "دقيقة", seconds: "ثانية",
    today: "الليلة هي الليلة!",
    joinUs: "انضموا إلينا في حفل خطوبة",
    scrollHint: "مرّروا لفتح الأبواب",
    sound: "الموسيقى",
    keepScrolling: "تابعوا التمرير",
    seaCaption: "على شاطئ البحر، في برجا",
    invitation: "الدعوة",
    theDate: "التاريخ", theCelebration: "الاحتفال", theVenue: "المكان",
    doorsOpen: "فتح الأبواب",
    mapButton: "افتح في الخرائط",
    addGoogle: "تقويم Google", addApple: "Apple / Outlook",
    theDetails: "التفاصيل",
    ourStory: "قصتنا",
    rsvp: "تأكيد الحضور",
    rsvpBody: "يشرّفنا حضوركم معنا. نرجو التكرّم بتأكيد الحضور.",
    rsvpButton: "تأكيد الحضور",
    rsvpName: "الاسم الكامل",
    rsvpNamePlaceholder: "اسمكم الكامل",
    rsvpGuests: "عدد الحضور",
    rsvpFewer: "عدد أقل", rsvpMore: "عدد أكثر",
    rsvpSending: "جارٍ الإرسال…",
    rsvpThanks: "شكراً لكم — تم حفظ مقاعدكم.",
    rsvpErrName: "يرجى إدخال الاسم الكامل.",
    rsvpErrGuests: "يرجى تحديد عدد الحضور.",
    rsvpErrSend: "تعذّر الإرسال. يرجى المحاولة مرة أخرى.",
    rsvpOffline: "نموذج الردّ غير مُفعّل بعد.",
    withLove: "مع الحب",
    amp: "و",
    footer: "صُنع بحب لخطوبتنا"
  }
};
