
import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ViewToggleProps {
  viewMode: 'grid' | 'table';
  setViewMode: (value: 'grid' | 'table') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode }) => {
  return (
    <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'table')} className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="grid" className="flex-1">
          <LayoutGrid className="h-4 w-4 mr-2" />
          Grid
        </TabsTrigger>
        <TabsTrigger value="table" className="flex-1">
          <List className="h-4 w-4 mr-2" />
          Table
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ViewToggle;
