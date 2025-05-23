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
        const [jobInfo] = await browser.tabs.executeScript(tab.id, {
          file: "extractJobInfo.js"
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