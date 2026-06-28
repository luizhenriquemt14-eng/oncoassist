import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

const SITE_NAME = "OncoAssist";
const SITE_URL = "https://oncoassist.com.br";

const setMeta = (selector: string, attribute: "content" | "href", value: string) => {
  const existing = document.head.querySelector(selector);
  if (existing) {
    existing.setAttribute(attribute, value);
    return;
  }

  const isCanonical = selector.includes("canonical");
  const tag = document.createElement(isCanonical ? "link" : "meta");

  if (isCanonical) {
    tag.setAttribute("rel", "canonical");
    tag.setAttribute("href", value);
  } else {
    const property = selector.match(/property="([^"]+)"/)?.[1];
    const name = selector.match(/name="([^"]+)"/)?.[1];
    if (property) {
      tag.setAttribute("property", property);
    }
    if (name) {
      tag.setAttribute("name", name);
    }
    tag.setAttribute("content", value);
  }

  document.head.appendChild(tag);
};

const normalizeUrl = (path?: string) => {
  if (!path) {
    return SITE_URL;
  }
  if (path.startsWith("http")) {
    return path;
  }
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

const SEO = ({
  title,
  description,
  keywords,
  image = "/og-image.svg",
  url = "/",
  type = "website",
  noindex = false,
}: SEOProps) => {
  useEffect(() => {
    document.title = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[name="author"]', "content", SITE_NAME);
    setMeta('meta[name="keywords"]', "content", keywords || "");
    setMeta(
      'meta[name="robots"]',
      "content",
      noindex ? "noindex,nofollow" : "index,follow"
    );
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:type"]', "content", type);
    setMeta('meta[property="og:url"]', "content", normalizeUrl(url));
    setMeta('meta[property="og:image"]', "content", normalizeUrl(image));
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:image"]', "content", normalizeUrl(image));
    setMeta('link[rel="canonical"]', "href", normalizeUrl(url));
  }, [description, image, keywords, noindex, title, type, url]);

  return null;
};

export default SEO;
