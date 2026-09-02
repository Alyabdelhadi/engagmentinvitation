/* =====================================================================
   Engagement invitation — single source of truth.
   Loaded by both the canonical page and the plate renderer, so the
   artwork and the DOM can never drift apart.  Edit only this file to
   customise the invitation.
   ===================================================================== */
(function (root) {

const invitation = {
  couple: {
    bride: { en: "Alaa Hasan",     ar: "آلاء حسن" },
    groom: { en: "Ali Abdelhadi",  ar: "علي عبد الهادي" }
  },

  /* 16 Oct 2026 falls on a Friday — change both halves together. */
  date:     { en: "Friday, October 16, 2026",   ar: "الجمعة، ١٦ تشرين الأول ٢٠٢٦" },
  dateBig:  { en: "16 October 2026",            ar: "١٦ تشرين الأول ٢٠٢٦" },
  time:     { en: "6:00 PM",                    ar: "الساعة ٦:٠٠ مساءً" },
  entrance: { en: "7:00 PM",                    ar: "الساعة ٧:٠٠ مساءً" },
  venue:    { en: "Diamond Wedding Venue",      ar: "قاعة دايموند للأفراح" },
  dinner:   { en: "Dinner will be served",      ar: "يُقام العشاء" },
  location: { en: "Barja · Zarout, Lebanon",    ar: "برجا · زاروت، لبنان" },

  message: {
    en: "With love and joy, we invite you to celebrate our engagement with us.",
    ar: "بكل الحب والفرح، ندعوكم لمشاركتنا فرحة خطوبتنا."
  },

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
    mode: "script",
    endpoint: "",
    formFields: { name: "entry.000000000", guests: "entry.000000000" },
    maxGuests: 12
  },

  mapUrl: "https://www.google.com/maps/@33.8690048,35.5172352,10z",

  /* Practical notes for plate 07 — add or remove rows freely. */
  details: [
    { label: { en: "Doors open",   ar: "فتح الأبواب" },
      value: { en: "6:00 PM",                        ar: "الساعة ٦:٠٠ مساءً" } },
    { label: { en: "Entrance",     ar: "دخول العروسين" },
      value: { en: "The couple arrive at 7:00 PM",   ar: "يدخل العروسان الساعة ٧:٠٠ مساءً" } },
    { label: { en: "Dinner",       ar: "العشاء" },
      value: { en: "Served during the evening",      ar: "يُقدَّم خلال السهرة" } },
    { label: { en: "Dress code",   ar: "الزي" },
      value: { en: "Formal · garden elegant",        ar: "رسمي · أناقة الحدائق" } },
    { label: { en: "Parking",      ar: "الوقوف" },
      value: { en: "Valet at the main gate",         ar: "خدمة صف السيارات عند البوابة" } },
    { label: { en: "Family",       ar: "العائلة" },
      value: { en: "Together with our families",     ar: "برفقة عائلتينا" } }
  ]
};

/* ---- the nine plates.  `art` selects a motif in the renderer. ---- */
const plates = [
  { id: "cover",       art: "cover",
    title: { en: "Our Engagement",   ar: "خطوبتنا" },
    place: { en: "Plate I",          ar: "اللوحة الأولى" } },

  { id: "invitation",  art: "sprig",
    title: { en: "The Invitation",   ar: "الدعوة" },
    place: { en: "Plate II",         ar: "اللوحة الثانية" },
    head:  { en: "Together with our families",  ar: "برفقة عائلتينا" },
    body:  { en: "we invite you to celebrate this beautiful beginning with us over dinner.",
             ar: "ندعوكم لمشاركتنا الاحتفال بهذه البداية الجميلة على مأدبة عشاء." } },

  { id: "date",        art: "wreath",
    title: { en: "The Date",         ar: "التاريخ" },
    place: { en: "Plate III",        ar: "اللوحة الثالثة" } },

  { id: "celebration", art: "rings",
    title: { en: "The Celebration",  ar: "الاحتفال" },
    place: { en: "Plate IV",         ar: "اللوحة الرابعة" },
    note:  { en: "Dinner will be served",  ar: "يُقام العشاء" } },

  { id: "story",       art: "photo", photo: "couple-photo-1.png", tilt: -2.4,
    title: { en: "Our Story",        ar: "قصتنا" },
    place: { en: "Plate V",          ar: "اللوحة الخامسة" },
    body:  { en: "It began quietly — a long table, a borrowed chair, a conversation that outlasted the evening. We have been finishing each other's sentences ever since, and now we would like to begin the rest of it in front of the people we love.",
             ar: "بدأت بهدوء — طاولة طويلة، وكرسي مستعار، وحديث امتدّ إلى ما بعد المساء. ومنذ ذلك الحين ونحن نكمل جُمل بعضنا البعض، واليوم نودّ أن نبدأ بقية الحكاية أمام من نحب." } },

  { id: "venue",       art: "arch",
    title: { en: "The Venue",        ar: "المكان" },
    place: { en: "Plate VI",         ar: "اللوحة السادسة" } },

  { id: "details",     art: "olive",
    title: { en: "The Details",      ar: "التفاصيل" },
    place: { en: "Plate VII",        ar: "اللوحة السابعة" } },

  { id: "rsvp",        art: "envelope",
    title: { en: "RSVP",             ar: "تأكيد الحضور" },
    place: { en: "Plate VIII",       ar: "اللوحة الثامنة" },
    head:  { en: "Kindly reply",     ar: "نرجو التكرّم بالردّ" },
    body:  { en: "so we may keep a seat for you at our table.",
             ar: "كي نحفظ لكم مقعداً على طاولتنا." } },

  { id: "closing",     art: "photo", photo: "couple-photo-2.png", tilt: 2.1,
    title: { en: "With Love",        ar: "مع الحب" },
    place: { en: "Plate IX",         ar: "اللوحة التاسعة" },
    head:  { en: "We can't wait to celebrate with you.",
             ar: "لا نطيق انتظار الاحتفال معكم." } }
];

/* ---- UI chrome, one entry per string ---- */
const translations = {
  en: {
    dir: "ltr", lang: "en", label: "English",
    siteTitle: "Our Engagement",
    kicker: "An engagement dinner · Lebanon · Autumn 2026",
    hint: "Drag the page to turn · Drag the glass across it",
    hintTouch: "Swipe the page to turn",
    prevPage: "previous page", nextPage: "next page",
    viewControls: "view controls", zoomIn: "zoom in", zoomOut: "zoom out",
    magnifier: "magnifier", scrollDown: "scroll to the invitation",
    navInvitation: "Invitation", navStory: "Our Story", navDetails: "Details", navRsvp: "RSVP",
    aboutLabel: "The Invitation",
    platesLabel: "Plates",
    detailsLabel: "Details",
    rsvpLabel: "RSVP",
    rsvpBody: "We would be honoured to have you with us. Kindly confirm your attendance.",
    rsvpButton: "Confirm Attendance",
    rsvpName: "Full name",
    rsvpNamePlaceholder: "Your full name",
    rsvpGuests: "Number of guests",
    rsvpSending: "Sending…",
    rsvpThanks: "Thank you — your seat is saved.",
    rsvpThanksAgain: "Reply again",
    rsvpErrName: "Please enter your full name.",
    rsvpErrGuests: "Please give the number of guests.",
    rsvpErrSend: "That didn't send. Please try again.",
    rsvpOffline: "The reply form is not connected yet.",
    mapButton: "Open in Maps",
    joinUs: "Join us",
    amp: "&",
    footer: "With love"
  },
  ar: {
    dir: "rtl", lang: "ar", label: "العربية",
    siteTitle: "خطوبتنا",
    kicker: "عشاء خطوبة · لبنان · خريف ٢٠٢٦",
    hint: "اسحب الصفحة لتقليبها · حرّك العدسة فوقها",
    hintTouch: "اسحبوا الصفحة لتقليبها",
    prevPage: "الصفحة السابقة", nextPage: "الصفحة التالية",
    viewControls: "أدوات العرض", zoomIn: "تكبير", zoomOut: "تصغير",
    magnifier: "عدسة مكبّرة", scrollDown: "انتقل إلى الدعوة",
    navInvitation: "الدعوة", navStory: "قصتنا", navDetails: "التفاصيل", navRsvp: "تأكيد الحضور",
    aboutLabel: "الدعوة",
    platesLabel: "اللوحات",
    detailsLabel: "التفاصيل",
    rsvpLabel: "تأكيد الحضور",
    rsvpBody: "يشرّفنا حضوركم معنا. نرجو التكرّم بتأكيد الحضور.",
    rsvpButton: "تأكيد الحضور",
    rsvpName: "الاسم الكامل",
    rsvpNamePlaceholder: "اسمكم الكامل",
    rsvpGuests: "عدد الحضور",
    rsvpSending: "جارٍ الإرسال…",
    rsvpThanks: "شكراً لكم — تم حفظ مقاعدكم.",
    rsvpThanksAgain: "تعديل الردّ",
    rsvpErrName: "يرجى إدخال الاسم الكامل.",
    rsvpErrGuests: "يرجى تحديد عدد الحضور.",
    rsvpErrSend: "تعذّر الإرسال. يرجى المحاولة مرة أخرى.",
    rsvpOffline: "نموذج الردّ غير مُفعّل بعد.",
    mapButton: "افتح في الخرائط",
    joinUs: "شاركونا",
    amp: "و",
    footer: "مع الحب"
  }
};

const api = { invitation: invitation, plates: plates, translations: translations };
if (typeof module === "object" && module.exports) module.exports = api;
root.INVITATION = api;

})(typeof globalThis !== "undefined" ? globalThis : this);
