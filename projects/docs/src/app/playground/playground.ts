import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  DOCUMENT,
  ElementRef,
  EnvironmentInjector,
  computed,
  createComponent,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArgButton } from '@brunomonfardini/ui';
import { DocCode } from '../code/code';
import { ManifestComponent, ManifestInput } from '../manifest';
import { DocPage } from '../registry';
import {
  PlaygroundValue,
  PlaygroundValues,
  controllableInputs,
  defaultValues,
  playgroundSnippet,
  queryFromValues,
  valuesFromQuery,
} from './playground-state';

/**
 * O componente ao vivo, com um controle por input gerado do manifesto. O
 * estado vai para a URL (?variant=danger&loading=true), para compartilhar.
 */
@Component({
  selector: 'doc-playground',
  imports: [ArgButton, DocCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playground.html',
  styleUrl: './playground.css',
})
export class DocPlayground {
  readonly page = input.required<DocPage>();
  readonly component = input.required<ManifestComponent>();

  private readonly injector = inject(EnvironmentInjector);
  private readonly appRef = inject(ApplicationRef);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private ref?: ComponentRef<unknown>;

  protected readonly inputs = computed(() => controllableInputs(this.component().inputs));
  private readonly defaults = computed(() =>
    defaultValues(this.component().inputs, this.page().playgroundInputs),
  );
  protected readonly values = signal<PlaygroundValues>({});
  protected readonly snippet = computed(() =>
    playgroundSnippet(
      this.component().selector,
      this.values(),
      this.defaults(),
      this.page().playgroundContent,
      this.component()
        .inputs.filter((i) => i.required)
        .map((i) => i.name),
    ),
  );

  constructor() {
    // Página nova: recria o componente com o estado da URL
    effect((onCleanup) => {
      const page = this.page();
      const values = valuesFromQuery(
        this.component().inputs,
        this.defaults(),
        this.route.snapshot.queryParams,
      );
      untracked(() => {
        this.values.set(values);
        this.render(page, this.stage().nativeElement, values);
      });
      onCleanup(() => this.destroy());
    });
  }

  protected update(input: ManifestInput, value: PlaygroundValue): void {
    this.values.update((values) => ({ ...values, [input.name]: value }));
    this.ref?.setInput(input.name, value);
    this.router.navigate([], {
      queryParams: queryFromValues(this.values(), this.defaults()),
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  protected onText(input: ManifestInput, event: Event): void {
    this.update(input, (event.target as HTMLInputElement).value);
  }

  protected onNumber(input: ManifestInput, event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.update(input, raw === '' ? undefined : Number(raw));
  }

  protected onCheck(input: ManifestInput, event: Event): void {
    this.update(input, (event.target as HTMLInputElement).checked);
  }

  protected reset(): void {
    const defaults = this.defaults();
    this.values.set({ ...defaults });
    for (const [name, value] of Object.entries(defaults)) {
      this.ref?.setInput(name, value);
    }
    this.router.navigate([], {
      queryParams: queryFromValues(defaults, defaults),
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private render(page: DocPage, stage: HTMLElement, values: PlaygroundValues): void {
    const host = page.hostElement ? this.document.createElement(page.hostElement) : undefined;
    const content = page.playgroundContent;
    this.ref = createComponent(page.component!, {
      environmentInjector: this.injector,
      hostElement: host,
      projectableNodes: content ? [[this.document.createTextNode(content)]] : [],
    });
    for (const [name, value] of Object.entries(values)) {
      if (value !== undefined) this.ref.setInput(name, value);
    }
    stage.replaceChildren(this.ref.location.nativeElement);
    this.appRef.attachView(this.ref.hostView);
  }

  private destroy(): void {
    if (this.ref) {
      this.appRef.detachView(this.ref.hostView);
      this.ref.destroy();
      this.ref = undefined;
    }
  }
}
