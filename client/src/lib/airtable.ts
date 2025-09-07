// Airtable API configuration for BookDirectStays

// Airtable configuration
const AIRTABLE_API_KEY = (import.meta as any).env?.VITE_AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = (import.meta as any).env?.VITE_AIRTABLE_BASE_ID || '';
const AIRTABLE_TABLE_NAME = 'Directory Submissions'; // Your actual table name

// Airtable API endpoint
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;

// Debug: Log configuration (remove in production)
console.log('Airtable Config:', {
  hasApiKey: !!AIRTABLE_API_KEY,
  hasBaseId: !!AIRTABLE_BASE_ID,
  tableName: AIRTABLE_TABLE_NAME
});

// Types for submissions
export interface AirtableSubmission {
  id: string;
  fields: {
    'Brand Name': string;
    'PMC General Website': string;
    'Direct Booking Engine URL': string;
    'Number of Listings': number;
    'Email': string;
    'One-line Description': string;
    'Why Book With You': string;
    'Why Rent With You': string;
    'Plan': string;
    'Top Stats': string;
    'Countries': string | string[];
    'Cities / Regions': string | string[];
    'Types of Stays': string | string[];
    'Ideal For': string | string[];
    'Properties Features': string | string[];
    'Services & Convenience': string | string[];
    'Lifestyle & Values': string | string[];
    'Design Style': string | string[];
    'Atmospheres': string | string[];
    'Settings/Locations': string | string[];
    'Instagram'?: string;
    'Facebook'?: string;
    'LinkedIn'?: string;
    'TikTok'?: string;
    'YouTube / Video Tour'?: string;
    'Logo'?: Array<{ url: string; filename: string }>;
    'Highlight Image'?: Array<{ url: string; filename: string }>;
    'Rating Screenshot'?: Array<{ url: string; filename: string }>;
    'Status': string;
    'Status Bis (PMC directory)'?: string;
    'Submission Date': string;
    // New fields
    'PMS Used'?: string;
    'Min Price'?: number;
    'Max Price'?: number;
    'Currency'?: string;
    'Google Reviews Link'?: string;
    'Cancellation Policy'?: string;
    'Commission On Revenue'?: number;
  };
  createdTime: string;
}

// Normalized submission interface for frontend use
export interface Submission {
  id: string;
  brandName: string;
  pmcGeneralWebsite: string;
  directBookingEngineUrl: string;
  numberOfListings: number;
  citiesRegions: string[];
  countries: string[];
  oneLineDescription: string;
  whyBookWithYou: string;
  whyRentWithYou: string;
  commissionOnRevenue?: number;
  topStats: string;
  typesOfStays: string[];
  idealFor: string[];
  propertiesFeatures: string[];
  servicesConvenience: string[];
  lifestyleValues: string[];
  designStyles: string[];
  atmospheres: string[];
  settingsLocations: string[];
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  tiktok?: string;
  youtube?: string;
  plan: string;
  submissionDate: string;
  status: string;
  statusBis?: string;
  paymentStatus: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  paymentDate: string;
  email: string;
  uniqueSlug?: string; // Add this for unique routing
  // Additional properties for display
  logo?: string;
  highlightImage?: string;
  ratingScreenshot?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
}

// Airtable service
export const airtableService = {
  async createSubmission(submissionData: any): Promise<any> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing. Please set VITE_AIRTABLE_API_KEY and VITE_AIRTABLE_BASE_ID');
    }

    const response = await fetch(AIRTABLE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              'Brand Name': submissionData.Brand_name,
              'PMC General Website': submissionData.PMC_General_Website,
              'Direct Booking Engine URL': submissionData.Direct_Booking_Engine_URL,
              'Number of Listings': submissionData.Number_of_Listings,
              'Email': submissionData.E_mail,
              'One-line Description': submissionData.field9,
              'Why Book With You': submissionData.field10,
              'Plan': submissionData.field11,
              'Countries': submissionData.Countries,
              'Cities / Regions': submissionData.Cities_Regions,
              'Types of Stays': submissionData.field12,
              'Ideal For': submissionData.field13,
              'Is Pet Friendly': submissionData.field14 === 'true',
              'Perks / Amenities': submissionData.field15,
              'Is Eco Conscious': submissionData.field16 === 'true',
              'Is Remote Work Friendly': submissionData.field17 === 'true',
              'Vibe / Aesthetic': submissionData.field18,
              'Instagram': submissionData.field19,
              'Facebook': submissionData.field20,
              'LinkedIn': submissionData.field21,
              'TikTok': submissionData.field22,
              'YouTube / Video Tour': submissionData.field23,
              'Logo': submissionData.Logo ? [{ url: submissionData.Logo }] : [],
              'Highlight Image': submissionData.Highlight_Image ? [{ url: submissionData.Highlight_Image }] : [],
            }
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Airtable API error: ${errorData.error?.message || response.statusText}`);
    }

    return response.json();
  },

  async getAllSubmissions(): Promise<AirtableSubmission[]> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    const response = await fetch(AIRTABLE_API_URL, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.records || [];
  },

  // Temporary method to test different status variations
  async testStatusVariations(): Promise<void> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    console.log('🧪 Testing different status variations...');

    const statusVariations = [
      "Approved – Published", // ← This is the correct one (em dash)
      "Approved - Published",
      "Approved-Published", 
      "Approved - published",
      "approved - published",
      "APPROVED - PUBLISHED",
      "Approved  -  Published", // extra spaces
      "Published",
      "Approved"
    ];

    for (const testStatus of statusVariations) {
      try {
        const filterFormula = `{Status} = "${testStatus}"`;
        const url = `${AIRTABLE_API_URL}?filterByFormula=${encodeURIComponent(filterFormula)}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const count = data.records?.length || 0;
          console.log(`🎯 Status "${testStatus}": ${count} records found`);
          
          if (count > 0) {
            console.log(`✅ FOUND MATCH with "${testStatus}"!`);
            console.log('📝 First matching record:', data.records[0]);
          }
        }
      } catch (error) {
        console.error(`❌ Error testing status "${testStatus}":`, error);
      }
    }
  },

  async getApprovedSubmissions(): Promise<Submission[]> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    console.log('📋 Fetching approved-published submissions...');

    // Run status variation test first (disabled - found the issue!)
    // await this.testStatusVariations();

    // First, let's get ALL records to see what statuses actually exist
    const allRecordsUrl = `${AIRTABLE_API_URL}`;
    console.log('🔍 First, fetching ALL records to debug statuses...');
    
    const allResponse = await fetch(allRecordsUrl, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (allResponse.ok) {
      const allData = await allResponse.json();
      const allRecords: AirtableSubmission[] = allData.records || [];
      console.log('📊 Total records in Airtable:', allRecords.length);
      
      if (allRecords.length > 0) {
        console.log('📝 First record for debugging:', allRecords[0]);
        console.log('📝 First record fields:', allRecords[0].fields);
        console.log('📝 First record status:', JSON.stringify(allRecords[0].fields['Status']));
        
        // Get all unique statuses from Status Bis field (this is what determines publishing)
        const allStatusBis = allRecords.map(r => r.fields['Status Bis (PMC directory)']).filter(Boolean);
        const uniqueStatusBis = [...new Set(allStatusBis)];
        console.log('📋 All unique Status Bis (PMC directory) statuses found:', uniqueStatusBis);
        console.log('📋 All Status Bis statuses (with quotes):', uniqueStatusBis.map(s => `"${s}"`));
        
        // Count each Status Bis status
        const statusBisCounts = allStatusBis.reduce((acc: any, status) => {
          if (status) {
            acc[status] = (acc[status] || 0) + 1;
          }
          return acc;
        }, {});
        console.log('📊 Status Bis (PMC directory) breakdown:', statusBisCounts);
        
        // Check if any match our target in Status Bis field
        const targetStatus = "Approved – Published"; // em dash
        const matchingRecords = allRecords.filter(r => 
          r.fields['Status Bis (PMC directory)'] === targetStatus
        );
        console.log(`🎯 Records with exact status "${targetStatus}" in Status Bis (PMC directory):`, matchingRecords.length);
        
        // Check for similar statuses in Status Bis field
        const similarStatusBis = uniqueStatusBis.filter(status => 
          status && status.toLowerCase().includes('approved') && status.toLowerCase().includes('published')
        );
        console.log('🔍 Similar Status Bis statuses containing "approved" and "published":', similarStatusBis);
      }
    }

    // Now try the filtered query - check Status Bis (PMC directory) field for publishing decisions
    const filterFormula = `{Status Bis (PMC directory)} = "Approved – Published"`;
    const url = `${AIRTABLE_API_URL}?filterByFormula=${encodeURIComponent(filterFormula)}`;
    
    console.log('🔗 API URL:', url);
    console.log('📝 Filter formula:', filterFormula);
    console.log('🎯 Looking for status "Approved – Published" in Status Bis (PMC directory) field');

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error('❌ Airtable API error:', response.status, response.statusText);
      throw new Error(`Airtable API error: ${response.statusText}`);
    }

    const data = await response.json();
    const records: AirtableSubmission[] = data.records || [];
    
    console.log('📦 Raw Airtable response for approved-published submissions:', data);
    console.log('📊 Number of approved-published records found:', records.length);

    if (records.length > 0) {
      console.log('🏠 First approved-published record:', records[0]);
      console.log('📝 First record Status Bis (PMC directory):', records[0].fields['Status Bis (PMC directory)']);
      console.log('✅ SUCCESS! Found records with Status Bis (PMC directory) = "Approved – Published"!');
    } else {
      console.log('❌ No records found with Status Bis (PMC directory) = "Approved – Published"');
      console.log('🔍 This suggests a status string mismatch or no approved records');
    }

    const transformedSubmissions = records.map((record, index) => {
      try {
        console.log(`🔄 Transforming approved-published record ${index + 1}/${records.length}:`, record.id);
        console.log(`📝 Record status: ${record.fields['Status']}`);
        
        const transformedSubmission = this.transformSubmission(record);
        console.log('✅ Successfully transformed submission:', transformedSubmission.brandName);
        console.log('📝 Submission Status Bis (PMC directory):', record.fields['Status Bis (PMC directory)']);
        return transformedSubmission;
      } catch (error) {
        console.error(`❌ Error transforming approved-published record ${index + 1}:`, error);
        console.error('📋 Problematic record:', record);
        throw error;
      }
    });
    
    console.log('✨ All transformed approved-published submissions:', transformedSubmissions.length);
    return transformedSubmissions;
  },

  async getSubmissionsByCountry(countryName: string): Promise<Submission[]> {
    // Use the submission processor function that includes unique slug generation
    const { getSubmissionsForCountry } = await import('./submission-processor');
    return getSubmissionsForCountry(countryName);
  },

  async getSubmissionById(id: string): Promise<Submission | null> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    try {
      const url = `${AIRTABLE_API_URL}/${id}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Airtable API error: ${response.statusText}`);
      }

      const record: AirtableSubmission = await response.json();
      
      const status = record.fields['Status'];
      console.log('📝 Single record status:', status);
      console.log('📊 Single record data:', record.fields);
      
      // Only return records that are approved-published (note: em dash)
      if (status !== 'Approved – Published') {
        console.log('❌ Record not approved-published, status:', status);
        console.log('🔍 Expected: "Approved – Published" (em dash), Got:', JSON.stringify(status));
        return null;
      }

      return this.transformSubmission(record);
    } catch (error) {
      console.error('Error fetching submission by ID:', error);
      return null;
    }
  },

  async getSubmissionBySlug(slug: string): Promise<Submission | null> {
    // Use the new slug-email mapping system
    const { getSubmissionBySlug } = await import('./slug-email-mapping');
    return getSubmissionBySlug(slug);
  },

  async getSubmissionByEmail(email: string): Promise<Submission | null> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    try {
      console.log(`🔍 Looking up submission by email: "${email}"`);
      
      // Filter by email field
      const filterFormula = `AND({Status} = "Approved – Published", {Email} = "${email}")`;
      const url = `${AIRTABLE_API_URL}?filterByFormula=${encodeURIComponent(filterFormula)}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        },
      });

      if (!response.ok) {
        console.error('❌ Airtable API error:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      const records: AirtableSubmission[] = data.records || [];
      
      if (records.length === 0) {
        console.log(`❌ No submission found for email: "${email}"`);
        return null;
      }

      if (records.length > 1) {
        console.warn(`⚠️ Multiple submissions found for email "${email}", using first one`);
      }

      const submission = this.transformSubmission(records[0]);
      console.log(`✅ Found submission for email "${email}": "${submission.brandName}"`);
      
      return submission;
      
    } catch (error) {
      console.error(`❌ Error fetching submission by email "${email}":`, error);
      return null;
    }
  },

  /**
   * Update submission status in Airtable
   * Status workflow: 
   * 1. "Pending" → "Approved – Not Yet Published" (admin approval)
   * 2. "Approved – Not Yet Published" → "Published" (when live on site)
   * 3. "Published" submissions appear in featured carousel and public listings
   */
  async updateSubmissionStatus(id: string, status: string): Promise<void> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    const response = await fetch(`${AIRTABLE_API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'Status': status
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.statusText}`);
    }

    console.log(`✅ Updated submission ${id} status to: ${status}`);
  },

  /**
   * Convenience method to mark approved submissions as published
   */
  async markAsPublished(id: string): Promise<void> {
    await this.updateSubmissionStatus(id, 'Published');
  },

  async getPublishedSubmissions(): Promise<Submission[]> {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing');
    }

    console.log('🔍 Fetching published submissions only...');

    // Filter for only published submissions
    const filterFormula = `{Status} = "Published"`;
    const url = `${AIRTABLE_API_URL}?filterByFormula=${encodeURIComponent(filterFormula)}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error('❌ Airtable API error for published submissions:', response.status, response.statusText);
      throw new Error(`Airtable API error: ${response.statusText}`);
    }

    const data = await response.json();
    const records: AirtableSubmission[] = data.records || [];

    console.log('📦 Published submissions count:', records.length);

    // Transform Airtable records to normalized format
    const transformed = records.map(this.transformSubmission);
    console.log('✨ Published submissions transformed:', transformed);
    
    return transformed;
  },

  // Helper method to transform Airtable records to normalized format
  transformSubmission(record: AirtableSubmission): Submission {
    console.log('🔄 Transforming submission record:', record.id);
    
    const fields = record.fields;
    
    // Helper function to extract URL from Airtable attachment field
    const getAttachmentUrl = (attachmentField: any): string | undefined => {
      if (!attachmentField || !Array.isArray(attachmentField) || attachmentField.length === 0) {
        return undefined;
      }
      
      const attachment = attachmentField[0];
      
      // Try different possible properties for the URL
      const url = attachment.url || 
             attachment.URL || 
             attachment.link || 
             attachment.Link ||
             attachment.thumbnails?.large?.url ||
             attachment.thumbnails?.full?.url ||
             undefined;
             
      return url;
    };
    
    // Helper function to find rating screenshot field dynamically
    const findRatingScreenshotUrl = (): string | undefined => {
      // First try exact field name
              const exactField = fields['Rating Screenshot'];
      if (exactField) {
        return getAttachmentUrl(exactField);
      }
      
      // Then try to find any attachment field with rating/review/screenshot keywords
      const ratingAttachmentFields = Object.keys(fields).filter(key => {
        const isRatingRelated = key.toLowerCase().includes('rating') || 
                               key.toLowerCase().includes('review') || 
                               key.toLowerCase().includes('screenshot');
        const value = fields[key as keyof typeof fields];
        const hasAttachment = Array.isArray(value) && value.length > 0 && 
                             typeof value[0] === 'object' && value[0] !== null && 'url' in value[0];
        return isRatingRelated && hasAttachment;
      });
      
      if (ratingAttachmentFields.length > 0) {
        const foundFieldName = ratingAttachmentFields[0];
        console.log('📸 Using rating screenshot field:', foundFieldName);
        return getAttachmentUrl(fields[foundFieldName as keyof typeof fields]);
      }
      
      return undefined;
    };
    
    // Helper function to safely parse arrays
    const parseArray = (value: string | string[] | undefined): string[] => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      return value.split(',').map(item => item.trim()).filter(Boolean);
    };

    const transformed = {
      id: record.id,
      brandName: fields['Brand Name'] || '',
      pmcGeneralWebsite: fields['PMC General Website'] || '',
      directBookingEngineUrl: fields['Direct Booking Engine URL'] || '',
      numberOfListings: fields['Number of Listings'] || 0,
      citiesRegions: parseArray(fields['Cities / Regions']),
      countries: parseArray(fields['Countries']),
      oneLineDescription: fields['One-line Description'] || '',
      whyBookWithYou: fields['Why Book With You'] || '',
      whyRentWithYou: fields['Why Rent With You'] || '',
      commissionOnRevenue: fields['Commission On Revenue'] ? Number(fields['Commission On Revenue']) : undefined,
      topStats: fields['Top Stats'] || '',
      typesOfStays: parseArray(fields['Types of Stays']),
      idealFor: parseArray(fields['Ideal For']),
      propertiesFeatures: parseArray(fields['Properties Features']),
      servicesConvenience: parseArray(fields['Services & Convenience']),
      lifestyleValues: parseArray(fields['Lifestyle & Values']),
      designStyles: parseArray(fields['Design Style']),
      atmospheres: parseArray(fields['Atmospheres']),
      settingsLocations: parseArray(fields['Settings/Locations']),
      instagram: fields['Instagram'] || undefined,
      facebook: fields['Facebook'] || undefined,
      linkedin: fields['LinkedIn'] || undefined,
      tiktok: fields['TikTok'] || undefined,
      youtube: fields['YouTube / Video Tour'] || undefined,
      plan: fields['Plan'] || '',
      submissionDate: fields['Submission Date'] || '',
      status: fields['Status'] || '',
      statusBis: fields['Status Bis (PMC directory)'] || undefined,
      paymentStatus: '', // Placeholder, will be updated by payment processor
      stripeCustomerId: undefined, // Placeholder, will be updated by payment processor
      stripeSubscriptionId: undefined, // Placeholder, will be updated by payment processor
      paymentDate: '', // Placeholder, will be updated by payment processor
      email: fields['Email'] || '',
      uniqueSlug: undefined, // Placeholder, will be generated by slug-email-mapping
      // Additional properties for display
      logo: getAttachmentUrl(fields['Logo']),
      highlightImage: getAttachmentUrl(fields['Highlight Image']),
      ratingScreenshot: findRatingScreenshotUrl(),
      minPrice: fields['Min Price'] ? Number(fields['Min Price']) : undefined,
      maxPrice: fields['Max Price'] ? Number(fields['Max Price']) : undefined,
      currency: fields['Currency'] || undefined,
    };



    console.log('✅ Transformed:', transformed.brandName, '- Status:', transformed.status);
    
    return transformed;
  }
};

// Export for use in components
export default airtableService; 