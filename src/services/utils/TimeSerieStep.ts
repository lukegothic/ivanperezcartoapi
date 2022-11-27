import { TimeSerieStep } from "../../domain";

/**
 * Map containing the relation between a TimeSerieStep and the TimeSerieStep dependencies
 * that are required to perform a group operation based on the provided TimeSerieStep.
 * For example, to be able to group data by day, it is needed to group by day, month and year
 * Just grouping by day isn't enough as it would group data from same day but different months and years
 */
export const TimePartsForGrouping: Map<TimeSerieStep, TimeSerieStep[]> = new Map([
  [TimeSerieStep.YEAR, [TimeSerieStep.YEAR]],
  [TimeSerieStep.MONTH, [TimeSerieStep.YEAR, TimeSerieStep.MONTH]],
  [TimeSerieStep.WEEK, [TimeSerieStep.YEAR, TimeSerieStep.WEEK]],
  [TimeSerieStep.DAY, [TimeSerieStep.YEAR, TimeSerieStep.MONTH, TimeSerieStep.DAY]],
  [TimeSerieStep.HOUR, [TimeSerieStep.YEAR, TimeSerieStep.MONTH, TimeSerieStep.DAY, TimeSerieStep.HOUR]]
]);
