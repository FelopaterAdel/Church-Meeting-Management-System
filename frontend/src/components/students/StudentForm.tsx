import {
  Box,
  Button,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import type { StudentFormData, StudentStatus } from '../../types/student';
import { STAGES } from '../../types/student';

interface StudentFormProps {
  defaultValues?: Partial<StudentFormData>;
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
  stage: '',
  status: 'ACTIVE',
};

export const StudentForm = ({
  defaultValues,
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
        {/* Full Name */}
        <Box>
          <TextField
            label="Full Name"
            fullWidth
            required
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
            {...register('fullName', {
              required: 'Full name is required',
              minLength: { value: 3, message: 'Name must be at least 3 characters' },
            })}
          />
        </Box>

        {/* Phone Number */}
        <Box>
          <TextField
            label="Phone Number"
            fullWidth
            required
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
            {...register('phoneNumber', {
              required: 'Phone number is required',
              pattern: {
                value: /^[0-9+\-\s()]{7,20}$/,
                message: 'Enter a valid phone number',
              },
            })}
          />
        </Box>

        {/* Confession Father */}
        <Box>
          <TextField
            label="Confession Father"
            fullWidth
            required
            error={!!errors.confessionFather}
            helperText={errors.confessionFather?.message}
            {...register('confessionFather', {
              required: 'Confession father is required',
            })}
          />
        </Box>

        {/* Stage */}
        <Box>
          <Controller
            name="stage"
            control={control}
            rules={{ required: 'Stage is required' }}
            render={({ field }) => (
              <TextField
                select
                label="Stage"
                fullWidth
                required
                error={!!errors.stage}
                helperText={errors.stage?.message}
                {...field}
              >
                {STAGES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>

        {/* Address */}
        <Box sx={{ gridColumn: '1 / -1' }}>
          <TextField
            label="Address"
            fullWidth
            multiline
            minRows={2}
            error={!!errors.address}
            helperText={errors.address?.message}
            {...register('address')}
          />
        </Box>

        {/* Coordinates */}
        <Box>
          <TextField
            label="Latitude"
            fullWidth
            type="number"
            inputProps={{ step: 'any' }}
            error={!!errors.latitude}
            helperText={errors.latitude?.message || 'Optional — GPS coordinate'}
            {...register('latitude', {
              setValueAs: (v) => (v === '' ? null : parseFloat(v)),
              validate: (v) =>
                v === null || (!isNaN(v) && v >= -90 && v <= 90) || 'Must be between -90 and 90',
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
            helperText={errors.longitude?.message || 'Optional — GPS coordinate'}
            {...register('longitude', {
              setValueAs: (v) => (v === '' ? null : parseFloat(v)),
              validate: (v) =>
                v === null || (!isNaN(v) && v >= -180 && v <= 180) || 'Must be between -180 and 180',
            })}
          />
        </Box>

        {/* Status */}
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
                onChange={(_, v: StudentStatus) => v && field.onChange(v)}
                size="small"
              >
                <ToggleButton
                  value="ACTIVE"
                  sx={{
                    px: 3,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(46,196,134,0.12)',
                      color: '#1a9e6a',
                      borderColor: 'rgba(46,196,134,0.3)',
                      '&:hover': { bgcolor: 'rgba(46,196,134,0.18)' },
                    },
                  }}
                >
                  Active
                </ToggleButton>
                <ToggleButton
                  value="INACTIVE"
                  sx={{
                    px: 3,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(180,180,180,0.15)',
                      color: '#555',
                      borderColor: 'rgba(180,180,180,0.3)',
                    },
                  }}
                >
                  Inactive
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Box>

        {/* Submit */}
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
              {isSubmitting ? 'Saving…' : submitLabel}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
