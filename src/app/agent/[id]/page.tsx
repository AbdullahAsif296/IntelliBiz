import { notFound } from "next/navigation";
import { agents } from "@/data/agents";
import { AgentInterface } from "@/components/agent-interface";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export async function generateStaticParams() {
    return agents.map((agent) => ({
        id: agent.id,
    }));
}

export default async function AgentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const agent = agents.find((a) => a.id === id);

    if (!agent) {
        notFound();
    }

    const { icon: Icon, ...agentWithoutIcon } = agent;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{agent.name}</h1>
                        <p className="text-muted-foreground">{agent.description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">{agent.category}</Badge>
                </div>
            </div>
            <Separator />
            <AgentInterface agent={agentWithoutIcon} />
        </div>
    );
}
