# Business economics, payments, platform rules and pricing for an India-based solo developer selling subscription apps (2025–2026)

*How this research was done, and its limits (read first).* WebFetch could not resolve any host in this environment (ENOTFOUND for revenuecat.com, wikipedia.org, docs.dodopayments.com and others). Direct curl was refused by the egress policy (HTTP 403). As a result, no page was read in full. Every finding below comes from WebSearch result extracts, which are search-engine summaries of the cited pages. Each citation points to the page the search tool linked to that fact. Where a summary blended several pages, the most likely page is named and the uncertainty is flagged. The shared web-search budget (200 calls per turn across all agents) ran out after about 40 of my queries. The coordinator's scope update arrived after that. It narrows the product to mobile-only or mobile + web, for Instagram creators, vloggers and individuals who pay for themselves. Its new requests are photo/video/social category benchmarks, web billing with shared entitlements (RevenueCat or similar), and React Native/Expo + Next.js build cost. These are answered only from data already gathered. Everything else is listed under Gaps. Check headline numbers against the primary pages before publishing. Today's date is 2026-10-12.

## 1. Mobile subscription app benchmarks: conversion, retention, revenue per install, India vs US/EU, categories

### Takeaway
The typical subscription app earns little. In RevenueCat's 2026 report (2025 data, 115k+ apps), only about 17% of new apps reach $1k MRR within two years, and 4.6% reach $10k. Growth is concentrated in the top quartile. India/Southeast Asia earns about one-fifth of what North America earns per install (D60 revenue per install $0.11 vs $0.55), and about 44% per payer (year-one realised LTV $14 vs $32). An app for Indian creators therefore needs very high volume or a meaningful share of US/EU payers. Hard paywalls convert about 5x better than freemium (10.7% vs 2.1% download-to-paid by day 35). Longer trials convert better than short ones. AI apps earn about 41% more per payer but churn about 30% faster.

### Cited Findings
**Scale and concentration**
- RevenueCat's State of Subscription Apps (SOSA) 2026 covers 2025 data from more than 115,000 apps and more than $16B in revenue. Subscription Insider adds that it spans more than 1B transactions across iOS, Android and web — [RevenueCat SOSA 2026](https://www.revenuecat.com/state-of-subscription-apps); [Subscription Insider](https://www.subscriptioninsider.com/blog/revenuecat-data-shows-subscription-app-growth-concentrating-at-the-top-news)
- New subscription app launches rose from about 2,000/month three years ago to almost 15,000/month (RevenueCat CEO Jacob Eiting, per coverage) — [Subscription Insider](https://www.subscriptioninsider.com/blog/revenuecat-data-shows-subscription-app-growth-concentrating-at-the-top-news); [ContentGrip](https://www.contentgrip.com/subscription-app-market-2026-growth/)
- The top 25% of apps grew revenue more than 80% year on year. The bottom 25% shrank 33%. The median app grew about 5% — [ContentGrip](https://www.contentgrip.com/subscription-app-market-2026-growth/)
- The share of new apps reaching $1k monthly recurring revenue within their first two years fell from 19% to 17%. The share reaching $10k fell from 5.3% to 4.6% (SOSA 2026 vs the prior edition) — [RevenueCat SOSA 2026 insights page](https://www-docs.revenuecat.com/sosa-26-insights/)
- SOSA 2025 (prior edition): about 20% of apps reach $1,000/month within two years of launch, and about 5% exceed $10,000/month — [Gigazine](https://gigazine.net/gsc_news/en/20250318-mobile-apps-subscriptions-revenue); [Michael Tsai](https://mjtsai.com/blog/2025/03/24/mobile-app-revenue-in-2025)
- SOSA 2025: after their first year, the top 5% of newly launched apps make $8,880, while the bottom 25% make no more than $19 (a gap of more than 400x) — [RevenueCat SOSA 2025](https://www.revenuecat.com/state-of-subscription-apps-2025); [Michael Tsai](https://mjtsai.com/blog/2025/03/24/mobile-app-revenue-in-2025)
- Adapty's State of In-App Subscriptions 2026 covers 16,000 apps, $3B in subscription revenue, 500M+ transactions and 105,000 paywalls. It reports that about 95% of subscription revenue goes to the top 10% of apps — [Adapty SOIS 2026](https://adapty.io/state-of-in-app-subscriptions/); [David Attias (Adapty) on X](https://x.com/david_attisaas/status/2031044449845813556); [PPC Land on Adapty](https://ppc.land/95-of-app-subscription-revenue-goes-to-top-10-adaptys-2026-benchmark-report/)
- Adapty pages are inconsistent on method. One says revenue is gross, another says it is net of store commission and taxes. Unofficial mirror pages give $2.2B instead of $3B — [Adapty report page](https://adapty.io/state-of-in-app-subscriptions-report/); [unofficial mirror](https://adapty-state-of-appsubs.vercel.app/)

**Conversion**
- D35 download-to-paid is the share of installs that start at least one paid subscription within 35 days of install. Median D35 is 10.7% for hard-paywall apps vs 2.1% for freemium apps — [RevenueCat SOSA 2026](https://www.revenuecat.com/state-of-subscription-apps)
- Median D35 by category: Health & Fitness 2.9%, Gaming 1.0% — [RevenueCat SOSA 2026](https://www.revenuecat.com/state-of-subscription-apps)
- Median D35 by price tier is reported as 1.4% (low), 2.0% (mid) and 2.8% (high) — [RevenueCat SOSA 2026](https://www.revenuecat.com/state-of-subscription-apps). Caution: these values match the regional figures below, so a secondary summary may have mislabeled them.
- Hard-paywall apps earn a median $2.32 per install by day 14, vs $0.27 for freemium (SOSA 2026) — [SaaStr](https://www.saastr.com/the-top-10-learnings-from-revenuecats-state-of-subscription-apps-how-115000-mobile-apps-deliver-16b-in-revenue-whats-working-whats-quietly-killing-growth/)
- Median trial-to-paid conversion (SOSA 2026) is 42.5% for 17–32-day trials and 25.5% for trials of four days or less. A 37.4% figure for 5–9-day trials circulates but could not be verified — [RevenueCat SOSA 2026](https://www.revenuecat.com/state-of-subscription-apps); [PricePush](https://pricepush.app/blog/trial-to-paid-conversion-rate-benchmarks)
- SOSA 2025: 17–32-day trials had the highest median conversion (45.7%). 3-day and 7-day trials had the most cancellations on day 0 and day 1 — [I Programmer](https://www.i-programmer.info/news/83-mobilephone/17938-making-money-from-subscription-apps.html); [BeTomorrow](https://www.betomorrow.com/en/documents/revenuecat-subscription-apps-report-2025)

**Retention**
- 12-month retention on annual plans is 21.1% for AI apps vs 30.7% for non-AI apps (SOSA 2026) — [TechCrunch](https://techcrunch.com/2026/03/10/ai-powered-apps-struggle-with-long-term-retention-new-report-shows); [PPC Land](https://ppc.land/ai-apps-earn-41-more-per-user-but-churn-30-faster-revenuecat-finds/)
- Secondary summaries of SOSA 2026 put year-one retention on annual plans at about 36% (low price), 26% (mid) and 23% (high). These are not verified against RevenueCat's own page, and the exact origin is unconfirmed — [ARPU Brothers summary](https://arpubrothers.com/blog/revenuecat-subscription-app-report-2026/)
- One blog table gives year-one retention of 27% for hard-paywall apps vs 28% for freemium. Another write-up calls the two "virtually identical" — [BuildMVPFast](https://www.buildmvpfast.com/blog/hard-paywall-vs-free-trial-revenuecat-indie-app-2026)
- Adapty 2026: trial users retain 1.4–1.7x better than direct buyers. Day-380 retention for trial subscribers is 19.9% on annual plans, 14.2% on monthly and 5.5% on weekly — [Adapty blog](https://adapty.io/blog/mobile-app-monetization-2026/)
- Adapty 2026: the gap between the best and worst region (4.1 percentage points) is small next to the gap between plan types (15+ points) — [Adapty SOIS 2026](https://adapty.io/state-of-in-app-subscriptions/)

**Regional: India vs US/EU**
- Median D35 download-to-paid (SOSA 2026): North America 2.6%, Western Europe 2.0%, India & Southeast Asia (IN/SEA) 1.4% — [PPC Land](https://ppc.land/ai-apps-earn-41-more-per-user-but-churn-30-faster-revenuecat-finds/)
- Median revenue per install (RPI) at day 14: North America $0.38 vs IN/SEA $0.08. At day 60: North America $0.55, Europe $0.33, IN/SEA $0.11 (SOSA 2026) — [RevenueCat 2026 benchmarks blog](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026); [RevenueCat SOSA 2026](https://www.revenuecat.com/state-of-subscription-apps)
- Median year-one realised LTV per payer: North America $32, Western Europe $25, global $23, IN/SEA $14 (SOSA 2026) — [RevenueCat 2026 benchmarks blog](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026); [RevenueCat SOSA 2026](https://www.revenuecat.com/state-of-subscription-apps)
- IN/SEA and LatAm have the most Android-leaning revenue mix, but iOS still earns most of the revenue even there — [RevenueCat SOSA 2026](https://www.revenuecat.com/state-of-subscription-apps)
- SOSA 2025 (different dataset): median RPI was $0.39 in North America vs $0.06–$0.09 in the lowest regions, including IN/SEA — [RevenueCat SOSA 2025](https://www.revenuecat.com/state-of-subscription-apps-2025)
- Adapty's 2026 pricing index across 22 countries: India 0.6x, US 1.0x, UK/France/Germany/Italy/Spain 1.2x — [Adapty report page](https://adapty.io/state-of-in-app-subscriptions-report/)

**Categories and AI (relevant to photo/video creator tools)**
- AI-powered apps earn about 41% more first-year revenue per payer and churn about 30% faster. The analysis covers 3,519 AI app configurations and more than 50M paid subscriptions — [TechCrunch](https://techcrunch.com/2026/03/10/ai-powered-apps-struggle-with-long-term-retention-new-report-shows); [Subscription Insider](https://www.subscriptioninsider.com/blog/ai-apps-earn-41-more-per-payer-but-churn-30-faster)
- Photo & Video has the highest share of AI-powered apps, at 61.4% — [Storyboard18](https://storyboard18.com/digital/ai-apps-struggle-to-retain-users-despite-strong-early-monetisation-report-finds-91785.html)
- Adapty 2026: the LTV premium from offering a trial varies by category. Utilities is highest at +85.1%. Lifestyle and Productivity show a negative premium — [Adapty blog](https://adapty.io/blog/subscription-app-success-2026/)
- RevenueCat publishes 11 category breakouts in the full PDF (330+ pages), including Business, Education, Productivity and Utilities. These category numbers were not extracted — [RevenueCat SOSA 2026](https://www.revenuecat.com/state-of-subscription-apps); [Productivity](https://www.revenuecat.com/state-of-subscription-apps-2026-productivity); [Business](https://www.revenuecat.com/state-of-subscription-apps-2026-business/); [Education](https://www.revenuecat.com/state-of-subscription-apps-2026-education); [Utilities](https://www.revenuecat.com/state-of-subscription-apps-2026-utilities/)

### Inferences
- Revenue per 10,000 installs at median D60 RPI: about $5,500 in North America, $3,300 in Europe and $1,100 in IN/SEA. An app for Indian creators only needs about 5x the installs of a US-focused app for the same revenue. Cheaper user acquisition in India offsets this only partly.
- The roughly 5x RPI gap breaks down as about 0.54x conversion (1.4% vs 2.6%) times about 0.44x revenue per payer ($14 vs $32), which gives about 0.24x. The remaining difference likely comes from different time windows.
- An AI-powered tool for Instagram creators enters the most AI-saturated category (Photo & Video, 61.4% AI). The benchmarks suggest charging a premium (+41% per payer) while expecting faster churn. That argues for pushing annual plans and for value that keeps users coming back, such as weekly content planning or batch editing, rather than one-off "wow" features.
- A hard paywall with a trial of a week or longer beats freemium on early revenue. Freemium makes sense mainly when free usage drives virality, for example exported content carrying a watermark or link.
- The base rate for a new subscription app is below 1 in 5 reaching $1k MRR within two years. Plan for a long tail.
- RevenueCat's data comes from a mobile in-app purchase SDK, so it is mostly B2C mobile. That fits the updated scope (individual creators paying for themselves).

### Gaps
- Benchmarks for photo/video, social and creator-tool categories (conversion, RPI, retention) were not extracted. The scope update arrived after the search budget ran out. RevenueCat's full PDF has 11 category breakouts, and Adapty's interactive report filters by category and country.
- No India-only figures were found. RevenueCat reports India together with Southeast Asia.
- No clean 12-month retention figure for monthly plans was found. A monthly reactivation (win-back) rate of 18–24% was reported, but that is not retention.
- Conflict: one secondary summary gives D35 conversion of 2.8% for North America vs 0.7% for IN/SEA, against 2.6% vs 1.4% elsewhere. The source of that summary could not be identified.
- A "median under $50/month after one year" figure circulates, but it appears to come from an older edition (about 29,000 apps) and is not confirmed for 2025 or 2026.
- Sensor Tower, Appfigures and Purchasely data were not gathered.

## 2. Small web SaaS benchmarks: churn, ARPU, time to $1k and $10k MRR

### Takeaway
Low-ARPA consumer and prosumer SaaS loses about 6–7% of customers per month. ChartMogul puts it at 6–7% for ARPA under $10, with a 6.1% median for ARPA under $25. Most indie SaaS stays small. TrustMRR-tracked bootstrapped SaaS has a median of about $145 MRR, and about 2.6% reach $10k MRR. MicroConf's latest survey (2024) found 28% of independent SaaS under $1k MRR. No reliable median for months-to-$10k-MRR exists. The base rates are similar to mobile (17% of apps reach $1k MRR within two years).

### Cited Findings
- A SaaS business with ARPA under $10 can expect 6–7% monthly customer churn (ChartMogul help center, undated) — [ChartMogul Help](https://help.chartmogul.com/hc/en-us/articles/203359321)
- Median monthly customer churn is 6.1% for ARPA under $25/month and falls to 2.2% for ARPA over $500. Best-in-class is under 2% — [ChartMogul SaaS metrics](https://chartmogul.com/saas-metrics/customer-churn/)
- Recurly data, via a secondary source: average churn is 6.5% for direct-to-consumer businesses (digital media, retail, education) vs 3.8% for B2B software and professional services — [LiveX AI](https://www.livex.ai/blog/average-saas-churn-rates)
- MicroConf State of Independent SaaS 2024 is the latest edition found (data collected late 2023, 469 founders). 28% of independent SaaS companies are under $1,000 MRR, the largest single group. 65% have only 1–10 paying customers (this appears to describe the $0–10K ARR segment) — [MicroConf $0–10K ARR page](https://microconf.com/founders/0-10k-arr)
- No MicroConf 2025 survey report was found. Freemius cites a median of about $4.2K MRR for profitable micro-SaaS (sourcing unclear). It also says 28% of 230 MicroConf 2025 attendees reported more than $100K MRR, but attendees are not a representative sample — [Freemius](https://freemius.com/blog/state-of-micro-saas-2025/)
- A TrustMRR-based analysis of 3,787 bootstrapped SaaS businesses puts median MRR at $145, with the 90th percentile at about $5,107 — [BigIdeasDB](https://bigideasdb.com/state-of-indie-saas-revenue-2026)
- 2.6% of TrustMRR-tracked SaaS startups reach $10K MRR — [BigIdeasDB](https://bigideasdb.com/trustmrr-saas-revenue-benchmarks-2026)
- One source claims solo developers commonly reach $1K MRR in 3–6 months and $5–10K in 12 months. The sample is affected by survivorship bias — [BigIdeasDB](https://bigideasdb.com/solo-developer-saas-monthly-revenue-examples)
- Anecdote: one team started charging in November 2019 and reached $10k MRR around July–August 2020, about 8–9 months — [Indie Hackers](https://www.indiehackers.com/post/heres-how-to-hit-10k-mrr-faster-891549221d)
- ChartMogul: the best SaaS companies reach $10M ARR in about 3 years and the next tier in about 5. Only 13% of tracked startups reach $10M ARR after 10 years — [SaaStr on ChartMogul](https://www.saastr.com/chartmogul-the-best-in-saas-get-to-10m-arr-in-3-years-the-next-best-in-about-5-years)

### Inferences
- At 6–7% monthly churn, the average customer stays about 14–17 months, so LTV is roughly 15x monthly ARPA. A $5/month creator tool would have an LTV of about $75 before fees.
- Indie web SaaS and indie mobile subscription apps have similar base rates: roughly 1 in 5 reach $1k MRR, and about 3–5% reach $10k.
- After the scope update, web SaaS benchmarks matter mainly for the economics of the web companion and web checkout.

### Gaps
- No Baremetrics or Stripe cohort data on time to $1k or $10k MRR surfaced.
- No MicroConf churn or ARPU figures were found.
- One vendor blog claims a "median 18 months to $10K MRR" with no source given, so it was excluded.

## 3. App store economics 2025–2026 (Google Play, Apple, CCI, Epic rulings, EU DMA) and what they mean for an Indian developer

### Takeaway
As of October 2026, a small developer pays about 15% on subscriptions in India on both stores. That is Apple's Small Business Program rate, or Google Play's 15% (11% if the user picks alternative billing under India's user choice billing). Larger savings exist only in some markets:
- **US:** Apple's 27% commission on links to outside checkout was held unlawful (contempt order April 2025, upheld December 2025). A lower, cost-based fee is being set on remand, and the Supreme Court granted review on 30 June 2026.
- **Google (US/UK/EEA):** a new structure took effect from 30 June 2026: a 10% service fee, plus a 5% billing fee only when using Play Billing. It reportedly reaches the rest of the world by 30 September 2027.
- **EU:** from 1 October 2026, Apple charges 15% on link-outs (reportedly 10% for Small Business Program members).

India-specific relief on Apple is stalled. The Delhi High Court stopped the CCI from issuing a final order.

### Cited Findings
**Google Play**
- Google cut its fee on subscriptions to 15% from 1 January 2022 — [TechCrunch](https://techcrunch.com/?p=2221893)
- **March 2026 change:** Google cut the Play service fee on recurring subscriptions to 10%.
  - In the US, UK and EEA, a separate 5% billing fee applies only when Google Play Billing is used. That makes about 15% through Play Billing, or 10% plus your own processor through alternative billing or external links.
  - Rollout: US, UK and EEA by 30 June 2026; Australia by 30 September 2026; Japan and Korea by 31 December 2026; rest of world by 30 September 2027. Sources differ on the exact dates.
  - Sources: [Adapty](https://adapty.io/blog/google-play-billing-changes-subscriptions-fees/); [PricePush](https://pricepush.app/blog/google-play-subscription-fees-2026-real-math); [Android Headlines](https://www.androidheadlines.com/2026/06/google-play-store-external-billing-fee-changes.html); [PocketGamer.biz](https://www.pocketgamer.biz/google-play-expands-billing-options-and-lowers-fees-for-developers/); [ProPakistani](https://propakistani.pk/2026/06/27/google-play-store-cuts-fees-and-allows-third-party-billing/)
- **India user choice billing:** after the CCI's October 2022 order, Google extended user choice billing to all developers in India, effective 26 April 2023. When a user picks alternative billing, the developer's service fee drops by 4 percentage points. Fees through Google Play Billing are unchanged — [Google Play Console Help (India)](https://support.google.com/googleplay/android-developer/answer/13306652?hl=en-IN); [Inc42](https://inc42.com/buzz/following-cci-order-google-extends-user-choice-billing-indian-devs/)
- Critics, including the CCI and the Alliance of Digital India Foundation, called the choice "illusory". The alternative path still carries Google's fee plus 1–3% in payment-provider fees — [TechCrunch (2023)](https://techcrunch.com/2023/05/17/google-pushes-ahead-with-in-app-billing-policy-in-india-insists-watchdog-compliance); [Business Standard](https://www.business-standard.com/companies/news/google-says-in-compliance-with-cci-order-pushes-ahead-with-in-app-billing-123051701199_1.html)
- In March 2024 the CCI ordered an investigation into Google's in-app billing over excessive and discriminatory charges — [The Register](https://www.theregister.com/2024/03/20/india_google_pay_antitrust_probe/)

**Epic v. Google (US)**
- **Proposed settlement, 5 November 2025:**
  - Fees capped at 9% or 20% on transactions in Play-distributed apps that use alternative payments. The 20% tier applies to purchases giving "more than a de minimis gameplay advantage".
  - Applies to apps installed or updated from Play after 30 October 2025.
  - A registration path for third-party app stores, running through 30 June 2032.
  - US developers may steer users to other payment methods in-app and through web links.
  - Sources: [SiliconANGLE](https://siliconangle.com/2025/11/05/google-make-major-changes-app-store-settle-epic-games-lawsuit/); [GamesMarket](https://www.gamesmarket.global/google-agrees-to-app-store-reforms-as-part-of-a-settlement-with-epic-games/); [Michael Tsai](https://mjtsai.com/blog/?p=49952)
- Judge Donato did not approve the settlement and questioned whether circumstances had changed enough. Google filed amended terms in March 2026. As of April 2026, fees and alternative distribution were still disputed — [VGC](https://www.videogameschronicle.com/news/judge-postpones-approval-of-epic-vs-google-settlement-wonders-why-theyre-suddenly-bffs); [Stash](https://www.stash.gg/blog/blog-epic-v-google-settlement-update-april-2026)

**Apple, US (Epic v. Apple contempt)**
- 30 April 2025: Judge Gonzalez Rogers held Apple in civil contempt and barred it from charging any commission on US purchases made through outside links — [Digital Policy Alert](https://digitalpolicyalert.org/event/39719-us-court-of-appeals-for-the-ninth-circuit-affirmed-contempt-finding-and-remanded-on-commission-rate-in-epic-games-v-apple); [Cravath](https://www.cravath.com/news-insights/epic-games-ninth-circuit-win-affirming-civil-contempt-finding.html)
- **Ninth Circuit, 11 December 2025:**
  - Affirmed the contempt finding.
  - Held that Apple's 27% commission on linked-out purchases had a prohibitive effect, and that Apple had restricted link design and placement.
  - Reversed the outright ban on any commission and sent the rate back to the district court. Apple may charge limited fees tied to the cost of facilitating the links. No rate was set.
  - Sources: [Digital Policy Alert](https://digitalpolicyalert.org/event/39719-us-court-of-appeals-for-the-ninth-circuit-affirmed-contempt-finding-and-remanded-on-commission-rate-in-epic-games-v-apple); [Concurrences](https://www.concurrences.com/en/bulletin/news-issues/december-2025/the-us-court-of-appeals-for-the-ninth-circuit-upholds-in-part-and-limits-in); [Silicon UK](https://www.silicon.co.uk/e-regulation/legal/apple-epic-appeal-627966)
- 6 May 2026: the Supreme Court denied Apple's application to stay the Ninth Circuit mandate — [Digital Policy Alert](https://digitalpolicyalert.org/event/39722-circuit-justice-denied-apples-application-to-stay-ninth-circuit-mandate-in-epic-games-v-apple); [Aaj TV / Reuters](https://english.aaj.tv/news/amp/330458434)
- 30 June 2026: the Supreme Court granted Apple's petition. Apple's questions are whether the injunction can cover all developers when Epic is the only plaintiff, and whether contempt can rest on the "spirit" of an order — [IPWatchdog](https://ipwatchdog.com/2026/06/30/high-court-grants-cert-in-apples-challenge-to-ninth-circuit-contempt-ruling-in-app-store-dispute/); [GV Wire](https://gvwire.com/2026/06/30/supreme-court-to-hear-apple-appeal-of-contempt-in-epic-games-lawsuit/)
- Judge Gonzalez Rogers refused to pause the remand: "The court is to determine an appropriate commission, that is a factual issue" — [Courthouse News](https://courthousenews.com/apples-fight-over-commissions-for-linked-out-app-store-purchases-continues-in-federal-court/)
- 12 August 2026: Apple filed a further stay application (No. 26A194) to halt lower-court proceedings. Its outcome was not found — [SCOTUSblog](https://www.scotusblog.com/cases/apple-inc-v-epic-games-inc-3/)

**Apple Small Business Program (global)**
- The commission is 15% for developers with under $1M in proceeds (not gross sales) in the prior calendar year. Associated developer accounts must be disclosed. The reduced rate starts 15 days after the end of the fiscal month in which enrollment is approved. Developers can re-qualify after falling back below the threshold — [Adapty SBP guide](https://adapty.io/blog/app-store-small-business-program/); [PricePush](https://pricepush.app/glossary/small-business-program)
- Without the program, subscriptions are charged 30% in a subscriber's first paid year and 15% after that. A lapse of more than 60 days resets the clock, per blog sources. Sources conflict on whether the program's 15% applies to subscriptions from day one; most say it does — [AppsOps](https://appsops.store/blog/app-store-small-business-program-commission); [Adapty SBP guide](https://adapty.io/blog/app-store-small-business-program/)

**Apple, EU (Digital Markets Act)**
- **August 2026 announcement, effective 1 October 2026:**
  - Apple replaces the €0.50-per-install Core Technology Fee (charged above 1M annual EU installs) with a 5% Core Technology Commission on digital sales in apps distributed through alternative marketplaces or the web.
  - App Store tiers: 26% with Apple in-app purchase, 20% with an alternative payment processor, 15% for purchases made on an outside website.
  - Small Business Program members, some partner programs, and auto-renewing subscriptions after year one pay 15% in the App Store, or 10% at the two lower tiers.
  - The European Commission welcomed the changes.
  - Sources: [Anadolu](https://aa.com.tr/en/science-technology/apple-revamps-eu-app-store-fees-to-resolve-regulatory-dispute/4031035); [TechCentral.ie](https://www.techcentral.ie/apple-adjusts-app-store-commissions-in-eu-to-comply-with-digital-markets-act/); [Gigazine](https://gigazine.net/gsc_news/en/20260819-apple-eu-commission/); [BetaNews](https://betanews.com/article/apple-eu-app-store-commission-fee/)

**Apple, India (CCI)**
- The CCI investigation found prima facie that Apple is dominant in iOS app distribution in India. A final hearing on the size of the penalty was set for 21 May 2026. The CCI had earlier rejected Apple's request to pause the case (31 December order) — [Yahoo/Reuters](https://www.yahoo.com/news/articles/india-warns-apple-proceed-antitrust-115203650.html); [MediaNama](https://www.medianama.com/2026/05/223-delhi-hc-stops-final-cci-order-against-apple/); [Sansa Legal](https://www.sansalegal.com/post/cci-vs-apple-2026-india-s-competition-commission-pursues-record-antitrust-penalty-over-app-store-pr)
- In May 2026 the Delhi High Court barred the CCI from passing a final order until a 15 July hearing on Apple's challenge to penalties based on global turnover. Apple estimates its exposure at up to $38B (10% of average global turnover) — [Outlook Business](https://www.outlookbusiness.com/corporate/apple-vs-cci-delhi-hc-hits-pause-on-antitrust-order-till-july-15); [Bar & Bench](https://www.barandbench.com/news/delhi-high-court-asks-cci-not-to-pass-final-orders-in-probe-against-apple)

### Inferences
- What each regime means for a small developer based in India (under $1M in proceeds), by where the buyer is:

| Buyer location | iOS | Android | Practical choice |
|---|---|---|---|
| India | In-app purchase at 15% (Small Business Program). No India alternative billing or link-out found. CCI case stalled. | 15% via Play Billing, or about 11% service fee (15% minus 4 points) plus your own processor (about 2–3%) under user choice billing | Use store billing. Alternative billing saves only about 1–2 points and adds a second payment stack. |
| US | Link to web checkout allowed. The 27% link-out fee was held prohibitive; a cost-based fee may be set on remand; Supreme Court review pending. | From 30 June 2026: 15% with Play Billing (10% + 5%), or 10% plus your processor via alternative billing or links (some sources say link fees are not yet enforced) | Offer a web checkout (merchant of record) to US users, mainly for annual plans and prices above about $4–5 per charge. Keep in-app purchase as the default. |
| EU | From 1 October 2026: in-app purchase 15% for small developers (26% standard); link-out 10–15% plus your processor | Same 10% + 5% structure from 30 June 2026 | Stay on in-app purchase. A link-out plus a 4–8% merchant-of-record fee costs about the same or more than 15%. |
| Rest of world | In-app purchase 15% | 15% until the new structure arrives (reported by 30 September 2027) | Use in-app purchase |

- The US link-out regime is unstable. The Supreme Court took the case on 30 June 2026, so a decision likely comes in the October 2026 term (by about June 2027). The district court may also set a fee in the meantime. A web-checkout path should therefore be a revenue optimisation that can be switched off, not a pillar of the business plan.
- Whatever India relief eventually comes from the CCI cases against Apple and Google is unlikely to arrive in time to shape a 2026–2027 launch.

### Gaps
- Not found: whether Apple currently charges any commission on US link-outs while the remand is pending (October 2026), and its exact current link/button design rules for the US storefront.
- The India timing and rates for Google's new fee structure are unconfirmed. One headline says India follows in 2027, but its source could not be pinned down. It is also unknown whether India's 4-point user-choice-billing discount survives the change.
- No outcomes found for the CCI's 2024 probe into Google billing, the CCI-Apple hearing after 15 July 2026, the Epic v. Google settlement after April 2026, or Apple's stay application 26A194.
- It is unclear whether Apple's EU tiers (26%/20%/15%) stack with any other charges, and which of the "two lower tiers" fall to 10% for Small Business Program members.

## 4. Payment options: Indian gateways (Razorpay, Cashfree, PayU, Stripe India, PayPal) and merchants of record (Paddle, Lemon Squeezy, Dodo, FastSpring, Polar, Creem)

### Takeaway
Stripe India is still invite-only for new accounts, with mandatory video KYC from 1 January 2026. A self-run global card checkout on Stripe is therefore unrealistic for a new Indian individual, so web checkout for global buyers should go through a merchant of record (MoR).
- **Most India-friendly MoRs:** Dodo Payments (India-based, 4% + $0.40, supports UPI) and Polar (4% + 40¢; pays out through Stripe Connect Express even where direct Stripe accounts are invite-only).
- **Others:** Paddle (5% + $0.50) supports INR and UPI AutoPay for buyers, but payouts to Indian sellers were not confirmed. Lemon Squeezy is being folded into Stripe Managed Payments. Creem (3.9% + 40¢) checks out only in USD/EUR.
- **Indian buyers:** Razorpay (2% + GST on the fee, 0.9% subscriptions add-on, 3% on international cards) and Cashfree (1.95–2%) are cheap. With them you remain the merchant, so tax obligations stay with you.

### Cited Findings
**Stripe India**
- "Businesses from India are not able to sign up for a new Stripe account through our website, and instead need to request an invite." Existing accounts continue. Platforms can add new connected accounts by invite only — [Stripe Support](https://support.stripe.com/questions/stripe-accounts-are-invite-only-in-india)
- Stripe's India export page says it "currently only support[s] a select number of businesses, with a focus on international expansion" — [Stripe Docs](https://docs.stripe.com/india-exports)
- From 1 January 2026, RBI's revised payment aggregator guidelines require a live video KYC check for every new user onboarding to Stripe in India — [Stripe Support: Video KYC](https://support.stripe.com/questions/video-kyc-for-india-onboarding)
- Stripe moved to invite-only in 2024, saying it would build infrastructure to support more users by the second half of 2025. Its support page still says it will reach out "when we are ready to open access more broadly" — [Inc42](https://inc42.com/buzz/us-payments-giant-stripe-goes-invite-only-in-india); [The Paypers](https://thepaypers.com/payments/news/stripe-moves-to-invite-only-in-india); [Outlook Business](https://www.outlookbusiness.com/corporate/stripe-shifts-to-invite-only-model-in-india-plans-infrastructure-boost-by-2025)
- Stripe says most Indian banks now support card e-mandates — [Stripe Support: RBI e-mandate FAQ](https://support.stripe.com/questions/rbi-e-mandate-regulations-context-and-faqs)

**Razorpay**
- **Domestic fees:**
  - The platform fee is 2%. New merchants get 0% for the first 90 days according to one Razorpay post, or on the first ₹5 lakh of GMV according to another.
  - 18% GST applies to the fee, so 2% becomes about 2.36% all-in.
  - UPI MDR is 0%, but gateways may charge a platform fee on UPI.
  - Sources: [Razorpay pricing explainer](https://razorpay.com/blog/razorpay-payment-gateway-pricing-explained/); [Razorpay 2026 pricing guide](https://razorpay.com/blog/?p=27981); [Razorpay SaaS cost guide](https://razorpay.com/blog/best-payment-gateway-pricing-saas-india-tco-guide/)
- International cards cost 3% plus GST, plus FX charges. Optional chargeback protection adds about 1% — [Razorpay pricing explainer](https://razorpay.com/blog/razorpay-payment-gateway-pricing-explained/); [Razorpay 2026 pricing guide](https://razorpay.com/blog/?p=27981)
- The Subscriptions add-on is 0.9% per transaction according to Razorpay, or about 0.99% according to a third party — [Razorpay SaaS cost guide](https://razorpay.com/blog/best-payment-gateway-pricing-saas-india-tco-guide/); [LearnWithHasan](https://learnwithhasan.com/payment-gateways/razorpay/)
- Razorpay claims automatic retries (up to 8 attempts) recover 20–30% of revenue lost to temporary failures. This is a vendor claim — [Razorpay blog](https://razorpay.com/blog/upi-autopay-vs-card-e-mandates/)

**Cashfree**
- The standard domestic platform fee is 1.95–2.0% for UPI, cards, net banking and wallets. A limited-time 1.6% rate for new merchants ran through 31 July 2026 and excluded international transactions — [Cashfree pricing](https://www.cashfree.com/en/payment-gateway-charges/)
- Promotional 0% offers exclude subscriptions (e-mandates) and international payments, and 18% GST still applies. International card pricing is unclear: one comparison site cites a 2.99% flat rate from a Cashfree product page, while others give unofficial estimates. An FX charge applies when settling in a currency other than INR — [Xflow on Cashfree charges](https://www.xflowpay.com/blog/cashfree-payment-gateway-charges); [Skydo comparison](https://www.skydo.com/compare/stripe-vs-cashfree); [Cashfree docs](https://www.cashfree.com/docs/help/account/pricing)
- Cashfree UPI AutoPay supports up to ₹15,000 per transaction without additional authentication — [Cashfree UPI AutoPay](https://www.cashfree.com/ae/upi-autopay/)

**PayPal**
- RBI's e-mandate rules disrupted PayPal recurring payments from Indian customers. One merchant support page recommends cards when PayPal fails, noting that card renewals from India still succeed — [Astute Graphics support](https://docs.astutegraphics.com/support/reserve-bank-of-india-e-mandate-directive-paypal-recurring-payments)

**Merchants of record**
- **Paddle:**
  - Third-party reviews put the fee at 5% + $0.50 per transaction.
  - Paddle's India page says buyers can pay by UPI (one-time) and UPI AutoPay (subscriptions), processed in INR.
  - Whether Paddle pays out to sellers based in India was not confirmed. Payouts are typically monthly, per third parties.
  - Sources: [Paddle India](https://www.paddle.com/billing/india); [Paddle blog](https://www.paddle.com/blog/payments-in-india); [LearnWithHasan](https://learnwithhasan.com/payment-gateways/paddle/); [Fungies review](https://fungies.io/paddle-review-2026)
- **Lemon Squeezy:**
  - Fee is 5% + 50¢. Lemon Squeezy is owned by Stripe.
  - A January 2026 update from the CEO reportedly said support is slower and updates are fewer, with the goal of an easy migration to Stripe Managed Payments. No shutdown date has been announced. Signups were reportedly gated in mid-2026 (unconfirmed).
  - Payouts: free to US banks, 1% to non-US banks, PayPal 50¢–3% (capped at $30), $50 minimum.
  - One vendor blog says new merchants in India may need a Stripe invite or PayPal for payouts.
  - Sources: [Dodo's Lemon Squeezy review](https://dodopayments.com/blogs/lemonsqueezy-review); [Fungies](https://fungies.io/lemon-squeezy-stripe-acquisition-saas-founders-2026/); [ProcessorVerdict](https://processorverdict.com/reviews/lemon-squeezy)
- Stripe Managed Payments pricing is reported inconsistently (for example, 3.5% plus standard processing) and may change at general availability — [ParityDeals](https://www.paritydeals.com/stripe-managed-payments-vs-lemon-squeezy-fees/)
- **Polar:**
  - Accepts payments globally except from sanctioned countries.
  - Pays out via Stripe Connect Express to individuals and companies in supported countries "even if Stripe standalone is invite-only there". Whether India is on the list was not confirmed, because the extract was cut off.
  - Fees are 4% + 40¢ per third parties. A competitor claims +1.5% for international cards, +0.5% for subscriptions and $15 per chargeback.
  - Polar adds no payout fee, but the provider charges $2/month for active payouts plus 0.25% + $0.25 per payout.
  - Sources: [Polar supported countries](https://polar.sh/docs/merchant-of-record/supported-countries); [Polar fees](https://docs.polar.sh/documentation/polar-as-merchant-of-record/fees); [Dodo's Polar review](https://dodopayments.com/blogs/polar-sh-review); [LearnWithHasan](https://learnwithhasan.com/payment-gateways/polar/)
- **Creem:**
  - Fee is 3.9% + 40¢, with no setup or monthly fees.
  - A competitor reports a payout fee of $7 or 1% outside EU/SEPA, 2% on USDC payouts, $25 per chargeback, funds held 7–12 days on top of a twice-monthly cycle, and +2% on revenue splits.
  - Checkout is USD/EUR only, and India UPI is not supported.
  - Sources: [ChatGate](https://chatgate.ai/post/creem-2-0); [Fungies on Creem](https://fungies.io/alternatives/creem); [Fungies comparison](https://fungies.io/creem-vs-paddle-vs-fungies-saas-mor-2026)
- **Dodo Payments:**
  - India-based MoR handling payments, billing and tax compliance. Advertised at 4% + $0.40, described as including processing, tax handling, compliance and chargeback management.
  - Fees for India-based merchants: ₹5 per domestic payout, $5 + 1% per international payout, ₹10 per refund, ₹1,000 per chargeback.
  - Payouts are bi-monthly by default (weekly and monthly also offered) with a $50 minimum, per a third party. Funds may be held in some cases.
  - Supports India UPI.
  - Sources: [Dodo docs](https://docs.dodopayments.com/miscellaneous/pricing-and-fee-structure); [Payhip on Dodo](https://payhip.com/hub/what-is-dodo-payments/); [Dodo Trustpilot replies](https://uk.trustpilot.com/review/dodopayments.com?page=2); [Fungies comparison](https://fungies.io/dodo-payments-vs-creem-vs-fungies-mor-indie-hackers-2026)

### Inferences
- Fee per charge, merchant of record vs a 15% store fee. This excludes surcharges, payout fees, FX and taxes:

| Price per charge | Store 15% | Paddle 5% + $0.50 | Polar or Dodo 4% + $0.40 | Creem 3.9% + $0.40 |
|---|---|---|---|---|
| $2.99/month | $0.45 (15%) | $0.65 (21.7%) | $0.52 (17.4%) | $0.52 (17.4%) |
| $9.99/month | $1.50 (15%) | $1.00 (10.0%) | $0.80 (8.0%) | $0.79 (7.9%) |
| $59.99/year | $9.00 (15%) | $3.50 (5.8%) | $2.80 (4.7%) | $2.74 (4.6%) |

- A merchant of record beats 15% only above about $3.60 per charge (Creem, Polar, Dodo) or $5.00 (Paddle). With Polar's claimed surcharges, the breakeven is about $4.44. Web checkout therefore makes sense for annual plans and for US/EU prices of $5 or more a month, not for cheap monthly plans.
- For Indian buyers at ₹99–₹299/month, a fixed fee of $0.40–$0.50 is roughly 15–45% of the price (assuming about ₹85–90 per USD; that rate is not sourced). Indian web buyers should go through Razorpay or Cashfree. Razorpay's total cost is about 2.4% plus the 0.9% subscriptions add-on, or about 3.3–3.4% if GST also applies to the add-on. Indian app users stay on store billing.
- Tools that depend on Stripe accounts may be hard for a new Indian individual to use. That includes Stripe Billing directly, the Lemon Squeezy-to-Stripe Managed Payments path, and Stripe-based web billing add-ons. This favours merchants of record that pay out to India (Dodo, possibly Polar and Paddle) or Indian gateways.

### Gaps
- Not researched because the search budget ran out: PayU subscription pricing, PayPal India fees on international receipts, and FastSpring's pricing and India eligibility.
- Not confirmed: whether Paddle pays out to Indian sellers, whether India is on Polar's payout list, and Dodo's settlement currency and handling of GST for Indian buyers.
- Not confirmed: whether Stripe Managed Payments is available to Indian sellers.

## 5. RBI recurring-payment rules and UPI AutoPay

### Takeaway
RBI's consolidated Digital Payments – E-Mandate Framework, 2026 (21 April 2026) keeps the core rules:
- Extra authentication (AFA) at mandate registration and the first debit.
- After that, automatic debits without AFA up to ₹15,000 per transaction. The limit is ₹1 lakh for insurance, mutual funds and credit-card bills.
- A pre-debit notice at least 24 hours before each debit, with an option to opt out.
- Applies to cards, prepaid instruments and UPI, domestic and cross-border.

NPCI also restricts UPI AutoPay debits to off-peak hours, with one attempt plus three retries (from 1 August 2025). At ₹99–₹999 creator-tool prices, the ₹15,000 limit never binds. The friction is setting up the mandate, the renewal notice that invites cancellation, and failed debits.

### Cited Findings
- RBI issued the Digital Payments – E-Mandate Framework, 2026 on 21 April 2026 (circular RBI/CO.DPSS.POLC.No.S56/02.14.003/2026-27), effective immediately. It consolidates and repeals the 2019–2024 e-mandate circulars and covers recurring transactions via cards, prepaid instruments and UPI, domestic or cross-border — [TaxGuru](https://taxguru.in/rbi/rbi-issues-consolidated-directions-digital-payments-e-mandate-framework-2026.html); [Maheshwari & Co](https://www.maheshwariandco.com/press-release/rbi-e-mandate-framework-2026/); [SCC Online](https://www.scconline.com/blog/post/2026/04/24/rbi-issues-digital-payments-e-mandate-framework-2026/); [Outlook Money](https://www.outlookmoney.com/personal-finance/rbi-issues-digital-payments-e-mandate-framework-to-simplify-and-secure-recurring-transactions); [Conventus Law](https://conventuslaw.com/report/rbis-digital-payments-e-mandate-framework-2026-consolidated-directions-for-recurring-digital-transactions/)
- **Authentication rules:**
  - Registration needs AFA, and so does the first transaction (the two can be combined).
  - Later recurring debits need no AFA up to ₹15,000 per transaction; above that, AFA is required.
  - The limit is ₹1,00,000 for insurance premiums, mutual fund subscriptions and credit-card bills.
  - Changing or cancelling a mandate requires AFA.
  - Sources: [RBI notification](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=13374); [RBI notification PDF](https://rbidocs.rbi.org.in/rdocs/notification/PDFs/396MDD002E435ECA145509929FC3ACBCFD0E9.PDF); [Rocketpay](https://rocketpay.co.in/blog/rbi-e-mandate-recurring-payments-15000); [Punjab Kesari/IANS](https://english.punjabkesari.com/business/rbi-tightens-e-mandate-rules-makes-extra-authentication-mandatory-for-recurring-payments-above-rs-15000/)
- The card issuer must send a pre-debit notice at least 24 hours ahead with the merchant name, amount, debit date and time, mandate reference and reason. Customers can opt out of that debit. Post-transaction alerts and grievance redress are mandatory. FASTag and NCMC top-ups are exempt from the pre-debit notice — [RBI notification PDF](https://rbidocs.rbi.org.in/rdocs/notification/PDFs/396MDD002E435ECA145509929FC3ACBCFD0E9.PDF); [Rocketpay](https://rocketpay.co.in/blog/rbi-e-mandate-recurring-payments-15000); [Outlook Money](https://www.outlookmoney.com/personal-finance/rbi-issues-digital-payments-e-mandate-framework-to-simplify-and-secure-recurring-transactions)
- The ₹1 lakh limit for mutual funds, insurance and credit-card bills dates from RBI's December 2023 change. The higher UPI AutoPay limits are tied to specific merchant category codes — [DT Next](https://www.dtnext.in/news/business/automatic-payment-limit-via-upi-raised-to-rs-1-lakh-rbi-754046); [Onmanorama](https://www.onmanorama.com/news/business/2023/12/13/automatic-payment-upi-1-lakh-rbi.html); [Eximpe](https://eximpe.com/blog/saas/upi-autopay-for-saas-setup-limits-and-what-global-founders-need-to-know)
- The 2026 framework borrows its definitions from RBI's Authentication Mechanisms for Digital Payment Transactions Directions, 2025 (25 September 2025) — [Outlook Money](https://www.outlookmoney.com/personal-finance/rbi-issues-digital-payments-e-mandate-framework-to-simplify-and-secure-recurring-transactions)
- **NPCI UPI AutoPay rules** (circular of 21 May 2025, effective 1 August 2025):
  - Debits run only outside peak hours: before 10:00, 13:00–17:00, or after 21:30.
  - Each mandate gets one attempt plus three retries. Secondary coverage reports that the mandate is cancelled automatically if all attempts fail.
  - Mandates can still be created at any time.
  - Sources: [Taxscan](https://www.taxscan.in/upi-auto-pay-transactions-to-be-restricted-from-august-1-as-new-api-rules-kick-in/521991); [SCC Online](https://www.scconline.com/blog/post/2025/07/30/upi-changes-starting-august-1-ncpi-guidelines-upi-api-usage-2025/); [Business Standard](https://www.business-standard.com/finance/personal-finance/upi-apps-to-limit-balance-checks-autopay-from-aug-1-how-changes-help-you-125072900572_1.html)
- History: after the 2021 card rules (an older ₹5,000 threshold is cited on a PayPal-related page), card subscription failure rates rose to 20%+ in some categories, which pushed merchants toward UPI AutoPay (vendor claim). Inc42 reported that UPI AutoPay and NACH were not affected, and that 80% of surveyed founders had not used card e-mandate platforms — [Razorpay](https://razorpay.com/blog/upi-autopay-vs-card-e-mandates/); [Astute Graphics](https://docs.astutegraphics.com/support/reserve-bank-of-india-e-mandate-directive-paypal-recurring-payments); [Inc42](https://inc42.com/features/recurring-payment-conundrum-how-guidelines-have-shaken-indias-subscription-economy/)
- **UPI AutoPay volumes (sources conflict):**
  - A Razorpay explainer citing NPCI says more than 26M new mandates are created per month, rising to about 50M by mid-2025 — [Razorpay](https://razorpay.com/blog/what-is-upi-mandate)
  - Razorpay's 2026 guide says both "over 120 million" and "over 3 million" per month — [Razorpay](https://razorpay.com/blog/upi-autopay-vs-card-e-mandates/)
  - More than 20M AutoPay mandates are cancelled each month, largely due to insufficient balance (August 2025) — [Business Standard](https://www.business-standard.com/finance/news/upi-discretionary-spending-bars-restaurants-autopay-revocations-august-2025-125090800646_1.html)
  - The 2021 base was 4.03M mandates in October 2021 — [Business Standard](https://www.business-standard.com/article/economy-policy/upi-autopay-sees-28-34-rise-in-recurring-mandates-shows-data-121111100067_1.html)
  - All UPI transactions totalled about 23.2B per month in May 2026 — [CoinLaw](https://coinlaw.io/upi-statistics/)
  - NPCI publishes AutoPay statistics — [NPCI](https://www.npci.org.in/product/upi/product-statistics)

### Inferences
- Indian subscribers get a notice before every renewal with a way to opt out. That likely raises monthly-plan churn compared with US card-on-file billing, and it favours annual plans. Annual plans at creator-tool prices stay well under ₹15,000, so they avoid AFA at renewal.
- UPI AutoPay is the main rail for Indian consumer subscriptions on the web. A web flow needs good failure handling within NPCI's one-attempt-plus-three-retries limit, such as in-app prompts to pay manually and win-back offers.
- Store billing (Apple/Google) handles mandates and retries for you. That is another reason for an India-focused mobile app to use store billing.

### Gaps
- No verified monthly NPCI AutoPay registration or execution figures for 2025–2026.
- No independent measure of how e-mandate rules affect subscription conversion. The 20–30% retry-recovery figure is a vendor claim.
- It is unclear whether the auto-cancel-after-failed-retries rule applies per debit cycle or to the whole mandate.
- Not researched: whether Google Play and Apple in India support UPI AutoPay for in-app subscriptions.

## 6. Tax and legal: GST on domestic and export SaaS, LUT, OIDAR, merchants of record and foreign VAT, entity choice, Section 44ADA

### Takeaway
SaaS or app subscriptions exported from India are zero-rated if all five export conditions in Section 2(6) of the IGST Act are met, especially payment in convertible foreign exchange. Filing an LUT (Form RFD-11) lets you export without paying IGST and keep input tax credit.

A merchant of record splits each sale in two: the MoR sells to the customer (and handles that country's VAT or sales tax), and you sell to the MoR (an export). So you do not register for foreign VAT. Domestic sales to Indian consumers attract GST once you are registered; the rate (widely 18%) was not re-verified in this session.

Below ₹20 lakh aggregate turnover, Notification 10/2017-IGST may exempt inter-state and export service suppliers from registration, but practitioners disagree. Voluntary registration is often recommended.

On entity choice:
- Sole proprietorship (slab rates) is cheapest at first.
- A Pvt Ltd or OPC under Section 115BAA (about 25.17% effective) helps once profits are retained.
- An LLP pays 30%.

Section 44ADA (50% presumptive income, up to ₹75 lakh if at least 95% of receipts are digital) covers specified professions. It is unresolved whether SaaS subscription revenue qualifies or is business income.

### Cited Findings
- **Export of services:**
  - Section 2(6) of the IGST Act requires all five conditions: supplier in India; recipient outside India; place of supply outside India; payment in convertible foreign exchange (or INR where RBI permits); and supplier and recipient not merely establishments of the same person — [Tally](https://tallysolutions.com/gst/gst-software-saas-exports-international-clients/); [Skydo](https://www.skydo.com/blog/export-of-services-under-gst); [Xflow](https://www.xflowpay.com/blog/gst-on-software-services)
  - Exports are zero-rated under Section 16 of the IGST Act (not exempt, so input tax credit is kept). You either export under an LUT (Form GST RFD-11) without paying IGST and claim a refund of unused credit, or pay IGST and claim a refund. Anyone prosecuted for evasion above ₹250 lakh must furnish a bond instead — [Patron Accounting](https://www.patronaccounting.com/blog/gst-on-saas-exports-lut); [IncorpX](https://www.incorpx.io/blog/saas-business-gst-guide-india); [Tally](https://tallysolutions.com/gst/gst-software-saas-exports-international-clients/)
  - For cross-border services, place of supply generally follows the recipient's location under Section 13 of the IGST Act — [IncorpX](https://www.incorpx.io/blog/saas-business-gst-guide-india)
- **Registration threshold:**
  - The threshold is ₹20 lakh (₹10 lakh in special-category states), counted on aggregate turnover across the PAN — [SetIndiaBiz](https://www.setindiabiz.com/?p=15182); [TaxAdda](https://taxadda.com/gst-on-freelancers/); [RegisterKaro](https://www.registerkaro.in/post/gst-registration-for-freelancers)
  - Notification 10/2017-IGST exempts inter-state service suppliers below the threshold from compulsory registration. Some practitioners argue exports always require registration. Voluntary registration is often more practical for banking compliance and input tax credit — same sources.
  - One source claims that freelancers using paid foreign tools must register and pay IGST under reverse charge regardless of turnover. This is contested and should be checked with a CA — [TaxAdda](https://taxadda.com/gst-on-freelancers/)
- **Merchants of record and OIDAR:**
  - One sale through an MoR becomes two transactions: the customer buys from the MoR, and the MoR buys from you. The MoR is the party liable for Indian GST on digital services sold to Indian buyers, and OIDAR registration has no minimum threshold — [Eximpe](https://eximpe.com/blog/psp/merchant-of-record-india)
  - An Indian developer's supply to a foreign MoR can be a zero-rated export if the conditions are met, including receiving convertible foreign exchange with proof — [Eximpe](https://eximpe.com/blog/psp/merchant-of-record-india)
  - Foreign OIDAR suppliers are responsible for Indian registration where the invoice identifies the service and the supplier — [India Briefing](https://www.india-briefing.com/news/tax-digital-services-oidar-in-india-gst-applicability-and-compliance-22465.html); [India Briefing (OIDAR compliance)](https://www.india-briefing.com/news/oidar-compliance-india-gst-registration-ntor-gstr5a-digital-tax-43951.html/)
  - MoRs market tax handling as part of their fee. Dodo says it manages "payments, billing, tax compliance", and its 4% + $0.40 includes "tax handling". Lemon Squeezy describes itself as "Payments, tax & subscriptions for software companies" — [Payhip on Dodo](https://payhip.com/hub/what-is-dodo-payments/); [Dodo Trustpilot replies](https://uk.trustpilot.com/review/dodopayments.com?page=2); [Lemon Squeezy](https://www.lemonsqueezy.com/); [Polar payments & taxes](https://docs.polar.sh/payment)
- **Section 44ADA:**
  - Applies to resident individuals and partnership firms (not LLPs) in professions specified under Section 44AA(1). Listed examples are legal, medical, engineering, architecture, accountancy, technical consultancy and interior decoration. Software and SaaS are not named.
  - Presumptive income is 50% of gross receipts. The limit is ₹50 lakh, or ₹75 lakh if cash receipts are at most 5% (from AY 2024–25).
  - Returns are filed on ITR-4, or ITR-3 if there are capital gains or foreign assets.
  - Sources: [Treelife](https://treelife.in/taxation/presumptive-taxation-under-section-44ad-44ada/); [TaxBuddy](https://www.taxbuddy.com/blog/presumptive-taxation-under-section-44ada); [Skydo](https://cdn.skydo.com/blog/44ada-of-income-tax-act); [PNB MetLife](https://www.pnbmetlife.com/articles/taxation/how-section-44ada-simplifies-tax-for-professionals-in-india.html)
- **Entity choice:**
  - A sole proprietorship pays slab rates; one example puts tax on ₹15 lakh profit at about ₹2.5–3 lakh.
  - An LLP pays a flat 30% plus cess.
  - A Pvt Ltd or OPC under Section 115BAA pays 22% (about 25.17% effective) but gives up most deductions and MAT credit. Dividends are taxed again in the shareholder's hands.
  - An LLP is audited only if turnover exceeds ₹40 lakh or contribution exceeds ₹25 lakh. A Pvt Ltd or OPC is audited every year and must hold at least 4 board meetings a year. LLP compliance costs about ₹15,000–40,000 a year (one estimate).
  - A Pvt Ltd needs at least 2 shareholders and is the only structure that suits investors and ESOPs. An OPC suits a single founder.
  - One creator-focused guide suggests staying a sole proprietor until profit reaches about ₹25–30 lakh a year.
  - Sources: [Winvesta](https://www.winvesta.in/blog/businesses/pvt-ltd-vs-llp-vs-sole-prop-which-pays-least-tax-on-usd-income); [LegalWiz](https://www.legalwiz.in/blog/llp-vs-private-limited-company-tax-benefits); [Kanakkupillai](https://www.kanakkupillai.com/learn/maximizing-tax-benefits-private-limited-vs-sole-proprietorship-in-india/); [Beacon Filing](https://beaconfiling.com/comparisons/compliance-cost-pvt-ltd-vs-llp-vs-opc); [DealPlexus](https://www.dealplexus.com/blog/content-creator-business-structure-india/raw)

### Inferences
- A practical setup for a solo developer in Gujarat:
  1. A sole proprietorship to start.
  2. Voluntary GST registration plus an LUT, so exports are zero-rated with clean paperwork.
  3. App-store billing for in-app sales, and a merchant of record for any global web checkout, so no foreign VAT or US sales-tax registration is needed.
  4. Receive payouts in foreign currency with proof (FIRA/FIRC or bank advice) to support zero-rating.
  5. Convert to a Pvt Ltd or OPC once profits are retained or investors are involved.
- If 44ADA does not apply to SaaS or app revenue, the fallback is regular books or Section 44AD for businesses. Get CA advice before the first tax year.

### Gaps
- Not re-verified in this session (search budget exhausted): the domestic GST rate and SAC code for SaaS and app subscriptions after the September 2025 GST rate changes. It is widely cited as 18%.
- Not researched: whether Apple and Google payouts to Indian developers count as zero-rated exports, and how they handle Indian GST on in-app sales to Indian users.
- Unresolved: whether SaaS or app subscription income counts as a profession (44ADA) or a business (44AD), and the section numbers under the Income-tax Act, 2025 (in force from 1 April 2026).
- Not researched: equalisation levy and TDS/TCS on payouts. Also not researched: whether Dodo (an Indian MoR) charges GST to Indian buyers and how it invoices Indian sellers.

## 7. Pricing strategy: regional pricing, India price points, lifetime deals, freemium vs trial vs hard paywall

### Takeaway
The evidence favours hard paywalls and longer trials:
- Download-to-paid by day 35 is 10.7% with a hard paywall vs 2.1% for freemium, and day-14 revenue per install is $2.32 vs $0.27.
- 17–32-day trials convert at about 42–46%, vs about 25% for trials of four days or less.
- Trial users retain 1.4–1.7x better than direct buyers.

Regional pricing is standard. Adapty's index puts India at 0.6x US prices, against 1.2x for the big-five Western European markets. No hard data was found on which INR price points convert best, or on AppSumo lifetime-deal economics.

### Cited Findings
- Adapty's pricing index across 22 countries: India 0.6x, US 1.0x, UK/France/Germany/Italy/Spain 1.2x — [Adapty report page](https://adapty.io/state-of-in-app-subscriptions-report/)
- Hard paywall vs freemium (SOSA 2026): D35 conversion 10.7% vs 2.1%; D14 revenue per install $2.32 vs $0.27 — [RevenueCat SOSA 2026](https://www.revenuecat.com/state-of-subscription-apps); [SaaStr](https://www.saastr.com/the-top-10-learnings-from-revenuecats-state-of-subscription-apps-how-115000-mobile-apps-deliver-16b-in-revenue-whats-working-whats-quietly-killing-growth/)
- Trial length: SOSA 2026 shows 42.5% conversion for 17–32-day trials vs 25.5% for ≤4-day trials. SOSA 2025 shows 45.7% for 17–32-day trials, and 3-day and 7-day trials had the most early cancellations — [PricePush](https://pricepush.app/blog/trial-to-paid-conversion-rate-benchmarks); [I Programmer](https://www.i-programmer.info/news/83-mobilephone/17938-making-money-from-subscription-apps.html)
- Trial users retain 1.4–1.7x better than direct buyers. The LTV premium from offering a trial is +85.1% in Utilities but negative in Lifestyle and Productivity — [Adapty blog](https://adapty.io/blog/mobile-app-monetization-2026/); [Adapty blog](https://adapty.io/blog/subscription-app-success-2026/)
- Year-one annual-plan retention reportedly falls with price: about 36% for low, 26% for mid and 23% for high price tiers (secondary, unverified) — [ARPU Brothers summary](https://arpubrothers.com/blog/revenuecat-subscription-app-report-2026/)
- AI apps earn about 41% more per payer but churn about 30% faster — [TechCrunch](https://techcrunch.com/2026/03/10/ai-powered-apps-struggle-with-long-term-retention-new-report-shows)
- Year-one realised LTV per payer in IN/SEA is $14, vs $32 in North America — [RevenueCat 2026 benchmarks blog](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026)
- Checkout currency matters. Creem shows Indian buyers USD or EUR prices only, while Paddle and Dodo support INR or UPI — [Fungies on Creem](https://fungies.io/alternatives/creem); [Paddle India](https://www.paddle.com/billing/india); [Fungies comparison](https://fungies.io/dodo-payments-vs-creem-vs-fungies-mor-indie-hackers-2026)

### Inferences
- **Pricing for creator tools:**
  - Use a hard paywall, or an onboarding paywall with a trial of at least 7 days. Short 3-day trials attract early cancellations.
  - Lead with annual plans. They also blunt India's per-renewal pre-debit notices and the faster churn typical of AI apps.
  - Use store price tiers localised by country, with India at roughly 0.4–0.6x US prices. A US price of $7.99–$9.99/month at 0.6x would be about $4.80–$6/month, which is roughly in line with the common ₹299–₹499 tiers. This is inferred: no INR conversion data was found.
- **Lifetime deals:** they are a poor fit for AI-heavy creator tools, whose per-use model costs keep accruing while the revenue arrives once. This is a cost-structure inference; no AppSumo data was gathered.

### Gaps
- No data found on conversion at INR price points (₹99–₹499/month vs annual) or on weekly plans in India.
- Not researched: AppSumo lifetime-deal terms (revenue split) and founder outcomes, and adoption data for PPP pricing tools.

## 8. Mobile-only vs mobile + web (scope updated): distribution, web checkout and shared entitlements, build cost and time

### Takeaway
For Instagram creators, vloggers and individuals paying for themselves, start mobile-first. They work on their phones. App stores handle billing, local payment methods, renewals and tax for buyers. Store fees (15% for small developers) are hard to beat in India and the EU. A light web companion pays off mainly for:
- US users, where link-outs to web checkout are allowed;
- annual or higher-priced plans, where merchant-of-record fees fall below 15%;
- SEO-driven acquisition.

RevenueCat's own data already spans iOS, Android and web. Shared-entitlement mechanics and build cost and time could not be researched after the scope update. See Gaps.

### Cited Findings
- RevenueCat's 2026 dataset covers subscriptions bought on iOS, Android and web (1B+ transactions) — [Subscription Insider](https://www.subscriptioninsider.com/blog/revenuecat-data-shows-subscription-app-growth-concentrating-at-the-top-news)
- IN/SEA revenue leans most toward Android of any region, but iOS still earns most of it — [RevenueCat SOSA 2026](https://www.revenuecat.com/state-of-subscription-apps)
- App-store competition is rising: about 15,000 new subscription apps launch each month — [Subscription Insider](https://www.subscriptioninsider.com/blog/revenuecat-data-shows-subscription-app-growth-concentrating-at-the-top-news)
- In the US, Apple's 27% fee on link-outs was held prohibitive. Any replacement fee must be limited and cost-based, and is being set on remand, with Supreme Court review pending — [Digital Policy Alert](https://digitalpolicyalert.org/event/39719-us-court-of-appeals-for-the-ninth-circuit-affirmed-contempt-finding-and-remanded-on-commission-rate-in-epic-games-v-apple); [IPWatchdog](https://ipwatchdog.com/2026/06/30/high-court-grants-cert-in-apples-challenge-to-ninth-circuit-contempt-ruling-in-app-store-dispute/)
- Google in the US, UK and EEA (from 30 June 2026): the 5% billing fee does not apply to alternative billing or external links, leaving a 10% service fee plus your processor — [Adapty](https://adapty.io/blog/google-play-billing-changes-subscriptions-fees/); [PricePush](https://pricepush.app/blog/google-play-subscription-fees-2026-real-math)
- India: Google user choice billing cuts the service fee by 4 points. No Apple alternative was found — [Google Play Console Help (India)](https://support.google.com/googleplay/android-developer/answer/13306652?hl=en-IN); [Outlook Business](https://www.outlookbusiness.com/corporate/apple-vs-cci-delhi-hc-hits-pause-on-antitrust-order-till-july-15)
- EU (from 1 October 2026): Apple link-out purchases cost 15% (reportedly 10% for Small Business Program members) — [TechCentral.ie](https://www.techcentral.ie/apple-adjusts-app-store-commissions-in-eu-to-comply-with-digital-markets-act/)
- New Indian Stripe accounts are invite-only, which limits Stripe-based web billing stacks — [Stripe Support](https://support.stripe.com/questions/stripe-accounts-are-invite-only-in-india)

### Inferences
- **Recommended pattern for a React Native/Expo + Next.js developer:**
  - The mobile app uses store in-app purchases through a cross-platform subscription SDK such as RevenueCat, which is the default everywhere.
  - A Next.js web companion handles SEO landing pages and a US/EU-facing checkout through a merchant of record that pays out to India (Dodo, Polar, or possibly Paddle). Web-only Indian buyers pay via Razorpay or Cashfree UPI AutoPay.
  - One user account (an auth provider) maps web purchases and store purchases onto the same entitlement, so a subscriber gets access on every platform.
  - Link out from the iOS app only on the US storefront, behind a switchable flag in case the court-set fee changes. Google alternative billing in India saves too little to justify at launch.
- **Where the saving matters:** web checkout saves about 5–10 points of revenue per transaction only at about $5+ per charge (see the fee table in section 4). For India-heavy, low-price monthly plans, store billing is close to optimal and removes payment-ops work for a solo developer.
- **Distribution:** creators find tools through Instagram/YouTube content and app-store search. A web companion adds SEO pages (templates, how-tos) and shareable output links, which a mobile-only app lacks. This is inference; no comparative ASO vs SEO data was gathered.

### Gaps
- Not researched, because the scope update arrived after the search budget ran out:
  - How RevenueCat Web Billing and shared entitlements work, its pricing, and whether it needs a Stripe account (a problem for new Indian sellers) or supports Paddle or other merchants of record.
  - Alternatives such as Adapty or Purchasely web paywalls, and web-to-app funnel benchmarks.
- Unverified background to check: RevenueCat is generally understood to offer web billing tied to Stripe, with integrations for some other billing providers. Confirm current support for India-based sellers.
- No sourced data on ASO vs SEO acquisition costs for creator tools, or on web vs app conversion for this audience.
- No sourced estimate of build cost or time for a React Native/Expo app with a light Next.js companion. To verify:
  - Apple Developer Program fee (commonly $99/year) and Google Play one-time registration (commonly $25).
  - Expo EAS build tiers and RevenueCat pricing tiers.
  - Typical solo-developer MVP timelines.
- Not checked: whether Apple's US link-out rules allow buttons inside the app or only links, and Google's US external-offer program requirements.
