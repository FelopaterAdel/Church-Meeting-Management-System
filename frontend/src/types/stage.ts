export interface Stage {
  id: string;
  name: 'First Stage' | 'Second Stage' | 'Third Stage';
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
