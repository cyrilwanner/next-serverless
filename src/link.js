import React from 'react';
import NextLink from 'next/link';
import { hasPathPrefix } from './util';
import { isLocal } from '../lib/util';

/**
 * Get the current path prefix
 * @return {string} path prefix or null
 */
const getPrefix = () => {
  if (typeof window === 'undefined') {
    return global.next_serverless_prefix || null;
  }

  if (hasPathPrefix(window.location.host)) {
    return '/prod';
  }

  return null;
};

/**
 * ServerlessLink component
 */
const ServerlessLink = (props) => {
  const prefix = getPrefix();

  if (prefix === null) {
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
        as={`${prefix}${href.substr(0, 1) === '/' ? '' : '/'}${href}`}
        {...parentProps}
      />
    );
  }

  return (
    <NextLink
      href={href}
      as={`${prefix}${href.substr(0, 1) === '/' ? '' : '/'}${as}`}
      {...parentProps}
    />
  );
};

ServerlessLink.propTypes = NextLink.propTypes;

export default ServerlessLink;
