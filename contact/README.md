# Contact Form with Google Forms and WhatsApp Integration

This guide explains how to set up the contact form integration with Google Forms and WhatsApp.

## How It Works

1. **Direct Google Form Submission**:
   - The form submits directly to Google Forms using the `target="hidden_iframe"` approach
   - Form fields are mapped directly to Google Form field IDs
   - The submission happens in a hidden iframe, so the user stays on your page

2. **WhatsApp Integration**:
   - After successful form submission, a WhatsApp message is prepared with the form data
   - The message is sent to your business WhatsApp number (7306364765)
   - This happens through a hidden iframe that opens the WhatsApp API URL

## Google Form Details

- Form ID: `1FAIpQLSeo_Ftmc7yEY69w_TVTZcfY8RysuRY92P87xDFryUfd-uP6aQ`
- Field IDs:
  - Name: `entry.2005620554`
  - Email: `entry.1045781291`
  - Address: `entry.1065046570`
  - Phone: `entry.1166974658`
  - Comments: `entry.839337160`

## Important Files

- **contact.html**: Contains the form and JavaScript for form submission and WhatsApp integration

## Testing

1. Fill out and submit the form
2. You should see a success message on the page
3. The data should be submitted to your Google Form
4. A WhatsApp message should be prepared with the form data

## Troubleshooting

If the form submission fails:

1. Check the browser console for errors
2. Make sure the Google Form ID and field IDs are correct
3. Verify that the form action URL is correct
4. Check if Google Forms is accepting submissions from your domain

## Security Considerations

- This implementation is simple and works well for most cases
- For additional security, consider adding reCAPTCHA to prevent spam
- The WhatsApp integration uses the public WhatsApp API, which requires user interaction on mobile devices 