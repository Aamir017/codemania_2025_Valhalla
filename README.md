# PhishGuard - Phishing Detection & Awareness Tool

PhishGuard is a web-based tool designed to help users identify potential phishing attempts and learn about cybersecurity best practices. The application is built using pure HTML, CSS, and JavaScript with no external dependencies or server requirements.

## Features

### URL Scanner
- Advanced URL analysis for phishing detection
- Integration with Google Safe Browsing API for enhanced threat detection
- Check for suspicious TLDs, excessive subdomains, and IP addresses
- Identify brand impersonation attempts
- Save and view recent scan history

### Phishing Awareness Training
- Interactive email simulations to practice identifying phishing attempts
- Learn about common phishing indicators
- Test your knowledge with real-world examples

### Security Knowledge Quiz
- Test your understanding of phishing and cybersecurity concepts
- Get a score and personalized feedback
- Track your improvement over time

## How to Use

1. **Clone or download** this repository
2. **Open the `index.html` file** in any modern web browser
3. No server or installation required - it's a client-side application!

### Google Safe Browsing API Setup (Optional)
For enhanced URL scanning capabilities:
1. Sign up for a Google API key at [Google Cloud Platform Console](https://console.cloud.google.com/)
2. Enable the Safe Browsing API
3. Replace `YOUR_API_KEY_HERE` in the `js/scanner.js` file with your actual API key

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript
- Uses localStorage to persist user data
- Responsive design that works on mobile and desktop
- Dark mode support
- Google Safe Browsing API integration for malicious URL detection

## URL Detection Methodology

The URL scanner uses a two-tier approach to evaluate the risk level of a URL:

1. **Local Analysis**:
   - Presence of suspicious top-level domains (.tk, .ml, etc.)
   - IP addresses in place of domain names
   - Use of the @ symbol in URLs
   - Excessive subdomains
   - Unusually long URLs
   - Brand names in suspicious domains
   - HTTP instead of HTTPS

2. **API-Enhanced Analysis** (when configured):
   - Checks against Google Safe Browsing's database of known:
     - Phishing sites
     - Malware sites
     - Unwanted software
     - Potentially harmful applications
   - Adjusts risk score based on API findings

## Limitations

- Basic URL analysis is available without API configuration
- Full threat detection requires Google Safe Browsing API setup
- API usage may be subject to quota limitations from Google
- Always exercise caution when visiting unknown websites

## Future Enhancements

- Integration with additional threat databases
- Additional phishing simulations
- More comprehensive URL analysis
- Browser extension version

## License

This project is open source and available under the [MIT License](LICENSE). # codemania_2025_Valhalla
