/**
 * TypeScript declarations for Custom Ripple JSX Runtime
 * A full-featured JSX runtime for Ripple inspired
 */

// JSX namespace for TypeScript JSX support
declare global {
  namespace JSX {
    // Intrinsic HTML elements
    interface IntrinsicElements {
      [elemName: string]: any;
    }

    // Element type
    interface Element extends RippleComponent {}

    // Element class
    interface ElementClass {
      render(): RippleComponent;
    }

    // Element attributes type
    interface ElementAttributesProperty {
      props: {};
    }

    // Element children property
    interface ElementChildrenAttribute {
      children: {};
    }
  }
}

// Base types for Ripple integration
export type Block = {
  s: {
    start: Node | null;
    end: Node | null;
  } | null;
};

// Ripple component function type
export type RippleComponent = (
  anchor: Node,
  props?: Record<string, any>,
  block?: Block
) => void;

// JSX component types
export type ComponentType<P = {}> = (props: P) => RippleComponent;
export type FunctionComponent<P = {}> = ComponentType<P>;
export type FC<P = {}> = FunctionComponent<P>;

// Props types
export interface HTMLAttributes<T = Element> {
  // Standard HTML attributes
  id?: string;
  className?: string;
  class?: string;
  style?: string | Record<string, string>;
  title?: string;
  lang?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  hidden?: boolean;
  tabIndex?: number;
  tabindex?: number;
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
  'data-testid'?: string;
  [key: `data-${string}`]: any;
  [key: `aria-${string}`]: any;

  // React-style props
  htmlFor?: string;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  contentEditable?: boolean | 'true' | 'false' | 'inherit';
  noValidate?: boolean;
}

export interface EventHandlers<T = Element> {
  // Mouse events
  onClick?: (event: MouseEvent) => void;
  onContextMenu?: (event: MouseEvent) => void;
  onDoubleClick?: (event: MouseEvent) => void;
  onDrag?: (event: DragEvent) => void;
  onDragEnd?: (event: DragEvent) => void;
  onDragEnter?: (event: DragEvent) => void;
  onDragExit?: (event: DragEvent) => void;
  onDragLeave?: (event: DragEvent) => void;
  onDragOver?: (event: DragEvent) => void;
  onDragStart?: (event: DragEvent) => void;
  onDrop?: (event: DragEvent) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onMouseMove?: (event: MouseEvent) => void;
  onMouseOut?: (event: MouseEvent) => void;
  onMouseOver?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;

  // Keyboard events
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyPress?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;

  // Focus events
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;

  // Form events
  onChange?: (event: Event) => void;
  onInput?: (event: Event) => void;
  onInvalid?: (event: Event) => void;
  onReset?: (event: Event) => void;
  onSubmit?: (event: Event) => void;

  // Media events
  onLoad?: (event: Event) => void;
  onError?: (event: Event) => void;

  // Touch events
  onTouchCancel?: (event: TouchEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  onTouchMove?: (event: TouchEvent) => void;
  onTouchStart?: (event: TouchEvent) => void;

  // Scroll events
  onScroll?: (event: Event) => void;

  // Wheel events
  onWheel?: (event: WheelEvent) => void;

  // Animation events
  onAnimationStart?: (event: AnimationEvent) => void;
  onAnimationEnd?: (event: AnimationEvent) => void;
  onAnimationIteration?: (event: AnimationEvent) => void;

  // Transition events
  onTransitionEnd?: (event: TransitionEvent) => void;
}

export interface BaseProps extends HTMLAttributes, EventHandlers {
  children?: ReactNode;
  key?: string | number;
  ref?: any;
}

// Children types
export type ReactText = string | number;
export type ReactChild = ReactText | JSX.Element;
export type ReactFragment = {} | Iterable<ReactNode>;
export type ReactNode =
  | ReactChild
  | ReactFragment
  | boolean
  | null
  | undefined;

// Props for specific elements
export interface AnchorHTMLAttributes extends BaseProps {
  download?: string;
  href?: string;
  hrefLang?: string;
  hreflang?: string;
  media?: string;
  ping?: string;
  rel?: string;
  target?: string;
  type?: string;
  referrerPolicy?: string;
}

export interface FormHTMLAttributes extends BaseProps {
  acceptCharset?: string;
  action?: string;
  autoComplete?: string;
  encType?: string;
  enctype?: string;
  method?: string;
  name?: string;
  noValidate?: boolean;
  target?: string;
}

export interface InputHTMLAttributes extends BaseProps {
  accept?: string;
  alt?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  capture?: boolean | string;
  checked?: boolean;
  crossOrigin?: string;
  disabled?: boolean;
  form?: string;
  formAction?: string;
  formEncType?: string;
  formMethod?: string;
  formNoValidate?: boolean;
  formTarget?: string;
  height?: number | string;
  list?: string;
  max?: number | string;
  maxLength?: number;
  min?: number | string;
  minLength?: number;
  multiple?: boolean;
  name?: string;
  pattern?: string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  size?: number;
  src?: string;
  step?: number | string;
  type?: string;
  value?: string | string[] | number;
  width?: number | string;
}

// Fragment props
export interface FragmentProps {
  children?: ReactNode;
  key?: string | number;
}

/**
 * Create a JSX element (for elements with children)
 */
export function jsx<P extends Record<string, any>>(
  type: string,
  props: P & BaseProps
): RippleComponent;
export function jsx<P extends Record<string, any>>(
  type: ComponentType<P>,
  props: P
): RippleComponent;
export function jsx(
  type: string | ComponentType<any>,
  props: Record<string, any>
): RippleComponent;

/**
 * Create a JSX element with static children (optimization for multiple children)
 */
export function jsxs<P extends Record<string, any>>(
  type: string,
  props: P & BaseProps
): RippleComponent;
export function jsxs<P extends Record<string, any>>(
  type: ComponentType<P>,
  props: P
): RippleComponent;
export function jsxs(
  type: string | ComponentType<any>,
  props: Record<string, any>
): RippleComponent;

/**
 * JSX Fragment component - renders children without a wrapper element
 */
export function Fragment(props: FragmentProps): RippleComponent;

/**
 * Development version of jsx (same as jsx for now)
 */
export function jsxDEV<P extends Record<string, any>>(
  type: string,
  props: P & BaseProps
): RippleComponent;
export function jsxDEV<P extends Record<string, any>>(
  type: ComponentType<P>,
  props: P
): RippleComponent;
export function jsxDEV(
  type: string | ComponentType<any>,
  props: Record<string, any>
): RippleComponent;

// Re-export common types for convenience
export {
  ComponentType,
  FunctionComponent,
  FC,
  ReactNode,
  ReactChild,
  ReactText,
  ReactFragment,
};

// Default export for compatibility
declare const _default: {
  jsx: typeof jsx;
  jsxs: typeof jsxs;
  Fragment: typeof Fragment;
  jsxDEV: typeof jsxDEV;
};

export default _default;
