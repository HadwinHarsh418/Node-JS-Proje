const fs = require('fs'); // To read the HTML template file
const Mailjet = require('node-mailjet'); // Assuming you're using Mailjet SDK
// const registerMail = require('./registerMail.html')

function sendWelcomeEmail(userEmail, firstName, confirmationLink,otp) {
    const mailjet = new Mailjet({
        apiKey: process.env.MJ_APIKEY_PUBLIC,
        apiSecret: process.env.MJ_APIKEY_PRIVATE
    });

    // Read the HTML template
    fs.readFile('registerMail.html', 'utf-8', (err, htmlTemplate) => {
        if (err) {
            console.log('Error reading template file:', err);
            return;
        }

        // Replace placeholders with actual values
        let htmlContent = htmlTemplate
            .replace('{{username}}', firstName)
            .replace('{{email}}', userEmail)
            .replace('{{date}}', new Date().toLocaleDateString())
            .replace('{{confirmationLink}}', confirmationLink)
            .replace('[Your Company Name]', 'Your Company Name')  // Replace with your company name
            .replace('[Support Email Address]', 'support@yourcompany.com') // Replace with your support email
            .replace('[Your Contact Information]', 'Contact info here')  // Replace with your contact info
            .replace('[Your Website URL]', 'https://www.yourwebsite.com') // Replace with your website URL
            .replace('{{otp}}', otp);

        // Send the email
        const request = mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: "harshkm814@gmail.com", // Use your email here
                            Name: "Pikachu World"
                        },
                        To: [
                            {
                                Email: userEmail,
                                Name: firstName
                            }
                        ],
                        Subject: "Welcome to Our Platform!",
                        HTMLPart: htmlContent // Use the populated HTML template
                    }
                ]
            });

        request
            .then((result) => {
                console.log('Email sent successfully:', result.body);
            })
            .catch((err) => {
                console.log('Error sending email:', err.statusCode);
            });
    });
}

module.exports = sendWelcomeEmail