import {Layout, Line, Rect, Txt, View2D} from '@motion-canvas/2d';
import {
  PossibleColor,
  all,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  waitFor,
} from '@motion-canvas/core';

export interface ActIntroOptions {
  actNumber: string;      // e.g., "ACT 01"
  title: string;          // e.g., "THE 33-YEAR FOUNDATION"
  subtitle?: string;      // e.g., "1993 – 2026"
  accentColor?: PossibleColor;
  holdDuration?: number;  // Seconds to stay on screen (default: 1.8s)
}

export function* playActIntro(view: View2D, options: ActIntroOptions) {
  const {
    actNumber,
    title,
    subtitle,
    accentColor = '#e3b341',
    holdDuration = 1.8,
  } = options;

  const overlay = createRef<Rect>();
  const textStack = createRef<Layout>();
  const divider = createRef<Line>();

  // Full-screen solid backdrop covering everything underneath
  view.add(
    <Rect
      ref={overlay}
      width={1920}
      height={1080}
      fill={'#0d1117'}
      zIndex={100}
      opacity={1}
    >
      <Layout
        ref={textStack}
        layout
        direction={'column'}
        alignItems={'center'}
        gap={18}
        opacity={0}
      >
        <Txt
          text={actNumber}
          fill={accentColor}
          fontSize={24}
          fontWeight={700}
          fontFamily={'JetBrains Mono, monospace'}
          letterSpacing={6}
        />

        <Line
          ref={divider}
          points={[
            [-140, 0],
            [140, 0],
          ]}
          stroke={accentColor}
          lineWidth={3}
          end={0}
        />

        <Txt
          text={title}
          fill={'#ffffff'}
          fontSize={64}
          fontWeight={800}
          fontFamily={'Inter, sans-serif'}
          letterSpacing={1}
        />

        {subtitle && (
          <Txt
            text={subtitle}
            fill={'#8b949e'}
            fontSize={24}
            fontFamily={'JetBrains Mono, monospace'}
            letterSpacing={2}
          />
        )}
      </Layout>
    </Rect>,
  );

  // 1. Fade in title + draw accent divider
  yield* all(
    textStack().opacity(1, 0.8, easeOutCubic),
    divider().end(1, 0.9, easeInOutCubic),
  );

  // 2. Hold so viewer can read it comfortably
  yield* waitFor(holdDuration);

  // 3. Smoothly fade out the entire title card to reveal the Act scene
  yield* overlay().opacity(0, 0.8, easeOutCubic);

  // 4. Clean up node from memory
  overlay().remove();
}