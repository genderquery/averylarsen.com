module.exports = function (eleventyConfig) {    
    eleventyConfig.addPassthroughCopy("css");

    // Copy _redirects to site folder so Netlify can see it
    eleventyConfig.addPassthroughCopy("_redirects");

    // pretty print objects for debugging
    eleventyConfig.addFilter("pretty", function (value) {
        return JSON.stringify(value, null, 4);
    });
}
