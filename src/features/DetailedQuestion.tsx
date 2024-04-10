import { Box, Grid, Paper, Stack, Typography, styled } from "@mui/material"
import React, { useState } from "react"
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

interface DetailedQuestionProps {
    isCorrect: boolean
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  

export const DetailedQuestion: React.FC<DetailedQuestionProps> = (props) => {

    const {isCorrect} = props

    const answerIcon = isCorrect ? <CheckIcon color="success" fontSize="large"/> : <ClearIcon color="error" fontSize="large"/>
    const answerColor = isCorrect ? 'green' : 'red'
    const answerText = isCorrect ? 'Верно' : 'Неверно'

    return (
        <Box p={1}>
            <Stack direction={'row'}><b>Вопрос 1</b><Box pl={1} color={answerColor} fontWeight={'bold'}>{answerText}</Box></Stack>
            <div>Баллы: <span>1/1</span></div>
            <Box mb={2}>
                <b>В какие сроки работники рабочих профессий, принимаемые на работу с вредными и (или)
                опасными условиями труда, проходят обучение и проверку знаний требований охраны труда?
            </b>
            </Box>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} m={2} >
                <Grid xs={6}>
                    <Item sx={{background: answerColor, fontWeight: 'bold'}}>Ответ пользователя</Item>
                </Grid>
                <Grid xs={6}>
                    <Item sx={{background: 'lightgrey'}}>Правильный ответ</Item>
                </Grid>
                <Grid xs={6}>
                    <Item>
                        <Box display={'flex'} justifyContent={'space-around'} alignItems={'center'}>
                            <Typography>{answerIcon} </Typography>
                            <Typography color={answerColor}>В течение первого месяца после назначения на эти работы</Typography>
                        </Box></Item>
                </Grid>
                <Grid xs={6}>
                    <Item><Typography>В течение первого месяца после назначения на эти работы</Typography></Item>
                </Grid>
            </Grid>
        </Box>
    )
}