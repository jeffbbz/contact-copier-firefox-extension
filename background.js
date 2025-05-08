browser.browserAction.onClicked.addListener(async () => {
  const tabs = await browser.tabs.query({
    currentWindow: true,
    pinned: false
  });

  if (tabs.length === 0) return;

  const sheetsData = await Promise.all(tabs.map(async (tab) => {
    // Execute job title extraction in the tab
    const [jobTitle] = await browser.tabs.executeScript(tab.id, {
      code: `(function() {
        const experienceSpan = Array.from(document.querySelectorAll('span[aria-hidden="true"]'))
          .find(span => span.textContent.trim() === "Experience");
        const experienceCard = experienceSpan.closest('div.pvs-header__top-container--no-stack').parentElement.nextElementSibling;
        const currentCompany = experienceCard.querySelector('ul li');
        const positions = Array.from(currentCompany.querySelectorAll('div.display-flex.flex-wrap.align-items-center.full-height'));
        const currentPosition = positions.length > 1 ? positions[1] : positions[0];
        return currentPosition.querySelector('span[aria-hidden="true"]').textContent.trim();
      })()`
    });

    // Extract contact name from tab title
    const contactName = tab.title
      .replace(/^\(\d+\)\s*/g, '')
      .split(' | LinkedIn')[0];
    
    return `${contactName}\tNo\t${tab.url}\t${jobTitle}`;
  }));

  await navigator.clipboard.writeText(sheetsData.join('\n'));
});