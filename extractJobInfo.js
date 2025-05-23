function extractJobInfo() {
  try {
    // Extract job title
    const experienceSpan = Array.from(document.querySelectorAll('span[aria-hidden="true"]'))
      .find(span => span.textContent.trim() === "Experience");
    if (!experienceSpan) return { jobTitle: '', companyName: '' };
    
    const experienceCard = experienceSpan.closest('div.pvs-header__top-container--no-stack').parentElement.nextElementSibling;
    const currentCompany = experienceCard.querySelector('ul li');
    const positions = Array.from(currentCompany.querySelectorAll('div.display-flex.flex-wrap.align-items-center.full-height'));
    const currentPosition = positions.length > 1 ? positions[1] : positions[0];
    const jobTitle = currentPosition.querySelector('span[aria-hidden="true"]').textContent.trim();
    
    // Extract company name
    const companyButton = document.querySelector('[aria-label^="Current company"]');
    let companyName = '';
    if (companyButton) {
      const match = companyButton.getAttribute('aria-label').match(/Current company: (.+?)\./i);
      companyName = match ? match[1].trim() : '';
    }

    return { jobTitle, companyName };
  } catch (e) {
    console.error('Error in content script:', e);
    return { jobTitle: '', companyName: '' };
  }
}

extractJobInfo();