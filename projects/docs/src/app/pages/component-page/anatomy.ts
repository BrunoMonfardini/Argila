import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import type { DocAnatomyPart, DocPage } from '../../registry';
import { DocText } from '../../shared/text';
import { DocThemeVersion } from '../../shared/theme-version';

export interface DocAnatomyMarker {
  number: number;
  /** Posição do canto da parte, em px, relativa ao palco. */
  x: number;
  y: number;
}

/** O elemento de cada parte: `data-anatomy="n"` ou, para partes internas, o seletor. */
export function anatomyTargets(
  stage: HTMLElement,
  parts: readonly DocAnatomyPart[],
): (Element | null)[] {
  return parts.map(
    (part, i) =>
      stage.querySelector(`[data-anatomy="${i + 1}"]`) ??
      (part.selector ? stage.querySelector(part.selector) : null),
  );
}

/** Distância mínima entre marcadores, em px: a largura de um marcador e uma folga. */
const MARKER_GAP = 26;

/**
 * Marcadores de partes que começam no mesmo canto (a lista e a primeira aba)
 * se cobririam: cada um que encostar num anterior anda para a direita.
 */
export function spreadMarkers(markers: readonly DocAnatomyMarker[]): DocAnatomyMarker[] {
  const placed: DocAnatomyMarker[] = [];
  for (const marker of markers) {
    let x = marker.x;
    while (
      placed.some((p) => Math.abs(p.x - x) < MARKER_GAP && Math.abs(p.y - marker.y) < MARKER_GAP)
    ) {
      x += MARKER_GAP;
    }
    placed.push({ ...marker, x });
  }
  return placed;
}

/**
 * Anatomia de um componente: o exemplo com um marcador numerado no canto de
 * cada parte, na cor de destaque, e a legenda em lista. Os marcadores são só
 * desenho (`aria-hidden`); quem lê a anatomia pelo leitor de tela ouve a legenda.
 */
@Component({
  selector: 'doc-anatomy',
  imports: [NgComponentOutlet, DocText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="doc-anatomy">
      <div class="doc-anatomy__stage" #stage>
        <ng-container *ngComponentOutlet="anatomy().example" />
        @for (marker of markers(); track marker.number) {
          <span
            class="doc-anatomy__marker"
            aria-hidden="true"
            [style.left.px]="marker.x"
            [style.top.px]="marker.y"
            >{{ marker.number }}</span
          >
        }
      </div>
      <figcaption>
        <ol class="doc-anatomy__legend">
          @for (part of anatomy().parts; track part.label) {
            <li>
              <strong>{{ part.label }}</strong
              >: <doc-text [text]="part.description" />
            </li>
          }
        </ol>
      </figcaption>
    </figure>
  `,
  styleUrl: './anatomy.css',
})
export class DocAnatomy {
  readonly anatomy = input.required<NonNullable<DocPage['anatomy']>>();

  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly version = inject(DocThemeVersion);
  protected readonly markers = signal<DocAnatomyMarker[]>([]);
  private destroyed = false;

  constructor() {
    // Sem ResizeObserver (ambientes de teste), os marcadores só se ajustam ao tema
    const observer =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(() => this.place());
    afterNextRender(() => {
      observer?.observe(this.stage().nativeElement);
      this.place();
    });
    // O design system muda o tamanho das partes: os marcadores acompanham
    effect(() => {
      this.version.version();
      this.anatomy();
      queueMicrotask(() => this.place());
    });
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      observer?.disconnect();
    });
  }

  private place(): void {
    if (this.destroyed) return;
    const stage = this.stage().nativeElement;
    const box = stage.getBoundingClientRect();
    const markers: DocAnatomyMarker[] = [];
    anatomyTargets(stage, this.anatomy().parts).forEach((target, i) => {
      if (!target) return;
      const rect = target.getBoundingClientRect();
      markers.push({ number: i + 1, x: rect.left - box.left, y: rect.top - box.top });
    });
    this.markers.set(spreadMarkers(markers));
  }
}
