import { useState } from 'react';
import { GridFilterModel } from '@mui/x-data-grid';

/**
 * Custom hook that manages the filter model state for the data grid.
 *
 * @return {Object} An object containing selectedValues, setSelectedValues, selectedField, filterLabel, and onChangeFilterModel function.
 */
export const useFilterModel = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedField, setSelectedField] = useState<string>('name');
  const [filterLabel, setFilterLabel] = useState<string>('');

  /**
   * Updates the filter model based on the new model provided.
   *
   * @param {GridFilterModel} newModel - The new filter model to update.
   */
  const onChangeFilterModel = (newModel: GridFilterModel) => {
    if (newModel.items) {
      setFilterLabel('ФИО');
      setSelectedField(newModel.items[0]?.field! || 'name');
    }
    if (!newModel.items[0]?.value) {
      setSelectedValues([]);
    }
  };

  return {
    selectedValues,
    setSelectedValues,
    selectedField,
    filterLabel,
    onChangeFilterModel,
  };
};
