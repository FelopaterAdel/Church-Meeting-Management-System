import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import type { StudentFormData, StudentStatus } from '../../types/student';
import type { Stage } from '../../types/stage';

interface StudentFormProps {
  defaultValues?: Partial<StudentFormData>;
  stages: Stage[];
  onSubmit: (data: StudentFormData) => void;
  isSubmitting: boolean;
  submitLabel?: string;
}

const DEFAULT: StudentFormData = {
  fullName: '',
  phoneNumber: '',
  confessionFather: '',
  address: '',
  latitude: null,
  longitude: null,
  stageId: '',
  status: 'ACTIVE',
};

export const StudentForm = ({
  defaultValues,
  stages,
  onSubmit,
  isSubmitting,
  submitLabel = 'Save Student',
}: StudentFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    defaultValues: { ...DEFAULT, ...defaultValues },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        <Box>
          <TextField
            label="Full Name"
            fullWidth
            required
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
            {...register('fullName', {
              required: 'Full name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
            })}
          />
        </Box>

      

        <Box>
          <TextField
            label="Phone Number"
            fullWidth
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
            {...register('phoneNumber', {
              pattern: {
                value: /^[0-9+\-\s()]{7,30}$/,
                message: 'Enter a valid phone number',
              },
            })}
          />
        </Box>

        <Box>
          <TextField
            label="Confession Father"
            fullWidth
            error={!!errors.confessionFather}
            helperText={errors.confessionFather?.message}
            
          />
        </Box>

        <Box>
          <Controller
            name="stageId"
            control={control}
            rules={{ required: 'Stage is required' }}
            render={({ field }) => (
              <TextField
                select
                label="Stage"
                fullWidth
                required
                error={!!errors.stageId}
                helperText={errors.stageId?.message}
                {...field}
              >
                {stages.map((stage) => (
                  <MenuItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>

        <Box sx={{ gridColumn: '1 / -1' }}>
          <TextField
            label="Address"
            fullWidth
            multiline
            minRows={2}
            error={!!errors.address}
            helperText={errors.address?.message}
           
          />
        </Box>

        <Box>
          <TextField
            label="Latitude"
            fullWidth
            type="number"
            inputProps={{ step: 'any' }}
            error={!!errors.latitude}
            helperText={errors.latitude?.message || 'Optional GPS coordinate'}
            {...register('latitude', {
              setValueAs: (value) => (value === '' ? null : parseFloat(value)),
              // validate: (value) =>
              //   value === null || (!Number.isNaN(value) && value >= -90 && value <= 90) || 'Must be between -90 and 90',
            })}
          />
        </Box>

        <Box>
          <TextField
            label="Longitude"
            fullWidth
            type="number"
            inputProps={{ step: 'any' }}
            error={!!errors.longitude}
            helperText={errors.longitude?.message || 'Optional GPS coordinate'}
            {...register('longitude', {
              setValueAs: (value) => (value === '' ? null : parseFloat(value)),
              // validate: (value) =>
              //   value === null ||
              //   (!Number.isNaN(value) && value >= -180 && value <= 180) ||
              //   'Must be between -180 and 180',
            })}
          />
        </Box>

        <Box sx={{ gridColumn: '1 / -1' }}>
          <Typography variant="body2" color="text.secondary" mb={1} fontWeight={500}>
            Status
          </Typography>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                exclusive
                value={field.value}
                onChange={(_, value: StudentStatus) => value && field.onChange(value)}
                size="small"
              >
                <ToggleButton value="ACTIVE" sx={{ px: 3 }}>
                  Active
                </ToggleButton>
                <ToggleButton value="INACTIVE" sx={{ px: 3 }}>
                  Inactive
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Box>

        <Box sx={{ gridColumn: '1 / -1' }}>
          <Box display="flex" justifyContent="flex-end" pt={1}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              disableElevation
              startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
              sx={{ minWidth: 160, borderRadius: 2 }}
            >
              {isSubmitting ? 'Saving...' : submitLabel}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
