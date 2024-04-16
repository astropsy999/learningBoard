import { GridFilterItem, GridFilterOperator } from '@mui/x-data-grid';
import CustomFilterInput from '../CustomFilterPanel';

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
