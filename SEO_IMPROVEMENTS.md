# SEO Improvements - Action Items

This document outlines the SEO improvements made and additional steps required.

## ✅ Completed Improvements

### 1. Meta Tags & Configuration
- ✅ Added viewport and theme-color meta tags
- ✅ Added comprehensive robots configuration
- ✅ Fixed base URL from `.vercel.app` to `.at` domain
- ✅ Added OpenGraph image references to metadata
- ✅ Added Twitter card image references
- ✅ Enhanced favicon configuration

### 2. Structured Data (Schema.org)
- ✅ Added Organization schema with Vienna focus
- ✅ Added GovernmentService schema with MA 36 information
- ✅ FAQPage schema already implemented (kept as-is)
- ✅ Enhanced structured data with language and location info

### 3. Sitemap & Robots
- ✅ Updated sitemap to use correct base URL
- ✅ Improved sitemap with proper TypeScript typing
- ✅ Robots.txt already correctly configured

### 4. PWA Support
- ✅ Added web manifest (`/app/manifest.ts`)
- ✅ Configured manifest with proper icons and metadata

### 5. Code Cleanup
- ✅ Removed unused `/app/lib/metadata.ts` file
- ✅ Consolidated all metadata in `/app/[locale]/metadataConfig.ts`

---

## 🎨 Required: Create Visual Assets

You need to create the following image files in the `/public` directory:

### OpenGraph Image (CRITICAL for Social Sharing)
**File:** `/public/og-image.png`
- **Dimensions:** 1200 x 630 pixels
- **Format:** PNG or JPG
- **Content suggestions:**
  - App name: "Betriebsanlagen Check"
  - Tagline: "Genehmigung prüfen in 2 Minuten"
  - Vienna-focused branding
  - Professional design with blue gradient (matching app colors)
  - Include "Wien" or Vienna landmark
- **Tools:** Canva, Figma, Photoshop, or online OG image generators

### Favicons (IMPORTANT for Branding)
1. **`/public/favicon.ico`** - 32x32 or 48x48 multi-resolution ICO
2. **`/public/icon-192.png`** - 192x192 PNG (Android)
3. **`/public/icon-512.png`** - 512x512 PNG (Android, PWA)
4. **`/public/apple-icon.png`** - 180x180 PNG (iOS)

**Design suggestions:**
- Use your logo or the checkmark icon from the app
- Blue gradient background (#2563eb)
- Simple, recognizable design that works at small sizes

**Tools to create favicons:**
- [Favicon.io](https://favicon.io/)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- Manual design in Figma/Sketch

---

## 🔍 Optional: Search Console Setup

Once deployed to your `.at` domain:

1. **Google Search Console**
   - Add property: https://betriebsanlage-check.at
   - Verify ownership (DNS or HTML file)
   - Add verification code to `app/layout.tsx` (line 26-27)
   - Submit sitemap: `https://betriebsanlage-check.at/sitemap.xml`

2. **Bing Webmaster Tools**
   - Add site and verify
   - Submit sitemap

3. **Other Verification Codes**
   - Yandex, if targeting Eastern Europe
   - Update `app/layout.tsx` verification section

---

## 📊 Recommended: Additional SEO Enhancements

### 1. Add BreadcrumbList Schema
Consider adding breadcrumb structured data on sub-pages:

```typescript
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://betriebsanlage-check.at"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Check",
      "item": "https://betriebsanlage-check.at/check"
    }
  ]
}
```

### 2. Environment Variables
Set in Vercel/production:
```env
NEXT_PUBLIC_SITE_URL=https://betriebsanlage-check.at
```

### 3. Performance Optimization
- Enable Next.js Image Optimization
- Consider adding `priority` to above-the-fold images
- Review Core Web Vitals in Vercel Speed Insights

### 4. Content Optimization
- Add more Vienna-specific keywords naturally in content
- Consider adding a blog section for SEO content
- Add "MA 36" mentions in more places (it's a key search term)

### 5. Local SEO
- Consider adding `LocalBusiness` schema with geo-coordinates:
  ```json
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "48.2082",
    "longitude": "16.3738"
  }
  ```

---

## 🧪 Testing Your SEO

After deploying:

1. **Meta Tags Test:**
   - [OpenGraph Debugger](https://www.opengraph.xyz/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

2. **Schema.org Validation:**
   - [Google Rich Results Test](https://search.google.com/test/rich-results)
   - [Schema Markup Validator](https://validator.schema.org/)

3. **SEO Audit:**
   - [Google Lighthouse](https://pagespeed.web.dev/)
   - [Ahrefs SEO Checker](https://ahrefs.com/seo-checker)
   - [SEMrush Site Audit](https://www.semrush.com/)

4. **Mobile-Friendly Test:**
   - [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

---

## 📈 Expected SEO Improvements

With these changes, you should see:

1. **Better Social Sharing** - OpenGraph images will display when shared on Facebook, LinkedIn, Twitter
2. **Improved SERP Appearance** - Rich snippets from structured data
3. **Better Mobile Experience** - PWA capabilities and proper viewport
4. **Multilingual SEO** - Proper hreflang tags for all 8 languages
5. **Local Vienna Focus** - Location-specific structured data
6. **Higher Rankings** - For Vienna-specific business permit queries

---

## 🚀 Deployment Checklist

Before pushing to production:

- [ ] Create and add `/public/og-image.png`
- [ ] Create and add all favicon files
- [ ] Set `NEXT_PUBLIC_SITE_URL` environment variable
- [ ] Test build locally: `npm run build`
- [ ] Verify sitemap generation: check `/sitemap.xml` after build
- [ ] Test on mobile devices
- [ ] Submit sitemap to Google Search Console after deployment
- [ ] Monitor Vercel Analytics for traffic improvements

---

## 📝 Notes

- The placeholder `og-image.png` file currently exists but contains text - replace it with an actual image
- All 8 language JSON files should be updated with OG images (currently only DE and EN are updated)
- Consider hiring a designer for professional OG image and favicons if needed
- Monitor Google Search Console for any crawling issues after deployment

---

*Last updated: 2025-10-29*
*Branch: feature/seo-optimization*
