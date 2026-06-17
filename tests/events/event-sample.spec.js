import { test, expect } from "../../fixtures/test-base.js";
import { BookingsPage } from "../../pages/BookingsPage.js";
import { featuredEvent } from "../../test-data/events.js";
import { secondaryBookingDetails } from "../../utils/booking.js";


test.describe("samples", () => {


    test("sample", async ({ page, homePage, eventsPage }) => {

        await homePage.visit();
        await homePage.waitForLoaded();
        await expect(page).toHaveURL(/\/$/);
        await homePage.openAllEvents();
      
        await expect(eventsPage.upComingEventsHeading).toBeVisible();
        await expect(eventsPage.searchInput).toBeVisible();
        await expect(eventsPage.eventList.first()).toBeVisible();
        let eventCount = await eventsPage.eventList.count();
        console.log(`Number of events: ${eventCount}`);

        for(let i=0; i<eventCount; i++)
        {
            const eventName=await eventsPage.eventList.nth(i).getByRole('heading').innerText();
            console.log(`Event ${i+1}: ${eventName}`);  
        }
    });

    test('sample2', async ({ page, homePage, eventsPage, bookingsPage ,eventDetailsPage}) => {

        await homePage.visit();
        await homePage.waitForLoaded();
        await expect(page).toHaveURL(/\/$/);
        await homePage.myBookingsButton.click();
        await expect(page).toHaveURL(/\/bookings$/);
        await bookingsPage.clearAllBookingsIfPresent();
        await bookingsPage.browseEvents();
        await expect(page).toHaveURL(/\/events$/);
        await eventsPage.searchFor('Hollywood Monsoon Night — Los Angeles');
        await eventsPage.waitForSearchQuery('Hollywood Monsoon Night — Los Angeles');
        await eventsPage.openEvent('Hollywood Monsoon Night — Los Angeles');
        await expect(page).toHaveURL(/\/events\/\d+$/);
    }
    );


    test('create a event', async({page, homePage,eventsPage,eventDetailsPage,bookingsPage})=>{
        
        await homePage.visit();
        await homePage.waitForLoaded();
        await homePage.openEvents();
        await eventsPage.addnewEventButton.click();
        const booking1=secondaryBookingDetails();
        await eventsPage.visit();
        await eventsPage.openEvent('Hollywood Monsoon Night — Los Angeles');
        await expect(page).toHaveURL(/\/events\/\d+$/);
            await expect(page.getByRole('heading', { name: 'Hollywood Monsoon Night — Los Angeles' })).toBeVisible();
            await eventDetailsPage.waitForBookingForm();

    await eventDetailsPage.fillBookingForm(booking1);
    await eventDetailsPage.confirmBooking();
    await expect(eventDetailsPage.confirmationHeading).toBeVisible();
    await expect(page.getByText(booking1.fullName)).toBeVisible();
    await eventDetailsPage.openMyBookings();
    await expect(page).toHaveURL(/\/bookings$/);
    await expect(bookingsPage.heading).toBeVisible();
    await expect(bookingsPage.bookingCard(featuredEvent.name)).toBeVisible();
    
    })
});



