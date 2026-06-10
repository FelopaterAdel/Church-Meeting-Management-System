import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import ClearIcon from '@mui/icons-material/Clear';
import { STAGES } from '../../types/student';
import type { StudentStatus } from '../../types/student';

interface StudentsFiltersProps {
  search: string;
  phoneSearch: string;
  stage: string;
  status: StudentStatus | '';
  onSearchChange: (v: string) => void;
  onPhoneSearchChange: (v: string) => void;
  onStageChange: (v: string) => void;
  onStatusChange: (v: StudentStatus | '') => void;
}

export const StudentsFilters = ({
  search,
  phoneSearch,
  stage,
  status,
  onSearchChange,
  onPhoneSearchChange,
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
    {/* Name Search */}
    <TextField
      size="small"
      placeholder="Search by name…"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      sx={{ minWidth: 200, flex: '1 1 200px' }}
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

    {/* Phone Search */}
    <TextField
      size="small"
      placeholder="Search by phone…"
      value={phoneSearch}
      onChange={(e) => onPhoneSearchChange(e.target.value)}
      sx={{ minWidth: 200, flex: '1 1 200px' }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PhoneIcon fontSize="small" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
        endAdornment: phoneSearch ? (
          <InputAdornment position="end">
            <IconButton size="small" onClick={() => onPhoneSearchChange('')}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : undefined,
      }}
    />

    {/* Stage Filter */}
    <TextField
      select
      size="small"
      label="Stage"
      value={stage}
      onChange={(e) => onStageChange(e.target.value)}
      sx={{ minWidth: 160 }}
    >
      <MenuItem value="">All Stages</MenuItem>
      {STAGES.map((s) => (
        <MenuItem key={s} value={s}>
          {s}
        </MenuItem>
      ))}
    </TextField>

    {/* Status Filter */}
    <TextField
      select
      size="small"
      label="Status"
      value={status}
      onChange={(e) => onStatusChange(e.target.value as StudentStatus | '')}
      sx={{ minWidth: 130 }}
    >
      <MenuItem value="">All Status</MenuItem>
      <MenuItem value="ACTIVE">Active</MenuItem>
      <MenuItem value="INACTIVE">Inactive</MenuItem>
    </TextField>

    {/* Clear All */}
    {(search || phoneSearch || stage || status) && (
      <Tooltip title="Clear all filters">
        <IconButton
          size="small"
          onClick={() => {
            onSearchChange('');
            onPhoneSearchChange('');
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
