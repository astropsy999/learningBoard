import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Groups2Icon from '@mui/icons-material/Groups2';
import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import * as React from 'react';
import { useLearners } from '../data/store/learners.store';
import { useLocation } from 'react-router-dom';

const options = ['Все сотрудники', 'Мое подразделение'];

export default function SplitButton() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  // const [buttonColor, setButtonColor] = React.useState('primary');
  const { currentUserData, setTurnOffDivisionFilter, deSelectAll } = useLearners();

  const location = useLocation();

  const handleClick = () => {
    const selectedOption = options[selectedIndex];

    switch (selectedOption) {
      case 'Все сотрудники':
        setTurnOffDivisionFilter(true);
        break;
      case 'Мое подразделение':
        setTurnOffDivisionFilter(false);
        break;
    }
  };

  // const apiRef = useGridApiRef();

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setOpen(false);
    switch (index) {
      case 0:
        // setButtonColor('primary');
        setTurnOffDivisionFilter(true);
        deSelectAll();
        break;
      default:
        // setButtonColor('warning');
        setTurnOffDivisionFilter(false);
        deSelectAll();
        break;
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup
        variant={location.pathname === '/' ? 'contained' : 'outlined'}
        ref={anchorRef}
        aria-label="Button group with a nested menu"
        color={ 'primary'}
        disabled={!currentUserData}
      >
        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
          startIcon={<Groups2Icon />}
        >
          {currentUserData ? (
            <ArrowDropDownIcon />
          ) : (
            <CircularProgress size={20} />
          )}
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 11,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}
