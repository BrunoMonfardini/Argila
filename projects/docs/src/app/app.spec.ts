import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideDocRouter } from './app.routes';

describe('App', () => {
  it('abre o catálogo na página inicial', async () => {
    TestBed.configureTestingModule({ providers: [provideDocRouter()] });
    const fixture = TestBed.createComponent(App);

    await fixture.whenStable();

    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('doc-shell')).not.toBeNull();
    expect(root.querySelector('header')?.textContent).toContain('Argila');
  });
});
