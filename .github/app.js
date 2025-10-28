document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('resume-form');
    const preview = document.getElementById('preview');
    const formSections = form.querySelectorAll('.form-section');

    // --- LOCAL STORAGE ---
    const saveToLocalStorage = () => {
        const formData = new FormData(form);
        const data = {};
        // Handle standard inputs
        for (const [key, value] of formData.entries()) { // Added custom_ to the exclusion list
            if (!key.startsWith('exp_') && !key.startsWith('edu_') && !key.startsWith('cert_') && !key.startsWith('proj_') && !key.startsWith('lang_') && !key.startsWith('custom_')) {
                data[key] = value;
            }
        }
        // Handle repeatable sections
        data.customSections = getSectionData('custom-sections-list');
        data.experience = getSectionData('work-experience-list');
        data.education = getSectionData('education-list');
        data.certifications = getSectionData('certifications-list');
        data.languages = getSectionData('languages-list');
        data.projects = getSectionData('projects-list');
        data.theme = document.getElementById('theme-select').value; // Save selected theme

        localStorage.setItem('resumeData', JSON.stringify(data));
    };

    const loadFromLocalStorage = () => {
        const data = JSON.parse(localStorage.getItem('resumeData'));
        if (data) {
            populateForm(data);
            if (data.theme) {
                document.getElementById('theme-select').value = data.theme;
                document.documentElement.setAttribute('data-theme', data.theme);
            }
        }
    };

    // --- FORM POPULATION ---
    const populateForm = (data) => {
        // Simple fields
        for (const key in data) {
            if (form.elements[key] && typeof data[key] === 'string') {
                form.elements[key].value = data[key];
            }
        }
        // Repeatable sections
        if (data.experience) data.experience.forEach(item => addExperience(item));
        if (data.education) data.education.forEach(item => addEducation(item));
        if (data.certifications) data.certifications.forEach(item => addCertification(item));
        if (data.languages) data.languages.forEach(item => addLanguage(item));
        if (data.customSections) data.customSections.forEach(item => addCustomSection(item));
        if (data.projects) data.projects.forEach(item => addProject(item));
        // updatePreview is called after this in the main execution flow
        updatePreview();
    };

    const getSectionData = (listId) => {
        const list = document.getElementById(listId);
        return Array.from(list.children).map(entry => {
            const entryData = {};
            entry.querySelectorAll('input, textarea, select').forEach(input => {
                entryData[input.name] = input.value;
            });
            return entryData;
        });
    };

    // --- LIVE PREVIEW UPDATE ---
    const updatePreview = () => {
        // Contact
        document.getElementById('preview-name').textContent = form.name.value;
        document.getElementById('preview-title').textContent = form.title.value;
        document.getElementById('preview-email').textContent = form.email.value;
        document.getElementById('preview-phone').textContent = form.phone.value;
        document.getElementById('preview-address').textContent = form.address.value;
        const websitePreview = document.getElementById('preview-website');
        if (form.website.value) {
            websitePreview.innerHTML = `<a href="${form.website.value}" target="_blank">${form.website.value}</a>`;
        } else {
            websitePreview.innerHTML = '';
        }

        // Summary
        const summarySection = document.getElementById('summary-section-preview');
        const summaryText = form.summary.value;
        document.getElementById('preview-summary').textContent = summaryText;
        summarySection.hidden = !summaryText;

        // Experience
        updateSectionPreview('work-experience-list', 'preview-experience', 'experience-section-preview', createExperienceHTML);
        // Education
        updateSectionPreview('education-list', 'preview-education', 'education-section-preview', createEducationHTML);
        // Certifications
        updateSectionPreview('certifications-list', 'preview-certifications', 'certifications-section-preview', createCertificationHTML, true);
        // Custom Sections
        updateSectionPreview('custom-sections-list', 'custom-sections-preview', 'custom-sections-preview', createCustomSectionHTML);
        // Languages
        updateSectionPreview('languages-list', 'preview-languages', 'languages-section-preview', createLanguageHTML);
        // Projects
        updateSectionPreview('projects-list', 'preview-projects', 'projects-section-preview', createProjectHTML);

        // Skills
        const skillsSection = document.getElementById('skills-section-preview');
        const skillsList = document.getElementById('preview-skills');
        const skills = form.skills.value.split(',').map(s => s.trim()).filter(s => s);
        skillsList.innerHTML = '';
        if (skills.length > 0) {
            skills.forEach(skill => skillsList.innerHTML += `<li>${skill}</li>`);
            skillsSection.hidden = false;
        } else {
            skillsSection.hidden = true;
        }

        // Footer
        document.getElementById('preview-footer-name').textContent = form.name.value;

        saveToLocalStorage();
    };

    const updateSectionPreview = (listId, previewId, sectionId, htmlFactory, isList = false) => {
        const list = document.getElementById(listId);
        const previewContainer = document.getElementById(previewId);
        const section = document.getElementById(sectionId);
        
        previewContainer.innerHTML = '';
        const entries = getSectionData(listId); // Use getSectionData to get structured data

        if (entries.length > 0) {
            // Special handling for languages to be a single line
            if (listId === 'languages-list') {
                previewContainer.innerHTML = entries.map(entry => createLanguageHTML(entry)).join(' • ');
            } else {
                entries.forEach(entryData => {
                const element = htmlFactory(entryData);
                if (element) {
                    previewContainer.appendChild(element);
                }
                });
            }
            section.hidden = false;
        } else {
            section.hidden = true;
        }
    };

    // --- HTML FACTORIES FOR PREVIEW ---
    const createExperienceHTML = (data) => {
        if (!data.company && !data.role) return null;
        const article = document.createElement('article');
        article.innerHTML = `
            <h3>${data.role || ''}</h3>
            <div>${data.company || ''}</div>
            <div class="job-meta">
                <span>${data.exp_location || ''}</span>
                <span>${data.exp_start_date || ''} - ${data.exp_end_date || ''}</span>
            </div>
            <ul>
                ${data.responsibilities.split('\n').map(line => `<li>${line.replace(/^- /, '')}</li>`).join('')}
            </ul>
        `;
        return article;
    };

    const createEducationHTML = (data) => {
        if (!data.school && !data.degree) return null;
        const article = document.createElement('article');
        article.innerHTML = `
            <h3>${data.degree || ''}</h3>
            <div>${data.school || ''}</div>
            <div class="job-meta">
                <span>${data.edu_notes || ''}</span>
                <span>${data.edu_start_date || ''} - ${data.edu_end_date || ''}</span>
            </div>
        `;
        return article;
    };

    const createCertificationHTML = (data) => {
        if (!data.certification_name) return null;
        const li = document.createElement('li');
        li.textContent = data.certification_name;
        return li;
    };

    const createCustomSectionHTML = (data) => {
        if (!data.custom_title) return null;
        const section = document.createElement('section');
        section.classList.add('resume-section'); // Re-use existing section styling
        section.innerHTML = `
            <h2>${data.custom_title}</h2>
            <p>${data.custom_description || ''}</p>
        `;
        return section;
    };

    const createLanguageHTML = (entryOrData) => {
        const data = entryOrData; // This function now only receives data objects
        return data.language_name ? `${data.language_name} (${data.proficiency})` : '';
    };

    const createProjectHTML = (data) => {
        if (!data.project_title) return null;
        const article = document.createElement('article');
        article.innerHTML = `
            <h3>${data.project_title}</h3>
            ${data.project_link ? `<div class="project-link"><a href="${data.project_link}" target="_blank">${data.project_link}</a></div>` : ''}
            <p>${data.project_description || ''}</p>
        `;
        return article;
    };

    // --- DYNAMIC FORM SECTION MANAGEMENT ---
    const setupRepeatableSection = (addButtonId, listId, templateId, addFunction, data) => {
        document.getElementById(addButtonId).addEventListener('click', () => addFunction());
        document.getElementById(listId).addEventListener('click', (e) => {
            const entry = e.target.closest('.form-group-compound');
            if (e.target.classList.contains('remove-btn')) {
                entry.remove();
                updatePreview();
            }
            if (e.target.classList.contains('move-up-btn')) {
                if (entry.previousElementSibling) {
                    entry.parentElement.insertBefore(entry, entry.previousElementSibling);
                    updatePreview();
                }
            }
            if (e.target.classList.contains('move-down-btn')) {
                if (entry.nextElementSibling) {
                    entry.parentElement.insertBefore(entry.nextElementSibling, entry);
                    updatePreview();
                }
            }
        });
    };

    const createEntry = (templateId, listId, data = {}) => {
        const template = document.getElementById(templateId);
        const clone = template.content.cloneNode(true);
        const entry = clone.querySelector('.form-group-compound');
        
        if (Object.keys(data).length > 0) {
            entry.querySelectorAll('input, textarea, select').forEach(input => {
                if (data[input.name]) {
                    input.value = data[input.name];
                }
            });
        }
        
        document.getElementById(listId).appendChild(entry);
    };

    const addExperience = (data) => createEntry('experience-template', 'work-experience-list', data);
    const addEducation = (data) => createEntry('education-template', 'education-list', data);
    const addCertification = (data) => createEntry('certification-template', 'certifications-list', data);
    const addLanguage = (data) => createEntry('language-template', 'languages-list', data);
    const addCustomSection = (data) => createEntry('custom-section-template', 'custom-sections-list', data);
    const addProject = (data) => createEntry('project-template', 'projects-list', data);

    setupRepeatableSection('add-experience', 'work-experience-list', 'experience-template', addExperience);
    setupRepeatableSection('add-education', 'education-list', 'education-template', addEducation);
    setupRepeatableSection('add-certification', 'certifications-list', 'certification-template', addCertification);
    setupRepeatableSection('add-language', 'languages-list', 'language-template', addLanguage);
    setupRepeatableSection('add-custom-section', 'custom-sections-list', 'custom-section-template', addCustomSection);
    setupRepeatableSection('add-project', 'projects-list', 'project-template', addProject);

    // --- EVENT LISTENERS ---
    form.addEventListener('input', updatePreview);
    form.addEventListener('change', updatePreview); // For selects, etc.

    // Character counter for summary
    const summaryTextarea = document.getElementById('summary');
    const summaryCharCount = document.getElementById('summary-char-count');
    summaryTextarea.addEventListener('input', () => {
        const count = summaryTextarea.value.length;
        summaryCharCount.textContent = `(${count}/670)`;
    });

    // Input validation messages
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', () => {
        const messageSpan = emailInput.nextElementSibling;
        if (emailInput.validity.typeMismatch) {
            messageSpan.textContent = 'Please enter a valid email address.';
        } else {
            messageSpan.textContent = '';
        }
    });

    // --- TOOLBAR ACTIONS ---
    // PDF Download
    document.getElementById('download-pdf').addEventListener('click', () => {
        const originalTitle = document.title;
        const resumeName = form.name.value || 'Resume';
        document.title = resumeName.replace(/ /g, '_'); // Set title for PDF filename

        window.print();

        // Restore original title after print dialog
        setTimeout(() => { document.title = originalTitle; }, 500);
    });

    // JSON Export
    document.getElementById('export-json').addEventListener('click', () => {
        const dataStr = localStorage.getItem('resumeData');
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'resume-data.json';
        link.click();
        URL.revokeObjectURL(url);
    });

    // JSON Import
    const importInput = document.getElementById('import-json-input');
    importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    resetForm(false); // Clear form without confirmation
                    populateForm(data);
                } catch (error) {
                    alert('Error: Could not parse JSON file.');
                }
            };
            reader.readAsText(file);
        } else {
            alert('Please select a valid .json file.');
        }
        // Reset input value to allow re-importing the same file
        importInput.value = '';
    });

    // Reset Form
    const resetForm = (confirmReset = true) => {
        if (confirmReset && !confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            return;
        }
        form.reset();
        document.getElementById('work-experience-list').innerHTML = '';
        document.getElementById('education-list').innerHTML = '';
        document.getElementById('certifications-list').innerHTML = '';
        document.getElementById('languages-list').innerHTML = '';
        document.getElementById('custom-sections-list').innerHTML = '';
        document.getElementById('projects-list').innerHTML = '';
        localStorage.removeItem('resumeData');
        updatePreview();
    };
    document.getElementById('reset-form').addEventListener('click', () => resetForm());

    // Theme Switcher
    const themeSelect = document.getElementById('theme-select');
    themeSelect.addEventListener('change', (e) => {
        const newTheme = e.target.value;
        document.documentElement.setAttribute('data-theme', newTheme);
        // Also save it immediately on change
        saveToLocalStorage();
    });

    // --- INITIALIZATION ---
    loadFromLocalStorage();
    // The theme is now correctly set inside loadFromLocalStorage.
    // If nothing is in local storage, we ensure the default theme is applied.
    document.documentElement.setAttribute('data-theme', document.documentElement.getAttribute('data-theme') || 'classic');
    updatePreview();
});
