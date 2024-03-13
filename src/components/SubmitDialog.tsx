import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Chip, CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { Bounce, toast } from 'react-toastify';
import { useCourses } from '../data/store/courses.store';
import { useLearners } from '../data/store/learners.store';
import { ToUpdateUser, updateAllData } from '../services/api.service';
import { useSWRConfig } from 'swr';
import { SelectedRowData } from '../scenes/MyLearners';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

interface SubmitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dialogTitle: string;
}

export const SubmitDialog: React.FC<SubmitDialogProps> = ({
  isOpen,
  onClose,
  dialogTitle,
}) => {
  const [open, setOpen] = React.useState(isOpen);
  const {
    selectedCoursesToSave,
    setSelectedCoursesToSave,
    singleSelectedUserCourses,
  } = useCourses();
  const {
    selectedRowsData,
    onlyLearnerName,
    allLearners,
    openCoursesDialog,
    setOnlyLearnerName,
    deSelectAll,
    setAllLearners,
  } = useLearners();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (selectedCoursesToSave.length === 1) {
      toast.warn('Необходимо выбрать хотя бы один курс!', {
        position: 'top-center',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
      return;
    }
    const deleteCourse = event.currentTarget.parentElement as HTMLButtonElement;
    const id = Number(deleteCourse.getAttribute('data-item-id'));
    const newSelectedCourses = selectedCoursesToSave.filter(
      (course) => course.id !== id,
    );
    setSelectedCoursesToSave(newSelectedCourses);
  };

  const handleSaveAssignedCourses = async () => {
    setIsLoading(true);
    let dataToUpdate: ToUpdateUser[] | null;
    const selectedCoursesIds = selectedCoursesToSave.map((course) => course.id);

    if (selectedRowsData.length > 0) {
      dataToUpdate = selectedRowsData
        .map((user) => {
          if (!user) return null;
          const oldCourses = user?.courses
            ? user?.courses.map((c) => +Object.keys(c)[0])
            : [];

          return {
            id: user.id,
            courses: Array.from(
              new Set([...oldCourses, ...selectedCoursesIds]),
            ),
          };
        })
        .filter(Boolean);
    } else {
      dataToUpdate = [];
      let foundLearner;
      if (allLearners) {
        foundLearner = allLearners.find(
          (learner) => learner.name === onlyLearnerName,
        );
      }
      dataToUpdate.push(
        // allLearners?.find((learner) => learner.name === onlyLearnerName),
        foundLearner as ToUpdateUser,
      );
      dataToUpdate = dataToUpdate.map((user) => {
        const oldCourses = user?.courses
          ? user?.courses.map((c) => +Object.keys(c)[0])
          : [];

        return {
          id: user?.id || 0,
          courses: Array.from(new Set([...oldCourses, ...selectedCoursesIds])),
        };
      });
    }

    const filteredDataToUpdate = dataToUpdate!.filter(
      (user) => user !== null,
    ) as ToUpdateUser[];
    console.log(
      '🚀 ~ handleSaveAssignedCourses ~ filteredDataToUpdate:',
      filteredDataToUpdate,
    );

    const result = await updateAllData(filteredDataToUpdate);
    if (result) {
      // Обновление данных в сторе
      const updatedLearners = allLearners!.map((learner) => {
        const updatedData = dataToUpdate!.find(
          (data: ToUpdateUser) => data.id === learner.id,
        );
        if (updatedData) {
          // Обновление курсов у пользователя
          return { ...learner, courses: updatedData.courses };
        }
        return learner; // Если пользователь не найден в обновленных данных
      });

      // Обновление стора с новыми данными
      setAllLearners(updatedLearners);

      setIsLoading(false);
      handleClose();
      openCoursesDialog(false);
      setOnlyLearnerName('');
      setSelectedCoursesToSave([]);
      deSelectAll();
      toast.success(result[0].data.message, {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
      });
    }
    console.log('🚀 ~ handleSaveAssignedCourses ~ allLearners:', allLearners);
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={4}
          justifyContent={'space-between'}
          minWidth={450}
        >
          <DialogTitle
            sx={{ m: 0, p: 2 }}
            id="customized-dialog-title"
            fontSize={16}
            fontWeight={'bold'}
            color={'steelblue'}
          >
            {dialogTitle}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent dividers>
          <div>
            <b>Вы выбрали следующие курсы:</b>
            <br />{' '}
            {selectedCoursesToSave.map((course) => (
              <Chip
                key={course.id}
                label={course.title}
                variant="outlined"
                sx={{ margin: '2px' }}
                onDelete={handleDelete}
                data-item-id={course.id}
              />
            ))}
          </div>
          <div>
            <b>Они будут назначены сотрудникам:</b>
            <br />
          </div>
          <div>
            {selectedRowsData.length > 0 ? (
              selectedRowsData.map((row) => (
                <Chip
                  key={row.id}
                  label={row.name}
                  variant="outlined"
                  sx={{ margin: '2px' }}
                />
              ))
            ) : (
              <Chip
                label={onlyLearnerName}
                variant="outlined"
                sx={{ margin: '2px' }}
              />
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="warning"
            startIcon={<CloseIcon />}
            variant="outlined"
            disabled={isLoading}
          >
            Отменить
          </Button>
          <Button
            autoFocus
            onClick={handleSaveAssignedCourses}
            color="secondary"
            variant="contained"
            startIcon={
              isLoading ? <CircularProgress size={18} /> : <CheckIcon />
            }
            disabled={isLoading}
          >
            Подтвердить
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};
function useSWRMutation(
  arg0: string,
  updateAllData: (dataToUpdate: ToUpdateUser[]) => Promise<any>,
): { trigger: any } {
  throw new Error('Function not implemented.');
}
