import { Brain, Eye, GitBranch, Layers, Users, Workflow } from "lucide-react";
import type { ServiceContent } from "../../data/services";
import { cn } from "../../lib/cn";

const registry = {
  ai: Brain,
  automation: Workflow,
  transformation: GitBranch,
  observability: Eye,
  talent: Users,
  product: Layers,
} as const;

export function ServiceIcon({
  icon,
  className,
  strokeWidth = 1.5,
}: {
  icon: ServiceContent["icon"];
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = registry[icon];
  return <Icon className={cn("size-6", className)} strokeWidth={strokeWidth} aria-hidden />;
}
