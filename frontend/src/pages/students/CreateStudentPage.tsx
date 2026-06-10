import { useNavigate } from 'react-router-dom';
import { Box, Paper, Alert } from '@mui/material';
import { useCreateStudent } from '../../hooks/useStudents';
import { StudentForm } from '../../components/students/StudentForm';
import { PageHeader } from '../../components/common/PageHeader';
import type { StudentFormData } from '../../types/student';

export default function CreateStudentPage() {
  const navigate = useNavigate();
  const mutation = useCreateStudent();

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
        <StudentForm
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          submitLabel="Create Student"
        />
      </Paper>
    </Box>
  );
}
