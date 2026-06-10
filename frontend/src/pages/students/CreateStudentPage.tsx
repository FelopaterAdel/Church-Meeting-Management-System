import { useNavigate } from 'react-router-dom';
import { Alert, Box, Paper } from '@mui/material';
import { useCreateStudent } from '../../hooks/useStudents';
import { useStages } from '../../hooks/useStages';
import { StudentForm } from '../../components/students/StudentForm';
import { PageHeader } from '../../components/common/PageHeader';
import { LoadingState, ErrorState } from '../../components/common/StateViews';
import type { StudentFormData } from '../../types/student';

export default function CreateStudentPage() {
  const navigate = useNavigate();
  const mutation = useCreateStudent();
  const { data: stages = [], isLoading, isError, refetch } = useStages();

  const handleSubmit = async (data: StudentFormData) => {
    const student = await mutation.mutateAsync(data);
    navigate(`/students/${student.id}`, { replace: true });
  };

  return (
    <Box>
      <PageHeader
        title="Add Student"
        subtitle="Register a new student in the church system"
        breadcrumbs={[
          { label: 'Students', to: '/students' },
          { label: 'Add Student' },
        ]}
      />

      {mutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {(mutation.error as Error)?.message || 'Failed to create student. Please try again.'}
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        {isLoading ? (
          <LoadingState message="Loading stages..." />
        ) : isError ? (
          <ErrorState message="Failed to load stages." onRetry={refetch} />
        ) : (
          <StudentForm
            stages={stages}
            onSubmit={handleSubmit}
            isSubmitting={mutation.isPending}
            submitLabel="Create Student"
          />
        )}
      </Paper>
    </Box>
  );
}
