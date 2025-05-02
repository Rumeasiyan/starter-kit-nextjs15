import type { Item } from '@/configs/types/item';

export interface SearchAndMultiSelectProps {
  items: Item[];
  selectedItems: Item[];
  onSelect: (items: Item[]) => void;
  onSearch?: (query: string) => Promise<Item[]>;
  placeholder?: string;
  className?: string;
  isSelectedItemsVisible?: boolean;
  selectedItemsVariant?: 'chip' | 'badge';
  overflowHandle?: 'scroll' | 'wrap';
  handleRemoveItem?: (item: Item) => void;
}
