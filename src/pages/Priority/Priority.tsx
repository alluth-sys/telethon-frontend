import { useAppSelector } from "@/app/hooks";
import FriendList, {
  MessageProfile,
  wordsFilter,
} from "@/components/FriendList/FriendList";
import { Typography } from "@mui/material";
import ReactDOM from "react-dom";
import React from "react";
import {
  Draggable,
  DragDropContext,
  Droppable,
  type DroppableProvided,
  type DraggableProvided,
  type DraggableStateSnapshot,
  type DraggableRubric,
  type DropResult,
} from "react-beautiful-dnd";
import { FriendBlock } from "@/components/FriendList/FriendList";
import "./Priority.css";
import { Friend } from "@/states/user/userSlice";
import SimpleFriendBlock from "@/components/SimpleFriendBlock/SimpleFriendBlock";
import { dragResult, DroppableSnapShot, DraggableSnapShot } from "./types";
import { List } from "react-virtualized";
import ProfilePicture from "@/components/MessageBox/ProfilePicture";
import { timeHandler } from "@/components/MessageBox/MessageBox";

const getItemStyle = (isDragging: boolean,provided:DraggableProvided, style: object) => {
  console.log("in style : isdragging?" , isDragging)
  if(!style){
    return provided
  }
  return {
    userSelect: "none",

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",
    overflowWrap: "break-word",
    position: "relative",
    // styles we need to apply on draggables
    ...provided,
    ...style,
  };
};

// const move = (source, destination, droppableSource, droppableDestination) => {
//   const sourceClone = Array.from(source);
//   const destClone = Array.from(destination);
//   const [removed] = sourceClone.splice(droppableSource.index, 1);

//   destClone.splice(droppableDestination.index, 0, removed);

//   const result = {};
//   result[0] = sourceClone;
//   result[1] = destClone;

//   return result;
// };

const reorder = (list, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function priority() {
  const timeList = useAppSelector((state) => state.user.timeList);

  const [list, setList] = React.useState([]);
  const [priList, setPriList] = React.useState([]);

  React.useEffect(() => {
    setList(timeList);
    setPriList(timeList);
  }, [timeList]);

  const handleDrag = (result: dragResult) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    console.log(source.droppableId, destination.droppableId);

    if (
      destination.droppableId == "timeList" &&
      source.droppableId == "timeList"
    ) {
      const items = reorder(list, source.index, destination.index);
      const newState = items;
      console.log("timeList move : ", newState);
      setList(newState);
    }

    if (
      destination.droppableId == "priList" &&
      source.droppableId == "priList"
    ) {
      const items = reorder(list, source.index, destination.index);
      const newState = items;
      setPriList(newState);
    }
  };

  const Encapsulated = (props: any) => {
    const { value,isDragging, provided, style, index } = props;
    console.log("provided : " , provided)
    return (
      <div
        className="flex grow bg-slate-500  h-20 items-center navigate"
        index={index}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={getItemStyle(isDragging,provided.draggableProps.style, style)}
      >
        YI
      </div>
    )
  };

  // Using a higher order function so that we can look up the quotes data to retrieve
  // our quote from within the rowRender function
  const getRowRender =
    (list: Friend[]) =>
    ({ index, style }: any) => {
      const value: Friend = list[index];
      console.log("STYE: " , style)
      return (
        <Draggable
          draggableId={value.channel_id.toString()}
          index={index}
          key={value.channel_id}
        >
          {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <Encapsulated provided={provided} isDragging={snapshot.isDragging} value={value} style={style} index={index}/>
          )}
        </Draggable>
      );
    };

  return (
    <div className="flex grow justify-start">
      <DragDropContext
        onDragEnd={handleDrag}
        onDragStart={(e) => {
          console.log(e);
        }}
      >
        <div className="flex" style={{ width: "320px" }}>
          <Droppable droppableId="priList" key="priList">
            {(provided: DroppableProvided, snapshot: DroppableSnapShot) => {
              return (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {priList.map((item: Friend, index) => (
                    <Draggable
                      key={`${item.channel_id}_L`}
                      draggableId={item.channel_id.toString() + "_L"}
                      index={index}
                    >
                      {(
                        provided: DraggableProvided,
                        snapshot: DraggableSnapShot
                      ) => {
                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <SimpleFriendBlock Friend={item} />
                          </div>
                        );
                      }}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
        </div>

        <div className="bg-black h-full w-1"></div>
        <div className="flex" style={{ width: "320px" }}>
          <Droppable
            droppableId="timeList"
            key="timeList"
            mode="virtual"
            renderClone={(
              provided: DraggableProvided,
              snapshot: DraggableStateSnapshot,
              rubric: DraggableRubric
            ) => <Encapsulated provided={provided} isDragging={snapshot.isDragging} style={{margin:0}} index={rubric.source.index} Friend={null} />}
          >
            {(droppableProvided: DroppableProvided) => (
              <List
                height={window.screen.height}
                rowCount={timeList.length}
                rowHeight={110}
                width={300}
                className="container-snap"
                ref={(ref) => {
                  // react-virtualized has no way to get the list's ref that I can so
                  // So we use the `ReactDOM.findDOMNode(ref)` escape hatch to get the ref
                  if (ref) {
                    // eslint-disable-next-line react/no-find-dom-node
                    const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
                    if (whatHasMyLifeComeTo instanceof HTMLElement) {
                      droppableProvided.innerRef(whatHasMyLifeComeTo);
                    }
                  }
                }}
                rowRenderer={getRowRender(timeList)}
              />
            )}
          </Droppable>
        </div>
      </DragDropContext>

      <div className="grid grow">
        <div
          className="bg-black flex h-1/3 justify-center items-center "
          style={{ width: "100%" }}
        >
          <Typography
            style={{ color: "white", fontSize: 50 }}
            className="text-4xl"
          >
            Bulletin Board
          </Typography>
        </div>
      </div>
    </div>
  );
}
