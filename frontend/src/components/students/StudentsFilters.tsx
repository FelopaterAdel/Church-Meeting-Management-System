import { Box, IconButton, InputAdornment, MenuItem, TextField, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import type { StudentStatus } from '../../types/student';
import type { Stage } from '../../types/stage';

interface StudentsFiltersProps {
  search: string;
  stageId: string;
  status: StudentStatus | '';
  stages: Stage[];
  onSearchChange: (value: string) => void;
  onStageChange: (value: string) => void;
  onStatusChange: (value: StudentStatus | '') => void;
}

export const StudentsFilters = ({
  search,
  stageId,
  status,
  stages,
  onSearchChange,
  onStageChange,
  onStatusChange,
}: StudentsFiltersProps) => (
  <Box
    display="flex"
    flexWrap="wrap"
    gap={2}
    p={2.5}
    bgcolor="background.paper"
    borderRadius={2}
    border="1px solid"
    borderColor="divider"
    mb={3}
  >
    <TextField
      size="small"
      placeholder="Search by name, phone, code..."
      value={search}
      onChange={(event) => onSearchChange(event.target.value)}
      sx={{ minWidth: 240, flex: '1 1 240px' }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
        endAdornment: search ? (
          <InputAdornment position="end">
            <IconButton size="small" onClick={() => onSearchChange('')}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : undefined,
      }}
    />

    <TextField
      select
      size="small"
      label="Stage"
      value={stageId}
      onChange={(event) => onStageChange(event.target.value)}
      sx={{ minWidth: 180 }}
    >
      <MenuItem value="">All Stages</MenuItem>
      {stages.map((stage) => (
        <MenuItem key={stage.id} value={stage.id}>
          {stage.name}
        </MenuItem>
      ))}
    </TextField>

    <TextField
      select
      size="small"
      label="Status"
      value={status}
      onChange={(event) => onStatusChange(event.target.value as StudentStatus | '')}
      sx={{ minWidth: 140 }}
    >
      <MenuItem value="">All Statuses</MenuItem>
      <MenuItem value="ACTIVE">Active</MenuItem>
      <MenuItem value="INACTIVE">Inactive</MenuItem>
    </TextField>

    {(search || stageId || status) && (
      <Tooltip title="Clear all filters">
        <IconButton
          size="small"
          onClick={() => {
            onSearchChange('');
            onStageChange('');
            onStatusChange('');
          }}
          sx={{ alignSelf: 'center' }}
        >
          <ClearIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    )}
  </Box>
);
