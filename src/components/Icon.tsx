import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import * as stylex from '@stylexjs/stylex';
// import { coreTokens as $ } from '@bonterratech/stitch-tokens/coreTokens.stylex';
import { iconMap } from './iconMap';

export interface IconProps extends Omit<FontAwesomeIconProps, 'size' | 'icon'> {
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
    | 'ellipsis-outline'
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
}

// Mapping color names to stylex color tokens
const colorClasses = stylex.create({
  default: { color: 'red' },
  link: { color: 'blue' },
  inverse: { color: 'green' },
  subtle: { color: 'yellow' },
  disabled: { color: 'purple' },
  success: { color: 'orange' },
  warning: { color: 'orange' },
  critical: { color: 'orange' },
  info: { color: 'orange' },
});

export function Icon({
  name,
  size = 'medium',
  color = 'default',
  ...props
}: IconProps) {
  const myIcon = iconMap[name];
  if (!myIcon) {
    console.warn(`Icon "${name}" not found in the icon map`);
  }

  let mySize: SizeProp = '1x';
  switch (size) {
    case 'x-small':
      mySize = 'xs';
      break;
    case 'small':
      mySize = 'sm';
      break;
    case 'medium':
      mySize = '1x';
      break;
    case 'large':
      mySize = 'lg';
      break;
    case 'x-large':
      mySize = 'xl';
      break;
    default:
      mySize = '1x';
      break;
  }

  return (
    <FontAwesomeIcon
      icon={myIcon}
      size={mySize}
      aria-label={props['aria-label'] || name}
      className={stylex.props(colorClasses[color]).className || ''}
      data-testid="stitch-icon"
    />
  );
}
