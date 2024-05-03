import { Box, Button, Card, CardContent, Skeleton, Stack } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import { getDetailedStatisctics } from '../app/api/api';
import { useCourses } from '../app/store/courses';
import { DetailedAttemptStat, StatInfoType } from '../app/types/stat';
import { getCourseTitleById } from '../shared/helpers/getCourseTitleById';
import AttemptDetailsTabs from './AttemptsDetails';
import { DetailedBestAttemptCard } from '../features/DetailedBestAttemptCard';

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
  const [detailedStatistic, setDetailedStatistic] = React.useState({});
  const [isDetailedStatLoading, setIsDetailedStatLoading] =
    React.useState(true);
  const [bestAttempt, setBestAttempt] = React.useState<
    DetailedAttemptStat | []
  >([]);

  const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const getBestAttempt = (attempts: DetailedAttemptStat[]) => {
    let bestAttempt = attempts[0];
    for (let i = 1; i < attempts.length; i++) {
      if (
        attempts[i].passing_score_percent > bestAttempt.passing_score_percent
      ) {
        bestAttempt = attempts[i];
      }
    }
    return bestAttempt;
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

      const { user, course } = selectedStatInfo;
      console.log('Starting request: user =', user, ', course =', course);

      setIsDetailedStatLoading(true);
      getDetailedStatisctics(user, course).then((data) => {
        const detailedStatistic = data.attempts;
        console.log(
          '🚀 ~ getDetailedStatisctics ~ detailedStatistic:',
          detailedStatistic,
        );

        const bestAttempt = getBestAttempt(detailedStatistic);
        setBestAttempt(bestAttempt);
        setIsDetailedStatLoading(false);
      });
    }
  }, [open]);

  const status =
    selectedStatInfo.status === 'passed' ? 'Пройден' : 'Не пройден';

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
            <DetailedBestAttemptCard
              data={bestAttempt as DetailedAttemptStat}
              isLoading={isDetailedStatLoading}
            />
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
