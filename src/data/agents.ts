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
        description: "Analyzes market sectors to identify emerging trends and growth opportunities.",
        category: "Strategy",
        icon: TrendingUp,
        inputPlaceholder: "Enter sector (e.g., Technology)",
        demoOutput: "**Trend Direction:** Rising\n**Strength:** Strong\n**Key Patterns:** AI, Automation\n**Recommendation:** Monitor Technology sector closely."
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
        description: "Analyzes customer feedback across platforms to gauge sentiment, emotion, and engagement.",
        category: "Customer Support",
        icon: Smile,
        inputPlaceholder: "Enter social media post or feedback",
        demoOutput: "**Sentiment:** Positive (Score: 0.8)\n**Emotion:** Joy (90%)\n**Engagement:** High\n**Recommendation:** Engage with user immediately."
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
        description: "Analyzes user behavior and purchase history to trigger timely, relevant surveys.",
        category: "Strategy",
        icon: ClipboardList,
        inputPlaceholder: "Enter user activity data",
        demoOutput: "**Survey Triggered:** Yes\n**Type:** Product Experience\n**Questions:**\n1. Did the product arrive in expected condition?\n2. Would you recommend us?"
    },
    {
        id: "lead-scoring",
        name: "Lead Scoring",
        description: "Evaluates leads based on engagement and demographics to predict conversion probability.",
        category: "Sales",
        icon: Star,
        inputPlaceholder: "Enter lead details (Age, Location, Activity)",
        demoOutput: "**Conversion Score:** 78%\n**Risk Category:** High\n**Recommendation:** Prioritize follow-up."
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
