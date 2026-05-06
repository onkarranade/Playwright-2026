export class AdminEventsPage {
  constructor(page) {
    this.page = page;
    this.newEventHeading = page.getByRole('heading', { name: '+ New Event' });
    this.editEventHeading = page.getByRole('heading', { name: '✏️ Edit Event' });
    this.titleInput = page.getByLabel('Title*');
    this.descriptionInput = page.getByPlaceholder('Describe the event…');
    this.categorySelect = page.getByLabel('Category*');
    this.cityInput = page.getByLabel('City*');
    this.venueInput = page.getByLabel('Venue*');
    this.eventDateInput = page.getByLabel('Event Date & Time*');
    this.priceInput = page.getByLabel('Price ($)*');
    this.totalSeatsInput = page.getByLabel('Total Seats*');
    this.imageUrlInput = page.getByLabel('Image URL (optional)');
    this.addEventButton = page.getByRole('button', { name: '+ Add Event' });
    this.updateEventButton = page.getByRole('button', { name: '💾 Update Event' });
    this.cancelEditButton = page.getByRole('button', { name: 'Cancel edit' });
    this.deleteDialog = page.getByRole('dialog', { name: 'Delete this event?' });
    this.confirmDeleteButton = page.getByRole('button', { name: 'Delete event' });
    this.deleteToast = page.getByText('Event deleted!');
    this.createToast = page.getByText('Event created!');
    this.updateToast = page.getByText('Event updated!');
  }

  async visit() {
    await this.page.goto('/admin/events');
  }

  async waitForLoaded() {
    await this.newEventHeading.waitFor({ state: 'visible' });
    await this.addEventButton.waitFor({ state: 'visible' });
    await this.page.getByRole('heading', { name: 'All Events' }).waitFor({ state: 'visible' });
  }

  eventRow(title) {
    return this.page.getByRole('row').filter({ has: this.page.getByRole('cell', { name: title, exact: true }) });
  }

  async fillNewEventForm(event) {
    await this.titleInput.fill(event.title);
    await this.descriptionInput.fill(event.description);
    await this.categorySelect.selectOption(event.category);
    await this.cityInput.fill(event.city);
    await this.venueInput.fill(event.venue);
    await this.eventDateInput.fill(event.eventDateTime);
    await this.priceInput.fill(String(event.price));
    await this.totalSeatsInput.fill(String(event.totalSeats));

    if (event.imageUrl) {
      await this.imageUrlInput.fill(event.imageUrl);
    }
  }

  async addEvent() {
    await this.addEventButton.click();
  }

  async waitForCreateToast() {
    await this.createToast.waitFor({ state: 'visible' });
  }

  async openEdit(title) {
    await this.eventRow(title).getByRole('button', { name: 'Edit' }).click();
  }

  async waitForEditMode() {
    await this.editEventHeading.waitFor({ state: 'visible' });
    await this.updateEventButton.waitFor({ state: 'visible' });
    await this.cancelEditButton.waitFor({ state: 'visible' });
  }

  async updateTitle(newTitle) {
    await this.titleInput.fill(newTitle);
    await this.updateEventButton.click();
  }

  async waitForUpdateToast() {
    await this.updateToast.waitFor({ state: 'visible' });
  }

  async deleteEventIfPresent(title) {
    const row = this.eventRow(title);

    if (await row.count()) {
      await row.getByRole('button', { name: 'Delete' }).click();
      await this.deleteDialog.waitFor({ state: 'visible' });
      await this.confirmDeleteButton.click();
      await row.first().waitFor({ state: 'detached' });
    }
  }

  async hasEvent(title) {
    return (await this.eventRow(title).count()) > 0;
  }
}