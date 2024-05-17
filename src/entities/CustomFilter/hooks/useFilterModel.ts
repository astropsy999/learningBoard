import { useState } from 'react';
import { GridFilterModel } from '@mui/x-data-grid';

export const useFilterModel = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedField, setSelectedField] = useState<string>('name');
  const [filterLabel, setFilterLabel] = useState<string>('');

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
