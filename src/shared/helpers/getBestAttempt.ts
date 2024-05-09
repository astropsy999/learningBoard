import { DetailedAttemptStat } from '../../app/types/stat';

export const getBestAttempt = (attempts: DetailedAttemptStat[]) => {
  let bestAttempt = attempts[0];
  for (let i = 1; i < attempts.length; i++) {
    if (attempts[i].passed_percent > bestAttempt.passed_percent) {
      bestAttempt = attempts[i];
    }
  }
  return bestAttempt;
};
