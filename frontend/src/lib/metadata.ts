import { Metadata } from "next";

export const siteConfig = {
  name: "HERITAGE | Premium Artisan Goods",
  description: "Authentic craftsmanship for modern living. Shop our curated collection of premium artisan products.",
  url: "https://heritage-premium.com",
  ogImage: "https://heritage-premium.com/og.jpg",
  links: {
    twitter: "https://twitter.com/heritage",
    github: "https://github.com/heritage",
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
      creator: "@heritage",
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
