import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import { useCourses } from '../app/data/store/courses';
import { DetailedQuestion } from '../features/DetailedQuestion';
import { StatInfoType } from '../pages/Statistics';
import { getCourseTitleById } from '../shared/helpers/getCourseTitleById';
import { Box, Button, Card, CardContent, Stack } from '@mui/material';

interface DetailedStartDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  selectedStatInfo: StatInfoType;
}

export const DetailedStatDialog: React.FC<DetailedStartDialogProps> = (
  props,
) => {
  const { open, setOpen, selectedStatInfo } = props;
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const { allCourses } = useCourses();

  const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const status =
    selectedStatInfo.status === 'passed' ? 'Пройден' : 'Не пройден';
  const statusColor = selectedStatInfo.status === 'passed' ? 'green' : 'red';
  const statusCardBg =
    selectedStatInfo.status === 'passed' ? '#90ee9038' : '#ff00001c';

  const date = new Date(selectedStatInfo.unixDate * 1000).toLocaleDateString(
    'ru-RU',
  );
  const time = new Date(selectedStatInfo.unixDate * 1000).toLocaleTimeString(
    'ru-RU',
    { hour: '2-digit', minute: '2-digit' },
  );

  const points = selectedStatInfo.points;
  const totalPoints = selectedStatInfo.totalPoints;
  const percent = selectedStatInfo.percent;
  const passingScore = selectedStatInfo.passingScore;
  const timeSpent = selectedStatInfo.timeSpent;

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          Результаты теста{' '}
          <strong>
            {getCourseTitleById(selectedStatInfo!.course, allCourses!)}
          </strong>{' '}
          для <strong>{selectedStatInfo.userName}</strong>
        </DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <Card>
              <CardContent sx={{ backgroundColor: statusCardBg }}>
                <Box p={1}>
                  <div>
                    Дата/Время:{' '}
                    <b>
                      {date} {time}
                    </b>
                  </div>
                  <div>
                    Вопросов отвечено:{' '}
                    <b>
                      {points} / {totalPoints}
                    </b>
                  </div>
                  <div>
                    Набрано баллов:{' '}
                    <b>
                      {points} / {totalPoints} ({percent})
                    </b>
                  </div>
                  <div>
                    Проходной балл: <b>{Math.floor(passingScore)} (70%)</b>
                  </div>
                  {/* <div>
                    Затрачено времени: <b>{timeSpent}</b>
                  </div> */}
                  <Stack direction={'row'}>
                    Результат{' '}
                    <Box color={statusColor} fontWeight={'bold'} ml={1}>
                      {status}
                    </Box>
                  </Stack>
                </Box>
              </CardContent>
            </Card>

            {/* <Box m={2}>
              <DetailedQuestion isCorrect={true} />
              <DetailedQuestion isCorrect={false} />
            </Box> */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
