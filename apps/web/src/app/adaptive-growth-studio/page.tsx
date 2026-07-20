import { getAgsBootstrap } from "./lib/api";
import { StudioShell } from "./studio-shell";
export const dynamic = "force-dynamic";
export default async function AdaptiveGrowthStudioPage() {
  return <StudioShell data={await getAgsBootstrap()} />;
}