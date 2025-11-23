import {
  BarChart3,
  Target,
  Smile,
  Zap,
  DollarSign,
  TrendingUp,
  UserMinus,
  Headphones,
  GitMerge,
  Megaphone,
  Search,
  ShieldCheck,
  Eye,
  FileText,
  ClipboardList,
  Star,
  Gift,
  LucideIcon
} from "lucide-react";

export type AgentCategory = 
  | "Marketing"
  | "Sales"
  | "Customer Support"
  | "Strategy"
  | "Analytics";

export interface Agent {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
  icon: LucideIcon;
  inputPlaceholder: string;
  demoOutput: string;
}

export const agents: Agent[] = [
  {
    id: "market-trend-monitor",
    name: "Market Trend Monitor",
    description: "Analyzes current market trends and provides actionable insights.",
    category: "Strategy",
    icon: TrendingUp,
    inputPlaceholder: "Enter industry or keyword (e.g., 'SaaS AI tools')",
    demoOutput: "## Market Trend Analysis for 'SaaS AI tools'\n\n*   **Growth:** 150% YoY increase in search volume.\n*   **Key Drivers:** Automation, Generative AI integration.\n*   **Opportunity:** High demand for specialized vertical agents."
  },
  {
    id: "competitor-tracker",
    name: "Competitor Tracker",
    description: "Tracks competitor activities, pricing changes, and feature launches.",
    category: "Strategy",
    icon: Target,
    inputPlaceholder: "Enter competitor URLs or names",
    demoOutput: "**Competitor Update:**\n*   **Competitor A:** Launched new 'Pro' plan at $49/mo.\n*   **Competitor B:** Updated landing page focusing on 'Enterprise Security'."
  },
  {
    id: "customer-sentiment",
    name: "Customer Sentiment",
    description: "Analyzes customer feedback to gauge sentiment and identify issues.",
    category: "Customer Support",
    icon: Smile,
    inputPlaceholder: "Paste customer reviews or support ticket text",
    demoOutput: "**Sentiment Analysis:**\n*   **Overall Score:** 7.5/10 (Positive)\n*   **Key Positives:** User interface, Speed.\n*   **Key Negatives:** Pricing structure, Mobile app bugs."
  },
  {
    id: "campaign-optimizer",
    name: "Campaign Optimizer",
    description: "Optimizes ad campaigns for better ROI and engagement.",
    category: "Marketing",
    icon: Zap,
    inputPlaceholder: "Enter campaign details and current metrics",
    demoOutput: "**Optimization Suggestions:**\n1.  **Targeting:** Narrow down age group to 25-34 for higher CTR.\n2.  **Ad Copy:** Test emotional hooks in headlines.\n3.  **Budget:** Reallocate 20% from Display to Search."
  },
  {
    id: "pricing-strategy",
    name: "Pricing Strategy",
    description: "Suggests optimal pricing strategies based on market data.",
    category: "Strategy",
    icon: DollarSign,
    inputPlaceholder: "Describe your product and current costs",
    demoOutput: "**Pricing Recommendation:**\n*   **Tiered Model:** Free, Starter ($29), Pro ($99).\n*   **Psychological Pricing:** Use $29 instead of $30.\n*   **Value Add:** Bundle support with Pro plan."
  },
  {
    id: "sales-pipeline-predictor",
    name: "Sales Pipeline Predictor",
    description: "Predicts future sales and identifies bottlenecks in the pipeline.",
    category: "Sales",
    icon: BarChart3,
    inputPlaceholder: "Upload pipeline data or enter summary stats",
    demoOutput: "**Pipeline Forecast:**\n*   **Projected Revenue (Q3):** $150,000\n*   **Conversion Rate:** 12% (Trending Up)\n*   **Risk:** 5 deals stuck in 'Negotiation' for >2 weeks."
  },
  {
    id: "churn-prevention",
    name: "Churn Prevention",
    description: "Identifies at-risk customers and suggests retention strategies.",
    category: "Customer Support",
    icon: UserMinus,
    inputPlaceholder: "Enter customer usage data or recent interactions",
    demoOutput: "**At-Risk Alert:**\n*   **Customer ID:** 12345\n*   **Risk Level:** High (85%)\n*   **Reason:** Low login frequency in last 30 days.\n*   **Action:** Send re-engagement email with 10% discount."
  },
  {
    id: "customer-support-auto",
    name: "Customer Support Auto",
    description: "Automates responses to common customer inquiries.",
    category: "Customer Support",
    icon: Headphones,
    inputPlaceholder: "Enter incoming customer query",
    demoOutput: "**Suggested Response:**\n'Hi there! Thanks for reaching out. You can reset your password by going to Settings > Security > Reset Password. Let me know if you need further help!'"
  },
  {
    id: "cross-sell-suggestion",
    name: "Cross-Sell Suggestion",
    description: "Recommends complementary products to existing customers.",
    category: "Sales",
    icon: GitMerge,
    inputPlaceholder: "Enter customer purchase history",
    demoOutput: "**Recommendations:**\n1.  **Product B:** Bought by 80% of users who bought Product A.\n2.  **Service C:** High margin add-on for this segment."
  },
  {
    id: "influencer-engagement",
    name: "Influencer Engagement",
    description: "Identifies and drafts outreach to relevant influencers.",
    category: "Marketing",
    icon: Megaphone,
    inputPlaceholder: "Enter brand niche and campaign goals",
    demoOutput: "**Top Influencers:**\n1.  **@TechGuru (Twitter):** High engagement in SaaS.\n2.  **@DesignDaily (Instagram):** Perfect for visual tools.\n\n**Draft DM:** 'Hey [Name], huge fan of your work on...'"
  },
  {
    id: "seo-optimizer",
    name: "SEO Optimizer",
    description: "Analyzes content and suggests improvements for better ranking.",
    category: "Marketing",
    icon: Search,
    inputPlaceholder: "Enter URL or paste content",
    demoOutput: "**SEO Audit:**\n*   **Score:** 65/100\n*   **Missing:** Meta description, H1 tag optimization.\n*   **Keyword Density:** 'AI' is overused (5%). Aim for 2-3%."
  },
  {
    id: "brand-reputation-guard",
    name: "Brand Reputation Guard",
    description: "Monitors brand mentions and alerts on potential PR risks.",
    category: "Marketing",
    icon: ShieldCheck,
    inputPlaceholder: "Enter brand name to monitor",
    demoOutput: "**Alert:** Negative sentiment detected on Twitter regarding recent downtime.\n**Action:** Issue public apology and status update immediately."
  },
  {
    id: "competitor-ad-detector",
    name: "Competitor Ad Detector",
    description: "Detects and analyzes competitor advertising strategies.",
    category: "Marketing",
    icon: Eye,
    inputPlaceholder: "Enter competitor brand name",
    demoOutput: "**Ad Intelligence:**\n*   **Active Channels:** Facebook, LinkedIn.\n*   **Key Message:** 'Cheaper than [Your Brand]'.\n*   **Creative Type:** Video testimonials."
  },
  {
    id: "content-gap",
    name: "Content Gap",
    description: "Identifies missing content topics compared to competitors.",
    category: "Marketing",
    icon: FileText,
    inputPlaceholder: "Enter your URL and competitor URL",
    demoOutput: "**Gap Analysis:**\n*   **Missing Topic:** 'Integration with Zapier'.\n*   **Opportunity:** High search volume, low competition.\n*   **Suggestion:** Write a 'How-to' guide."
  },
  {
    id: "proactive-survey",
    name: "Proactive Survey",
    description: "Generates survey questions to gather specific customer insights.",
    category: "Strategy",
    icon: ClipboardList,
    inputPlaceholder: "Enter research goal (e.g., 'Feature validation')",
    demoOutput: "**Survey Questions:**\n1.  How often do you use feature X?\n2.  What is the biggest pain point with current solution?\n3.  Would you pay $10/mo for this add-on?"
  },
  {
    id: "lead-scoring",
    name: "Lead Scoring",
    description: "Scores leads based on behavior and demographics.",
    category: "Sales",
    icon: Star,
    inputPlaceholder: "Enter lead details (Job title, Company size, Activity)",
    demoOutput: "**Lead Score: 85/100 (Hot)**\n*   **Factors:** CTO title (+20), Enterprise size (+30), Visited pricing page (+15)."
  },
  {
    id: "loyalty-program-optimizer",
    name: "Loyalty Program Optimizer",
    description: "Optimizes loyalty programs to maximize retention and LTV.",
    category: "Marketing",
    icon: Gift,
    inputPlaceholder: "Describe current loyalty program structure",
    demoOutput: "**Optimization Tips:**\n*   **Reward Speed:** Give first reward sooner to build habit.\n*   **Tiers:** Add a 'VIP' tier for top 1% customers.\n*   **Gamification:** Add progress bars for next reward."
  }
];
