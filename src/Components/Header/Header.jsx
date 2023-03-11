import * as React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import {
  List,
  ListItem,
  colors,
  ListItemButton,
  ListItemIcon,
  Button,
  Typography,
  Toolbar,
  ListItemText,
  IconButton,
  Drawer,
  Divider,
  CssBaseline,
  Box,
  AppBar
} from "@mui/material";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import BusinessIcon from "@mui/icons-material/Business";
import useHeaderFooter from "./Hooks/useHeader.jsx";
import { useNavigate } from "react-router-dom";
import ReviewsIcon from "@mui/icons-material/Reviews";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import Person2Icon from "@mui/icons-material/Person2";
// import logo from "../../Assets/Images/logo192.png";
import "./Header.scss";

// const drawerWidth = 240;

const colorConfigs = {
  sidebar: {
    bg: "#233044",
    color: "#eeeeee",
    hoverBg: "#1e293a",
    activeBg: "#1e253a"
  },
  topbar: {
    bg: "#fff",
    color: "#000"
  },
  mainBg: colors.grey["100"]
};
const sizeConfigs = {
  sidebar: {
    // width: "300px"
    width: "240px"
  }
};

const Header = (props) => {
  const isVisibleHeader = useHeaderFooter();
  const navigate = useNavigate();

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const takeUserInfo = localStorage.getItem("userInfo");
  const getUserInfo = JSON.parse(takeUserInfo);

  const navItems =
    getUserInfo !== undefined && getUserInfo !== null
      ? [
          "Home",
          "Business",
          "My Reviews",
          "My Business",
          "User Profile",
          "Log Out"
        ]
      : ["Home", "Business", "Log In"];

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleRoute = (getVal) => {
    if (getVal === "Home") {
      // navigate("/search-gst-number");
      navigate("/");
    } else if (getVal === "Business") {
      navigate("/business-result");
    } else if (getVal === "Log Out") {
      localStorage.clear();
      navigate("/");
    } else if (getVal === "Log In") {
      navigate("/login");
    } else if (getVal === "My Reviews") {
      navigate("/my-reviews");
    } else if (getVal === "My Business") {
      navigate("/my-business");
    } else if (getVal === "User Profile") {
      navigate("/user-profile");
    }
  };

  let appState = false;
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
              sx={{
                "&: hover": {
                  backgroundColor: colorConfigs.sidebar.hoverBg
                },
                backgroundColor:
                  appState === item.state
                    ? colorConfigs.sidebar.activeBg
                    : "unset",
                paddingY: "12px",
                paddingX: "24px"
              }}
              onClick={() => handleRoute(item)}
            >
              <ListItemIcon
                sx={{
                  color: colorConfigs.sidebar.color
                }}
                className="d-flex align-items-center justify-content-center"
              >
                {item === "Home" ? (
                  <>
                    <AppsOutlinedIcon />
                    <ListItemText primary={item} className="ml-3" />
                  </>
                ) : item === "Business" ? (
                  <>
                    <BusinessIcon />
                    <ListItemText primary={item} className="ml-3" />
                  </>
                ) : item === "My Reviews" ? (
                  <>
                    <ReviewsIcon />
                    <ListItemText primary={item} className="ml-3" />
                  </>
                ) : item === "My Business" ? (
                  <>
                    <BusinessCenterIcon />
                    <ListItemText primary={item} className="ml-3" />
                  </>
                ) : item === "User Profile" ? (
                  <>
                    <Person2Icon />
                    <ListItemText primary={item} className="ml-3" />
                  </>
                ) : (
                  <>
                    <LogoutIcon className="ml-1" />
                    <ListItemText primary={item} className="ml-3" />
                  </>
                )}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/* <List>
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
      </List> */}
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
                  // onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: "none" } }}
                >
                  <MenuIcon onClick={handleDrawerToggle} />
                  <div className="d-flex h-100 justify-content-center">
                    <h3 className="m-0">G S T</h3>
                    <h3 className="m-0 ml-2 text-danger"> I N </h3>
                  </div>
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
                // sx={{
                //   display: { xs: "block", sm: "none" },
                //   "& .MuiDrawer-paper": {
                //     boxSizing: "border-box",
                //     width: drawerWidth
                //   }
                // }}
                sx={{
                  width: sizeConfigs.sidebar.width,
                  flexShrink: 0,
                  "& .MuiDrawer-paper": {
                    width: sizeConfigs.sidebar.width,
                    boxSizing: "border-box",
                    borderRight: "0px",
                    backgroundColor: colorConfigs.sidebar.bg,
                    color: colorConfigs.sidebar.color
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
