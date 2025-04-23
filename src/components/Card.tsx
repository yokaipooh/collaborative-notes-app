import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  CardContent,
  IconButton,
  Card as MuiCard,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  id,
  title,
  content,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <MuiCard
      sx={{
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#ffffff",
        ":hover": {
          boxShadow: 6,
        },
        transition: "box-shadow 0.3s ease",
      }}
    >
      <CardContent>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", color: "#333" }}
          >
            {title}
          </Typography>
          <Box gap={2}>
            <IconButton
              size="small"
              color="secondary"
              sx={{ marginRight: 1 }}
              onClick={() => navigate(`/edit/${id}`)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => onDelete(id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          component="div"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            WebkitLineClamp: 1,
            marginTop: 1,
            color: "#555",
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </CardContent>
    </MuiCard>
  );
};

export default memo(NoteCard);
