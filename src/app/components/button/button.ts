import type { Callback } from '@/app/utils/types.ts';
import { BaseComponent } from '../base-components.ts';

import styles from './button.module.scss';

interface Props {
  textContent: string;
  onClick?: Callback;
  className?: string;
}

const Button = ({textContent, onClick, className }: Props):BaseComponent  =>
  new BaseComponent({
    tag: 'button',
    className: `${styles.button} ${className || ''}`,
    textContent,
    onclick: (PreventDefault: Event): void => {
      PreventDefault.preventDefault();
      onClick?.();
    },
  });
export default Button;
