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

const getItemStyle = (
  isDragging: boolean,
  provided: DraggableProvided,
  style: object
) => {
  if (!style) {
    return provided;
  }
  return {
    userSelect: "none",

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",
    overflowWrap: "break-word",
    position: "relative",
    width: "320px",
    // styles we need to apply on draggables
    ...provided,
    ...style,
  };
};

const move = (
  src: Friend[],
  des: Friend[],
  startIndex: number,
  endIndex: number
) => {
  const result_src = Array.from(src);
  const result_des = Array.from(des);
  const [removed] = result_src.splice(startIndex, 1);
  result_des.splice(endIndex, 0, removed);
  const res = [result_src, result_des];
  return res;
};

const reorder = (list: Friend[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function priority() {
  const timeList = useAppSelector((state) => state.user.timeList);

  const [list, setList] = React.useState([]);
  const [priList, setPriList] = React.useState([]);
  const [cacheName, setCacheName] = React.useState("");

  React.useEffect(() => {
    setList(timeList);
  }, [timeList]);

  const handleDrag = (result: dragResult) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    console.log(result);

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
      source.droppableId == "timeList" &&
      destination.droppableId == "priList"
    ) {
      const res = move(list, priList, source.index, destination.index);
      const newList = res[0];
      const newPri = res[1];
      setList(newList);
      setPriList(newPri);
    }

    if (
      destination.droppableId == "priList" &&
      source.droppableId == "priList"
    ) {
      const items = reorder(priList, source.index, destination.index);
      const newState = items;
      setPriList(newState);
    }
  };

  const Encapsulated = (props: any) => {
    const { value, isDragging, provided, style, index } = props;
    if (value?.channel_id === undefined || value.channel_id === null) {
      return (
        <div
          className="flex grow bg-slate-500  h-20 items-center navigate"
          index={index}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(isDragging, provided.draggableProps.style, style)}
        >
          <div style={{ padding: "0px 5px" }}>
            <ProfilePicture
              uid={cacheName}
              imgSrc={`data:image/jpeg;base64,${null}`}
              width={64}
              height={64}
            />
          </div>
          <div className="grid ml-4 grow " style={{ height: "60px" }}>
            <div style={{ height: "20px", minHeight: "20px" }}>
              {wordsFilter("", 8)}
            </div>

            <div
              className="flex "
              style={{
                overflowWrap: "break-word",
                whiteSpace: "nowrap",
                height: "20px",
                minHeight: "20px",
              }}
            ></div>
          </div>
          <div
            className="w-fit"
            style={{
              position: "absolute",
              right: "3px",
              top: "11px",
              borderRadius: "20px",
            }}
          >
            <Typography
              className="px-2"
              style={{
                color: "black",
                minWidth: "20px",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            ></Typography>
          </div>
        </div>
      );
    }
    return (
      <div
        className="flex grow bg-slate-500  h-20 items-center navigate"
        index={index}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={getItemStyle(isDragging, provided.draggableProps.style, style)}
      >
        <div style={{ padding: "0px 5px" }}>
          <ProfilePicture
            uid={value!.username}
            imgSrc={`data:image/jpeg;base64,${value!.profile_b64}`}
            width={64}
            height={64}
          />
        </div>
        <div className="grid ml-4 grow " style={{ height: "60px" }}>
          <div style={{ height: "20px", minHeight: "20px" }}>
            {wordsFilter(value.username, 8)}
          </div>

          <div
            className="flex "
            style={{
              overflowWrap: "break-word",
              whiteSpace: "nowrap",
              height: "20px",
              minHeight: "20px",
            }}
          >
            <MessageProfile {...value!.last_message!} />
          </div>
        </div>
        <div
          className="w-fit"
          style={{
            position: "absolute",
            right: "3px",
            top: "11px",
            borderRadius: "20px",
          }}
        >
          <Typography
            className="px-2"
            style={{
              color: "black",
              minWidth: "20px",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            {timeHandler(value!.last_message?.timestamp)}
          </Typography>
        </div>
        {value!.unread_count != 0 && (
          <div
            className="w-fit"
            style={{
              position: "absolute",
              right: "7px",
              top: "40px",
              backgroundColor: "green",
              borderRadius: "20px",
              textAlign: "center",
            }}
          >
            <Typography
              className="px-2"
              style={{ color: "white", minWidth: "43px" }}
            >
              {value!.unread_count > 99 ? "99+" : value!.unread_count}
            </Typography>
          </div>
        )}
      </div>
    );
  };

  // Using a higher order function so that we can look up the quotes data to retrieve
  // our quote from within the rowRender function
  const getRowRender =
    (list: Friend[]) =>
    ({ index, style }: any) => {
      const value: Friend = list[index];
      return (
        <Draggable
          draggableId={value.channel_id.toString()}
          index={index}
          key={value.channel_id}
        >
          {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
            <Encapsulated
              provided={provided}
              isDragging={snapshot.isDragging}
              value={value}
              style={style}
              index={index}
            />
          )}
        </Draggable>
      );
    };

  return (
    <div className="flex grow justify-start">
      <DragDropContext
        onDragEnd={handleDrag}
        onDragStart={(e: any) => {
          if (e!.source.droppableId == "timeList") {
            setCacheName(list[e!.source.index].username);
          }
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
                              null,
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
            ) => (
              <Encapsulated
                provided={provided}
                isDragging={snapshot.isDragging}
                style={{ margin: 0 }}
                index={rubric.source.index}
                Friend={null}
              />
            )}
          >
            {(droppableProvided: DroppableProvided) => (
              <List
                height={window.innerHeight - 1}
                rowCount={list.length}
                rowHeight={80}
                width={320}
                className="container-snap"
                ref={(ref: any) => {
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
                rowRenderer={getRowRender(list)}
                data={Math.random()}
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
