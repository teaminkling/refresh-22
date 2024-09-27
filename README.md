# Design Refresh

This is the repository for the 2022 Design Refresh. It has lived through various stages:

1. pre-2022: a temporary build site.
2. 2022: a full-fledged site with API, user-generated content, forms, and more.
3. post-2022: a static site that behaves the same way as the 2022 site but statically generated.

## Local Development

For the frontend:

```shell
npm install
npm run dev
```

Ensure `.env` is populated with a valid Discord bot token to grab user profile images on build.

## Deployment

The frontend is statically generated/prerendered from `./dist/client`:

```shell
npm run build
```

## License

Apache 2.0: You are free to copy, adapt, and read any of the code as you please.

However, "Design Refresh", "FiveClawd", "Inkling Interactive", marketing materials (including the logo), and
user-generated content is All Rights Reserved of their respective copyright holders.
