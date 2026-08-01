"use client";

import { useCallback, useEffect, useState } from "react";
import { usePublicClient, useWatchContractEvent } from "wagmi";
import { decodeEventLog, getAbiItem, type Log } from "viem";

import { statusContractAbi } from "@/abi/statusContract";
import {
  isStatusContractConfigured,
  STATUS_CONTRACT_ADDRESS,
} from "@/constants/addresses";

export type StatusUpdatedEvent = {
  user: `0x${string}`;
  statusId: bigint;
  newStatus: string;
  timestamp: bigint;
  transactionHash: `0x${string}`;
  logIndex: number;
};

const statusUpdatedEvent = getAbiItem({
  abi: statusContractAbi,
  name: "StatusUpdated",
});

function parseStatusUpdatedLog(log: Log): StatusUpdatedEvent | null {
  try {
    const decoded = decodeEventLog({
      abi: statusContractAbi,
      data: log.data,
      topics: log.topics,
    });
    if (decoded.eventName !== "StatusUpdated") return null;
    const args = decoded.args as {
      user: `0x${string}`;
      statusId: bigint;
      newStatus: string;
      timestamp: bigint;
    };
    return {
      user: args.user,
      statusId: args.statusId,
      newStatus: args.newStatus,
      timestamp: args.timestamp,
      transactionHash: log.transactionHash ?? ("0x" as `0x${string}`),
      logIndex: Number(log.logIndex ?? 0),
    };
  } catch {
    return null;
  }
}

/**
 * Loads historical StatusUpdated logs and appends live events via Alchemy/RPC.
 */
export function useStatusUpdatedEvents() {
  const publicClient = usePublicClient();
  const [events, setEvents] = useState<StatusUpdatedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mergeEvent = useCallback((incoming: StatusUpdatedEvent) => {
    setEvents((prev) => {
      const key = `${incoming.transactionHash}-${incoming.logIndex}`;
      if (
        prev.some(
          (item) => `${item.transactionHash}-${item.logIndex}` === key
        )
      ) {
        return prev;
      }
      return [...prev, incoming];
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isStatusContractConfigured || !publicClient) {
        setEvents([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const logs = await publicClient.getLogs({
          address: STATUS_CONTRACT_ADDRESS,
          event: statusUpdatedEvent,
          fromBlock: BigInt(0),
          toBlock: "latest",
        });

        if (cancelled) return;
        const parsed = logs
          .map((log) => parseStatusUpdatedLog(log))
          .filter((item): item is StatusUpdatedEvent => item !== null);
        setEvents(parsed);
      } catch (err) {
        console.error("Failed to load StatusUpdated logs", err);
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load status events"
          );
          setEvents([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [publicClient]);

  useWatchContractEvent({
    address: isStatusContractConfigured ? STATUS_CONTRACT_ADDRESS : undefined,
    abi: statusContractAbi,
    eventName: "StatusUpdated",
    enabled: isStatusContractConfigured,
    onLogs(logs) {
      for (const log of logs) {
        const parsed = parseStatusUpdatedLog(log as Log);
        if (parsed) mergeEvent(parsed);
      }
    },
  });

  return { events, isLoading, error };
}
