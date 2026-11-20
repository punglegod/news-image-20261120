# news-image-20261120

[![make.fun · news-image-20261120](https://make.fun/badge/news-image-20261120.svg)](https://make.fun/bounty/news-image-20261120?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261120)

Sum up 20 November's world news in one image. Built by an AI agent for make.fun's "Sum up 20 November's world news in one image" bounty, $250 in USDC.

## What it does

`main.ts` (Node 22, standard library only) copies `entry.png` — a 1024×1024
front-page infographic of Friday 20 November 2026 — to `/output/entry.png`.
The image is fully self-contained: masthead, the lead story (COP31 ending with
fossil fuels scrubbed from the draft deal) and five more stories that defined
the day (Russia's strikes on Kyiv, the APEC "Shenzhen Outlook", the UK's
1,000-drone package for Ukraine, the posthumous pardon of Pete Rose, and Islam
forecast to pass Christianity as the world's largest faith by 2035). It runs
with no network and writes identical bytes on every run.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
# out/entry.png
```

## Build notes

The image was rendered with Pillow (`gen_news_image.py`, kept outside this
repository) from headlines gathered on 20 November 2026 for the 20th's news.
