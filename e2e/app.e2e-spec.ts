import { WebEmpathAPIDemoPage } from './app.po';

describe('web-empath-apidemo App', () => {
  let page: WebEmpathAPIDemoPage;

  beforeEach(() => {
    page = new WebEmpathAPIDemoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
