# Design Refresh

This is the repository for the Design Refresh. It supersedes work done for the 2021 Refresh and will
act as the source website for all future content, 2022 and onwards (potentially).

## Architecture

This is a NextJS SSR + Serverless API app running on Vercel and Cloudflare Workers. It is designed
to be free to operate with small enough levels of bandwidth/computing power.

## Local Development

For the frontend:

```shell
npm install
npm run dev
```

For the backend:

```shell
npm run build
wrangler dev --env development
```

For both environments, check you have the following files:

- `.env.local` based on `.env.example`
- `api/wrangler.toml` based on `api/wrangler.example.toml`

## Deployment

To build the frontend, set up the deployment through Cloudflare Pages. Alternatively:

```shell
next build; next generate
```

...then serve the `out` directory. On Pages, you might need to delete the `api` directory first.
Just make sure you don't do that for local development.

The backend is more straightforward:

```shell
cd api;
wrangler publish --env production
```

## License

The source code is licensed by Apache 2.0. You are free to copy, adapt, and read any of the code as
you please.

However, "Design Refresh", "FiveClawd", marketing materials (including the logo), and user-generated
content is All Rights Reserved of their respective copyright holders.
