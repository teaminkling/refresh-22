# Design Refresh

This is the repository for the 2022 Design Refresh. It supersedes work done for the 2021 Refresh 
and will act as the source website for all future content.

## Architecture

This is a NextJS app running on Cloudflare Pages with dynamic functionality in Functions. This 
runs on the Cloudflare Workers backbone.

Cloudflare K/V is used to provide dynamic details via a direct read-only connection to the 
browser. The client performs most of the logic in handing this information. Workers also read 
from the Contentful headless CMS for necessary information.

## Build Instructions

This section is TBD.

## Deploy

This section is TBD.

## License

The LICENSE provided with this repository is a copyleft open source license. We are clarifying 
that this only includes the source code: feel free to edit and use it as you like. "Design 
Refresh", "FiveClawd", marketing materials (including the logo), user-generated content, and 
anything that isn't specifically just the source code is All Rights Reserved of their respective 
copyright holders.
