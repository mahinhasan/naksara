import { Metadata } from "next";

export const siteConfig = {
  name: "Naksara | Premium Artisan Goods",
  description: "Authentic craftsmanship for modern living. Shop our curated collection of premium artisan products.",
  url: "https://naksara.com",
  ogImage: "https://naksara.com/og.jpg",
  links: {
    twitter: "https://twitter.com/naksara",
    github: "https://github.com/naksarahasan",
  },
};

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@naksara",
    },
    icons,
    metadataBase: new URL(siteConfig.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
