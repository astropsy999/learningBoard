import { GridFilterItem, GridFilterOperator } from '@mui/x-data-grid';
import CustomFilterInput from '../CustomFilterPanel';

/**
 * Custom hook that returns an array of filter operators for custom filtering.
 *
 * @param {string[]} selectedValues - Array of selected values
 * @param {Function} setSelectedValues - Function to set selected values
 * @param {string} filterLabel - Label for the filter
 * @param {string} selectedField - Selected field for filtering
 * @return {GridFilterOperator<any, string, string>[]} Array of filter operators
 */
export const useCustomFilterOperators = (
  selectedValues: string[],
  setSelectedValues: Function,
  filterLabel: string,
  selectedField: string,
) => {
  const filterOperators: GridFilterOperator<any, string, string>[] = [
    {
      value: 'isAnyOf',
      getApplyFilterFn: (filterItem: GridFilterItem) => {
        if (!filterItem.field || !filterItem.value || !filterItem.operator) {
          return null;
        }

        if (selectedValues.length === 0) {
          return (value: string) => true;
        }

        return (value: string) => {
          return selectedValues?.includes(value);
        };
      },
      InputComponent: CustomFilterInput,
      InputComponentProps: {
        onChange: (selectedValue: string[]) => {
          setSelectedValues(selectedValue);
        },
        filterLabel,
        field: selectedField,
        selectedOptions: selectedValues,
      },
    },
  ];

  return filterOperators;
};
