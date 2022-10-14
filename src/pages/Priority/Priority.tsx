import { useAppDispatch, useAppSelector } from "@/app/hooks";
import FriendList, {
  MessageProfile,
  wordsFilter,
} from "@/components/FriendList/FriendList";
import { Typography } from "@mui/material";
import ReactDOM from "react-dom";
import React, { useCallback } from "react";
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
import "./Priority.css";
import {
  Friend,
  setUserShowContextMenu,
  updateFriendPriority,
} from "@/states/user/userSlice";
import SimpleFriendBlock from "@/components/SimpleFriendBlock/SimpleFriendBlock";
import { dragResult, DroppableSnapShot, DraggableSnapShot } from "./types";
import { List } from "react-virtualized";
import ListSubheader from "@mui/material/ListSubheader";
import MuiList from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import ProfilePicture from "@/components/MessageBox/ProfilePicture";
import { timeHandler } from "@/components/MessageBox/MessageBox";
import { BASE } from "@/constants/endpoints";
import axios from "axios";
import BulletinArea from "./BulletinArea/BulletinArea";

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

const reorder = (list: Friend[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function priority() {
  const friendList = useAppSelector((state) => state.user.friendList);
  const user_id = useAppSelector((state) => state.user.data?.id);
  const showContextMenu = useAppSelector((state) => state.user.showContextMenu);
  const dispatch = useAppDispatch();
  const [list, setList] = React.useState<[string, Friend][]>([]);
  const [level3List, setLevel3List] = React.useState<[string, Friend][]>([]);
  const [level2List, setLevel2List] = React.useState<[string, Friend][]>([]);
  const [level1List, setLevel1List] = React.useState<[string, Friend][]>([]);
  const [cacheName, setCacheName] = React.useState("");

  var nameMap = new Map();
  nameMap.set("friendList", list);
  nameMap.set("level3List", level3List);
  nameMap.set("level2List", level2List);
  nameMap.set("level1List", level1List);

  var funMap = new Map();
  funMap.set("friendList", setList);
  funMap.set("level3List", setLevel3List);
  funMap.set("level2List", setLevel2List);
  funMap.set("level1List", setLevel1List);

  var priMap = new Map();
  priMap.set("friendList", -1);
  priMap.set("level3List", 2);
  priMap.set("level2List", 1);
  priMap.set("level1List", 0);

  React.useEffect(() => {
    let tmplist = Object.entries(friendList);
    tmplist = tmplist.filter((ele) => ele[1].channel_id != 0);
    setList(tmplist.filter((ele) => ele[1].priority == -1));
    setLevel1List(tmplist.filter((ele) => ele[1].priority == 0));
    setLevel2List(tmplist.filter((ele) => ele[1].priority == 1));
    setLevel3List(tmplist.filter((ele) => ele[1].priority == 2));
  }, [friendList]);

  const handleDrag = (result: dragResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId == source.droppableId) {
      const items = reorder(
        nameMap.get(destination.droppableId),
        source.index,
        destination.index
      );
      const newState = items;
      funMap.get(destination.droppableId)(newState);
    } else {
      let channel_id = "";

      if (result.draggableId.toString().includes("_")) {
        channel_id = result.draggableId.toString().split("_")[0];
      } else {
        channel_id = result.draggableId.toString();
      }

      axios
        .post(`${BASE}/channel/priority/${user_id}`, {
          channel_id: channel_id,
          priority: priMap.get(destination.droppableId),
        })
        .then((response) => {
          dispatch(
            updateFriendPriority({
              channel_id: channel_id,
              priority: priMap.get(destination.droppableId),
            })
          );
        })
        .catch((e) => console.log(e));
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
              {wordsFilter(cacheName, 8)}
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
    (list: [string, Friend][]) =>
    ({ index, style }: any) => {
      const value: any = list[index];

      return (
        <Draggable
          draggableId={value[1].channel_id.toString()}
          index={index}
          key={value[1].channel_id}
        >
          {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
            <Encapsulated
              provided={provided}
              isDragging={snapshot.isDragging}
              value={value[1]}
              style={style}
              index={index}
            />
          )}
        </Draggable>
      );
    };

  const [level1open, setlevel1Open] = React.useState(true);
  const [level2open, setlevel2Open] = React.useState(true);
  const [level3open, setlevel3Open] = React.useState(true);
  const handlelevel3Click = () => {
    setlevel3Open(!level3open);
  };

  const handlelevel2Click = () => {
    setlevel2Open(!level2open);
  };

  const handlelevel1Click = () => {
    setlevel1Open(!level1open);
  };

  const handleClickOut = useCallback(() => {
    showContextMenu ? dispatch(setUserShowContextMenu(false)) : null;
  }, [showContextMenu]);

  return (
    <div
      className="flex grow justify-start"
      onClick={() => {
        handleClickOut();
      }}
    >
      <DragDropContext
        onDragEnd={handleDrag}
        onDragStart={(e: any) => {
          if (e!.source.droppableId == "friendList") {
            setCacheName(list[e!.source.index][1].username);
          }
        }}
      >
        <div className="flex" style={{ width: "320px" }}>
          <MuiList
            sx={{ bgcolor: "background.paper" }}
            className="w-full"
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <ListItemButton onClick={handlelevel3Click}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Rank 3" />
              {level3open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={level3open} timeout="auto" unmountOnExit>
              <Droppable droppableId="level3List" key="level3List">
                {(provided: DroppableProvided, snapshot: DroppableSnapShot) => {
                  return (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {level3List.map((item: any, index) => (
                        <Draggable
                          key={`${item[1].channel_id}_level_3`}
                          draggableId={
                            item[1].channel_id.toString() + "_level_3"
                          }
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
                                <SimpleFriendBlock Friend={item[1]} />
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
            </Collapse>
            <ListItemButton onClick={handlelevel2Click}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Rank 2" />
              {level2open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={level2open} timeout="auto" unmountOnExit>
              <Droppable droppableId="level2List" key="level2List">
                {(provided: DroppableProvided, snapshot: DroppableSnapShot) => {
                  return (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {level2List.map((item: any, index) => (
                        <Draggable
                          key={`${item[1].channel_id}_level_2`}
                          draggableId={
                            item[1].channel_id.toString() + "_level_2"
                          }
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
                                <SimpleFriendBlock Friend={item[1]} />
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
            </Collapse>
            <ListItemButton onClick={handlelevel1Click}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Rank 1" />
              {level1open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={level1open} timeout="auto" unmountOnExit>
              <Droppable droppableId="level1List" key="level1List">
                {(provided: DroppableProvided, snapshot: DroppableSnapShot) => {
                  return (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {level1List.map((item: any, index) => (
                        <Draggable
                          key={`${item[1].channel_id}_level_1`}
                          draggableId={
                            item[1].channel_id.toString() + "_level_1"
                          }
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
                                <SimpleFriendBlock Friend={item[1]} />
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
            </Collapse>
          </MuiList>
        </div>

        <div className="bg-black h-full w-1"></div>
        <div className="flex" style={{ width: "320px" }}>
          <Droppable
            droppableId="friendList"
            key="friendList"
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
          className="bg-black flex justify-center items-center "
          style={{ width: "100%", height: "33vh" }}
        >
          <Typography
            style={{ color: "white", fontSize: 50 }}
            className="text-4xl"
          >
            Bulletin Board
          </Typography>
        </div>
        <div
          className="flex flex-col  grow w-full pt-5"
          style={{ height: "67vh", position: "static" }}
          id="BulletingAreaWrapper"
        >
          <BulletinArea />
        </div>
      </div>
    </div>
  );
}
