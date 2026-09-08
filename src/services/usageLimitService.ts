/**
 * USAGE LIMIT SERVICE — LESS CREATION
 * Centralized, client-side usage management that respects free users
 * and unlocks higher/unlimited limits for Pro members.
 * Reuses existing membership verification without modifying core.
 */

import { getCachedMembership } from '../utils/razorpayClient';

export interface UsageStatus {
  hasAccess: boolean;
  isPro: boolean;
  remainingDailyOperations: number;
  totalDailyLimit: number;
  message?: string;
}

const STORAGE_KEY_USAGE = 'less_creation_daily_tool_usage';
const FREE_DAILY_LIMIT = 50; // Very generous daily free limit for everyday work

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

interface StoredUsage {
  date: string;
  count: number;
}

function getStoredUsage(): StoredUsage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USAGE);
    if (!raw) return { date: getTodayString(), count: 0 };
    const parsed: StoredUsage = JSON.parse(raw);
    if (parsed.date !== getTodayString()) {
      return { date: getTodayString(), count: 0 };
    }
    return parsed;
  } catch {
    return { date: getTodayString(), count: 0 };
  }
}

function saveStoredUsage(usage: StoredUsage): void {
  try {
    localStorage.setItem(STORAGE_KEY_USAGE, JSON.stringify(usage));
  } catch {}
}

export const usageLimitService = {
  /**
   * Checks if user has access to execute tool operation
   */
  checkUsage(toolId?: string): UsageStatus {
    const membership = getCachedMembership();
    const isPro = Boolean(membership && membership.status === 'ACTIVE');

    if (isPro) {
      return {
        hasAccess: true,
        isPro: true,
        remainingDailyOperations: 999999,
        totalDailyLimit: 999999,
      };
    }

    const currentUsage = getStoredUsage();
    const remaining = Math.max(0, FREE_DAILY_LIMIT - currentUsage.count);

    return {
      hasAccess: remaining > 0,
      isPro: false,
      remainingDailyOperations: remaining,
      totalDailyLimit: FREE_DAILY_LIMIT,
      message: remaining <= 0 ? 'You have reached the daily free limit. Upgrade to Pro for unlimited usage.' : undefined
    };
  },

  /**
   * Records one usage of a tool
   */
  recordUsage(toolId: string): void {
    const membership = getCachedMembership();
    if (membership && membership.status === 'ACTIVE') return;

    const currentUsage = getStoredUsage();
    currentUsage.count += 1;
    saveStoredUsage(currentUsage);
  },

  /**
   * Resets local counter for testing or new day
   */
  resetDailyUsage(): void {
    saveStoredUsage({ date: getTodayString(), count: 0 });
  }
};
