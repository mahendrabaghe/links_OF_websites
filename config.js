/* =========================================================
   config.js  —  EDIT ONLY THIS FILE TO CUSTOMIZE THE SITE
   ---------------------------------------------------------
   Every piece of text, image and link on the page comes from
   the object below. You never need to touch index.html.

   Anything left as a placeholder is simply hidden or rendered
   as a disabled "Add your …" card, so the site never shows a
   broken link.
   ========================================================= */

window.SITE_CONFIG = {
  /* ---------- 1. IDENTITY ---------- */
  name: 'Mahendra Baghel',
  title: 'ML & Data Engineer | python | Data Analyst',
  bio: 'Building intelligent solutions with AI, Machine Learning and Data Science.',
  location: 'Noida, India', // set to '' to hide

  /* ---------- 2. AVAILABILITY BADGE ---------- */
  availability: {
    show: true,
    text: 'Available for Opportunities'
  },

  /* ---------- 3. PROFILE PHOTO ----------
     Put your photo at assets/profile.jpeg (square, 600x600+ recommended).
     If the file is missing, a monogram avatar built from your name is
     shown automatically — nothing breaks.                             */
  profileImage: 'assets/profile.jpeg',

  /* ---------- 4. CONTACT ---------- */
  email: 'msb10102005@gmail.com', // used for the Email card + mailto social icon
  whatsapp: '+91 7828628592', // international format, digits and + only

  /* ---------- 5. MAIN LINK CARDS ----------
     `href` is the raw value. Leave a placeholder to hide the card.
     `tone` sets the accent colour of the icon tile.                 */
  cards: [
    {
      id: 'resume',
      label: 'Resume',
      description: 'View my full CV (PDF)',
      icon: 'document',
      tone: 'rose',
      href: 'assets/resume.pdf',
      action: 'open' // 'open' = new browser tab · 'download' = save the file
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      description: 'Projects, case studies & writing',
      icon: 'globe',
      tone: 'violet',
      href: 'https://mahendra-portfolio-flax.vercel.app/'
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      description: 'Professional network & experience',
      icon: 'linkedin',
      tone: 'sky',
      href: 'https://www.linkedin.com/in/mahendra-baghel-665989249/'
    },
    {
      id: 'github',
      label: 'GitHub',
      description: 'Open-source code & repositories',
      icon: 'github',
      tone: 'slate',
      href: 'https://github.com/mahendrabaghe'
    },

    {
      id: 'websites',
      label: 'My Websites',
      description: 'Explore my published websites',
      icon: 'globe',
      tone: 'teal',
      href: '#websites'
    },
    {
      id: 'kaggle',
      label: 'Kaggle',
      description: 'Competitions, notebooks & datasets',
      icon: 'kaggle',
      tone: 'blue',
      href: 'https://www.kaggle.com/mahendrabaghel07'
    },
    {
      id: 'email',
      label: 'Email',
      description: 'Get in touch — I reply within a day',
      icon: 'mail',
      tone: 'amber',
      href: 'mailto' // keyword: builds mailto: from `email` above
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      description: 'Chat with me instantly',
      icon: 'whatsapp',
      tone: 'green',
      href: 'wa.me' // keyword: builds wa.me link from `whatsapp` above
    }
  ],

  /* ---------- 6. PUBLISHED WEBSITES ----------
     Add one object per project. Leave this empty until you have a site to show.
     `image` is optional; missing or unavailable images use a built-in fallback. */
  websites: [
    {
      name: 'Connect-X',
      description: 'A modern responsive website .',
      url: 'https://mahendrabaghe.github.io/whtclon/',
      image: 'assets/project1.png'
    },

    {
      name: 'Easy-File-share',
      description: 'Scan and share your data .',
      url: 'https://mahendrabaghel78.github.io/aad/',
      image: 'assets/project2.png'
    },

    {
      name: 'My Digital Print Shop',
      description: 'Scan and share your data and print with users own device.',
      url: 'https://mahendrabaghe.github.io/qigital_print_qrr/admin',
      image: 'assets/project3.png'
    },

    {
      name: 'School student management system',
      description: 'A comprehensive solution for managing school student information.',
      url: 'https://mahendrabaghe.github.io/sch/',
      image: 'assets/project4.png'
    },

    {
      name: 'RAvan-Ai',
      description: 'An AI-powered platform for data analysis and insights.',
      url: 'https://mahendrabaghe.github.io/ravanai/',
      image: 'assets/project5.png'
    }
  ],

  /* ---------- 7. SMALL SOCIAL ICON ROW ----------
     Order here = order on the page. Placeholders are hidden. */
  socials: [
    { id: 'linkedin', icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/YOUR-PROFILE' },
    { id: 'github', icon: 'github', label: 'GitHub', href: 'https://github.com/YOUR-USERNAME' },
    { id: 'kaggle', icon: 'kaggle', label: 'Kaggle', href: 'https://www.kaggle.com/YOUR-USERNAME' },
    { id: 'mail', icon: 'mail', label: 'Email', href: 'mailto' },
    { id: 'whatsapp', icon: 'whatsapp', label: 'WhatsApp', href: 'wa.me' },
    { id: 'instagram', icon: 'instagram', label: 'Instagram', href: '' },
    { id: 'x', icon: 'x', label: 'X (Twitter)', href: '' },
    { id: 'youtube', icon: 'youtube', label: 'YouTube', href: '' }
  ],

  /* ---------- 8. THEME ---------- */
  theme: {
    default: 'dark', // 'dark' | 'light' — used on first visit only
    persist: true // remembers the visitor's choice in localStorage
  },

  /* ---------- 9. SEO ---------- */
  seo: {
    title: 'YOUR NAME | AI/ML Engineer & Python Developer',
    description:
      'All my professional links in one place — resume, GitHub, LinkedIn, Kaggle, portfolio and contact details.',
    url: 'https://YOUR-DOMAIN.com', // canonical + og:url
    ogImage: 'assets/profile.jpeg', // 1200x630 recommended
    twitterHandle: '@YOUR-HANDLE'
  },

  /* ---------- 10. FOOTER ---------- */
  footer: {
    year: 'auto', // 'auto' = current year, or set e.g. '2026'
    madeWithLove: true
  }
};
