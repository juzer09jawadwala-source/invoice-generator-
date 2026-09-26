import * as React from 'react';
import { CreepyButton, CreepyButtonProps } from './creepy-button';

export interface ButtonProps extends CreepyButtonProps {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <CreepyButton ref={ref} {...props} />;
  }
);

Button.displayName = 'Button';

export { CreepyButton };
export default Button;
