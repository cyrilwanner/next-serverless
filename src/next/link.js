import React from 'react';
import NextLink from 'next/link';
import { isLocal, getPathPrefix } from './util';

/**
 * ServerlessLink component
 */
const ServerlessLink = (props) => {
  const prefix = getPathPrefix();

  if (prefix === '') {
    return <NextLink {...props} />;
  }

  const { href, as, ...parentProps } = props;

  if (!href || !isLocal(href) || (as && !isLocal(as))) {
    return <NextLink {...props} />;
  }

  if (!as) {
    return (
      <NextLink
        href={href}
        as={prefix + href}
        {...parentProps}
      />
    );
  }

  return (
    <NextLink
      href={href}
      as={prefix + as}
      {...parentProps}
    />
  );
};

ServerlessLink.propTypes = NextLink.propTypes;

export default ServerlessLink;
