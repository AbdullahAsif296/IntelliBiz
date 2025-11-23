import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { agents, AgentCategory } from "@/data/agents";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  // Group agents by category
  const groupedAgents = agents.reduce((acc, agent) => {
    if (!acc[agent.category]) {
      acc[agent.category] = [];
    }
    acc[agent.category].push(agent);
    return acc;
  }, {} as Record<AgentCategory, typeof agents>);

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-1.5 rounded-full bg-gradient-to-b from-primary via-purple-500 to-blue-500"></div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground text-lg ml-5">
          Access your suite of intelligent business agents powered by AI.
        </p>
      </div>

      {/* Agent Categories */}
      {Object.entries(groupedAgents).map(([category, categoryAgents]) => (
        <div key={category} className="space-y-5">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
              {category}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent"></div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryAgents.map((agent) => (
              <Link
                href={`/agent/${agent.id}`}
                key={agent.id}
                className="block h-full group"
              >
                <Card className="h-full hover-lift border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 overflow-hidden relative">
                  {/* Gradient accent on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-transparent group-hover:to-purple-500/5 transition-all duration-500"></div>

                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3 relative z-10">
                    <CardTitle className="text-base font-semibold leading-tight group-hover:text-primary transition-colors duration-300">
                      {agent.name}
                    </CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 group-hover:from-primary/20 group-hover:to-purple-500/20 transition-all duration-300 group-hover:scale-110">
                      <agent.icon className="h-5 w-5 text-primary group-hover:text-primary transition-colors" />
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                      {agent.description}
                    </CardDescription>

                    <div className="mt-4 flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                      <span>Open Agent</span>
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
