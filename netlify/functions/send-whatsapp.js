// Netlify Function for WhatsApp integration
const https = require('https');
const querystring = require('querystring');

// Business WhatsApp number
const BUSINESS_WHATSAPP_NUMBER = '917306364765';

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request (preflight CORS check)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Preflight call successful' })
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const requestBody = JSON.parse(event.body);
    const { number, message } = requestBody;

    if (!number || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    // Format the phone number (remove any non-numeric characters)
    const formattedNumber = number.replace(/\D/g, '');

    // OPTION 1: WhatsApp Cloud API (Meta/Facebook Business API)
    // Uncomment and configure this if you have WhatsApp Business API access
    // const whatsappCloudApiResult = await sendViaWhatsAppCloudAPI(formattedNumber, message);

    // OPTION 2: Twilio API for WhatsApp
    // Uncomment and configure this if you have Twilio with WhatsApp capability
    // const twilioResult = await sendViaTwilio(formattedNumber, message);

    // OPTION 3: Simple WhatsApp URL (default fallback)
    // This doesn't actually send the message automatically but provides a URL
    const whatsappUrl = getWhatsAppUrl(formattedNumber, message);

    // Return success response with WhatsApp URL
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'WhatsApp message prepared',
        whatsapp_url: whatsappUrl,
        to: formattedNumber
      })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error', details: error.message })
    };
  }
};

// OPTION 1: WhatsApp Cloud API (Meta/Facebook Business API)
async function sendViaWhatsAppCloudAPI(number, message) {
  // Replace these with your actual credentials
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  
  if (!accessToken || !phoneNumberId) {
    throw new Error('WhatsApp API credentials not configured');
  }
  
  const data = JSON.stringify({
    messaging_product: 'whatsapp',
    to: number,
    type: 'text',
    text: { body: message }
  });
  
  const options = {
    hostname: 'graph.facebook.com',
    port: 443,
    path: `/v17.0/${phoneNumberId}/messages`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Content-Length': data.length
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 300,
            response: parsedData,
            statusCode: res.statusCode
          });
        } catch (e) {
          resolve({
            success: false,
            response: responseData,
            statusCode: res.statusCode,
            error: e.message
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(data);
    req.end();
  });
}

// OPTION 2: Twilio API for WhatsApp
async function sendViaTwilio(number, message) {
  // Replace these with your actual credentials
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
  
  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials not configured');
  }
  
  // Format the number for Twilio
  const toNumber = `whatsapp:+${number}`;
  
  const data = querystring.stringify({
    From: fromNumber,
    To: toNumber,
    Body: message
  });
  
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  
  const options = {
    hostname: 'api.twilio.com',
    port: 443,
    path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`,
      'Content-Length': data.length
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 300,
            response: parsedData,
            statusCode: res.statusCode
          });
        } catch (e) {
          resolve({
            success: false,
            response: responseData,
            statusCode: res.statusCode,
            error: e.message
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(data);
    req.end();
  });
}

// OPTION 3: Simple WhatsApp URL (client-side fallback)
function getWhatsAppUrl(number, message) {
  // Use the business WhatsApp number instead of the number from the request
  return `https://api.whatsapp.com/send?phone=${BUSINESS_WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
} 