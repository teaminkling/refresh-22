# Design Refresh

This is the repository for the Design Refresh. It supersedes work done for the 2021 Refresh and will
act as the source website for all future content, 2022 and onwards.

## Architecture

This is a NextJS app running on Vercel and backend running on Cloudflare Workers.

This project is unique in that it runs entirely on free tiers of IaaS. Choices were made to make
operation free or as cheap as possible.

Some licenses for proprietary software were purchased (e.g., Fancybox) but those are perpetual.

## Local Development

For the frontend:

```shell
# in /
npm install
npm run dev
```

For the backend:

```shell
# in /
npm run build
wrangler dev --env development
```

For both environments, ensure you have the following files and edit them as needed:

- `.env.local` based on `.env.example`
- `api/wrangler.toml` based on `api/wrangler.example.toml`

## Deployment

To build the frontend, set up the deployment through Cloudflare Pages. Alternatively:

```shell
# in /
next build
next generate
```

...then serve the `out` directory. On Pages, you might need to delete the `api` directory first.
Just make sure you don't do that for local development.

The backend is more straightforward:

```shell
# in /api
wrangler publish --env production
```

## License

The source code is licensed by Apache 2.0. You are free to copy, adapt, and read any of the code as
you please.

However, "Design Refresh", "FiveClawd", marketing materials (including the logo), and user-generated
content is All Rights Reserved of their respective copyright holders.
