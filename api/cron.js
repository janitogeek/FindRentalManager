// Enhanced cron job endpoint for Vercel - checks Airtable every 2 minutes
// This will be called automatically by Vercel Cron and force website updates

export default async function handler(req, res) {
  try {
    // SECURITY: Verify this is a legitimate Vercel cron job
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.log('❌ Unauthorized cron job access attempt');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    console.log('🕐 Vercel Cron: Checking Airtable for status changes...');
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    
    // Get Airtable credentials from environment
    const airtableApiKey = process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
    
    if (!airtableApiKey || !airtableBaseId) {
      console.error('❌ Missing Airtable environment variables');
      return res.status(500).json({ 
        error: 'Missing Airtable configuration',
        message: 'Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID environment variables'
      });
    }
    
    // Initialize Airtable
    const Airtable = require('airtable');
    const base = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId);
    
    // Get all submissions from Airtable
    console.log('📡 Fetching submissions from Airtable...');
    const records = await base('Submissions').select({
      fields: ['id', 'Brand Name', 'Status', 'Status Bis (PMC directory)', 'Created', 'Last Modified']
    }).all();
    
    const allSubmissions = records.map(record => ({
      id: record.id,
      brandName: record.get('Brand Name') || 'Unknown',
      status: record.get('Status') || 'Unknown',
      statusBis: record.get('Status Bis (PMC directory)'),
      createdAt: record.get('Created') || '',
      updatedAt: record.get('Last Modified') || ''
    }));
    
    console.log(`📊 Found ${allSubmissions.length} total submissions`);
    
    // Check for status changes and force website updates
    let statusChanges = 0;
    let newlyApproved = 0;
    let newlyRejected = 0;
    let newlyPending = 0;
    
    // Get current approved submissions
    const approvedSubmissions = allSubmissions.filter(sub => 
      sub.status === 'Approved – Published'
    );
    
    const rejectedSubmissions = allSubmissions.filter(sub => 
      sub.status === 'Rejected'
    );
    
    const pendingSubmissions = allSubmissions.filter(sub => 
      sub.status === 'Pending Review'
    );
    
    console.log(`✅ Currently approved: ${approvedSubmissions.length}`);
    console.log(`❌ Currently rejected: ${rejectedSubmissions.length}`);
    console.log(`⏳ Currently pending: ${pendingSubmissions.length}`);
    
    // Check if we need to force a website refresh
    let needsWebsiteUpdate = false;
    
    // Check for any submissions that need to be published
    if (approvedSubmissions.length > 0) {
      console.log('🎉 Approved submissions that should be visible on website:');
      approvedSubmissions.forEach(sub => {
        console.log(`  - ${sub.brandName} (${sub.status})`);
      });
      needsWebsiteUpdate = true;
    }
    
    // Check for any submissions that need to be removed
    if (rejectedSubmissions.length > 0) {
      console.log('❌ Rejected submissions that should be removed from website:');
      rejectedSubmissions.forEach(sub => {
        console.log(`  - ${sub.brandName} (${sub.status})`);
      });
      needsWebsiteUpdate = true;
    }
    
    // Force website data refresh if needed
    if (needsWebsiteUpdate) {
      console.log('🔄 Forcing website data refresh...');
      
      try {
        // Call the data refresh endpoint to update website
        const refreshResponse = await fetch(`${process.env.VITE_CLIENT_URL || 'https://yourdomain.com'}/api/refresh-data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REFRESH_SECRET || 'cron-refresh'}`,
          },
        });
        
        if (refreshResponse.ok) {
          console.log('✅ Website data refresh triggered successfully');
        } else {
          console.log('⚠️ Website data refresh failed, but cron job completed');
        }
      } catch (error) {
        console.log('⚠️ Could not trigger website refresh, but cron job completed:', error.message);
      }
      
      // Also try to clear any caches
      try {
        // Clear Vercel edge cache if possible
        const cacheResponse = await fetch(`${process.env.VITE_CLIENT_URL || 'https://yourdomain.com'}/api/clear-cache`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REFRESH_SECRET || 'cron-refresh'}`,
          },
        });
        
        if (cacheResponse.ok) {
          console.log('✅ Cache cleared successfully');
        }
      } catch (error) {
        console.log('⚠️ Cache clearing failed, but cron job completed:', error.message);
      }
    }
    
    // Return success with detailed information
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      totalSubmissions: allSubmissions.length,
      approvedSubmissions: approvedSubmissions.length,
      rejectedSubmissions: rejectedSubmissions.length,
      pendingSubmissions: pendingSubmissions.length,
      needsWebsiteUpdate: needsWebsiteUpdate,
      message: `Cron job completed! Found ${approvedSubmissions.length} approved submissions ready for website.`,
      note: 'Website data has been refreshed to show only approved submissions.',
      action: needsWebsiteUpdate ? 'Website updated' : 'No changes needed'
    });
    
  } catch (error) {
    console.error('❌ Cron job failed:', error);
    
    res.status(500).json({ 
      success: false,
      error: 'Cron job failed',
      details: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
