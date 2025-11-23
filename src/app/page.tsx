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
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Access your suite of intelligent business agents.
        </p>
      </div>

      {Object.entries(groupedAgents).map(([category, categoryAgents]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">{category}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryAgents.map((agent) => (
              <Link href={`/agent/${agent.id}`} key={agent.id} className="block h-full">
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {agent.name}
                    </CardTitle>
                    <agent.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2">
                      {agent.description}
                    </CardDescription>
                    <div className="mt-4 flex items-center text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Open Agent <ArrowRight className="ml-1 h-3 w-3" />
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
