/**
 * Unique Slug Generation for Companies
 * - Uses brand name as base slug (e.g., "kjh", "estopa")  
 * - Adds numbers for duplicates (e.g., "kjh-2", "kjh-3")
 * - Tied to unique submission ID for reliability
 */

import { airtableService, type Submission } from './airtable';
import { generateSlug } from './utils';

interface SlugMapping {
  slug: string;
  email: string;
  brandName: string;
  submissionId: string;  // Key: Tied to unique ID
}

// In-memory cache for slug mappings
let slugMappingCache: Map<string, SlugMapping> | null = null;

export const buildSlugEmailMappings = async (): Promise<Map<string, SlugMapping>> => {
  const allSubmissions = await airtableService.getApprovedSubmissions();
  
  const slugMap = new Map<string, SlugMapping>();
  const usedSlugs = new Set<string>();

  allSubmissions.forEach(submission => {
    const brandField = submission.brandName || submission['Brand Name'];
    const emailField = submission.email || submission.Email;
    
    // Generate base slug from brand name
    const baseSlug = generateSlug(brandField);  // "kjh", "estopa"
    let uniqueSlug = baseSlug;
    let counter = 1;

    // Add numbers for duplicates: kjh → kjh-2 → kjh-3
    while (usedSlugs.has(uniqueSlug)) {
      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
    }

    usedSlugs.add(uniqueSlug);
    
    // Map by submission ID (not email) for reliability
    const mapping: SlugMapping = {
      slug: uniqueSlug,
      email: emailField,
      brandName: brandField,
      submissionId: submission.id  // Unique ID
    };

    slugMap.set(uniqueSlug, mapping);
    console.log(`🏷️ Mapped: "${brandField}" → "${uniqueSlug}" (ID: ${submission.id})`);
  });

  return slugMap;
};

/**
 * Get cached slug mappings (build if not cached)
 */
export async function getSlugEmailMappings(): Promise<Map<string, SlugMapping>> {
  if (!slugMappingCache) {
    slugMappingCache = await buildSlugEmailMappings();
  }
  return slugMappingCache;
}

// Find submission by unique slug
export const getSubmissionBySlug = async (slug: string) => {
  const mappings = await getSlugEmailMappings();
  const mapping = mappings.get(slug);
  
  if (!mapping) return null;

  const allSubmissions = await airtableService.getApprovedSubmissions();
  
  // Find by submission ID (most reliable)
  const submission = allSubmissions.find(s => s.id === mapping.submissionId);
  
  if (submission) {
    (submission as any).uniqueSlug = slug;
    return submission;
  }
  
  return null;
};

// Add unique slugs to all submissions
export const getAllSubmissionsWithSlugs = async () => {
  const allSubmissions = await airtableService.getApprovedSubmissions();
  const mappings = await getSlugEmailMappings();
  
  return allSubmissions.map(submission => {
    // Find slug by matching submission ID
    let uniqueSlug = null;
    for (const [slug, mapping] of mappings.entries()) {
      if (mapping.submissionId === submission.id) {  // Match by ID
        uniqueSlug = slug;
        break;
      }
    }
    
    return {
      ...submission,
      uniqueSlug: uniqueSlug || generateSlug(submission.brandName || submission['Brand Name'])
    };
  });
};

/**
 * Force rebuild of slug mappings (useful for updates)
 */
export async function rebuildSlugMappings(): Promise<void> {
  console.log('🔄 Force rebuilding slug mappings...');
  slugMappingCache = null;
  await buildSlugEmailMappings();
  console.log('✅ Slug mappings rebuilt');
}

/**
 * Debug: Show all slug mappings
 */
export async function debugSlugMappings(): Promise<void> {
  console.log('🐛 DEBUG: Slug-Email Mappings');
  const mappings = await getSlugEmailMappings();
  
  const mappingArray = Array.from(mappings.values());
  console.table(mappingArray.map(m => ({
    Slug: m.slug,
    BrandName: m.brandName,
    Email: m.email,
    SubmissionId: m.submissionId
  })));
}
