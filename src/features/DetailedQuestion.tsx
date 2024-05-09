import {
  Badge,
  Box,
  Chip,
  Grid,
  Paper,
  Typography,
  styled,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import React from 'react';
import { DetailedStatAnswer, DetailedStatQuestion } from '../app/types/stat';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

// Helper function to calculate if the question is correct
const isCorrect = (question: DetailedStatQuestion) =>
  question.correct === question.answer;

// Helper function to get the answer text based on the answer index
const getAnswerText = (answers: DetailedStatAnswer[], answerIndex: number) => {
  const answer = answers[answerIndex];
  return answer ? answer.text : null;
};

// Component to render the question header
const QuestionHeader = ({
  index,
  question,
}: {
  index: number;
  question: DetailedStatQuestion;
}) => (
  <Box
    display="flex"
    alignItems="center"
    mb={1}
    justifyContent={'space-around'}
  >
    <Chip label={`Вопрос ${index + 1}`} style={{ marginRight: '1rem' }} />
    <Badge
      badgeContent={isCorrect(question) ? 'Верно' : 'Неверно'}
      color={isCorrect(question) ? 'success' : 'error'}
    />
    <Chip
      label={`Баллы: ${question.awarded_points} / ${question.max_points}`}
      style={{ marginLeft: '1rem' }}
    />
  </Box>
);

// Component to render the user and correct answers
const QuestionFooter = ({ question }: { question: DetailedStatQuestion }) => (
  <Grid container spacing={2} mb={2}>
    <Grid item xs={6}>
      <Item
        style={{
          background: isCorrect(question) ? 'lightgreen' : 'lightpink',
          fontWeight: 'bold',
        }}
      >
        <Box display="flex" justifyContent="space-around" alignItems="center">
          <Typography lineHeight={1}>
            {isCorrect(question) ? (
              <CheckIcon color="success" fontSize="large" />
            ) : (
              <ClearIcon color="error" fontSize="large" />
            )}
          </Typography>
          <Typography color={isCorrect(question) ? 'darkgreen' : 'darkred'} lineHeight={1.1} align='left' marginLeft={1} >
            {getAnswerText(question.answers, question.answer)}
          </Typography>
        </Box>
      </Item>
    </Grid>
    <Grid item xs={6}>
      <Item>
        <Typography lineHeight={1.1} align='left'>
          {getAnswerText(question.answers, question.correct)}
        </Typography>
      </Item>
    </Grid>
  </Grid>
);

// Component to render the question content
const QuestionContent = ({ question }: { question: DetailedStatQuestion }) => (
  <Box p={2} fontWeight="bold">
    {question.text}
  </Box>
);

export const DetailedQuestion = ({ questionsInAttempt }: any) => {
  return (
    <Box>
      {questionsInAttempt.map(
        (question: DetailedStatQuestion, index: number) => (
          <Box
            key={index}
            border={'1px solid lightgray'}
            p={2}
            mt={1}
            mb={3}
            borderRadius={'10px'}
            width={'100%'}
            bgcolor={'white'}
          >
            <QuestionHeader index={index} question={question} />
            <QuestionContent question={question}  />
            <QuestionFooter question={question} />
          </Box>
        ),
      )}
    </Box>
  );
};
