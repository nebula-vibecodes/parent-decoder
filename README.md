# Parent Decoder

An upgraded, privacy-conscious guide to modern slang, emojis, and online phrases. Built with React, TypeScript, Vite, and a custom responsive design system.

## Run

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

## Structure

- Home with live term and whole-message search
- Local whole-message decoder with copyable summaries
- Filterable, URL-persisted library with 413 detailed guides
- Term pages with meanings, examples, origins, context, and conversation guidance
- Conversation starters and browser-local saved terms/messages
- Suggestion and copy-only feedback drafts
- About, approach, privacy, editorial policy, review status, and editorial demo

Hash-based navigation keeps every route reachable from a static deployment. Saved items use local storage only: they do not sync across devices and are removed when browser site data is cleared. Suggestion and editorial workflows intentionally disclose their demo/copy-only behavior; no backend or external AI service is configured.
