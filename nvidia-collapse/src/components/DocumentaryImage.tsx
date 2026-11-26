import {Img, Layout, Rect, Txt, View2D} from '@motion-canvas/2d';
import {
  PossibleColor,
  SignalValue,
  all,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  waitFor,
} from '@motion-canvas/core';

export interface ImageCutawayOptions {
  src: SignalValue<string>;
  tag?: string;           // e.g., "ARCHIVAL // 1993"
  caption: string;        // e.g., "East San Jose Denny's where Nvidia was sketched on napkins"
  accentColor?: PossibleColor;
  holdDuration?: number;  // Seconds to stay on screen (default: 3.5s)
  maxWidth?: number;      // Max image width (default: 1360)
  maxHeight?: number;     // Max image height (default: 720)
}

export interface ImageCutawayOptions {
  src: SignalValue<string>;
  tag?: string;
  caption: string;
  accentColor?: PossibleColor;
  delayBefore?: number;   // Pause before photo appears (default: 2.0s)
  holdDuration?: number;  // Seconds photo stays on screen (default: 3.5s)
  maxWidth?: number;
  maxHeight?: number;
}

export function* playImageCutaway(view: View2D, options: ImageCutawayOptions) {
  const {
    src,
    tag = 'DOCUMENTARY RECORD',
    caption,
    accentColor = '#e3b341',
    delayBefore = 6.0,
    holdDuration = 3.5,
    maxWidth = 1360,
    maxHeight = 720,
  } = options;

  if (delayBefore > 0) {
    yield* waitFor(delayBefore);
  }

  const backdrop = createRef<Rect>();
  const card = createRef<Rect>();
  const imgRef = createRef<Img>();

  view.add(
    <Rect
      ref={backdrop}
      width={1920}
      height={1080}
      fill={'rgba(13, 17, 23, 0.96)'}
      zIndex={90}
      opacity={0}
      layout
      direction={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      gap={22}
    >
      {/* Framed Photo / Document Container (preserves natural aspect ratio) */}
      <Rect
        ref={card}
        radius={16}
        fill={'#141920'}
        stroke={accentColor}
        lineWidth={3}
        clip
        layout
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Img
          ref={imgRef}
          src={src}
          maxWidth={maxWidth}
          maxHeight={maxHeight}
          smoothing={true}
        />
      </Rect>

      {/* Clean Documentary Lower-Third Caption Bar */}
      <Rect
        width={1200}
        radius={12}
        fill={'#161b22'}
        stroke={'#30363d'}
        lineWidth={2}
        paddingTop={16}
        paddingBottom={16}
        paddingLeft={28}
        paddingRight={28}
        layout
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        gap={24}
      >
        <Txt
          text={tag}
          fill={accentColor}
          fontSize={18}
          fontWeight={700}
          fontFamily={'JetBrains Mono, monospace'}
        />
        <Txt
          text={caption}
          fill={'#f0f6fc'}
          fontSize={21}
          fontWeight={600}
          fontFamily={'Inter, sans-serif'}
        />
      </Rect>
    </Rect>,
  );

  // 1. Smoothly fade in cutaway + start slow Ken Burns zoom
  yield* all(
    backdrop().opacity(1, 0.7, easeOutCubic),
    imgRef().scale(1.06, holdDuration + 1.4, easeInOutCubic),
  );

  // 2. Hold so the audience can take in the image or read the document
  yield* waitFor(holdDuration);

  // 3. Fade back out to resume the main timeline/diagram
  yield* backdrop().opacity(0, 0.7, easeOutCubic);

  // 4. Clean up node
  backdrop().remove();
}