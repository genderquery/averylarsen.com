const { DateTime } = require("luxon");
const { URL } = require("url");
const md = require("markdown-it");
const anchor = require("markdown-it-anchor");

module.exports = function (eleventyConfig) {
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
