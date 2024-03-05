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
import { Chip } from '@mui/material';
import { useLearners } from '../data/store/learners.store';
import CheckIcon from '@mui/icons-material/Check';

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
  const { selectedCoursesToSave } = useCourses();
  const { SELECTED_ROWS_DATA } = useLearners();

  React.useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleDelete = (id: number) => {};

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
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
              />
            ))}
          </Typography>
          <Typography gutterBottom>
            <b>Они будут назначены сотрудникам:</b>
            <br />
          </Typography>
          <Typography gutterBottom>
            {SELECTED_ROWS_DATA.length > 0 &&
              SELECTED_ROWS_DATA.map((row) => (
                <Chip
                  key={row.id}
                  label={row.name}
                  variant="outlined"
                  sx={{ margin: '2px' }}
                />
              ))}
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
            onClick={handleClose}
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
