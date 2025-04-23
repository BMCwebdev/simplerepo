# Client-Side FontAwesome Loading Implementation Guide

## File 1: IconClient.tsx

```tsx
import React, { useState, useEffect } from 'react';
import * as stylex from '@stylexjs/stylex';
import { coreTokens as $ } from '@bonterratech/stitch-tokens/coreTokens.stylex';

// NO FontAwesome imports at the module level!

export interface IconProps {
  name:
    | 'arrow-right-from-bracket'
    | 'arrow-up'
    | 'arrow-up-right-from-square'
    | 'bars'
    | 'bell-outline'
    | 'bell'
    | 'bookmark-outline'
    | 'bookmark'
    | 'building-columns'
    | 'building-outline'
    | 'building'
    | 'calendar-outline'
    | 'calendar'
    | 'check'
    | 'chevron-down'
    | 'chevron-left'
    | 'chevron-right'
    | 'chevron-up'
    | 'circle'
    | 'circle-check'
    | 'circle-info'
    | 'circle-question'
    | 'clock-outline'
    | 'clock-rotate-left'
    | 'clock'
    | 'diamond-exclamation'
    | 'door-open'
    | 'ellipsis'
    | 'ellipsis-vertical'
    | 'facebook'
    | 'gear-outline'
    | 'gear'
    | 'gift'
    | 'gift-outline'
    | 'heart-outline'
    | 'heart'
    | 'house-outline'
    | 'house'
    | 'instagram'
    | 'linkedin'
    | 'lock-outline'
    | 'lock'
    | 'magnifying-glass'
    | 'minus'
    | 'money-bill-wave'
    | 'paper-plane-outline'
    | 'paper-plane'
    | 'pen-outline'
    | 'pen'
    | 'phone-outline'
    | 'phone'
    | 'plus'
    | 'print-outline'
    | 'print'
    | 'sparkle-outline'
    | 'sparkles-outline'
    | 'sparkles'
    | 'star-outline'
    | 'star'
    | 'thumbtack-outline'
    | 'thumbtack'
    | 'trash-outline'
    | 'trash'
    | 'triangle-exclamation'
    | 'user-outline'
    | 'user'
    | 'x-twitter'
    | 'xmark';
  size?: 'x-small' | 'small' | 'medium' | 'large' | 'x-large';
  color?:
    | 'critical'
    | 'default'
    | 'disabled'
    | 'info'
    | 'inverse'
    | 'link'
    | 'subtle'
    | 'success'
    | 'warning';
  'aria-label'?: string;
}

// Mapping color names to stylex color tokens
const colorClasses = stylex.create({
  default: { color: $['--s-color-icon'] },
  link: { color: $['--s-color-link'] },
  inverse: { color: $['--s-color-icon-inverse'] },
  subtle: { color: $['--s-color-icon-subtle'] },
  disabled: { color: $['--s-color-icon-disabled'] },
  success: { color: $['--s-color-icon-success'] },
  warning: { color: $['--s-color-icon-warning'] },
  critical: { color: $['--s-color-icon-critical'] },
  info: { color: $['--s-color-icon-info'] },
});

// Unicode fallback icons for SSR
const FALLBACK_ICONS: Record<string, string> = {
  'arrow-right-from-bracket': '↪',
  'arrow-up': '↑',
  'arrow-up-right-from-square': '↗',
  bars: '≡',
  'bell-outline': '🔔',
  bell: '🔔',
  'bookmark-outline': '🔖',
  bookmark: '🔖',
  'building-columns': '🏛️',
  'building-outline': '🏢',
  building: '🏢',
  'calendar-outline': '📅',
  calendar: '📅',
  check: '✓',
  'chevron-down': '▼',
  'chevron-left': '◀',
  'chevron-right': '▶',
  'chevron-up': '▲',
  circle: '●',
  'circle-check': '✅',
  'circle-info': 'ⓘ',
  'circle-question': '❓',
  'clock-outline': '🕒',
  'clock-rotate-left': '↺',
  clock: '🕒',
  'diamond-exclamation': '⚠',
  'door-open': '🚪',
  ellipsis: '…',
  'ellipsis-vertical': '⋮',
  facebook: 'f',
  'gear-outline': '⚙️',
  gear: '⚙️',
  gift: '🎁',
  'gift-outline': '🎁',
  'heart-outline': '♡',
  heart: '♥',
  'house-outline': '🏠',
  house: '🏠',
  instagram: 'Ig',
  linkedin: 'in',
  'lock-outline': '🔒',
  lock: '🔒',
  'magnifying-glass': '🔍',
  minus: '−',
  'money-bill-wave': '💵',
  'paper-plane-outline': '✈',
  'paper-plane': '✈',
  'pen-outline': '✎',
  pen: '✎',
  'phone-outline': '📞',
  phone: '📞',
  plus: '+',
  'print-outline': '🖨️',
  print: '🖨️',
  'sparkle-outline': '✨',
  'sparkles-outline': '✨',
  sparkles: '✨',
  'star-outline': '☆',
  star: '★',
  'thumbtack-outline': '📌',
  thumbtack: '📌',
  'trash-outline': '🗑️',
  trash: '🗑️',
  'triangle-exclamation': '⚠',
  'user-outline': '👤',
  user: '👤',
  'x-twitter': '𝕏',
  xmark: '✕',
};

export function IconClient({
  name,
  size = 'medium',
  color = 'default',
  'aria-label': ariaLabel,
  ...props
}: IconProps) {
  // State to hold the rendered icon
  const [icon, setIcon] = useState<React.ReactNode>(
    FALLBACK_ICONS[name] || '●',
  );
  // State to track if we're on the client
  const [isClient, setIsClient] = useState(false);

  // Effect to set client state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Client-side effect to load FontAwesome
  useEffect(() => {
    // Only runs on the client
    if (!isClient) return;

    let mounted = true;

    const loadIcon = async () => {
      try {
        // Dynamically import FontAwesome components
        const fontAwesomeModule = await import(
          '@fortawesome/react-fontawesome'
        );
        const FontAwesomeIcon = fontAwesomeModule.FontAwesomeIcon;

        // Determine which icon package and icons to load
        let iconDefinition;
        let iconSize;

        // Convert our size to FontAwesome's size
        switch (size) {
          case 'x-small':
            iconSize = 'xs';
            break;
          case 'small':
            iconSize = 'sm';
            break;
          case 'medium':
            iconSize = '1x';
            break;
          case 'large':
            iconSize = 'lg';
            break;
          case 'x-large':
            iconSize = 'xl';
            break;
          default:
            iconSize = '1x';
            break;
        }

        if (name.endsWith('-outline')) {
          // Regular icons
          const regularIcons = await import(
            '@fortawesome/pro-regular-svg-icons'
          );
          const iconName = name.replace('-outline', '');
          const faIconName =
            'fa' +
            iconName.charAt(0).toUpperCase() +
            iconName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());

          iconDefinition = regularIcons[faIconName];
        } else if (
          name === 'facebook' ||
          name === 'instagram' ||
          name === 'linkedin' ||
          name === 'x-twitter'
        ) {
          // Brand icons
          const brandIcons = await import('@fortawesome/free-brands-svg-icons');
          let brandIconName =
            name === 'x-twitter'
              ? 'faTwitter'
              : 'fa' + name.charAt(0).toUpperCase() + name.slice(1);

          iconDefinition = brandIcons[brandIconName];
        } else {
          // Solid icons
          const solidIcons = await import('@fortawesome/pro-solid-svg-icons');
          const faIconName =
            'fa' +
            name.charAt(0).toUpperCase() +
            name.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());

          iconDefinition = solidIcons[faIconName];
        }

        // If we found the icon and component is still mounted, render it
        if (iconDefinition && mounted) {
          setIcon(
            <FontAwesomeIcon
              icon={iconDefinition}
              size={iconSize}
              aria-label={ariaLabel || name}
              {...props}
            />,
          );
        } else if (mounted) {
          console.warn(`Icon "${name}" not found`);
        }
      } catch (error) {
        console.error('Error loading FontAwesome icon:', error);
      }
    };

    loadIcon();

    // Cleanup function to prevent state updates after unmount
    return () => {
      mounted = false;
    };
  }, [name, size, isClient, ariaLabel, props]);

  // Return the icon with stylex styling
  // suppressHydrationWarning prevents React warnings
  return (
    <span
      className={stylex.props(colorClasses[color]).className || ''}
      suppressHydrationWarning
      data-testid="stitch-icon-client"
    >
      {icon}
    </span>
  );
}
```

## File 2: ButtonWithClientIcon.tsx

```tsx
import {
  Button as RACButton,
  ButtonProps as RACButtonProps,
  Link as RACLink,
  LinkProps as RACLinkProps,
  ButtonRenderProps,
  LinkRenderProps,
  composeRenderProps,
} from 'react-aria-components';
import { ReactNode } from 'react';
import { IconClient as Icon, IconProps } from './IconClient';
import * as stylex from '@stylexjs/stylex';
import { focusRing } from './utils';
import { InlineStack } from './layout/InlineStack';
import { coreTokens as $ } from '@bonterratech/stitch-tokens/coreTokens.stylex';

// [Copy all the style definitions from the original Button.tsx here]

interface CommonProps {
  variant?: 'default' | 'primary' | 'subtle' | 'critical' | 'icon';
  startIcon?: IconProps['name'] | undefined;
  endIcon?: IconProps['name'] | undefined;
  isSelected?: boolean;
  width?: 'default' | 'auto' | 'full';
  children?: ReactNode;
}

type ButtonOrLinkProps =
  | (Omit<RACButtonProps, 'children'> & { href?: never } & CommonProps)
  | (Omit<RACLinkProps, 'children'> & { href: string } & CommonProps);

function iconVariantPicker(variant: string): IconProps['color'] {
  switch (variant) {
    case 'primary':
    case 'critical':
      return 'inverse';
    default:
      return 'default';
  }
}

export function ButtonWithClientIcon({
  variant = 'default',
  startIcon = undefined,
  endIcon = undefined,
  isSelected = false,
  width = 'default',
  href,
  ...props
}: ButtonOrLinkProps) {
  // [Copy the implementation from Button.tsx, but keep using our IconClient]

  const content = composeRenderProps(
    props.children,
    (children, renderProps: { isDisabled: boolean }) => (
      <InlineStack gap="100" verticalAlign="center">
        {startIcon && (
          <Icon
            color={
              renderProps.isDisabled ? 'disabled' : iconVariantPicker(variant)
            }
            name={startIcon}
            size="medium"
          />
        )}
        {children}
        {endIcon && (
          <Icon
            color={
              renderProps.isDisabled ? 'disabled' : iconVariantPicker(variant)
            }
            name={endIcon}
            size="medium"
          />
        )}
      </InlineStack>
    ),
  );

  if (href) {
    return (
      <RACLink href={href} {...linkProps}>
        {content}
      </RACLink>
    );
  }

  return <RACButton {...buttonProps}>{content}</RACButton>;
}
```

## File 3: index-client.ts

```tsx
// Export components for client-side approach
export { IconClient as Icon } from './components/IconClient';
export { ButtonWithClientIcon as Button } from './components/ButtonWithClientIcon';
export { Keyboard } from './components/Keyboard';
export { Card } from './components/Card';
export { Text } from './components/Text';
export { Heading } from './components/Heading';
```

## File 4: Update vite.config.ts

```ts
// In the build.lib.entry section:
entry: process.env.VITE_MINIMAL ? './src/index-minimal.ts' :
       // ... other entries
       process.env.VITE_CLIENT ? './src/index-client.ts' :
       // ... other entries
       './src/index.ts',
```

## File 5: Update package.json

```json
"scripts": {
  // ... existing scripts
  "build-client": "npm run clean && tsc && cross-env VITE_BUILD_LIBRARY=true VITE_CLIENT=true vite build"
}
```

## Implementation Strategy

1. Create the IconClient.tsx component first
2. Create ButtonWithClientIcon.tsx that uses it
3. Create index-client.ts to export these components
4. Update vite.config.ts to add the new entry point
5. Add the build-client script to package.json
6. Build with npm run build-client
7. Test in the testapp

## Why This Should Work

1. **No Module-Level FontAwesome Imports**: The SWC StyleX plugin won't see any FontAwesome imports during static analysis
2. **Dynamic Loading**: All FontAwesome components are loaded dynamically via import() in useEffect
3. **SSR Support**: Unicode fallbacks ensure the component renders something during SSR
4. **Hydration Handling**: suppressHydrationWarning prevents React errors when the client-side component loads FontAwesome

This approach completely avoids exposing any FontAwesome code to the SWC StyleX plugin's static analyzer.
