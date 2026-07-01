import type { authProfile } from '../../../Types/Auth.Types.js';

/**
 * Calculates user rank based on experience, projects, and contributions.
 * Rank hierarchy:
 * - 'S': 'God' experience level, or high projects and contributions
 * - 'A': 'Intermediate' experience level with solid contributions
 * - 'B': 'Beginner' level
 * - 'E': Default/New builders
 * 
 * @param {string} experience - User experience level ('Beginner' | 'Intermediate' | 'God')
 * @param {number} totalProjects - Total projects completed
 * @param {number} totalContributions - Total contributions made
 * @returns {'S' | 'A' | 'B' | 'E'} Calculated rank
 */
export const calculateRank = (
  experience: 'Beginner' | 'Intermediate' | 'God' | string,
  totalProjects: number = 0,
  totalContributions: number = 0
): 'S' | 'A' | 'B' | 'E' => {
  const expLower = experience.toLowerCase();
  
  if (expLower === 'god' || totalContributions > 100 || totalProjects > 20) {
    return 'S';
  }
  if (expLower === 'intermediate' || totalContributions > 30 || totalProjects > 5) {
    return 'A';
  }
  if (expLower === 'beginner') {
    return 'B';
  }
  return 'E';
};

/**
 * Sanitizes and normalizes the raw profile input from requests.
 * Ensures arrays and nested structures are formatted correctly.
 * 
 * @param {Partial<authProfile>} input - Raw profile input fields
 * @returns {Partial<authProfile>} Sanitized profile object
 */
export const sanitizeProfileInput = (input: Partial<authProfile>): Partial<authProfile> => {
  const clean: Partial<authProfile> = {};

  if (input.name) clean.name = input.name.trim();
  if (input.avatar) clean.avatar = input.avatar.trim();
  if (input.Bio) clean.Bio = input.Bio.trim();
  if (input.college) clean.college = input.college.trim();
  if (input.intent) clean.intent = input.intent.trim();
  
  if (input.experience) {
    // Standardize case
    const exp = input.experience.toLowerCase();
    if (exp === 'god') clean.experience = 'God';
    else if (exp === 'intermediate') clean.experience = 'Intermediate';
    else clean.experience = 'Beginner';
  }

  // Handle arrays, ensure they are cleaned of empty elements
  if (Array.isArray(input.skills)) {
    clean.skills = input.skills.map(s => s.trim().toLowerCase()).filter(Boolean) as [String];
  }
  if (Array.isArray(input.techstack)) {
    clean.techstack = input.techstack.map(t => t.trim().toLowerCase()).filter(Boolean) as [String];
  }
  if (Array.isArray(input.socials)) {
    clean.socials = input.socials.map(s => s.trim()).filter(Boolean) as [String];
  }
  if (Array.isArray(input.Achievements)) {
    clean.Achievements = input.Achievements.map(a => a.trim()).filter(Boolean) as [String];
  }

  if (typeof input.avaliabilty === 'boolean') {
    clean.avaliabilty = input.avaliabilty;
  }

  return clean;
};
