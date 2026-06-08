import { BudgetPreset, UserProfile } from '../types';
import { DEFAULT_PRESETS } from '../constants/defaultPresets';
import { ChartColors } from '../constants/colors';

interface AIBudgetRequest {
  income: number;
  lifestyle: 'minimal' | 'moderate' | 'comfortable' | 'luxury';
  goals: string[];
  dependents: number;
  currency: string;
}

interface AIBudgetResponse {
  categories: Array<{
    name: string;
    percentage: number;
    description: string;
  }>;
  reasoning: string;
}

/**
 * AI Scaffolding Service - Generates personalized budget presets using AI
 * Supports OpenAI and Anthropic Claude APIs
 * Falls back to default presets if API fails or is unavailable
 */

export class AIBudgetScaffoldingService {
  private openaiApiKey: string | null = null;
  private claudeApiKey: string | null = null;
  private baseUrl: string;

  constructor(openaiKey?: string, claudeKey?: string) {
    this.openaiApiKey = openaiKey || null;
    this.claudeApiKey = claudeKey || null;
    this.baseUrl = 'https://api.openai.com/v1';
  }

  /**
   * Set API key for OpenAI
   */
  setOpenAIKey(key: string) {
    this.openaiApiKey = key;
  }

  /**
   * Set API key for Anthropic Claude
   */
  setClaudeKey(key: string) {
    this.claudeApiKey = key;
  }

  /**
   * Generate AI-powered budget preset from user profile
   */
  async generateBudgetPreset(
    profile: UserProfile,
    onlineStatus: boolean = true,
  ): Promise<BudgetPreset> {
    // If offline, return default preset
    if (!onlineStatus) {
      return this.getDefaultFallback();
    }

    // If no API keys configured, return default
    if (!this.openaiApiKey && !this.claudeApiKey) {
      return this.getDefaultFallback();
    }

    try {
      // Try OpenAI first if available
      if (this.openaiApiKey) {
        const preset = await this.generateWithOpenAI(profile);
        if (preset) return preset;
      }

      // Fall back to Claude if available
      if (this.claudeApiKey) {
        const preset = await this.generateWithClaude(profile);
        if (preset) return preset;
      }

      // If both fail, return default
      return this.getDefaultFallback();
    } catch (error) {
      console.error('AI budget generation failed:', error);
      return this.getDefaultFallback();
    }
  }

  /**
   * Generate budget using OpenAI API
   */
  private async generateWithOpenAI(profile: UserProfile): Promise<BudgetPreset | null> {
    try {
      const prompt = this.buildPrompt(profile);

      const response = await fetch(this.baseUrl + '/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a financial advisor. Generate a personalized budget allocation in JSON format.
Return ONLY valid JSON with this structure:
{
  "categories": [
    { "name": "string", "percentage": number (0-100), "description": "string" }
  ],
  "reasoning": "string"
}
Ensure percentages sum to 100.`,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        console.error('OpenAI API error:', response.status);
        return null;
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (content) {
        return this.parseAIResponse(content, profile);
      }

      return null;
    } catch (error) {
      console.error('OpenAI request failed:', error);
      return null;
    }
  }

  /**
   * Generate budget using Anthropic Claude API
   */
  private async generateWithClaude(profile: UserProfile): Promise<BudgetPreset | null> {
    try {
      const prompt = this.buildPrompt(profile);

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.claudeApiKey!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 500,
          messages: [
            {
              role: 'user',
              content: `You are a financial advisor. Generate a personalized budget allocation in JSON format.
Return ONLY valid JSON with this structure:
{
  "categories": [
    { "name": "string", "percentage": number (0-100), "description": "string" }
  ],
  "reasoning": "string"
}
Ensure percentages sum to 100.

User profile:
${prompt}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        console.error('Claude API error:', response.status);
        return null;
      }

      const data = await response.json();
      const content = data.content[0]?.text;

      if (content) {
        return this.parseAIResponse(content, profile);
      }

      return null;
    } catch (error) {
      console.error('Claude request failed:', error);
      return null;
    }
  }

  /**
   * Build prompt from user profile
   */
  private buildPrompt(profile: UserProfile): string {
    return `
Income: ${profile.monthlyIncome}
Currency: ${profile.currencyCode}
Lifestyle: moderate
Dependents: ${profile.dependents || 0}
Savings Goals: General savings and emergency fund
Major Expenses: Housing, Food, Transportation
Preferences: Balanced approach to spending and savings

Create a personalized budget breakdown that fits this profile.
`;
  }

  /**
   * Parse AI response and convert to BudgetPreset
   */
  private parseAIResponse(content: string, profile: UserProfile): BudgetPreset | null {
    try {
      // Extract JSON from response (AI might wrap it in markdown code blocks)
      let jsonStr = content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }

      const parsed = JSON.parse(jsonStr) as AIBudgetResponse;

      // Validate and normalize percentages
      const totalPercentage = parsed.categories.reduce((sum, cat) => sum + cat.percentage, 0);
      if (totalPercentage < 99 || totalPercentage > 101) {
        console.warn('AI categories do not sum to 100%:', totalPercentage);
        return null;
      }

      // Build preset
      const preset: BudgetPreset = {
        id: `ai-preset-${Date.now()}`,
        name: `AI Suggestion - ${new Date().toLocaleDateString()}`,
        categories: parsed.categories.map((cat, index) => ({
          id: cat.name.toLowerCase().replace(/\s+/g, '-'),
          name: cat.name,
          percentage: Math.round(cat.percentage),
          color: ChartColors[index % ChartColors.length],
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return preset;
    } catch (error) {
      console.error('Failed to parse AI response:', error, 'Content:', content);
      return null;
    }
  }

  /**
   * Get default fallback preset
   */
  private getDefaultFallback(): BudgetPreset {
    return DEFAULT_PRESETS[0];
  }

  /**
   * Test API connectivity
   */
  async testOpenAIConnection(): Promise<boolean> {
    if (!this.openaiApiKey) return false;

    try {
      const response = await fetch(this.baseUrl + '/models', {
        headers: {
          Authorization: `Bearer ${this.openaiApiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Test Claude API connectivity
   */
  async testClaudeConnection(): Promise<boolean> {
    if (!this.claudeApiKey) return false;

    try {
      const response = await fetch('https://api.anthropic.com/v1/models', {
        headers: {
          'x-api-key': this.claudeApiKey,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const aiBudgetService = new AIBudgetScaffoldingService();
