
import { MetricCategory } from "@/types/metrics";

export const metricsData: MetricCategory[] = [
  {
    id: "foundational",
    name: "Foundational Metrics",
    description: "Objective indicators of a project's baseline strength and viability.",
    metrics: [
      {
        id: "funding",
        name: "Funding",
        description: "Indicates investor confidence and resources available for sustained growth.",
        importance: "Strong correlation between a project's funding level and its strategic viability.",
        thresholds: {
          T0: "More than $500,000",
          T1: "Less than $500,000"
        },
        tools: [
          "Crunchbase",
          "PitchBook",
          "Messari",
          "CoinDesk & Cointelegraph",
          "Project Websites & Official Blog"
        ]
      },
      {
        id: "team-experience",
        name: "Team Experience",
        description: "Assesses the relevant expertise and track record of founders and leadership.",
        importance: "Experienced teams are better equipped to navigate complexities and execute effectively.",
        thresholds: {
          T0: "Founders and leadership have at least 5 years of relevant blockchain or industry-specific experience",
          T1: "Limited or irrelevant experience among founders and leadership"
        },
        tools: [
          "LinkedIn",
          "Twitter (X)",
          "GitHub Profiles",
          "Personal or Professional Websites",
          "Medium or Substack Articles"
        ]
      },
      {
        id: "team-diversity",
        name: "Team Diversity",
        description: "Evaluates the geographical and functional diversity of the team.",
        importance: "Diverse teams bring varied perspectives, promote innovation, and increase adaptability.",
        thresholds: {
          T0: "Teams representing at least 3 different countries or spanning at least 2 continents",
          T1: "Teams from fewer than 3 countries or restricted to a single continent"
        },
        tools: [
          "LinkedIn",
          "Company Website",
          "Public Interviews and Podcasts",
          "Crunchbase & PitchBook"
        ]
      },
      {
        id: "github-activity",
        name: "GitHub Activity",
        description: "Measures development activity, transparency, and community engagement.",
        importance: "Active code repositories indicate robust development and community engagement.",
        thresholds: {
          T0: "Consistently high activity with at least 20 commits per month, active engagement across 5+ repositories",
          T1: "Low activity, less than 10 commits per month, limited repository engagement"
        },
        tools: [
          "GitHub Insights and Analytics",
          "GitHub API (Custom Queries)",
          "Electric Capital Developer Report",
          "Gitcoin & GitHub Sponsors",
          "Open Source Explorer"
        ]
      },
      {
        id: "advisors-vc",
        name: "Advisors & VC Backing",
        description: "Evaluates the quality and credibility of advisors and investors.",
        importance: "Top-tier backing enhances credibility, strategic alignment, and resource availability.",
        thresholds: {
          T0: "High-quality advisors with proven track records and clear Tier-1 venture capital involvement",
          T1: "Advisors with limited track records or involvement of non-Tier-1 venture capital"
        },
        tools: [
          "Crunchbase",
          "PitchBook",
          "LinkedIn & Twitter (X)",
          "AngelList & CB Insights",
          "Official Project Communications"
        ]
      }
    ]
  },
  {
    id: "product",
    name: "Product Metrics",
    description: "Quantitative measures of a project's product strength and market acceptance.",
    metrics: [
      {
        id: "product-market-fit",
        name: "Product-Market Fit (PMF)",
        description: "Assesses how well the product meets market needs and achieves adoption.",
        importance: "High PMF indicates strong market acceptance and long-term viability.",
        thresholds: {
          T0: "≥50,000 active users, >70% monthly retention, ≥20% MoM growth",
          T1: "<50,000 active users, <40% monthly retention, ≤5% MoM growth"
        },
        tools: [
          "Dune Analytics",
          "Token Terminal",
          "Google Analytics & Similarweb",
          "Amplitude or Mixpanel"
        ]
      },
      {
        id: "composability",
        name: "Composability & Interoperability",
        description: "Measures integration potential with other protocols and standards.",
        importance: "Projects with high composability are better positioned for ecosystem adoption.",
        thresholds: {
          T0: "Clear, proven integrations with at least 5 prominent Web3 protocols",
          T1: "Limited or no proven integrations"
        },
        tools: [
          "GitHub Code Reviews",
          "Documentation Analysis",
          "Integration Demonstrations",
          "API Documentation"
        ]
      },
      {
        id: "user-projections",
        name: "Active User Projections",
        description: "Evaluates the credibility and ambition of user adoption forecasts.",
        importance: "Accurate, ambitious projections reflect strategic potential and market readiness.",
        thresholds: {
          T0: "User adoption projection of ≥50,000 users within the first year",
          T1: "User adoption projection of <50,000 users within the first year"
        },
        tools: [
          "Whitepapers & Roadmaps",
          "Messari & Delphi Digital Reports",
          "Third-party Analytics"
        ]
      }
    ]
  },
  {
    id: "financial",
    name: "Financial Metrics",
    description: "Evaluates economic sustainability and the robustness of token design.",
    metrics: [
      {
        id: "tokenomics",
        name: "Tokenomics Structure",
        description: "Assesses the sustainability of token distribution and economic model.",
        importance: "Sustainable token economics ensure longevity and investor confidence.",
        thresholds: {
          T0: "Treasury reserves ≥25% of market cap, ≥25% stablecoin/fiat reserves",
          T1: "Treasury reserves <10% of market cap, <10% stablecoin/fiat reserves"
        },
        tools: [
          "Project Whitepaper",
          "Etherscan / Blockchain Explorers",
          "Token Terminal & DefiLlama"
        ]
      },
      {
        id: "economic-viability",
        name: "Economic Viability",
        description: "Measures the project's financial health and economic activity.",
        importance: "High economic viability indicates robust adoption and strategic position.",
        thresholds: {
          T0: "TVL/Market Cap Ratio ≥0.5, Sustained ≥10% MoM growth",
          T1: "TVL/Market Cap Ratio <0.2, Stagnant or declining TVL"
        },
        tools: [
          "DefiLlama & Token Terminal",
          "CoinGecko & CoinMarketCap"
        ]
      }
    ]
  },
  {
    id: "strategic",
    name: "Strategic Alignment Metrics",
    description: "Assesses positioning and leadership within specific industry verticals.",
    metrics: [
      {
        id: "vertical-leadership",
        name: "Vertical Leadership",
        description: "Evaluates the project's competitive position in its industry vertical.",
        importance: "Projects with clear industry leadership demonstrate strategic advantages.",
        thresholds: {
          T0: "Among the top 5 within a defined vertical",
          T1: "Outside top 5, emerging, or unclear positioning"
        },
        tools: [
          "Industry Reports (Messari, Delphi Digital, The Block)",
          "Market Share Analysis",
          "Competitive Positioning"
        ]
      }
    ]
  },
  {
    id: "ecosystem",
    name: "Ecosystem & Community Metrics",
    description: "Quantifies the health and engagement of a project's community and ecosystem.",
    metrics: [
      {
        id: "network-effects",
        name: "Network Effects",
        description: "Measures the growth and interconnectedness of the project ecosystem.",
        importance: "Strong network effects enhance strategic positioning and scalability.",
        thresholds: {
          T0: "≥10 actively used protocols/dApps, >20% third-party developer contributions",
          T1: "≤3 actively used protocols/dApps, <5% third-party contributions"
        },
        tools: [
          "DefiLlama & DappRadar",
          "GitHub Analytics",
          "Electric Capital Developer Report",
          "Dune Analytics"
        ]
      },
      {
        id: "community-engagement",
        name: "Community Engagement",
        description: "Assesses the activity and growth of the project's community.",
        importance: "Active communities drive adoption, advocacy, and ecosystem involvement.",
        thresholds: {
          T0: "≥5,000 active community members, consistent month-over-month growth",
          T1: "<1,000 active members, declining or static engagement"
        },
        tools: [
          "Discord & Telegram Analytics",
          "Twitter Analytics & SocialBlade",
          "LunarCrush & Santiment"
        ]
      },
      {
        id: "strategic-partnerships",
        name: "Strategic Partnerships",
        description: "Evaluates the quality and impact of project partnerships.",
        importance: "Strategic partnerships expand market reach and enhance credibility.",
        thresholds: {
          T0: "≥3 significant partnerships actively contributing to adoption",
          T1: "≤1 notable partnership or limited strategic impact"
        },
        tools: [
          "Official Announcements & Project Website",
          "Press Releases & Independent Coverage",
          "LinkedIn & Crunchbase"
        ]
      }
    ]
  },
  {
    id: "risk",
    name: "Risk Metrics & Red Flags",
    description: "Identifies potential issues critical for BD professionals to assess.",
    metrics: [
      {
        id: "regulatory-risks",
        name: "Regulatory Risks",
        description: "Assesses the regulatory clarity and compliance of the project.",
        importance: "Regulatory clarity ensures long-term operational stability.",
        thresholds: {
          T0: "Operates in low-risk jurisdictions with established regulatory frameworks",
          T1: "Operates in high-risk jurisdictions or areas with ambiguous regulations"
        },
        tools: [
          "Legal and Compliance Resources",
          "Project Legal Disclosures",
          "Independent Legal Analyses"
        ]
      },
      {
        id: "token-liquidity",
        name: "Token Liquidity",
        description: "Measures the liquidity and trading activity of the project's token.",
        importance: "Adequate liquidity ensures investor confidence and reduces manipulation risks.",
        thresholds: {
          T0: "High liquidity: >5% of circulating supply in daily trading volume",
          T1: "Low liquidity: <1% of circulating supply in daily trading volume"
        },
        tools: [
          "CoinGecko & CoinMarketCap",
          "DEX & CEX Analytics",
          "Kaiko & CryptoCompare"
        ]
      },
      {
        id: "runway-burn",
        name: "Runway & Burn Rate",
        description: "Evaluates the project's financial sustainability and resources.",
        importance: "Sustainable financial management enhances long-term viability.",
        thresholds: {
          T0: "Runway of 24+ months based on current burn rates and funding",
          T1: "Limited runway of 6 months or fewer"
        },
        tools: [
          "Financial Reports & Treasury Disclosures",
          "Blockchain Explorers",
          "Third-party Analyses"
        ]
      }
    ]
  }
];
