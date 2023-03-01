import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import useHeaderFooter from "./Hooks/useHeader.jsx";
import "./Header.scss";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;
const navItems = ["Home"];
const Header = (props) => {
  const isVisibleHeader = useHeaderFooter();
  const navigate = useNavigate();

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleRoute = (getVal) => {
    if (getVal === "Home") {
      navigate("/");
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <div className="d-flex h-100 justify-content-center">
          <h3 className="m-0">G S T</h3>
          <h3 className="m-0 ml-2 text-danger"> I N </h3>
        </div>
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              onClick={() => handleRoute(item)}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;
  return (
    <>
      {isVisibleHeader ? (
        // <div className='header-container'>
        //     <div className='d-flex h-100 align-items-center'>
        //         <h3 className='m-0'>G S T</h3><h3 className='m-0 ml-2 text-danger'> I N </h3>
        //     </div>
        // </div>
        <>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar component="nav">
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: "none" } }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
                >
                  <div className="d-flex h-100 align-items-center">
                    <h3 className="m-0">G S T</h3>
                    <h3 className="m-0 ml-2 text-danger"> I N </h3>
                  </div>
                </Typography>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  {navItems.map((item) => (
                    <Button
                      key={item}
                      sx={{ color: "#fff" }}
                      onClick={(event) => {
                        handleRoute(item);
                      }}
                    >
                      {item}
                    </Button>
                  ))}
                </Box>
              </Toolbar>
            </AppBar>
            <Box component="nav">
              <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true // Better open performance on mobile.
                }}
                sx={{
                  display: { xs: "block", sm: "none" },
                  "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: drawerWidth
                  }
                }}
              >
                {drawer}
              </Drawer>
            </Box>
          </Box>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Header;
