# Design Refresh

This is the repository for the 2022 Design Refresh. It supersedes work done for the 2021 Refresh and
will act as the source website for all future content.

## Architecture

This is a NextJS SSR + Serverless API app running on Vercel with additional applications in the
`apps/` directory to be deployed to Digital Ocean:

### 'Nailer

A cheap and "slow" asynchronous thumbnail generation service written in Django. Providing a valid
API key, a file URL, and a thumbnail URL, a thumbnail is generated and placed in the expected
bucket.

All requests to create thumbnails are logged which can be viewed in Django Admin.

This will be deployed as an always-online $5-monthly App Platform app.

### Twobee

A Discord bot. This bot listens for API calls from serverless functions with an accepted APIkey on
any create/update event. They update an audit log and a public submission on every request.

This will be deployed as an always-online $5-monthly App Platform app. That probably is too
expensive for what is actually being run, but my time as a server administrator is worth more than
$5 a month.

### Additionally

Contentful is a headless CMS that provides a response for much of the static information.

The browser performs most of the logic in displaying this information and will use hand-built Redux
structures to cache frequently accessed information.

## Build Instructions

This section is TBD.

## Deploy

This section is TBD.

## License

The LICENSE provided with this repository is a copyleft open source license. We are clarifying that
this only includes the source code: feel free to edit and use it as you like. "Design Refresh",
"FiveClawd", marketing materials (including the logo), user-generated content, and anything that
isn't specifically just the source code is All Rights Reserved of their respective copyright
holders.
