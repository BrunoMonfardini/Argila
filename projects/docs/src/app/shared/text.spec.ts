import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DocText, splitInlineCode } from './text';

@Component({
  imports: [DocText],
  template: `<doc-text text="Use \`<a arg-button>\` para navegar" />`,
})
class Host {}

describe('DocText', () => {
  it('separa texto e código pelas crases', () => {
    expect(splitInlineCode('a `b` c')).toEqual([
      { text: 'a ', code: false },
      { text: 'b', code: true },
      { text: ' c', code: false },
    ]);
    expect(splitInlineCode('`só código`')).toEqual([{ text: 'só código', code: true }]);
  });

  it('mostra o código como texto, nunca como marcação', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('code')?.textContent).toBe('<a arg-button>');
    expect(element.querySelector('a')).toBeNull();
    expect(element.textContent).toContain('para navegar');
  });
});
