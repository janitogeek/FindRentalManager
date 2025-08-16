import { NextApiRequest, NextApiResponse } from 'next';
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  const { endpoint } = query;

  try {
    switch (method) {
      case 'GET':
        if (endpoint === 'health') {
          return await handleHealth(req, res);
        } else if (endpoint === 'test') {
          return await handleTest(req, res);
        } else if (endpoint === 'submissions') {
          return await handleGetSubmissions(req, res);
        } else if (endpoint === 'pocketbase') {
          return await handlePocketbase(req, res);
        }
        break;

      case 'POST':
        if (endpoint === 'submissions') {
          return await handleCreateSubmission(req, res);
        } else if (endpoint === 'log-click') {
          return await handleLogClick(req, res);
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }

    // Default response for root endpoint
    if (!endpoint) {
      return res.status(200).json({
        message: 'FindRentalManager API',
        version: '1.0.0',
        endpoints: [
          'GET /api/main?endpoint=health',
          'GET /api/main?endpoint=test',
                  'GET /api/main?endpoint=submissions',
        'POST /api/main?endpoint=submissions',
        'POST /api/main?endpoint=log-click',
        'GET /api/main?endpoint=pocketbase',
      ],
      });
    }

    res.status(404).json({ error: 'Endpoint not found' });
  } catch (error) {
    console.error('Main API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleHealth(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check if PocketBase is accessible
    const healthCheck = await pb.health.check();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      pocketbase: healthCheck.status === 'ok' ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    });
  }
}

async function handleTest(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    message: 'Test endpoint working',
    timestamp: new Date().toISOString(),
    method: req.method,
    query: req.query,
  });
}

async function handleGetSubmissions(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { page = 1, limit = 50, sort = '-created', filter } = req.query;

    const params: any = {
      page: Number(page),
      perPage: Number(limit),
      sort: String(sort),
    };

    if (filter) {
      params.filter = String(filter);
    }

    const records = await pb.collection('Submissions').getList(Number(page), Number(limit), params);

    res.status(200).json({
      page: records.page,
      perPage: records.perPage,
      totalItems: records.totalItems,
      totalPages: records.totalPages,
      items: records.items,
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
}

async function handleCreateSubmission(req: NextApiRequest, res: NextApiResponse) {
  try {
    const submissionData = req.body;

    // Validate required fields
    if (!submissionData.propertyName || !submissionData.hostEmail) {
      return res.status(400).json({ error: 'Property name and host email are required' });
    }

    const record = await pb.collection('Submissions').create(submissionData);

    res.status(201).json({
      id: record.id,
      message: 'Submission created successfully',
      record,
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ error: 'Failed to create submission' });
  }
}

async function handleLogClick(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { hostId, type } = req.body;

    if (!hostId || !type) {
      return res.status(400).json({ error: 'Host ID and type are required' });
    }

    // Log the click event (you can implement your own logging logic here)
    console.log(`Click tracked: ${type} for host ${hostId} at ${new Date().toISOString()}`);

    // You can also store this in PocketBase or another database
    // For now, we'll just return success
    res.status(200).json({
      success: true,
      message: 'Click tracked successfully',
      data: { hostId, type, timestamp: new Date().toISOString() }
    });
  } catch (error) {
    console.error('Error logging click:', error);
    res.status(500).json({ error: 'Failed to log click' });
  }
}

async function handlePocketbase(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { collection, action, id } = req.query;

    if (collection === 'Submissions' && action === 'records') {
      const { page = 1, limit = 50, sort = '-created', filter } = req.query;

      const params: any = {
        page: Number(page),
        perPage: Number(limit),
        sort: String(sort),
      };

      if (filter) {
        params.filter = String(filter);
      }

      const records = await pb.collection('Submissions').getList(Number(page), Number(limit), params);

      return res.status(200).json({
        page: records.page,
        perPage: records.perPage,
        totalItems: records.totalItems,
        totalPages: records.totalPages,
        items: records.items,
      });
    }

    res.status(404).json({ error: 'PocketBase endpoint not found' });
  } catch (error) {
    console.error('PocketBase API error:', error);
    res.status(500).json({ error: 'PocketBase operation failed' });
  }
}
