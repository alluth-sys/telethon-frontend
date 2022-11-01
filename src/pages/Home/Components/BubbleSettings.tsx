import React from "react";
import IconButton from "@mui/material/IconButton";
import ReorderIcon from "@mui/icons-material/Reorder";
import Popover from "@mui/material/Popover";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import useFriendList from "../Hooks/useFriendList";

export default function BubbleSettings() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [bubbleNums, setBubbleNums] = React.useState<number | number[]>();

  const { friendData } = useFriendList();

  const handleSliderChange = (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => {
    setBubbleNums(value);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!friendData) return null;

  return (
    <div
      className="absolute top-20 right-10 bg-gray-800 rounded-2xl hover:bg-blue-500 transition-all duration-200 ease-linear
        cursor-pointer shadow-lg sidebar-icon group"
    >
      <div className="contact-tooltip group-hover:scale-100">
        Quick Settings
      </div>
      <IconButton sx={{ color: "white" }} onClick={handleClick}>
        <ReorderIcon fontSize="large" />
      </IconButton>
      <div className="w-fit">
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Box width={300} sx={{ p: 2, mt: 1, mx: 1 }}>
            <Typography>Max Bubbles</Typography>
            <Slider
              defaultValue={1}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={10}
              value={bubbleNums}
              onChange={handleSliderChange}
            />
          </Box>
        </Popover>
      </div>
    </div>
  );
}
