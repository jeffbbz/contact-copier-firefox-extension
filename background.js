browser.browserAction.onClicked.addListener(async () => {
  try {
    const tabs = await browser.tabs.query({
      currentWindow: true,
      pinned: false,
      url: "*://*.linkedin.com/*"
    });

    if (tabs.length === 0) {
      console.log("No matching tabs found");
      return;
    }

    const sheetsData = await Promise.all(tabs.map(async (tab) => {
      try {
        // Execute job title and company extraction in the tab
        const [jobInfo] = await browser.tabs.executeScript(tab.id, {
          code: `(function() {
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
              const companyButton = document.querySelector('[aria-label^="Current company"]') || 
                                  document.querySelector('[aria-label*="at "]');
              let companyName = '';
              if (companyButton) {
                const match = companyButton.getAttribute('aria-label').match(/Current company: (.+?)(\\.|$)/i) || 
                              companyButton.getAttribute('aria-label').match(/at (.+?)(\\.|$)/i);
                companyName = match ? match[1].trim() : '';
              }

              return { jobTitle, companyName };
            } catch (e) {
              console.error('Error in content script:', e);
              return { jobTitle: '', companyName: '' };
            }
          })()`
        });

        // Extract contact name from tab title
        const contactName = tab.title
          .replace(/^\(\d+\)\s*/g, '')
          .split(' | LinkedIn')[0];
        
        return `${contactName}\tNo\t${tab.url}\t${jobInfo.jobTitle}\t${jobInfo.companyName}`;
      } catch (e) {
        console.error(`Error processing tab ${tab.id}:`, e);
        return `${tab.title.split(' | LinkedIn')[0]}\tNo\t${tab.url}\tError\tError`;
      }
    }));

    await navigator.clipboard.writeText(sheetsData.join('\n'));
    console.log("Data copied to clipboard successfully");
  } catch (error) {
    console.error("Extension error:", error);
  }
});