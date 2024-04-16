import CloseIcon from '@mui/icons-material/Close';
import { Box, Chip, Container, Grid } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { TransitionProps } from '@mui/material/transitions';
import * as React from 'react';
import { FC } from 'react';
import { Bounce, toast } from 'react-toastify';
import { CourseCard } from '../entities/CourseCard/CourseCard';
import { useCourses } from '../app/store/courses';
import { useLearners } from '../app/store/learners';
import { CoursesWithDeadline } from '../app/types/store.types';
import { SelectedRowData } from '../pages/LearnersList';

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
  assignedCourses: CoursesWithDeadline[];
  lockedCourses?: number[];
};
export const CoursesToLearner: FC<CoursesToLearnerProps> = ({
  onOpen,
  onClose,
  assignedCourses,
  lockedCourses,
}) => {
  const { allCourses, setAllCourses, setSelectedCoursesToSave } = useCourses();
  const [openSubmitDialog, setOpenSubmitDialog] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCourseIds, setSelectedCourseIds] = React.useState<
    CoursesWithDeadline[]
  >([]);

  const { selectedRowsData, setSelectedRowsDataOnMyLearners, allData } =
    useLearners();

  const isMassEditMode = selectedRowsData.length > 1;

  React.useEffect(() => {
    allData && setAllCourses(allData.courses);
    setIsLoading(false);
  }, [allCourses, allData, setAllCourses]);

  React.useEffect(() => {
    // Поставить галочки на тех курсах id которых уже выбраны ранее
    setSelectedCourseIds(assignedCourses);

    const filteredWithDeadline = assignedCourses
      .filter((assignedCourse) =>
        allData?.courses.some((course) => course.id === assignedCourse.id),
      )
      .map((assignedCourse) => {
        const course = allData?.courses.find(
          (course) => course.id === assignedCourse.id,
        );
        return { ...course, deadline: assignedCourse.deadline };
      }) as CoursesWithDeadline[];

    setSelectedCoursesToSave(filteredWithDeadline);
  }, [assignedCourses, allData?.courses, setSelectedCoursesToSave]);

  const handleDeleteLearnerFromGroup = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (selectedRowsData.length === 1) {
      toast.warn('Необходимо выбрать хотя бы одного ученика!', {
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
    const chipElement = event.currentTarget.parentElement as HTMLButtonElement;

    const itemId = chipElement.getAttribute('data-item-id');
    setSelectedRowsDataOnMyLearners([
      ...selectedRowsData.filter((item) => item.id !== Number(itemId)),
    ]);
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
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                width: '100%',
              }}
            >
              <Box>
                {!isMassEditMode ? (
                  <h2>РЕДАКТИРОВАНИЕ:</h2>
                ) : (
                  <h2 style={{ opacity: 0.9 }}>МАССОВОЕ РЕДАКТИРОВАНИЕ:</h2>
                )}
              </Box>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                <Box m={1}>
                  {selectedRowsData.length &&
                    selectedRowsData?.map((item) => (
                      <Chip
                        label={item.name}
                        color="warning"
                        variant="filled"
                        size="medium"
                        key={item.id}
                        sx={{ margin: '2px' }}
                        onDelete={handleDeleteLearnerFromGroup}
                        data-item-id={item.id}
                        data-item-name={item.name}
                      />
                    ))}
                </Box>
              </Typography>

              <IconButton
                edge="start"
                color="inherit"
                onClick={onClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Box>
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
                  <CourseCard
                    courseItem={course}
                    assigned={selectedCourseIds}
                    isLocked={
                      lockedCourses! && lockedCourses.includes(course.id)
                    }
                    allLockedCourses={lockedCourses!}
                  />
                </Grid>
              ))}
          </Grid>
        </Container>
      </Dialog>
    </React.Fragment>
  );
};
