# ATS-Friendly Resume Builder

A simple, client-side, single-page web application for creating, previewing, and exporting ATS-friendly resumes. Built with pure HTML, CSS, and JavaScript—no frameworks, no libraries, no backend.

## How to Run

1.  Download the project files (`index.html`, `styles.css`, `app.js`).
2.  Open `index.html` in any modern web browser (like Chrome, Firefox, or Edge).
3.  That's it! The application runs entirely in your browser.

## Features

*   **Live Preview**: See your resume update in real-time as you type.
*   **PDF Export**: Generate a clean, printable PDF of your resume using your browser's print function.
*   **JSON Data**: Export your resume data to a JSON file for backup, and import it later to continue editing.
*   **Local Storage**: Your progress is automatically saved in your browser's local storage, so you won't lose work if you refresh the page.
*   **Responsive Design**: Works on both desktop and mobile devices.
*   **Theming**: Switch between 'Classic' and 'Modern' visual themes.

## ATS Best Practices Implemented

This builder is designed to produce resumes that are easily parsed by Applicant Tracking Systems (ATS).

1.  **Semantic HTML**: The preview uses semantic tags (`<header>`, `<section>`, `<h1>`, `<h2>`, etc.) which helps ATS bots understand the structure of your document.
2.  **Single-Column Layout**: The print output is a clean, single-column layout, which is the most reliable format for ATS parsing.
3.  **Standard Fonts**: Uses system fonts that are universally available and readable. No special fonts or icons that might confuse a parser.
4.  **No Images or Graphics**: All information, including contact details, is plain text. ATS cannot read text embedded in images.
5.  **Clear Headings**: Sections like "Work Experience" and "Education" are clearly marked with heading tags.
6.  **Consistent Date Formatting**: Encourages a consistent format for dates (e.g., "Jan 2020 – Mar 2023").
