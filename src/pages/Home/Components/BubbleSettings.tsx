import React from "react";
import IconButton from "@mui/material/IconButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";

import useFriendList from "../Hooks/useFriendList";
import { useAppSelector } from "@/app/hooks";
import { useAppDispatch } from "@/app/hooks";
import { RootState } from "@/app/store";
import { setFilterShowRank } from "@/states/user/userSlice";

export default function BubbleSettings() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const filterShowRank = useAppSelector(
    (state: RootState) => state.user.filterShowRank
  );
  const dispatch = useAppDispatch();

  const [showRank, setShowRank] = React.useState(filterShowRank);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const { friendData } = useFriendList();

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
      <div className="contact-tooltip group-hover:scale-100">Filter</div>
      <IconButton sx={{ color: "white" }} onClick={handleClick}>
        <FilterAltIcon fontSize="large" />
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
          <Box width={150} sx={{ p: 2, mt: 1, mx: 1, mb: 1 }}>
            <FormControl>
              <FormLabel id="rank-radio-buttons-group-label">Show:</FormLabel>
              <RadioGroup
                aria-labelledby="rank-radio-buttons-group-label"
                defaultValue="All"
                name="radio-buttons-group"
                onChange={(event) => {
                  setShowRank(event.target.value);
                }}
                value={showRank}
              >
                <FormControlLabel value="All" control={<Radio />} label="All" />
                <FormControlLabel
                  value="Rank3"
                  control={<Radio />}
                  label="Rank 3"
                />
                <FormControlLabel
                  value="Rank2"
                  control={<Radio />}
                  label="Rank 2"
                />
                <FormControlLabel
                  value="Rank1"
                  control={<Radio />}
                  label="Rank 1"
                />
              </RadioGroup>
            </FormControl>
            <div className="w-full flex justify-end">
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => {
                  dispatch(setFilterShowRank({ rank: showRank }));
                }}
              >
                Apply
              </Button>
            </div>
          </Box>
        </Popover>
      </div>
    </div>
  );
}
