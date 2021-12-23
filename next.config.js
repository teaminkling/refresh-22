/** @type {import("next").NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/artists",
        destination: "/lists/artists",
      },
      {
        source: "/weeks",
        destination: "/lists/weeks",
      },
    ]
  },
  async redirects() {
    return [
      {
        source: "/security.txt",
        destination: "/.well-known/security.txt",
        permanent: true,
      },
      {
        source: "/themes",
        destination: "/weeks",
        permanent: true,
      },
    ]
  }
}
