import { describe, it, expect, beforeEach } from 'vitest';
import {
  extractBudget,
  extractTimeline,
  extractLocations,
  addToConversationContext,
  getConversationContext,
  clearConversationContext,
} from '../src/utils/chatbotUtils';

describe('chatbotUtils', () => {
  describe('extractBudget', () => {
    it('should extract budget in lakhs', () => {
      expect(extractBudget('I have a budget of 50 lakhs')).toBe('50 lakhs');
      expect(extractBudget('Looking for properties around 25 lakh')).toBe('25 lakh');
    });

    it('should extract budget in crores', () => {
      expect(extractBudget('My budget is 2 crores')).toBe('2 crores');
      expect(extractBudget('Around 1.5 cr budget')).toBe('1.5 cr');
    });

    it('should return null for no budget', () => {
      expect(extractBudget('Looking for a house')).toBeNull();
    });
  });

  describe('extractTimeline', () => {
    it('should extract timeline in days', () => {
      expect(extractTimeline('Need it in 30 days')).toBe('30 days');
    });

    it('should extract timeline in months', () => {
      expect(extractTimeline('Looking for 3 months')).toBe('3 months');
    });

    it('should extract urgent keywords', () => {
      expect(extractTimeline('Need urgently')).toBe('urgent');
      expect(extractTimeline('ASAP please')).toBe('asap');
    });

    it('should return null for no timeline', () => {
      expect(extractTimeline('Looking for a property')).toBeNull();
    });
  });

  describe('extractLocations', () => {
    it('should extract common Hyderabad locations', () => {
      const locations = extractLocations('Looking in Gachibowli or Hitech City');
      expect(locations).toContain('gachibowli');
      expect(locations).toContain('hitech city');
    });

    it('should handle case insensitivity', () => {
      const locations = extractLocations('POCHARAM or kondapur');
      expect(locations).toContain('pocharam');
      expect(locations).toContain('kondapur');
    });

    it('should return empty array for no locations', () => {
      expect(extractLocations('Looking for a house')).toEqual([]);
    });

    it('should not duplicate locations', () => {
      const locations = extractLocations('Gachibowli is nice, I like Gachibowli');
      expect(locations.filter(l => l === 'gachibowli')).toHaveLength(1);
    });
  });

  describe('conversation context', () => {
    beforeEach(() => {
      clearConversationContext();
    });

    it('should add and retrieve messages', () => {
      addToConversationContext('user', 'Hello');
      addToConversationContext('assistant', 'Hi there!');
      
      const context = getConversationContext();
      expect(context).toHaveLength(2);
      expect(context[0]).toEqual({ role: 'user', content: 'Hello' });
      expect(context[1]).toEqual({ role: 'assistant', content: 'Hi there!' });
    });

    it('should limit context to 15 messages', () => {
      for (let i = 0; i < 20; i++) {
        addToConversationContext('user', `Message ${i}`);
      }
      
      const context = getConversationContext();
      expect(context).toHaveLength(15);
      expect(context[0].content).toBe('Message 5');
    });

    it('should clear context', () => {
      addToConversationContext('user', 'Test');
      clearConversationContext();
      
      expect(getConversationContext()).toEqual([]);
    });
  });
});
