# WooCommerce Active Subscriptions — Migration Data
# Exported March 24, 2026

| WC Order # | Customer | Product | Amount | Interval | Start Date | Next Payment | Orders |
|------------|----------|---------|--------|----------|------------|--------------|--------|
| #3074 | Greg Wann | SMM-Marketing_Basic - Social Media Marketing | $493.00 | /month | Jan 22, 2026 | Apr 1, 2026 | 3 |
| #3036 | Frank Poe | Google Local Service Ads (LSA) Management & Optimization | $250.00 | /month | Nov 25, 2025 | Apr 1, 2026 | 5 |
| #3028 | Frank Poe | Managed Web Hosting | $39.00 | /month | Nov 24, 2025 | Apr 24, 2026 | 5 |
| #3026 | Frank Poe | Fully Managed SEO - Basic | $992.70 | /month | Nov 24, 2025 | Apr 1, 2026 | 4 |
| #3019 | Keith A Beck | SMM-Marketing_Basic - Social Media Marketing | $493.00 | /month | Nov 23, 2025 | Apr 1, 2026 | 5 |
| #2940 | Michael Lark | Managed Web Hosting | $31.00 | /month | Aug 14, 2025 | Apr 17, 2026 | 8 |
| #2860 | Ashley Hayes | Managed Web Hosting | $39.00 | /month | Mar 29, 2025 | Mar 31, 2026 | 12 |
| #2823 | Jonathan Coay | Managed Web Hosting | $335.00 | /year | Feb 11, 2025 | Feb 11, 2027 | 3 |
| #2821 | Lindsay Fry | Managed Web Hosting | $745.00 | /year | Feb 10, 2025 | Feb 10, 2027 | 2 |
| #2742 | Jeffrey McAlister | Managed Web Hosting | $637.00 | /year | Jan 23, 2025 | Jan 23, 2027 | 2 |
| #2659 | Gail McBain | Custom Social Media Package for HER Fitness | $585.25 | /month | Jan 7, 2025 | Apr 17, 2026 | 15 |
| #2633 | Ryan LaCross | Managed Web Hosting | $421.00 | /year | Dec 26, 2024 | Dec 26, 2026 | 2 |
| #2346 | John Patterson | Managed Web Hosting | $421.00 | /year | Jun 4, 2024 | Jun 4, 2026 | 2 |
| #2340 | Glenn Glasser | Managed Web Hosting | $378.90 | /year | May 28, 2024 | May 28, 2026 | 2 |
| #2319 | Jean-Philippe Dupuis | Managed Web Hosting | $39.00 | /month | May 6, 2024 | Apr 6, 2026 | 23 |
| #2248 | Sean Rowe | Managed Web Hosting | $0.00 | Manual | Jan 26, 2024 | Feb 26, 2027 | 5 |
| #2233 | John Gibson | Managed Web Hosting | $421.00 | /year | Jan 10, 2024 | Jan 12, 2027 | 3 |
| #2209 | Brenden Moriarty | Managed Web Hosting | $39.00 | /month | Dec 11, 2023 | Apr 17, 2026 | 28 |
| #2194 | Jeffrey McAlister | Managed Web Hosting | $421.00 | /year | Nov 15, 2023 | Nov 15, 2026 | 4 |
| #2077 | Marnie Buchsbaum | Managed Web Hosting | $335.00 | /year | Aug 15, 2023 | Aug 15, 2026 | 3 |
| #2060 | GREG BROCK | Managed Web Hosting | $378.90 | /year | Jul 10, 2023 | Jul 10, 2026 | 3 |
| #1995 | Tiffini Brown | Fully Managed SEO - Basic | $993.00 | /month | May 2, 2023 | Apr 1, 2026 | 35 |
| #1918 | Ashley Dunmire | Managed Web Hosting | $39.00 | /month | Mar 28, 2023 | Apr 3, 2026 | 36 |
| #1892 | Corey Smith | Managed Web Hosting | $39.00 | /month | Feb 7, 2023 | Apr 17, 2026 | 38 |
| #1885 | Mick Anderson | Managed Web Hosting | $421.00 | /year | Jan 26, 2023 | Jan 26, 2027 | 4 |
| #1880 | Ashley Grimaldi | Managed Web Hosting | $39.00 | /month | Jan 23, 2023 | Apr 23, 2026 | 39 |
| #1719 | Ann Gilbert | Managed Web Hosting | $69.00 | /month | Nov 18, 2022 | Apr 18, 2026 | 41 |
| #1717 | Gail McBain | Managed Web Hosting | $69.00 | /month | Nov 18, 2022 | Apr 20, 2026 | 41 |
| #1628 | Glenn Glasser | Fully Managed SEO - Basic | $993.00 | /month | Aug 26, 2022 | Apr 2, 2026 | 42 |

## Notes
- Jeffrey McAlister has 2 subscriptions (#2742 annual + #2194 annual)
- Frank Poe has 3 subscriptions (#3036 LSA + #3028 hosting + #3026 SEO)
- Gail McBain has 2 subscriptions (#2659 custom social + #1717 hosting)
- Glenn Glasser has 2 subscriptions (#2340 hosting + #1628 SEO)
- Sean Rowe #2248 is $0 manual — internal/test account, skip or handle separately
- Gail McBain #2659 is a CUSTOM package ($585.25/mo HER Fitness social) — needs custom product
- Frank Poe #3026 shows $992.70 (slightly different from standard $993.00) — note the discrepancy

## Migration Steps (DO WHEN READY TO GO LIVE)
1. Export Stripe Customer IDs from live Stripe for each customer email
2. Create user accounts in new system (email match)
3. Link existing Stripe Customer ID + Subscription ID to new user records
4. Map WC products to new system product slugs
5. Do NOT create new Stripe subscriptions — link to existing ones
6. Send password reset emails to all 29 customers
