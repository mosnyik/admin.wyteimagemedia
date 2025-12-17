export const profileMagazineQuery = `
*[_type == "profileMagazinePage"][0]{
  hero {
    title,
    highlight,
    text,
    images {
      mobile {asset->{url}},
      tablet {asset->{url}},
      desktop {asset->{url}},
      wide {asset->{url}}
    }
  },
  aboutSection {
    heading,
    content 
  },
   editions[] {
    title,
    description,
    "images": images[].asset->url,
    links[] {
      title,
      to
    },
    buyLink
  }

}
`;
export const servicesPageQuery = `
*[_type == "servicesPage"][0]{
  hero {
    title,
    highlight,
    text,
    images {
      "mobile": mobile.asset->url,
      "tablet": tablet.asset->url,
      "desktop": desktop.asset->url,
      "wide": wide.asset->url
    }
  },
  about {
    heading,
    content
  },
  services[] {
    title,
    description,
    features,
    icon,
    color
  },
  processSteps[] {
    "step": number,
    title,
    description
  },
  testimonials[] {
    quote,
    author,
    position
  },
  integrityPledge,
  legacy,
  cta {
    title,
    text,
    primaryButton,
    secondaryButton
  }
}
`;

export const eventsPageQuery = `
*[_type == "eventsPage"][0]{
  hero {
    title,
    highlight,
    text,
    images {
      mobile {asset->{url}},
      tablet {asset->{url}},
      desktop {asset->{url}},
      wide {asset->{url}}
    }
  },
  upcomingEvents[]->{
    title,
    date,
    time,
    location,
    description,
    category,
    status,
    featured,
    attendees,
    highlights,
    "images": images[].asset->url
  },
  pastEvents[]->{
    title,
    date,
    time,
    location,
    description,
    category,
    status,
    featured,
    attendees,
    cta,
    ctaLink,
    highlights,
    "images": images[].asset->url
  },
    cta {
    title,
    text,
    primaryButton,
    secondaryButton
  }
}
`;
export const aboutUsPageQuery = `
*[_type == "aboutUsPage"][0]{
  hero {
    title,
    highlight,
    text,
    images {
      mobile {asset->{url}},
      tablet {asset->{url}},
      desktop {asset->{url}},
      wide {asset->{url}}
    }
  },
  mission,
  stats[] {
    number,
    label
  },
  about{
  content,
    "image": image.asset->url
  },
  values[] {
    title,
    description,
    icon
  },
  milestones[] {
    year,
    title,
    description
  },
  teamMembers[] {
    name,
    position,
    bio,
    "image": image.asset->url
  },
  cta {
    title,
    text,
    buttons[] {
      label,
      link
    }
  }
}
`;

export const contactUsPageQuery = `*[_type == "contactUsPage"][0]{
  hero{
    title,
    highlight,
    text,
    images{
      "mobile": mobile.asset->url,
      "tablet": tablet.asset->url,
      "desktop": desktop.asset->url,
      "wide": wide.asset->url
    }
  },
  contactInfo[]{
    title,
    address,
    phones[],
    emails[],
    icon
  },
  serviceOptions,
  faqs[]{
    question,
    answer
  },
  socials[]{
    name,
    link
  },
  responseTimes[]{
    time,
    label
  }
}`;

export const homeQuery = `*[_type == "home"][0]{
  title,
  landing {
    "backgroundImage": backgroundImage.asset->url,
    subHeadings,
    cta {
      text,
      link
    }
  },
  marquee {
    text,
    speed
  },
  about {
    intro,
    howToNominateTitle,
    nominateSteps,
    socials[] {
      name,
      link
    }
  },
    featuredSection {
    featuredVideoTitle,
    featuredVideo,
    featuredProjects[] {
      title,
      "images": images[].asset->url,
      links[] {
        title,
        to
      }
    }
  },
  magazinePages[] {
    title,
    description,
    content,
    pageNo,
    "image": image.asset->url
  },
  magazineHero{
  title,
    highlight,
    text,
    images {
    "mobile": mobile.asset->url,
    "tablet": tablet.asset->url,
    "desktop": desktop.asset->url,
    "wide": wide.asset->url
  }
  },
  magazineOffer {
     "magazineCover": magazineCover.asset->url,
    oldPrice,
    newPrice,
    gumroadLink
  },
  features[] {
    icon,
    title,
    description
  }
}`;

export const formSubmissionQuery = `*[
  _type == "formSubmission"
]{
  ...,
  "imageUrl": image1.asset->url
}`;

