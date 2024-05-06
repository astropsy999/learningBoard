import { Box, Button, Card, CardContent, Skeleton, Stack } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import { getDetailedStatisctics } from '../app/api/api';
import { useCourses } from '../app/store/courses';
import {
  DetailedAttemptStat,
  DetailedStatQuestion,
  StatInfoType,
} from '../app/types/stat';
import { getCourseTitleById } from '../shared/helpers/getCourseTitleById';
import AttemptDetailsTabs from './AttemptsDetails';
import { DetailedBestAttemptCard } from '../features/DetailedBestAttemptCard';

interface DetailedStartDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  selectedStatInfo: StatInfoType;
}

export const DetailedStatDialog: React.FC<DetailedStartDialogProps> = (
  props
) => {
  const { open, setOpen, selectedStatInfo } = props;
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const { allCourses } = useCourses();
  const [isDetailedStatLoading, setIsDetailedStatLoading] =
    React.useState(true);
  const [bestAttempt, setBestAttempt] = React.useState<
    DetailedAttemptStat | []
  >([]);
  const [detailedQuestions, setDetailedQuestions] = React.useState<
    {
      [key: number]: DetailedStatQuestion[];
    }[]
  >([]);

  const [isNewCourse, setIsNewCourse] = React.useState(true);

  const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const getBestAttempt = (attempts: DetailedAttemptStat[]) => {
    let bestAttempt = attempts[0];
    for (let i = 1; i < attempts.length; i++) {
      if (attempts[i].passed_percent > bestAttempt.passed_percent) {
        bestAttempt = attempts[i];
      }
    }
    return bestAttempt;
  };
  const getDetailedQuestions = (attempts: DetailedAttemptStat[]) => {
    let detailedQuestions = [];
    for (let i = 0; i < attempts.length; i++) {
      const attempt = attempts[i];
      detailedQuestions.push({ [i + 1]: attempts[i].questions });
    }

    return detailedQuestions;
  };

  const handleClose = () => {
    setOpen(false);
    setDetailedQuestions([]);
    setBestAttempt([]);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    const { user, course } = selectedStatInfo;

    if (course === 10 || course === 12) {
      setIsNewCourse(false);
    }
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }

      setIsDetailedStatLoading(true);
      getDetailedStatisctics(user, course).then((data) => {
        const detailedStatistic = data.attempts;
        const bestAttempt = getBestAttempt(detailedStatistic);
        const detailedQuestions = getDetailedQuestions(detailedStatistic);
        setDetailedQuestions(detailedQuestions);
        setBestAttempt(bestAttempt);
        setIsDetailedStatLoading(false);
      });
    }
  }, [open]);

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
              oldData={selectedStatInfo}
            />
            {!isNewCourse && (
              <Box mt={2}>
                <AttemptDetailsTabs detailedQuestions={detailedQuestions} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
