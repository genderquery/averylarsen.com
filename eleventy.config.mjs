import { DateTime } from "luxon";
import { URL } from "url";
import md from "markdown-it";
import anchor from "markdown-it-anchor";


export default async function (eleventyConfig) {
  eleventyConfig.ignores.add("README.md");

  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("averylarsen@mailbox.org.asc");

  // Copy _redirects to site folder so Netlify can see it
  eleventyConfig.addPassthroughCopy("_redirects");

  eleventyConfig.setLibrary(
    "md",
    md({
      html: true,
    }).use(anchor, {
      permalink: anchor.permalink.headerLink({ safariReaderFix: true }),
    })
  );

  // pretty print objects for debugging
  eleventyConfig.addFilter("pretty", function (value) {
    return JSON.stringify(value, null, 4);
  });

  eleventyConfig.addFilter("localeDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toLocaleString(
      DateTime.DATE_MED
    );
  });

  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toISODate();
  });

  eleventyConfig.addFilter("rfc2822Date", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toRFC2822();
  });

  eleventyConfig.addFilter("absoluteUrl", (url, base) => {
    return new URL(url, base).toString();
  });
};
