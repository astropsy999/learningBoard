import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import { useCourses } from '../app/store/courses';
import { getCourseTitleById } from '../shared/helpers/getCourseTitleById';
import { StatInfoType } from '../app/types/stat';
import AttemptDetailsTabs from './AttemptsDetails';

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
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          <Box>
            Результаты теста{' '}
            <strong>
              {getCourseTitleById(selectedStatInfo!.course, allCourses!)}
            </strong>{' '}
            для <strong>{selectedStatInfo.userName}</strong>
          </Box>
        </DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <Box
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
          <Card>
            <CardContent sx={{ backgroundColor: statusCardBg }}>
              <Box p={1}>
                <Box>
                  Дата/Время: <b>{date} {time}</b>
                </Box>
                <Box>
                  Вопросов отвечено: <b>{points} / {totalPoints}</b>
                </Box>
                <Box>
                  Набрано баллов: <b>{points} / {totalPoints} ({percent})</b>
                </Box>
                <Box>
                  Проходной балл: <b>{Math.floor(passingScore)} (70%)</b>
                </Box>
                {/* <Box variant="body1">
                  Затрачено времени: <b>{timeSpent}</b>
                </Box> */}
                <Stack direction="row">
                  <Box>Результат</Box>
                  <Box color={statusColor} fontWeight="bold" ml={1}>
                    {status}
                  </Box>
                </Stack>
              </Box>
            </CardContent>
          </Card>
            <Box mt={2}>
              <AttemptDetailsTabs />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
