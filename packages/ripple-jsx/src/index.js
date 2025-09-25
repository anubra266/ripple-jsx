/**
 * Custom Ripple JSX Runtime
 * A full-featured JSX runtime for Ripple inspired
 * This provides actual DOM element creation and proper JSX support
 */

import { set_attribute, append, active_block } from 'ripple/internal/client';

function assign_nodes(start, end) {
  var block = /** @type {Block} */ (active_block);
  var s = block.s;
  if (s === null) {
    block.s = {
      start,
      end,
    };
  } else if (s.start === null) {
    s.start = start;
    s.end = end;
  }
}

function create_anchor() {
  var t = document.createTextNode('');
  t.__t = '';
  return t;
}

function create_text(value = '') {
  return document.createTextNode(value);
}

// JSX attribute name mappings (similar to React/Svelte)
const MAPPED_ATTRIBUTES = new Map([
  ['className', 'class'],
  ['htmlFor', 'for'],
  ['tabIndex', 'tabindex'],
  ['readOnly', 'readonly'],
  ['autoComplete', 'autocomplete'],
  ['autoFocus', 'autofocus'],
  ['contentEditable', 'contenteditable'],
  ['noValidate', 'novalidate'],
]);

/**
 * Converts JSX attribute names to HTML attribute names
 * @param {string} key - JSX attribute name
 * @returns {string} - HTML attribute name
 */
function jsxKeyToHtml(key) {
  return (
    MAPPED_ATTRIBUTES.get(key) ||
    key
      // Handle event handlers: onClick => onclick
      .replace(/^on([A-Z])/, (_, letter) => 'on' + letter.toLowerCase())
    // Handle other JSX conventions as needed
  );
}

/**
 * Flattens children array and filters out falsy values
 * @param {any} children - Children to flatten
 * @returns {any[]} - Flattened children array
 */
function flattenChildren(children) {
  if (!Array.isArray(children)) {
    return children === null || children === undefined || children === false ? [] : [children];
  }

  const result = [];
  for (const child of children) {
    if (child === null || child === undefined || child === false) {
      continue;
    }
    if (Array.isArray(child)) {
      result.push(...flattenChildren(child));
    } else {
      result.push(child);
    }
  }
  return result;
}

/**
 * Creates a DOM element with the given tag name
 * @param {string} tag - HTML tag name
 * @returns {Element} - Created element
 */
function createElement(tag) {
  // Handle SVG elements
  if (
    tag === 'svg' ||
    tag === 'circle' ||
    tag === 'path' ||
    tag === 'rect' ||
    tag === 'g' ||
    tag === 'line' ||
    tag === 'polyline' ||
    tag === 'polygon' ||
    tag === 'ellipse' ||
    tag === 'text' ||
    tag === 'tspan' ||
    tag === 'defs' ||
    tag === 'use' ||
    tag === 'image'
  ) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  }

  // Handle MathML elements
  if (
    tag === 'math' ||
    tag === 'mi' ||
    tag === 'mo' ||
    tag === 'mn' ||
    tag === 'mrow' ||
    tag === 'msup' ||
    tag === 'msub' ||
    tag === 'mfrac' ||
    tag === 'msqrt'
  ) {
    return document.createElementNS('http://www.w3.org/1998/Math/MathML', tag);
  }

  return document.createElement(tag);
}

/**
 * Processes JSX props and separates them into attributes, events, and children
 * @param {Record<string, any> | null} props - Raw JSX props
 * @returns {{attributes: Record<string, any>, events: Record<string, Function>, children: any[]}} - Processed props object
 */
function processProps(props) {
  const { children = [], ...otherProps } = props || {};
  /** @type {Record<string, any>} */
  const attributes = {};
  /** @type {Record<string, Function>} */
  const events = {};

  for (const [key, value] of Object.entries(otherProps)) {
    if (key.startsWith('on') && typeof value === 'function') {
      // Event handler
      const eventName = key.slice(2).toLowerCase();
      events[eventName] = value;
    } else {
      // Regular attribute
      const htmlKey = jsxKeyToHtml(key);
      attributes[htmlKey] = value;
    }
  }

  return { attributes, events, children: flattenChildren(children) };
}

/**
 * Renders children to the DOM at the given anchor
 * @param {Node} anchor - Anchor node to render before
 * @param {any[]} children - Children to render
 */
function renderChildren(anchor, children) {
  let firstNode = null;
  let lastNode = null;

  for (const child of children) {
    if (typeof child === 'string' || typeof child === 'number') {
      // Text node
      const textNode = create_text(String(child));
      append(anchor, textNode);
      if (!firstNode) firstNode = textNode;
      lastNode = textNode;
    } else if (typeof child === 'function') {
      // Component function - call it with a new anchor
      const childAnchor = create_anchor();
      append(anchor, childAnchor);
      child(childAnchor, {}, active_block);
      if (!firstNode) firstNode = childAnchor;
      lastNode = childAnchor;
    } else if (child && typeof child === 'object' && child.nodeType) {
      // DOM node
      append(anchor, child);
      if (!firstNode) firstNode = child;
      lastNode = child;
    }
    // Ignore null, undefined, false, true
  }

  // Assign nodes if we have any children
  if (firstNode && lastNode) {
    assign_nodes(firstNode, lastNode);
  }
}

/**
 * Create a JSX element (for elements with children)
 * @param {string | Function} type - Element type (tag name or component function)
 * @param {Record<string, any> | null} props - Element properties including children
 * @returns {Function} - Ripple component function that renders the element
 */
export function jsx(type, props) {
  if (typeof type === 'function') {
    // Component function - return a wrapper that calls it properly
    /** @param {any} anchor @param {any} wrapperProps @param {any} block */
    return function componentWrapper(anchor, wrapperProps,block) {
      // Merge props from JSX with any additional props
      const mergedProps = { ...props, ...wrapperProps };
      return (type(mergedProps))(anchor, wrapperProps, block);
};
  } else if (typeof type === 'string') {
    // DOM element - return a component function that creates the element
    /** @param {any} anchor @param {any} wrapperProps @param {any} block */
    return function elementWrapper(anchor, wrapperProps) {
      const element = createElement(type);
      const mergedProps = { ...props, ...wrapperProps };
      const { attributes, events, children } = processProps(mergedProps);

      // Set attributes
      if (Object.keys(attributes).length > 0) {
        for (const [key, value] of Object.entries(attributes)) {
          if (value != null) {
            set_attribute(element, key, value);
          }
        }
      }

      // Add event listeners
      for (const [eventName, handler] of Object.entries(events)) {
        element.addEventListener(eventName, /** @type {EventListener} */ (handler));
      }

      // Render children inside the element
      if (children.length > 0) {
        const childAnchor = create_anchor();
        element.appendChild(childAnchor);
        renderChildren(childAnchor, children);
      }

      // Append element to DOM and assign nodes for block tracking
      append(anchor, element);
      assign_nodes(element, element);
    };
  } else {
    // Invalid type
    throw new Error(`Invalid JSX element type: ${type}`);
  }
}

/**
 * Create a JSX element with static children (optimization for multiple children)
 * @param {string | Function} type - Element type (tag name or component function)
 * @param {object} props - Element properties including children
 * @returns {Function} - Ripple component function
 */
export function jsxs(type, props) {
  return jsx(type, props);
}

/**
 * JSX Fragment component - renders children without a wrapper element
 * @param {Record<string, any> | null} props - Fragment props (should contain children)
 * @returns {Function} - Ripple component function that renders fragment children
 */
export function Fragment(props) {
  /** @param {any} anchor @param {any} wrapperProps @param {any} block */
  return function fragmentWrapper(anchor, wrapperProps, block) {
    const mergedProps = { ...props, ...wrapperProps };
    const { children } = processProps(mergedProps);

    if (children.length === 0) {
      // Empty fragment - create a single text node anchor
      const emptyNode = create_text('');
      append(anchor, emptyNode);
      assign_nodes(emptyNode, emptyNode);
    } else {
      renderChildren(anchor, children);
    }
  };
}

/**
 * Development version of jsx (same as jsx for now)
 * @param {string | Function} type - Element type
 * @param {object} props - Element properties
 * @returns {Function} - Ripple component function
 */
export function jsxDEV(type, props) {
  return jsx(type, props);
}
