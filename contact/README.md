# Contact Form with Google Forms and WhatsApp Integration for Netlify

This guide explains how to set up the contact form integration with Google Forms and WhatsApp on Netlify.

## Google Forms Setup

1. **Google Form Details**:
   - Form ID: `1FAIpQLSeo_Ftmc7yEY69w_TVTZcfY8RysuRY92P87xDFryUfd-uP6aQ`
   - Field IDs:
     - Name: `entry.2005620554`
     - Email: `entry.1045781291`
     - Address: `entry.1065046570`
     - Phone: `entry.1166974658`
     - Comments: `entry.839337160`

2. **Netlify Configuration**:
   - The `netlify.toml` file has been updated with the correct Google Form ID
   - The form submission is handled through a Netlify redirect to avoid CORS issues

## WhatsApp Integration Setup on Netlify

### Option 1: Simple WhatsApp API (Client-side)

This is already implemented and requires no additional setup. It will open WhatsApp with a pre-filled message but requires user interaction.

### Option 2: WhatsApp Business API (Server-side with Netlify Functions)

For automated message sending without user interaction:

1. **Deploy to Netlify**:
   - Push your code to a Git repository (GitHub, GitLab, etc.)
   - Connect the repository to Netlify
   - Deploy your site

2. **Set Environment Variables in Netlify**:
   - Go to your Netlify site dashboard
   - Navigate to Site settings > Build & deploy > Environment
   - Add the required environment variables based on your chosen method:

   For WhatsApp Cloud API:
   ```
   WHATSAPP_ACCESS_TOKEN=your_access_token
   WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
   ```

   For Twilio:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
   ```

3. **Enable the API in the Function**:
   - Open `netlify/functions/send-whatsapp.js`
   - Uncomment the API method you want to use:
     ```js
     const whatsappCloudApiResult = await sendViaWhatsAppCloudAPI(formattedNumber, message);
     // OR
     const twilioResult = await sendViaTwilio(formattedNumber, message);
     ```

## Testing Your Integration

1. Deploy your site to Netlify
2. Fill out the contact form and submit
3. Check your Google Sheet to confirm the data was received
4. Check if the WhatsApp message was sent or if WhatsApp opened with the pre-filled message

## Troubleshooting

- If Google Form submission fails, check the field IDs and form URL in the Netlify redirect
- If WhatsApp integration fails, check the Netlify Function logs in your Netlify dashboard
- Make sure your environment variables are correctly set in the Netlify dashboard

## Security Considerations

- The current implementation uses environment variables for API keys, which is secure for Netlify Functions
- Consider adding rate limiting to prevent abuse (Netlify offers this feature)
- For additional security, you can add reCAPTCHA to your form 