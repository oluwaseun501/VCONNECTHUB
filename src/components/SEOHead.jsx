/**
 * SEOHead.jsx
 * Drop this component at the top of any page to set per-page meta tags.
 *
 * Usage:
 *   import SEOHead from "@/components/SEOHead";
 *   <SEOHead
 *     title="Buy TikTok Followers Nigeria | VConnectHub"
 *     description="Get real TikTok followers instantly from ₦500. Nigeria's #1 SMM panel."
 *     url="https://vconnecthub.com/boosting"
 *   />
 *
 * Requires: npm install react-helmet-async
 * Wrap your <App /> in <HelmetProvider> from react-helmet-async.
 */

import { Helmet } from "react-helmet-async";

const DEFAULT = {
  title: "VConnectHub | Buy SMM Services & Virtual Numbers in Nigeria",
  description:
    "VConnectHub – Nigeria's fastest SMM panel. Buy TikTok, Instagram & YouTube followers, likes and views. Get virtual phone numbers for WhatsApp, OTP & SMS verification.",
  image: "https://vconnecthub.com/og-image.png",
  url: "https://vconnecthub.com/",
};

export default function SEOHead({
  title = DEFAULT.title,
  description = DEFAULT.description,
  image = DEFAULT.image,
  url = DEFAULT.url,
  noIndex = false,
}) {
  return (
    <Helmet>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}

/**
 * Per-page usage guide:
 *
 * /login          → noIndex=true (no need to rank login page)
 * /register       → noIndex=true
 * /boosting       → title="Buy SMM Services Nigeria – TikTok, Instagram, YouTube | VConnectHub"
 * /vtu            → title="Buy Airtime & Data Online Nigeria | VConnectHub"
 * /blog/:slug     → title from blog post title + " | VConnectHub Blog"
 */
