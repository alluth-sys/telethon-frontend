export type dragNode = { index: number; droppableId: string };
export type dragResult = {
  draggableId: number;
  type: string;
  source: dragNode;
  reason: string;
  mode: string;
  combine: boolean | null;
  destination: dragNode;
};

export type DroppableProps = {
  data_rbd_droppable_context_id: string;
  data_rbd_droppable_id: string;
};
export type DroppableProvided = {
  droppableProps: DroppableProps;
  innerRef: LegacyRef<HTMLDivElement> | undefined;
  placeholder: object;
};

export type DroppableSnapShot = {
  draggingFromThisWith: null | string;
  draggingOverWith: null | string;
  isDraggingOver: boolean;
  isUsingPlaceholder: boolean;
};

export type DragHandleProps = {
  aria_describedby: string;
  data_rbd_drag_handle_context_id: string;
  data_rbd_drag_handle_draggable_id: string;
  draggable: boolean;
  onDragStart: any;
  role: string;
  tabIndex: number;
};

export type DraggableProvided = {
  dragHandleProps: DragHandleProps;
  draggableProps: object;
  innerRef: any;
};

export type DraggableSnapShot = {
  combineTargetFor: null | string;
  combineWith: null | string;
  draggingOver: null | string;
  dropAnimation: null | string;
  isClone: boolean;
  isDragging: boolean;
  isDropAnimating: boolean;
  mode: null | string;
};
