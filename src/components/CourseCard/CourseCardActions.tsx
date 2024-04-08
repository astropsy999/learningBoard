import { Box, CardActions, Checkbox, CircularProgress, FormControlLabel, Skeleton, Switch } from "@mui/material"
import React from "react"
import AssignDatePicker from "../DatePicker"
import { useLearners } from "../../data/store/learners.store";
import { getLearnerIdByName } from "../../helpers/getLearnerIdByName";
import { getLockedUsersByCourseId } from "../../helpers/getlockedUsersByCourseId";
import { lockCourses } from "../../services/api.service";
import { mutate } from "swr";
import { Bounce, toast } from "react-toastify";
import { CourseData } from "../../data/store/courses.store";

interface CourseCardActionsProps {
    courseLocked: boolean,
    handleLockUnlock: (e: React.MouseEvent<HTMLLabelElement, MouseEvent>, courseId: number, courseLocked: boolean) => void
    courseItem: CourseData,
    globalLoading?: boolean
    isCoursedateLoading?: boolean,
    isCourseCardLoading?: boolean,
    handleDateChange: (newDate: Object | null, itemId: number) => void,
    deadlineDate?: string | number,
    checked?: boolean,
    isLoading?: boolean
}

export const CourseCardActions: React.FC<CourseCardActionsProps> = (props) => {

    const {
        checked,
        courseLocked, 
        handleLockUnlock, 
        courseItem, 
        globalLoading, 
        isCoursedateLoading, 
        isCourseCardLoading, 
        handleDateChange, 
        deadlineDate,
        isLoading
    } = props

    const {currentUserData, onlyLearnerName, allLearners, selectedRowsData} = useLearners()



    return (
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
        <Box>
          {!isCourseCardLoading 
            ? <Checkbox color="info" checked={checked} /> 
            : <CircularProgress size={33} color="info"  />
          }
        </Box>
        {currentUserData?.manager.level === 1 && (
          <Box>
            {isLoading ? (
              <CircularProgress size={30} color="info" />
            ) : (
              <FormControlLabel
                control={
                  <Switch
                    checked={courseLocked}
                    color={courseLocked ? 'warning' : 'secondary'}
                  />
                }
                label={courseLocked ? 'Разблокировать' : 'Блокировать'}
                onClick={(e) =>
                  handleLockUnlock(e, courseItem.id, courseLocked)
                }
              />
            )}
          </Box>
        )}
        <Box 
          sx={{
            backgroundColor: !globalLoading ? (!courseLocked ? 'lightskyblue' : 'lightcoral') : 'inherit', 
            display: !checked ? 'none' : 'block', 
            borderRadius: 1,
            }} >
        {!isCoursedateLoading 
            ? <AssignDatePicker
                onDateChange={(newDate) => handleDateChange(newDate, courseItem.id)}
                disabled={!checked}
                defaultValue={deadlineDate as string}
          />
            : <Skeleton width={130} height={60}/>}
        </Box>
      </CardActions>
    )
}