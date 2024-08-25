import React from 'react';
import {useTailwind} from 'tailwind-rn';

const WithTailwindHook = Component =>
  function WrappedComponent(props) {
    const tailwind = useTailwind();
    return <Component {...props} tailwind={tailwind} />;
  };
export default WithTailwindHook;
