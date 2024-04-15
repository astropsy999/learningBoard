export type Attempt = {
    points: number,
    status: 'passed' | 'failed' | 'incomplete',
    date: number,
}

export type Interaction = {
    id: string,
    type: 'choice',
    weighting: number,
    time: string,
    latency: string,
    pattern: string,
    response: string,
    result: string,
}
export type CourseAttempt = {
    id: number,
    attempts: Attempt[],
    total_points: number,
    interactions: Interaction[]
}

export type AllStatisticsData = {
    id: number,
    name: string,
    courses: CourseAttempt[],
}