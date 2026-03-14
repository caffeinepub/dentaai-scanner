import { useActor } from "@/hooks/useActor";
import type { ScanResult } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useScanHistory() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["scanHistory"],
    queryFn: async (): Promise<ScanResult[]> => {
      if (!actor) return [];
      const result = await actor.getCallerScanHistory();
      return result as unknown as ScanResult[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLatestScan() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["latestScan"],
    queryFn: async (): Promise<ScanResult | null> => {
      if (!actor) return null;
      const result = await actor.getCallerLatestScan();
      return result as unknown as ScanResult | null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitScan() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (scan: ScanResult) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.submitScan(scan as any);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scanHistory"] });
      qc.invalidateQueries({ queryKey: ["latestScan"] });
    },
  });
}
