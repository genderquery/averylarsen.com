const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.ignores.add("README.md");

  eleventyConfig.addPassthroughCopy("css");

  // Copy _redirects to site folder so Netlify can see it
  eleventyConfig.addPassthroughCopy("_redirects");

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
};
