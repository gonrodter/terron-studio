# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Terron Studio portfolio site (Vue 3 + Vite, single-page application). PostHog is initialized on first interaction from `src/analytics.js` with environment-variable-based configuration, a global Vue error handler forwards uncaught exceptions to PostHog, and custom events are captured across the key user interactions on the page. Session recording, surveys and feature flags are disabled because this site only uses product analytics events.

| Event name | Description | File |
|---|---|---|
| `book_call_clicked` | User clicked a 'Book a call' button anywhere on the page | `src/App.vue` |
| `message_clicked` | User clicked a 'Send a message' link to open their email client | `src/App.vue` |
| `pricing_tab_selected` | User switched to a different pricing tab in the pricing section | `src/App.vue` |
| `project_link_clicked` | User clicked a project card or board link to view an external project | `src/App.vue` |
| `faq_toggled` | User opened or closed an FAQ item | `src/App.vue` |
| `service_category_clicked` | User clicked a service category in the showcase grid | `src/App.vue` |
| `dev_addon_toggled` | User toggled the 'Add Development' add-on in the pricing configurator | `src/App.vue` |
| `retainer_task_count_changed` | User adjusted the number of active tasks in the retainer pricing card | `src/App.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://eu.posthog.com/project/233521/dashboard/852083)
- [Book a call clicks (wizard)](https://eu.posthog.com/project/233521/insights/3GSunZPU)
- [Contact CTAs comparison (wizard)](https://eu.posthog.com/project/233521/insights/pDOe86pq)
- [Pricing interest by service (wizard)](https://eu.posthog.com/project/233521/insights/nJKnYfaG)
- [Project clicks by name (wizard)](https://eu.posthog.com/project/233521/insights/k7GuEsKI)
- [FAQ engagement (wizard)](https://eu.posthog.com/project/233521/insights/1t3hcwO6)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
