import { expect } from 'detox';

import { navigateToRegister, platformTypes, TTextMatcher } from '../../helpers/app';
import data from '../../data';

describe('Create user screen', () => {
	let alertButtonType: string;
	let textMatcher: TTextMatcher;
	before(async () => {
		await device.launchApp({ permissions: { notifications: 'YES' }, delete: true });
		({ alertButtonType, textMatcher } = platformTypes[device.getPlatform()]);
		await navigateToRegister();
	});

	describe('Render', () => {
		it('should have create user screen', async () => {
			await waitFor(element(by.id('register-view')))
				.toExist()
				.withTimeout(2000);
		});

		it('should have name input', async () => {
			await expect(element(by.id('register-view-name'))).toBeVisible();
		});

		it('should have email input', async () => {
			await expect(element(by.id('register-view-email'))).toBeVisible();
		});

		it('should have password input', async () => {
			await expect(element(by.id('register-view-password'))).toBeVisible();
		});

		it('should have submit button', async () => {
			await element(by.id('register-view')).atIndex(0).swipe('up', 'fast', 0.5);
			await expect(element(by.id('register-view-submit'))).toBeVisible();
		});

		it('should have legal button', async () => {
			await expect(element(by.id('register-view-more'))).toBeVisible();
		});
	});

	describe('Usage', () => {
		// FIXME: Detox isn't able to check if it's tappable: https://github.com/wix/Detox/issues/246
		// it('should submit invalid email and do nothing', async() => {
		// 	const invalidEmail = 'invalidemail';
		// 	await element(by.id('register-view-name')).replaceText(data.user);
		// 	await element(by.id('register-view-username')).replaceText(data.user);
		// 	await element(by.id('register-view-email')).replaceText(invalidEmail);
		// 	await element(by.id('register-view-password')).replaceText(data.password);
		// 	await element(by.id('register-view-submit')).tap();
		// });

		// TODO: When server handle two errors in sequence, the server return Too many requests and force to wait for some time.
		// it('should submit email already taken and raise error', async () => {
		// 	await element(by.id('register-view-name')).replaceText(data.registeringUser.username);
		// 	await element(by.id('register-view-username')).replaceText(data.registeringUser.username);
		// 	await element(by.id('register-view-email')).replaceText(data.users.existing.email);
		// 	await element(by.id('register-view-password')).replaceText(data.registeringUser.password);
		// 	await element(by.id('register-view-submit')).tap();
		// 	await waitFor(element(by[textMatcher]('Email already exists. [403]')).atIndex(0))
		// 		.toExist()
		// 		.withTimeout(10000);
		// 	await element(by[textMatcher]('OK').and(by.type(alertButtonType))).tap();
		// });

		it('should submit username already taken and raise error', async () => {
			await element(by.id('register-view-name')).replaceText(data.registeringUser.username);
			await element(by.id('register-view-username')).replaceText(data.users.existing.username);
			await element(by.id('register-view-email')).replaceText(data.registeringUser.email);
			await element(by.id('register-view-password')).replaceText(data.registeringUser.password);
			await element(by.id('register-view-submit')).tap();
			await waitFor(element(by[textMatcher]('Username is already in use')).atIndex(0))
				.toExist()
				.withTimeout(10000);
			await element(by[textMatcher]('OK').and(by.type(alertButtonType))).tap();
		});

		it('should register', async () => {
			await element(by.id('register-view-name')).replaceText(data.registeringUser.username);
			await element(by.id('register-view-username')).replaceText(data.registeringUser.username);
			await element(by.id('register-view-email')).replaceText(data.registeringUser.email);
			await element(by.id('register-view-password')).replaceText(data.registeringUser.password);
			await element(by.id('register-view-submit')).tap();
			await waitFor(element(by.id('rooms-list-view')))
				.toBeVisible()
				.withTimeout(60000);
		});
	});
});
