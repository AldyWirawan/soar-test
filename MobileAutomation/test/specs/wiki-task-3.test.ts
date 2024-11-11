interface Selectors {
    MORE_OPTIONS: string;
    SETTINGS_OPTION: string;
    SWITCH_WIDGETS: string;
    NAVIGATE_UP: string;
}
const SELECTORS = {
    MORE_OPTIONS: '//android.widget.TextView[@content-desc="More options"]',
    SETTINGS_OPTION: '//android.widget.TextView[@resource-id="org.wikipedia.alpha:id/explore_overflow_settings"]',
    SWITCH_WIDGETS: '//android.widget.Switch[@resource-id="org.wikipedia.alpha:id/switchWidget"]',
    NAVIGATE_UP: '//android.widget.ImageButton[@content-desc="Navigate up"]'
};
describe('Wikipedia Settings Test', () => {
    it('should navigate to settings and disable all options', async () => {
        try {
            // Click on More Options (triple dot)
            const moreOptions = await $(SELECTORS.MORE_OPTIONS);
            await moreOptions.waitForDisplayed({ timeout: 5000 });
            await moreOptions.click();
            
            // Click on Settings
            const settingsOption = await $(SELECTORS.SETTINGS_OPTION);
            await settingsOption.waitForDisplayed({ timeout: 5000 });
            await settingsOption.click();
            
            // Get all switches and disable them
            const switches = await $$(SELECTORS.SWITCH_WIDGETS);
            
            // Loop through each switch and turn it off
            for (let i = 0; i < 4; i++) {
                const switchElement = switches[i];
                const isEnabled = await switchElement.getAttribute('checked');
                
                if (isEnabled === 'true') {
                    await switchElement.click();
                    await driver.pause(500); // Small pause between switches
                }
            }
            
            // Click Navigate Up (back button)
            const navigateUp = await $(SELECTORS.NAVIGATE_UP);
            await navigateUp.waitForDisplayed({ timeout: 5000 });
            await navigateUp.click();

            driver.pause(1000);
            
            console.log('Successfully disabled all switches and returned to previous screen');
            
        } catch (error) {
            console.error('Settings test failed:', error);
            throw error;
        }
    });
});