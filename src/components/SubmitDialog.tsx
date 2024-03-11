import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { useCourses } from '../data/store/courses.store';
import { Box, Chip } from '@mui/material';
import { useLearners } from '../data/store/learners.store';
import CheckIcon from '@mui/icons-material/Check';
import { Bounce, toast } from 'react-toastify';
import {  useSWRConfig } from 'swr';
import { updateAllData } from '../services/api.service';

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
  const { selectedCoursesToSave, setSelectedCoursesToSave } = useCourses();
  const { SELECTED_ROWS_DATA, onlyLearnerName } = useLearners();

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

  const handleSaveAssignedCourses = () => {

  console.log('SELECTED_ROWS_DATA: ', SELECTED_ROWS_DATA);
  console.log('selectedCoursesToSave: ', selectedCoursesToSave);

  const selectedCoursesIds = selectedCoursesToSave.map(course => course.id);
  console.log('selectedCoursesIds: ', selectedCoursesIds);


    const dataToUpdate = SELECTED_ROWS_DATA.map(user => ({
      id: user.id,
      courses: selectedCoursesIds
  }));

  console.log('dataToUpdate: ', dataToUpdate);


    
    updateAllData(dataToUpdate)
  }

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
          <Typography gutterBottom>
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
          </Typography>
          <Typography gutterBottom>
            <b>Они будут назначены сотрудникам:</b>
            <br />
          </Typography>
          <Typography gutterBottom>
            {SELECTED_ROWS_DATA.length > 0 ? (
              SELECTED_ROWS_DATA.map((row) => (
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
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="warning"
            startIcon={<CloseIcon />}
            variant="outlined"
          >
            Отменить
          </Button>
          <Button
            autoFocus
            onClick={handleSaveAssignedCourses}
            color="secondary"
            variant="contained"
            startIcon={<CheckIcon />}
          >
            Подтвердить
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};
