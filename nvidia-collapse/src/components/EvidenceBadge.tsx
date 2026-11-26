import {Rect, RectProps, Txt} from '@motion-canvas/2d';
import {
  PossibleColor,
  SignalValue,
  SimpleSignal,
  createSignal,
} from '@motion-canvas/core';

export type EvidenceStatus = 'CONFIRMED' | 'ALLEGED';

export interface EvidenceBadgeProps extends RectProps {
  status?: SignalValue<EvidenceStatus>;
}

const STATUS_STYLES: Record<
  EvidenceStatus,
  {label: string; fill: PossibleColor; stroke: PossibleColor; text: PossibleColor}
> = {
  CONFIRMED: {
    label: '● CONFIRMED STATEMENT',
    fill: '#132a1c',
    stroke: '#2ea043',
    text: '#3fb950',
  },
  ALLEGED: {
    label: '▲ ALLEGED / UNDER PROBE',
    fill: '#2b2111',
    stroke: '#d29922',
    text: '#e3b341',
  },
};

export class EvidenceBadge extends Rect {
  private readonly currentStatus: SimpleSignal<EvidenceStatus>;

  public constructor(props?: EvidenceBadgeProps) {
    const initialStatus =
      typeof props?.status === 'function'
        ? props.status()
        : (props?.status ?? 'ALLEGED');

    const statusSignal = createSignal<EvidenceStatus>(initialStatus);

    super({
      layout: true,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 22,
      paddingRight: 22,
      radius: 999,
      lineWidth: 2,
      fill: () => STATUS_STYLES[statusSignal()].fill,
      stroke: () => STATUS_STYLES[statusSignal()].stroke,
      ...props,
    });

    this.currentStatus = statusSignal;

    this.add(
      <Txt
        text={() => STATUS_STYLES[this.currentStatus()].label}
        fill={() => STATUS_STYLES[this.currentStatus()].text}
        fontSize={20}
        fontWeight={700}
        fontFamily={'JetBrains Mono, monospace'}
        letterSpacing={1.5}
      />,
    );
  }

  public setStatus(next: EvidenceStatus) {
    this.currentStatus(next);
  }
}