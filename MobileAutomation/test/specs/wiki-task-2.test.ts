interface Selectors {
    SEARCH_CONTAINER: string;
    SEARCH_INPUT: string;
    FIRST_SEARCH_RESULT: string;
    CLOSE_BUTTON: string;
}
const SELECTORS = {
    SEARCH_CONTAINER: '//android.widget.LinearLayout[@resource-id="org.wikipedia.alpha:id/search_container"]',
    SEARCH_INPUT: '//android.widget.EditText[@resource-id="org.wikipedia.alpha:id/search_src_text"]',
    FIRST_SEARCH_RESULT: '//android.widget.TextView[@resource-id="org.wikipedia.alpha:id/page_list_item_title"]',
    CLOSE_BUTTON: '//android.widget.ImageView[@resource-id="org.wikipedia.alpha:id/search_close_btn"]'
};
describe('Wikipedia Search Test', () => {
    it('should search for New York and validate first result', async () => {
        try {
            // Click on the search container
            const searchContainer = await $(SELECTORS.SEARCH_CONTAINER);
            await searchContainer.waitForDisplayed({ timeout: 5000 });
            await searchContainer.click();
            
            // Input search text
            const searchInput = await $(SELECTORS.SEARCH_INPUT);
            await searchInput.waitForDisplayed({ timeout: 5000 });
            await searchInput.setValue('new york');
            
            // Wait for search results to load
            await driver.pause(2000);
            
            // Get the first result
            const firstResult = await $(SELECTORS.FIRST_SEARCH_RESULT);
            await firstResult.waitForDisplayed({ timeout: 5000 });
            const resultText = await firstResult.getText();
            
            // Validate the result contains "New York"
            const containsNewYork = resultText.toLowerCase().includes('new york');
            if (!containsNewYork) {
                throw new Error(`Expected first result to contain "New York", but got "${resultText}"`);
            }
            
            console.log(`Search validation successful. First result: "${resultText}"`);
            
            // Click close button to erase
            const closeButton = await $(SELECTORS.CLOSE_BUTTON);
            await closeButton.waitForDisplayed({ timeout: 5000 });
            await closeButton.click();

            await driver.pause(2000);

            // Click close button to homepage
            await closeButton.waitForDisplayed({ timeout: 5000 });
            await closeButton.click();

            await driver.pause(2000);

        } catch (error) {
            console.error('Search test failed:', error);
            throw error;
        }
    });
});
// Helper function to perform assertions
function assertContainsNewYork(text: string): void {
    const normalizedText = text.toLowerCase();
    if (!normalizedText.includes('new york')) {
        throw new Error(`Text "${text}" does not contain "New York"`);
    }
}