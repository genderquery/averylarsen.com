module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return (
      collectionApi
        // get everything in the posts subdirectory
        .getFilteredByGlob("posts/*")
        // sort by ascending by date
        .sort((a, z) => a.date - z.date)
    );
  });

  return {
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};
