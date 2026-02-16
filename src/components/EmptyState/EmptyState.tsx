import { Box, Typography } from '@mui/material';
import { InboxOutlined } from '@mui/icons-material';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  message?: string;
  icon?: ReactNode;
}

const EmptyState = ({
  message = 'Nenhum item encontrado.',
  icon,
}: EmptyStateProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      color: 'text.secondary',
    }}
  >
    {icon ?? <InboxOutlined sx={{ fontSize: 64, mb: 1, opacity: 0.4 }} />}
    <Typography variant="body1">{message}</Typography>
  </Box>
);

export default EmptyState;
