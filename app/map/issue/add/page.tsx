"use client";
import OverlayPage from "@/components/OverlayPage/OverlayPage";
import {
  Button,
  Fab,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Done, LocationOn } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { LocationTypes } from "@/constants/LocationTypes";
import UploadGallery from "@/components/UploadGallery/UploadGallery";
import {
  LocationPickerCoords,
  LocationPickerEnabled,
} from "@/constants/LocationPicker";
import { useAtom, useAtomValue } from "jotai";
import "./page.css";
import { IssueTypes } from "@/constants/IssueTypes";
import { useSession } from "next-auth/react";
import { enqueueSnackbar } from "notistack";

export default function AddIssuePage() {
  const [pickerEnabled, setPickerEnabled] = useAtom(LocationPickerEnabled);
  const pickerCoords = useAtomValue(LocationPickerCoords);
  const [formDisabled, setFormDisabled] = useState(false);
  const [locType, setLocType] = useState("");
  const [issueCategory, setIssueCategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [moreDetails, setMoreDetails] = useState("");
  const [priority, setPriority] = useState("medium");
  const [photoFileList, setPhotoFileList] = useState<File[]>();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") {
      setFormDisabled(true);
    }
  }, [status]);

  const submitIssue = () => {
    const requestBody = {
      userId: session?.user.id,
      category: issueCategory,
      locationType: locType,
      latitude: pickerCoords.lat,
      longitude: pickerCoords.lng,
      shortDescription: shortDescription,
      moreDetails: moreDetails,
      priority: priority,
      photos: photoFileList,
    };

    setFormDisabled(true);
    fetch("/api/issue/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        enqueueSnackbar("Submission was successful!");
        setFormDisabled(false);
      })
      .catch((error) => {
        console.log(error);
        enqueueSnackbar("An error occurred!");
        setFormDisabled(false);
      });
  };

  return (
    <OverlayPage
      className={"add-issue-page " + (pickerEnabled ? "picking-location" : "")}
      closeButton={!pickerEnabled}
    >
      <div className="done-picking-button">
        <Fab
          variant="extended"
          color="secondary"
          size="medium"
          onClick={() => setPickerEnabled(false)}
        >
          <Done sx={{ mr: 1 }} />
          Pick location
        </Fab>
      </div>
      <Stack className="form-controls" gap={2}>
        <Typography variant="h5">Add issue</Typography>

        <TextField
          label="Location"
          color="secondary"
          variant="standard"
          value={pickerCoords.lat + ", " + pickerCoords.lng}
          required
          disabled={formDisabled}
          fullWidth
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <LocationOn />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  color="secondary"
                  onClick={() => setPickerEnabled(true)}
                  disabled={formDisabled}
                >
                  Pick on map
                </Button>
              </InputAdornment>
            ),
          }}
        />

        <FormControl
          fullWidth
          variant="standard"
          color="secondary"
          required
          disabled={formDisabled}
        >
          <InputLabel id="location-type-label">Location Type</InputLabel>
          <Select
            labelId="location-type-label"
            id="location-type"
            value={locType}
            label="Location Type"
            color="secondary"
            variant="standard"
            required
            onChange={(event: SelectChangeEvent) => {
              setLocType(event.target.value as string);
            }}
          >
            {LocationTypes.map(({ key, name, icon }) => (
              <MenuItem key={key} value={key}>
                <Stack gap={0.75} direction="row">
                  {icon}
                  {name}
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Short description"
          color="secondary"
          variant="standard"
          fullWidth
          required
          disabled={formDisabled}
          value={shortDescription}
          onChange={(event) => setShortDescription(event.target.value)}
        />

        <FormControl
          fullWidth
          variant="standard"
          color="secondary"
          required
          disabled={formDisabled}
        >
          <InputLabel id="issue-type-label">Issue Category</InputLabel>
          <Select
            labelId="issue-type-label"
            id="issue-type"
            value={issueCategory}
            label="Issue Category"
            color="secondary"
            variant="standard"
            required
            onChange={(event: SelectChangeEvent) => {
              setIssueCategory(event.target.value as string);
            }}
          >
            {IssueTypes.map(({ key, name, icon }) => (
              <MenuItem key={key} value={key}>
                <Stack gap={0.75} direction="row">
                  {icon}
                  {name}
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div>
          <div
            style={{
              fontSize: "12px",
              color: "rgba(0,0,0,0.6)",
              marginBottom: "3px",
            }}
          >
            Priority
          </div>
          <ToggleButtonGroup
            value={priority}
            exclusive
            onChange={(
              event: React.MouseEvent<HTMLElement>,
              newPriority: string
            ) => {
              setPriority(newPriority);
            }}
            size="small"
            fullWidth
            color="secondary"
            disabled={formDisabled}
            aria-label="priority"
          >
            <ToggleButton value="low" aria-label="low priority">
              Low
            </ToggleButton>
            <ToggleButton value="medium" aria-label="medium priority">
              Medium
            </ToggleButton>
            <ToggleButton value="high" aria-label="high priority">
              High
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <UploadGallery
          disabled={formDisabled}
          onFileListChange={(files) => {
            setPhotoFileList(files);
            console.log(files);
          }}
        />

        <TextField
          label="More details"
          color="secondary"
          variant="standard"
          value={moreDetails}
          onChange={(event) => setMoreDetails(event.target.value)}
          fullWidth
          multiline
          disabled={formDisabled}
        />

        <Button
          variant="contained"
          color="secondary"
          onClick={submitIssue}
          disabled={formDisabled}
        >
          Submit
        </Button>
      </Stack>
    </OverlayPage>
  );
}
