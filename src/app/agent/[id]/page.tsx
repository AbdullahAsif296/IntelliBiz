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
        <div className="space-y-8">
            {/* Premium Agent Header */}
            <div className="space-y-4">
                <div className="flex items-start gap-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-blue-500 shadow-xl shadow-primary/20 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Icon className="h-8 w-8 text-white relative z-10" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                            {agent.name}
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
                            {agent.description}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 ml-[84px]">
                    <Badge
                        variant="secondary"
                        className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary border-primary/20 hover:from-primary/20 hover:to-purple-500/20 transition-all duration-300"
                    >
                        {agent.category}
                    </Badge>
                </div>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

            <AgentInterface agent={agentWithoutIcon} />
        </div>
    );
}
