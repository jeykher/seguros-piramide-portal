import React,{useEffect,useState} from 'react';
import Axios from 'axios'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function AutocompleteControl(props) {
  const { api, cursor, name, label, helperText, isOpen } = props
  const [open, setOpen] = useState(isOpen);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const response = await Axios.post(api);
      const jsonCursor = response.data[cursor]
      if (active) {
        setOptions(jsonCursor);

      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  return (
    <Autocomplete
      id={`id_${name}`}
      open={open}
      onOpen={() => {setOpen(true);}}
      onClose={() => {setOpen(false);}}
      getOptionSelected={(option, value) => option.NAME === value.NAME}
      getOptionLabel={option => option.NAME}
      options={options}
      loading={loading}
      onChange={props.onChange}
      onInputChange={props.onInputChange}
      loadingText="Cargando"
      clearOnEscape
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          fullWidth
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            name: props.name,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
