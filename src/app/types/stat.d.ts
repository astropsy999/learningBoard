export type Attempt = {
  points: number;
  status: 'passed' | 'failed' | 'incomplete';
  date: number;
};
export type Interaction = {
  id: string;
  type: 'choice';
  weighting: number;
  time: string;
  latency: string;
  pattern: string;
  response: string;
  result: string;
};
export type CourseAttempt = {
  id: number;
  attempts: Attempt[];
  total_points: number;
  interactions: Interaction[];
};

export type AllStatisticsData = {
  id: number;
  name: string;
  courses: CourseAttempt[];
};

export type BestTryResult = {
  percent: number;
  points: number;
  state: boolean;
};

export type BestTry = {
  course_id: number;
  datetime_finished: string;
  points: number;
  result: BestTryResult;
  title: string;
};

export type AllStatisticsDataBestTry = {
  id: number;
  name: string;
  courses: BestTry[];
};

export type StatInfoType = {
  course: number;
  user: number;
  userName: string;
  status: string;
  unixDate: number;
  points: number;
  totalPoints: number;
  percent: string;
  passingScore: number;
  timeSpent: string;
};

export type DetailedStatAnswer = {
  text: string;
};

export type DetailedStatQuestion = {
  uid: string; // Уникальный идентификатор вопроса
  text: string; // Текст вопроса
  evaluation: number; // Оценка вопроса
  status: number; // Статус вопроса (например, решен или нет)
  max_points: number; // Максимальное количество баллов за вопрос
  awarded_points: number; // Набранные баллы за вопрос
  max_attempts: number; // Максимальное количество попыток
  used_attempts: number; // Использованные попытки
  correct: number; // Правильный ответ
  answer: number; // Данный ответ
  answers: DetailedStatAnswer[]; // Список возможных ответов на вопрос
};

export type DetailedAttemptStat = {
  title: string; // Название курса
  user: string; // Имя пользователя, проходящего курс
  number: number; // Номер курса
  type: string; // Тип курса (например, "graded" - оцениваемый)
  count_questions: number; // Общее количество вопросов
  passing_score: number; // Проходной балл
  passing_score_percent: number; // Процент проходного балла
  total_points: number; // Общее количество возможных баллов
  time_limit: number; // Ограничение по времени на курс
  passed: number; // Статус
  answered_questions: number; // Количество отвеченных вопросов
  points_scored: number; // Набранные баллы
  passed_percent: number; // Процент прохождения
  time_spent: number; // Время, затраченное на курс (в секундах)
  time_spent_format: string; // Форматированное время, затраченное на курс
  time_finished: string; // Дата и время завершения курса
  questions: DetailedStatQuestion[]; // Список вопросов в курсе
};
