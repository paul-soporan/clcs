import type { ShellDriver } from '../types';

import BashDriver from './BashDriver';
import ZshDriver from './ZshDriver';
import FishDriver from './FishDriver';
import PowerShellDriver from './PowerShellDriver';

export const drivers = [BashDriver, ZshDriver, FishDriver, PowerShellDriver];

/**
 * @returns The driver corresponding to the default shell.
 */
function getDefaultDriver(): ShellDriver {
  const defaultDriver = drivers.find((driver) => driver.isDefaultShell());

  if (typeof defaultDriver === 'undefined') {
    if (typeof process.env.SHELL !== 'undefined') {
      throw new TypeError(`Default shell "${process.env.SHELL}" is not supported`);
    }

    throw new TypeError('No default shell could be detected');
  }

  return defaultDriver;
}

/**
 * @returns The driver corresponding to the requested shell.
 */
function getRequestedDriver(shellName: string): ShellDriver {
  const requestedDriver = drivers.find((driver) => driver.shellName === shellName);

  if (typeof requestedDriver === 'undefined') {
    throw new TypeError(`Requested shell "${shellName}" is not supported`);
  }

  return requestedDriver;
}

/**
 * @returns The driver corresponding to the requested shell or to the default shell if no shell is requested.
 */
export function getDriver(shellName?: string): ShellDriver {
  return typeof shellName === 'string' ? getRequestedDriver(shellName) : getDefaultDriver();
}
