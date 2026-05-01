import type { Locale } from "./i18n";

type NavItem = {
  label: string;
  href: string;
};

type Dictionary = {
  brand: string;
  company: string;
  nav: NavItem[];
  home: {
    title: string;
    text: string;
    primary: string;
    secondary: string;
    introTitle: string;
    introText: string;
    servicesTitle: string;
    services: {
      title: string;
      text: string;
    }[];
    featuredTitle: string;
    featuredText: string;
    ctaTitle: string;
    ctaText: string;
  };
  about: {
    title: string;
    paragraphs: string[];
  };
  projects: {
    title: string;
    text: string;
    categories: string;
  };
  fitout: {
    title: string;
    text1: string;
    text2: string;
    subheading: string;
  };
  contact: {
    title: string;
    text: string;
    form: {
      name: string;
      phone: string;
      email: string;
      message: string;
      submit: string;
    };
    info: string;
    whatsapp: string;
    instagram: string;
  };
  footer: {
    text: string;
  };
  whatsappMessage: string;
};

export const dictionary: Record<Locale, Dictionary> = {
  tr: {
    brand: "Hauzart",
    company: "Fikrim Var İç Mimarlık",
    nav: [
      { label: "Ana Sayfa", href: "/" },
      { label: "Biz Kimiz", href: "/about" },
      { label: "Projeler", href: "/projects" },
      { label: "Fitout Management", href: "/fitout-management" },
      { label: "İletişim", href: "/contact" }
    ],
    home: {
      title: "Mekânlara estetik, işlev ve karakter kazandırıyoruz.",
      text: "Hauzart olarak konut, ofis ve ticari alanlar için iç mimari tasarım, uygulama ve fitout management hizmetleri sunuyoruz. Her projede ihtiyaçları doğru analiz ederek zamansız ve işlevsel yaşam alanları kurguluyoruz.",
      primary: "Projeleri İncele",
      secondary: "İletişime Geç",
      introTitle: "Tasarımın ötesinde, bütüncül bir proje yaklaşımı",
      introText: "Her mekânın kendi kimliği olduğuna inanıyoruz. Bu anlayışla, estetik kararları işlevsellik ve uygulama disipliniyle birleştirerek her projeyi özgün bir bakış açısıyla ele alıyoruz.Malzeme seçiminden renk paletine, aydınlatma kurgusundan detay çözümlerine kadar tüm süreçleri bir bütün olarak değerlendiriyor; tasarımın yalnızca görsel değil, aynı zamanda deneyimsel bir değer taşımasını hedefliyoruz. Proje sürecinde şeffaf iletişim ve titiz planlama ile ilerleyerek, her aşamada sürdürülebilir, uygulanabilir ve uzun ömürlü çözümler sunuyoruz. Böylece ortaya çıkan her iş, yalnızca bir mekân değil; kullanıcıyla bağ kuran, yaşayan ve zamana uyum sağlayan bir tasarım haline geliyor.",
      servicesTitle: "Hizmetler",
      services: [
        {
          title: "İç Mimari Tasarım",
          text: "Kullanıcı ihtiyaçlarına ve mekânın potansiyeline göre özgün iç mekân çözümleri geliştiriyoruz."
        },
        {
          title: "Uygulama Süreci",
          text: "Tasarım kararlarının sahada doğru ve kontrollü şekilde hayata geçirilmesini sağlıyoruz."
        },
        {
          title: "Fitout Management",
          text: "Projenin uygulama ve koordinasyon süreçlerini planlayarak tüm aşamaları düzenli şekilde yönetiyoruz."
        }
      ],
      featuredTitle: "Seçili Projeler",
      featuredText: "Farklı ölçeklerde geliştirdiğimiz projelerden seçilmiş örnekleri inceleyin.",
      ctaTitle: "Projenizi birlikte şekillendirelim",
      ctaText: "Yeni bir yaşam alanı, çalışma ortamı ya da ticari mekân için bize ulaşın. İhtiyacınıza uygun süreci birlikte planlayalım."
    },
    about: {
      title: "Biz Kimiz",
      paragraphs: [
        "Hauzart, iç mimariyi yalnızca estetik bir düzenleme olarak değil, yaşamı ve kullanım deneyimini doğrudan etkileyen bütüncül bir süreç olarak ele alır.",
        "Her projede mekânın ihtiyaçlarını, kullanıcı beklentilerini ve uygulama gerçekliğini birlikte değerlendirerek dengeli çözümler üretir.",
        "Amacımız, sadece iyi görünen değil; doğru çalışan, sürdürülebilir ve karakter sahibi mekânlar oluşturmaktır."
      ]
    },
    projects: {
      title: "Projeler",
      text: "Farklı ölçek ve ihtiyaçlara göre geliştirdiğimiz iç mimari projelerden seçilmiş örnekler.",
      categories: "Konut · Ofis · Ticari Alan"
    },
    fitout: {
      title: "Fitout Management",
      text1: "Fitout management, tasarımın uygulamaya eksiksiz ve kontrollü şekilde aktarılmasını sağlayan yönetim sürecidir.",
      text2: "Bu yaklaşım sayesinde proje sürecinde zaman, kalite ve uygulama disiplini korunurken; tasarım kararlarının sahada doğru şekilde karşılık bulması sağlanır.",
      subheading: "Planlama, koordinasyon ve uygulama kontrolü"
    },
    contact: {
      title: "İletişim",
      text: "Projeniz hakkında konuşmak, hizmetlerimiz hakkında bilgi almak ya da iş birliği için bizimle iletişime geçebilirsiniz.",
      form: {
        name: "Ad Soyad",
        phone: "Telefon",
        email: "E-posta",
        message: "Mesaj",
        submit: "Gönder"
      },
      info: "ADRES: Beştepe mahallesi mertebe sokak 4/1 yenimahalle ankara. Instagram üzerinden çalışmalarımızı inceleyebilir,İletişim formu yada telefon üzerinden doğrudan bizimle iletişime geçebilirsiniz.",
      instagram: "Instagram’a Git"
    },
    footer: {
      text: "İç mimari tasarım, uygulama ve fitout management."
    },
    whatsappMessage: "Merhaba, Hauzart ile bir proje hakkında görüşmek istiyorum."
  },
  en: {
    brand: "Hauzart",
    company: "Fikrim Var Interior Architecture",
    nav: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Fitout Management", href: "/fitout-management" },
      { label: "Contact", href: "/contact" }
    ],
    home: {
      title: "We bring aesthetics, function and character into spaces.",
      text: "At Hauzart, we provide interior design, implementation and fitout management services for residential, office and commercial spaces. In every project, we analyze needs carefully and create timeless, functional environments.",
      primary: "View Projects",
      secondary: "Contact Us",
      introTitle: "A holistic approach beyond design",
      introText: "We believe every space has its own identity. With this perspective, we combine aesthetics with functionality and execution discipline, approaching each project with a unique design vision.",
      servicesTitle: "Services",
      services: [
        {
          title: "Interior Design",
          text: "We develop custom interior solutions based on user needs and the full potential of the space."
        },
        {
          title: "Implementation",
          text: "We ensure that design decisions are applied on site accurately and in a controlled manner."
        },
        {
          title: "Fitout Management",
          text: "We manage planning, coordination and execution processes to keep every stage of the project organized."
        }
      ],
      featuredTitle: "Selected Projects",
      featuredText: "Explore selected works from projects developed across different scales.",
      ctaTitle: "Let’s shape your project together",
      ctaText: "Get in touch for your next living space, workplace or commercial project. Let’s plan the right process for your needs together."
    },
    about: {
      title: "Who We Are",
      paragraphs: [
        "Hauzart approaches interior architecture not only as an aesthetic arrangement, but as a holistic process that directly shapes daily life and user experience.",
        "In every project, we evaluate spatial needs, user expectations and implementation realities together to deliver balanced solutions.",
        "Our goal is to create spaces that are not only visually strong, but also practical, sustainable and full of character."
      ]
    },
    projects: {
      title: "Projects",
      text: "Selected examples from interior architecture projects developed for different scales and needs.",
      categories: "Residential · Office · Commercial"
    },
    fitout: {
      title: "Fitout Management",
      text1: "Fitout management is the process of ensuring that design is transferred into execution completely and in a controlled way.",
      text2: "This approach protects timing, quality and execution discipline throughout the project while ensuring that design decisions are accurately reflected on site.",
      subheading: "Planning, coordination and execution control"
    },
    contact: {
      title: "Contact",
      text: "Get in touch to discuss your project, learn more about our services or explore a potential collaboration.",
      form: {
        name: "Full Name",
        phone: "Phone",
        email: "Email",
        message: "Message",
        submit: "Send"
      },
      info: "You can view our work on Instagram and contact us directly via Mail.",
      instagram: "Visit Instagram"
    },
    footer: {
      text: "Interior design, implementation and fitout management."
    },
    whatsappMessage: "Hello, I would like to discuss a project with Hauzart."
  }
};

export function getDictionary(locale: Locale) {
  return dictionary[locale];
}
