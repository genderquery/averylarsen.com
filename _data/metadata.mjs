export default function () {
  return {
    title: "averylarsen.com",
    description: "Personal website of Avery Larsen",
    baseUrl: () => {
      if (process.env.BASE_URL) {
        return process.env.BASE_URL;
      }
      if (process.env.BRANCH === "staging") {
        return "https://staging--averylarsen.netlify.app/";
      }
      return "https://averylarsen.com";
    },
  };
}
