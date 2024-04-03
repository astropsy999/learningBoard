import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Chip, CircularProgress, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { Bounce, toast } from 'react-toastify';
import { mutate } from 'swr';
import { useCourses } from '../data/store/courses.store';
import { useLearners } from '../data/store/learners.store';
import { ToUpdateUser, updateAllData } from '../services/api.service';
import AssignDatePicker from './DatePicker';
import { DateBuilderReturnType } from '@mui/x-date-pickers';
import { CoursesWithDeadline } from '../data/types.store';

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
    setAssignedCourses,
  } = useCourses();
  const [deadline, setDeadline] = React.useState<number | null>(null);

  const {
    selectedRowsData,
    onlyLearnerName,
    allLearners,
    openCoursesDialog,
    setOnlyLearnerName,
    deSelectAll,
  } = useLearners();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleDateChange = (newDate: Object | null) => {
    // @ts-ignore
    const dateString = newDate!.$d;
    const unixTime = new Date(dateString).getTime() / 1000;
    setDeadline(unixTime);
  };

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
    let dataToUpdate;
    const selectedCoursesIds = selectedCoursesToSave.map((course) => ({
      id: course.id,
      deadline: course.deadline,
    }));

    if (selectedRowsData.length > 0) {
      dataToUpdate = selectedRowsData
        .map((user) => {
          if (!user) return null;

          const oldCourses = user?.courses
            ? user?.courses.map((c) => {
                return {
                  id: +Object.keys(c)[0],
                  deadline: c.deadline,
                };
              })
            : [];

          const uniqueIds = new Set([
            ...oldCourses.map((course) => course.id),
            ...selectedCoursesIds.map((course) => course.id),
          ]);

          const courseMap: { [id: number]: CoursesWithDeadline } = {};

          oldCourses.forEach((course) => {
              courseMap[course.id] = course;
          });

          selectedCoursesIds.forEach((course) => {
              courseMap[course.id] = course;
          });

          const uniqueCourses = Object.values(courseMap);

          return {
            id: user.id,
            courses: uniqueCourses,
          };
        })
        .filter(Boolean);
    } else {
      dataToUpdate = [];
      dataToUpdate.push(
        allLearners?.find((learner) => learner.name === onlyLearnerName),
      );
      dataToUpdate = dataToUpdate.map((user) => {
        return {
          id: user?.id || 0,
          courses: Array.from(new Set([...selectedCoursesIds])),
        };
      });
    }

    const filteredDataToUpdate = dataToUpdate.filter(
      (user) => user !== null,
    ) as ToUpdateUser[];

    const result = await updateAllData(filteredDataToUpdate);

    mutate('allData').then(() => {
      handleClose();
      openCoursesDialog(false);
      toast.success(result[0]?.data?.message, {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
      });
      setOnlyLearnerName('');
      deSelectAll();
      setIsLoading(false);
      setAssignedCourses([]);
    });
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
          minWidth={550}
        >
          <DialogTitle
            sx={{ m: 0, p: 2 }}
            id="customized-dialog-title"
            color={'steelblue'}
            variant="h4"
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
          <Box m={1}>
            {selectedCoursesToSave?.length > 0 ? (
              <Typography variant="h5" fontWeight={'600'}>
                Вы выбрали следующие курсы:
              </Typography>
            ) : null}

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
          </Box>
          <Box m={1}>
            {selectedCoursesToSave.length > 0 ? (
              <Typography variant="h5" fontWeight={'600'}>
                Они будут назначены сотрудникам:
              </Typography>
            ) : (
              <Typography variant="h5" fontWeight={'600'} color={'orange'}>
                Все назначенные ранее курсы будут удалены у сотрудников:
              </Typography>
            )}

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
          </Box>
          <Box m={1}>
            {/* <Typography variant="h5" fontWeight={'600'} m={1}>
              Дата окончания курса:
            </Typography> */}
            {/* <AssignDatePicker onDateChange={handleDateChange} /> */}
          </Box>
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
