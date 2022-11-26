import { TimeSerieStep } from "../../domain";

export const DATETIMEPARTS_MAP = {
  [TimeSerieStep.YEAR]: [TimeSerieStep.YEAR],
  [TimeSerieStep.MONTH]: [TimeSerieStep.YEAR, TimeSerieStep.MONTH],
  [TimeSerieStep.WEEK]: [TimeSerieStep.YEAR, TimeSerieStep.WEEK],
  [TimeSerieStep.DAY]: [TimeSerieStep.YEAR, TimeSerieStep.MONTH, TimeSerieStep.DAY],
  [TimeSerieStep.HOUR]: [TimeSerieStep.YEAR, TimeSerieStep.MONTH, TimeSerieStep.DAY, TimeSerieStep.HOUR]
};
