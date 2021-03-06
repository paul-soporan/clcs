import fs from 'fs';
import type { GetCompletionBlockOptions } from './types';
import { getDriver } from './drivers';

/**
 * The options of the `cleanupShellConfigurationFile` function.
 */
export interface CleanupShellConfigurationFileOptions extends GetCompletionBlockOptions {
  shellName?: string;
}

/**
 * Removes the completion block (which registers the completion provider) from the user's shell configuration file.
 */
export default async function cleanupShellConfigurationFile({
  shellName,
  ...getCompletionBlockOptions
}: CleanupShellConfigurationFileOptions): Promise<void> {
  const driver = getDriver(shellName);

  const configurationFile = driver.getShellConfigurationFile();

  if (!fs.existsSync(configurationFile)) {
    return;
  }

  const oldContent = await fs.promises.readFile(configurationFile, 'utf8');

  const completionBlock = driver.getCompletionBlock(getCompletionBlockOptions);

  await fs.promises.writeFile(configurationFile, oldContent.replaceAll(completionBlock, ''));
}
