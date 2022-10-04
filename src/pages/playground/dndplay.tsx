import { Button, Divider, Typography } from "@mui/material";
import React from "react";
import { Draggable, DragDropContext } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material";
import { bgcolor, display } from "@mui/system";
import { content } from "googleapis/build/src/apis/content";

const Container = styled("div")({
  width: "200px",
  textAlign: "center",
  borderWidth: "1px",
  borderColor: "black",
});

const DragPlace = styled("div")({
  width: "220px",
  backgroundColor: "#b1f2ff",
  display: "grid",
  justifyContent: "center",
  textAlign: "center",
});

const getItems = (count: number, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `item ${k + offset}`,
  }));

export default function Drag() {
  const [dumArr, setDumArr] = React.useState([1, 2, 3, 4, 5, 6]);
  const [priArr, setPriArr] = React.useState(getItems(6, 15));
  const [testList, setTestList] = React.useState(getItems(10));

  const handleonAdd = () => {
    setDumArr((prev) => {
      return [...prev, prev[prev.length - 1] + 1];
    });
  };

  const grid = 8;

  const getItemStyle = (isDragging: boolean, draggableStyle) => {
    return {
      userSelect: "none",
      padding: grid * 2,
      margin: `0 0 ${grid}px 0`,

      // change background colour if dragging
      background: isDragging ? "lightgreen" : "grey",

      // styles we need to apply on draggables
      ...draggableStyle,
    };
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  type dragNode = { index: number; droppableId: string };
  type dragResult = {
    draggableId: number;
    type: string;
    source: dragNode;
    reason: string;
    mode: string;
    combine: boolean | null;
    destination: dragNode;
  };

  function handleDrag(result: dragResult) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = source.droppableId;
    const dInd = destination.droppableId;

    if (sInd === dInd) {
      console.log(sInd, sInd == "friendList");
      if (sInd == "priList") {
        const items = reorder(priArr, source.index, destination.index);
        const newState = items;
        console.log(newState);
        setPriArr(newState);
      } else if (sInd == "friendList") {
        const items = reorder(dumArr, source.index, destination.index);
        const newState = items;
        console.log(newState);
        setDumArr(newState);
      } else {
        const items = reorder(testList, source.index, destination.index);
        const newState = items;
        console.log(newState);
        setTestList(newState);
      }
    }
  }

  return (
    <div
      className=" flex "
      style={{
        width: "70vw",
        paddingLeft: "10vw",
      }}
    >
      <DragDropContext draggbleId="draggable" index="1" onDragEnd={handleDrag}>
        <DragPlace>
          SET LIST
          <Button onClick={handleonAdd}>Add number</Button>
          <Droppable droppableId="priList" key="priList">
            {(provided, snapshot) => {
              console.log("innerRef : ", provided.innerRef);
              return (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {priArr.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
        </DragPlace>
        <DragPlace>
          FRIEND SET
          <Button onClick={handleonAdd}>Add number</Button>
          <Droppable droppableId="friendList" key="friendList">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {dumArr.map((ele) => (
                  <Draggable
                    key={ele + 10}
                    draggableId={(ele + 10).toString()}
                    index={ele}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        {ele}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragPlace>
        <DragPlace>
          <Droppable key="testList" droppableId="testList">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {testList.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          {item.content}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragPlace>
      </DragDropContext>
    </div>
  );
}
