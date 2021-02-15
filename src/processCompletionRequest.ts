import type { Writable } from 'stream';
import { getDriver } from './drivers';
import normalizeShellCompletionRequest from './normalizeShellCompletionRequest';
import type { CompletionFunction, ShellCompletionRequest } from './types';

/**
 * The options of the `processCompletionRequest` function.
 */
export interface ProcessCompletionRequestOptions extends ShellCompletionRequest {
  shellName: string;
  stdout?: Writable;
}

export default async function processCompletionRequest(
  {
    shellName,
    stdout = process.stdout,
    ...shellCompletionRequest
  }: ProcessCompletionRequestOptions,
  getCompletion: CompletionFunction,
): Promise<void> {
  const completionRequest = normalizeShellCompletionRequest(shellCompletionRequest);

  let results = await getCompletion(completionRequest);
  if (!Array.isArray(results)) {
    results = [results];
  }

  const richResults = results.map((result) => {
    const richResult = typeof result === 'string' ? { completionText: result } : result;
    return {
      ...richResult,
      listItemText: richResult.listItemText ?? richResult.completionText,
    };
  });

  const driver = getDriver(shellName);

  stdout.write(driver.getReply(richResults));
}
