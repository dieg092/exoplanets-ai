import localFont from "next/font/local";

export const Fellix = localFont({
  src: [
    {
      path: "./static-fonts/Fellix-Light.woff2",
      weight: "300",
    },
    {
      path: "./static-fonts/Fellix-Regular.woff2",
      weight: "400",
    },
    {
      path: "./static-fonts/Fellix-Bold.woff2",
      weight: "500",
    },
  ],
});
