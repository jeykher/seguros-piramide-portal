import React from 'react';
import { makeStyles, useTheme} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%'
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      marginTop: 40,
    },
  },
  variant: "menu",
  getContentAnchorEl: null,
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function SelectMultipleChip(props) {
    const {id,idLabel,label,arrayValues,idvalue,descrip,onChange} = props
    const classes = useStyles();
    const theme = useTheme();
    const [personName, setPersonName] = React.useState([]);

    const handleChange = (event) => {
        setPersonName(event.target.value);
        onChange(event)
    };

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id={idLabel}>{label}</InputLabel>
            <Select
                labelId={idLabel}
                id={id}
                fullWidth
                multiple
                value={personName}
                onChange={handleChange}
                input={<Input id={idLabel} />}
                renderValue={(selected) => {
                    return <div className={classes.chips}>
                        {selected.map((value) =>{
                            const regSelect = arrayValues.find(element => element[idvalue] === value);
                            return <Chip key={value} label={regSelect[descrip]} className={classes.chip} />
                        })}
                    </div>
                }}
                MenuProps={MenuProps}
            >
                {arrayValues.map((reg) => (
                    <MenuItem key={reg[idvalue]} value={reg[idvalue]} style={getStyles(reg, personName, theme)}>{reg[descrip]}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
