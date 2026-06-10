import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import type { MeetingFormData } from '../../types/meeting';
import type { Stage } from '../../types/stage';

interface MeetingFormProps {
  stages: Stage[];
  defaultValues?: Partial<MeetingFormData>;
  loading?: boolean;
  error?: string | null;
  submitLabel: string;
  onSubmit: (values: MeetingFormData) => void;
}

export const MeetingForm = ({
  stages,
  defaultValues,
  loading,
  error,
  submitLabel,
  onSubmit,
}: MeetingFormProps) => {
  const { control, handleSubmit } = useForm<MeetingFormData>({
    defaultValues: {
      meetingName: defaultValues?.meetingName ?? '',
      date: defaultValues?.date ?? '',
      stageId: defaultValues?.stageId ?? '',
    },
  });

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5}>
          {error && <Alert severity="error">{error}</Alert>}

          <Controller
            name="meetingName"
            control={control}
            rules={{ required: 'Meeting name is required' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Meeting Name"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="date"
            control={control}
            rules={{ required: 'Meeting date is required' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Date"
                type="datetime-local"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            )}
          />

          <Controller
            name="stageId"
            control={control}
            rules={{ required: 'Stage is required' }}
            render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <InputLabel id="meeting-stage-label">Stage</InputLabel>
                <Select {...field} labelId="meeting-stage-label" label="Stage">
                  {stages.map((stage) => (
                    <MenuItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Box display="flex" justifyContent="flex-end">
            <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={loading} disableElevation>
              {submitLabel}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};
