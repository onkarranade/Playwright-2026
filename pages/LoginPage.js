export class LoginPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Sign in to EventHub' });
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.registerLink = page.getByRole('link', { name: 'Register' });
    this.invalidCredentialsToast = page.getByText('Invalid email or password');
  }

  async visit() {
    await this.page.goto('/login');
  }

  async waitForLoaded() {
    await this.heading.waitFor({ state: 'visible' });
  }

  async signIn(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async openRegister() {
    await this.registerLink.click();
  }
}