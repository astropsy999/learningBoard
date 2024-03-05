import CloseIcon from '@mui/icons-material/Close';
import { Container, Grid } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { TransitionProps } from '@mui/material/transitions';
import * as React from 'react';
import { FC } from 'react';
import { CourseCard } from '../../components/CourseCard';
import { SelectedRowData } from '../mylearners/MyLearners';
import { useCourses } from '../../data/store/courses.store';
import { SubmitDialog } from '../../components/SubmitDialog';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type CoursesToLearnerProps = {
  onOpen: boolean;
  onClose: () => void;
  name?: string;
  lernersData?: SelectedRowData[] | undefined;
};

export const CoursesToLearner: FC<CoursesToLearnerProps> = ({
  onOpen,
  onClose,
  name,
  lernersData,
}) => {
  const getLearnersNamesToString = (learnersArray: SelectedRowData[]) => {
    return learnersArray.map((learner) => learner.name).join(', ');
  };

  const { allCourses, setAllCourses } = useCourses();
  const [openSubmitDialog, setOpenSubmitDialog] = React.useState(false);

  React.useEffect(() => {
    setAllCourses(); // Вызов функции для загрузки данных при монтировании компонента
  }, [allCourses, setAllCourses]);

  const handleSaveCourses = () => {
    setOpenSubmitDialog(true);
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={onOpen}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }} color="secondary">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Назначение обучения для{' '}
              {lernersData?.length
                ? getLearnersNamesToString(lernersData)
                : name}
            </Typography>
            <Button
              autoFocus
              color="warning"
              onClick={handleSaveCourses}
              variant="contained"
            >
              Сохранить
            </Button>
          </Toolbar>
        </AppBar>
        <Container>
          <Grid
            container
            spacing={2}
            display={'flex'}
            justifyContent={'center'}
            mt={2}
          >
            {allCourses &&
              allCourses.map((course) => (
                <Grid item key={course.id}>
                  <CourseCard courseItem={course} />
                </Grid>
              ))}
          </Grid>
        </Container>
      </Dialog>
      <SubmitDialog
        isOpen={openSubmitDialog}
        onClose={() => setOpenSubmitDialog(false)}
      />
    </React.Fragment>
  );
};
