// test/config/capabilities.ts
export const androidCapabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:udid': 'b900d2880906',
    'appium:app': 'WikipediaSample.apk',
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': 3600,
    'appium:noReset': false
};
export const iosCapabilities = {
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': 'iPhone 12',  // Replace with your device name
    'appium:platformVersion': '14.5',  // Replace with your iOS version
    'appium:app': process.env.IOS_APP_PATH || '/path/to/your/app.app',
    'appium:noReset': false
};