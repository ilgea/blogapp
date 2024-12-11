import { Avatar, CardActions, CardHeader } from "@mui/material";
import moment from "moment";
import "moment/locale/tr";
import placeholder from "../assets/userholder.png";

const CardPostedActions = ({ blog }) => {
  const { author, published_date, updated_date, authorUrl } = blog;

  return (
    <CardActions sx={{ padding: 0 }}>
      <CardHeader
        sx={{ padding: 1, backgroundColor: "" }}
        avatar={
          <Avatar alt="user avatar" src={authorUrl || placeholder} />
        }
        titleTypographyProps={{ fontWeight: "700" }}
        title={author}
        subheaderTypographyProps={{ fontSize: ".75rem" }}
        subheader={
          updated_date
            ? `Son güncelleme: ${moment(updated_date).diff(moment(), "minutes") * -1 >= 1 ? moment(updated_date).fromNow().replace("önce", "") : "Şimdi"}`
            : `Oluşturulma: ${moment(published_date).diff(moment(), "minutes") * -1 >= 1 ? moment(published_date).fromNow().replace("önce", "") : "Şimdi"}`
        }
      />
    </CardActions>
  );
};

export default CardPostedActions;
