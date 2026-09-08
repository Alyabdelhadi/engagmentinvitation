/* =====================================================================
   Engagement invitation — single source of truth.
   Everything the couple might change lives here, in both languages:
   names, date, time, venue, location, the message, the RSVP wiring,
   the map link, the practical details and the story.
   ===================================================================== */

export type Language = "en" | "ar";
export type Text = Record<Language, string>;

export const invitation = {
  couple: {
    bride: { en: "Alaa Hasan",     ar: "آلاء حسن" } as Text,
    groom: { en: "Ali Abdelhadi",  ar: "علي عبد الهادي" } as Text,
    /* short forms for the big lettering */
    brideShort: { en: "Alaa", ar: "آلاء" } as Text,
    groomShort: { en: "Ali",  ar: "علي" } as Text
  },

  /* 16 Oct 2026 falls on a Friday — change every date field together. */
  date:     { en: "Friday, October 16, 2026",   ar: "الجمعة، ١٦ تشرين الأول ٢٠٢٦" } as Text,
  dateBig:  { en: "16 October 2026",            ar: "١٦ تشرين الأول ٢٠٢٦" } as Text,
  dateShort:{ en: "16 / 10 / 2026",             ar: "١٦ / ١٠ / ٢٠٢٦" } as Text,
  /* the moment the countdown runs to — doors open, Lebanon time (UTC+3 in October) */
  dateISO:  "2026-10-16T18:00:00+03:00",
  time:     { en: "6:00 PM",                    ar: "الساعة ٦:٠٠ مساءً" } as Text,
  entrance: { en: "7:00 PM",                    ar: "الساعة ٧:٠٠ مساءً" } as Text,
  venue:    { en: "Diamond Wedding Venue",      ar: "قاعة دايموند للأفراح" } as Text,
  dinner:   { en: "Dinner will be served",      ar: "يُقام العشاء" } as Text,
  location: { en: "Barja · Zarout, Lebanon",    ar: "برجا · زاروت، لبنان" } as Text,

  message: {
    en: "With love and joy, we invite you to celebrate our engagement with us.",
    ar: "بكل الحب والفرح، ندعوكم لمشاركتنا فرحة خطوبتنا."
  } as Text,

  invite: {
    head: { en: "Together with our families",  ar: "برفقة عائلتينا" } as Text,
    body: { en: "we invite you to celebrate this beautiful beginning with us over dinner.",
            ar: "ندعوكم لمشاركتنا الاحتفال بهذه البداية الجميلة على مأدبة عشاء." } as Text
  },

  story: {
    en: "It began quietly — a long table, a borrowed chair, a conversation that outlasted the evening. We have been finishing each other's sentences ever since, and now we would like to begin the rest of it in front of the people we love.",
    ar: "بدأت بهدوء — طاولة طويلة، وكرسي مستعار، وحديث امتدّ إلى ما بعد المساء. ومنذ ذلك الحين ونحن نكمل جُمل بعضنا البعض، واليوم نودّ أن نبدأ بقية الحكاية أمام من نحب."
  } as Text,

  rsvpPlate: {
    head: { en: "Kindly reply",     ar: "نرجو التكرّم بالردّ" } as Text,
    body: { en: "so we may keep a seat for you at our table.",
            ar: "كي نحفظ لكم مقعداً على طاولتنا." } as Text
  },

  closing: { en: "We can't wait to celebrate with you.",
             ar: "لا نطيق انتظار الاحتفال معكم." } as Text,

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
    mode: "script" as "script" | "form",
    endpoint: "",
    formFields: { name: "entry.000000000", guests: "entry.000000000" },
    maxGuests: 12
  },

  mapUrl: "https://www.google.com/maps/@33.8690048,35.5172352,10z",

  /* Practical notes — add or remove rows freely. `icon` picks a drawing. */
  details: [
    { icon: "door",   label: { en: "Doors open",   ar: "فتح الأبواب" },
      value: { en: "6:00 PM",                        ar: "الساعة ٦:٠٠ مساءً" } },
    { icon: "couple", label: { en: "Entrance",     ar: "دخول العروسين" },
      value: { en: "The couple arrive at 7:00 PM",   ar: "يدخل العروسان الساعة ٧:٠٠ مساءً" } },
    { icon: "dinner", label: { en: "Dinner",       ar: "العشاء" },
      value: { en: "Served during the evening",      ar: "يُقدَّم خلال السهرة" } },
    { icon: "dress",  label: { en: "Dress code",   ar: "الزي" },
      value: { en: "Formal · garden elegant",        ar: "رسمي · أناقة الحدائق" } },
    { icon: "car",    label: { en: "Parking",      ar: "الوقوف" },
      value: { en: "Valet at the main gate",         ar: "خدمة صف السيارات عند البوابة" } },
    { icon: "family", label: { en: "Family",       ar: "العائلة" },
      value: { en: "Together with our families",     ar: "برفقة عائلتينا" } }
  ] as { icon: DetailIcon; label: Text; value: Text }[]
};

export type DetailIcon = "door" | "couple" | "dinner" | "dress" | "car" | "family";

/* ---- UI chrome, one entry per string ---- */
export const ui = {
  en: {
    dir: "ltr", label: "English", switchTo: "العربية",
    siteTitle: "Our Engagement",
    kicker: "A journey of love begins",
    subKicker: "An engagement dinner · Lebanon · Autumn 2026",
    scrollHint: "Keep scrolling and RSVP",
    countdown: "Countdown", until: "Until", days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds",
    today: "Tonight's the night!",
    invitation: "The Invitation",
    theDate: "The Date", theCelebration: "The Celebration", theVenue: "The Venue",
    doorsOpen: "Doors open", entrance: "The couple arrive",
    mapButton: "Open in Maps",
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
    rsvpThanksAgain: "Reply again",
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
    scrollHint: "تابعوا التمرير وأكّدوا حضوركم",
    countdown: "العدّ التنازلي", until: "حتى", days: "يوم", hours: "ساعة", minutes: "دقيقة", seconds: "ثانية",
    today: "الليلة هي الليلة!",
    invitation: "الدعوة",
    theDate: "التاريخ", theCelebration: "الاحتفال", theVenue: "المكان",
    doorsOpen: "فتح الأبواب", entrance: "دخول العروسين",
    mapButton: "افتح في الخرائط",
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
    rsvpThanksAgain: "تعديل الردّ",
    rsvpErrName: "يرجى إدخال الاسم الكامل.",
    rsvpErrGuests: "يرجى تحديد عدد الحضور.",
    rsvpErrSend: "تعذّر الإرسال. يرجى المحاولة مرة أخرى.",
    rsvpOffline: "نموذج الردّ غير مُفعّل بعد.",
    withLove: "مع الحب",
    amp: "و",
    footer: "صُنع بحب لخطوبتنا"
  }
} as const satisfies Record<Language, Record<string, string>>;

export type UiStrings = (typeof ui)[Language];
