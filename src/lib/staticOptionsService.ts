// Service for handling static option ID/string translation
import prisma from "@/lib/prisma";

export interface StaticOption {
  id: number;
  category: string;
  value: string;
  displayOrder?: number;
  version: number;
  isActive: boolean;
}

// Type-safe category constants
export const VALID_CATEGORIES = {
  DATA_INTERESTS: 'data_interests',
  MOTIVATIONS: 'motivations', 
  GOVERNMENTS: 'governments',
  INFORMATION_SOURCES: 'information_sources'
} as const;

export type ValidCategory = typeof VALID_CATEGORIES[keyof typeof VALID_CATEGORIES];

export class StaticOptionsService {
  private static cache: Map<string, StaticOption[]> = new Map();
  private static cacheExpiry: Map<string, number> = new Map();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private static readonly MAX_CACHE_SIZE = 100; // Prevent memory leaks

  /**
   * Validate category parameter
   */
  private static validateCategory(category: string): ValidCategory {
    const validCategories = Object.values(VALID_CATEGORIES);
    if (!validCategories.includes(category as ValidCategory)) {
      throw new Error(`Invalid category: ${category}. Must be one of: ${validCategories.join(', ')}`);
    }
    return category as ValidCategory;
  }

  /**
   * Clean up cache if it exceeds max size
   */
  private static cleanupCache(): void {
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
        this.cacheExpiry.delete(oldestKey);
      }
    }
  }

  /**
   * Get all active options for a category (type-safe)
   */
  static async getActiveOptions(category: ValidCategory): Promise<StaticOption[]> {
    try {
      const validatedCategory = this.validateCategory(category);
      const cacheKey = `${validatedCategory}_active`;
      const now = Date.now();
      
      // Atomic cache check and retrieval
      const cachedOptions = this.cache.get(cacheKey);
      const cacheExpiry = this.cacheExpiry.get(cacheKey);
      
      if (cachedOptions && cacheExpiry && cacheExpiry > now) {
        return cachedOptions;
      }

      const options = await prisma.staticOptionRegistry.findMany({
        where: {
          category: validatedCategory,
          isActive: true
        },
        orderBy: [
          { displayOrder: 'asc' },
          { id: 'asc' }
        ]
      });

      // Cache management with cleanup
      this.cleanupCache();
      this.cache.set(cacheKey, options);
      this.cacheExpiry.set(cacheKey, now + this.CACHE_TTL);

      return options;
    } catch (error) {
      console.error(`[StaticOptionsService] Failed to get options for category ${category}:`, error);
      throw new Error(`Failed to retrieve options for category: ${category}`);
    }
  }

  /**
   * Convert string values to IDs
   */
  static async stringsToIds(category: string, values: string[]): Promise<number[]> {
    const validatedCategory = this.validateCategory(category);
    const options = await this.getActiveOptions(validatedCategory);
    const optionMap = new Map(options.map(opt => [opt.value, opt.id]));
    
    return values
      .map(value => {
        if (value === "Other") return -1; // Special ID for "Other"
        return optionMap.get(value);
      })
      .filter((id): id is number => id !== undefined);
  }

  /**
   * Convert IDs to current string values
   */
  static async idsToStrings(category: string, ids: number[]): Promise<string[]> {
    if (!ids || ids.length === 0) return [];

    const validatedCategory = this.validateCategory(category);

    // Handle "Other" special case
    const otherIds = ids.filter(id => id === -1);
    const regularIds = ids.filter(id => id !== -1);

    const results: string[] = [];

    // Get regular options
    if (regularIds.length > 0) {
      const options = await prisma.staticOptionRegistry.findMany({
        where: {
          id: { in: regularIds },
          category: validatedCategory,
          isActive: true
        }
      });

      // Maintain order based on original IDs array
      for (const id of regularIds) {
        const option = options.find((opt: StaticOption) => opt.id === id);
        if (option) {
          results.push(option.value);
        }
      }
    }

    // Add "Other" entries
    if (otherIds.length > 0) {
      results.push("Other");
    }

    return results;
  }

  /**
   * Get historical string values (what user originally selected)
   */
  static async idsToHistoricalStrings(category: string, ids: number[], selectionVersion: number): Promise<string[]> {
    if (!ids || ids.length === 0) return [];

    const validatedCategory = this.validateCategory(category);
    const otherIds = ids.filter(id => id === -1);
    const regularIds = ids.filter(id => id !== -1);

    const results: string[] = [];

    if (regularIds.length > 0) {
      const options = await prisma.staticOptionRegistry.findMany({
        where: {
          id: { in: regularIds },
          category: validatedCategory,
          version: selectionVersion
        }
      });

      for (const id of regularIds) {
        const option = options.find((opt: StaticOption) => opt.id === id);
        if (option) {
          results.push(option.value);
        }
      }
    }

    if (otherIds.length > 0) {
      results.push("Other");
    }

    return results;
  }

  /**
   * Create new version of an option
   */
  static async updateOptionText(
    optionId: number, 
    newValue: string, 
    changeReason: string
  ): Promise<StaticOption> {
    const oldOption = await prisma.staticOptionRegistry.findUnique({
      where: { id: optionId }
    });

    if (!oldOption) {
      throw new Error(`Option with ID ${optionId} not found`);
    }

    // Create new version
    const newOption = await prisma.staticOptionRegistry.create({
      data: {
        category: oldOption.category,
        value: newValue,
        displayOrder: oldOption.displayOrder,
        version: oldOption.version + 1,
        changeReason
      }
    });

    // Deprecate old version
    await prisma.staticOptionRegistry.update({
      where: { id: optionId },
      data: {
        isActive: false,
        replacedById: newOption.id,
        deprecatedAt: new Date()
      }
    });

    // Clear cache
    this.clearCache(oldOption.category);

    return newOption;
  }

  /**
   * Clear cache for a category
   */
  static clearCache(category?: string): void {
    if (category) {
      this.cache.delete(`${category}_active`);
      this.cacheExpiry.delete(`${category}_active`);
    } else {
      this.cache.clear();
      this.cacheExpiry.clear();
    }
  }
}
