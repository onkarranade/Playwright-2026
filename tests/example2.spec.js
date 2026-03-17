import {test,expect} from '@playwright/test';

test('first test',async ({page})=>
{

   await page.goto('https://www.reddit.com/r/barrie/');
   const title =await page.title()
    console.log(title);
    
   await expect(page).toHaveTitle(title);

})


test('register page', async({page})=> 
{

await page.goto('https://practice.expandtesting.com/register');
await page.locator('#username').fill('test-qa1');
await page.locator('#password').fill('Qa@123');
await page.getByLabel('Confirm Password').fill('Qa@123');
await page.getByRole('button', { name: 'Register' }).click();
//await page.locator(':text-is("Successfully registered, you can log in now.")')
await expect(page.locator(':text-is("Successfully registered, you can log in now.")')).toBeVisible();


})

test.only('login test',async ({page})=> 
{
await page.goto('https://practice.expandtesting.com/login');
await page.getByLabel('Username').fill('practice');
await page.getByLabel('Password').fill('SuperSecretPassword!');
await page.getByRole('button', { name: 'Login' }).click();
await expect(page.getByRole('alert')).toContainText('You logged into a secure area!');
await page.getByText('Logout', { exact: true }).click();
await expect(page.getByRole('alert')).toContainText('You logged out of the secure area!');

})