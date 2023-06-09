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
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from "@mui/icons-material/Business";
import useHeaderFooter from "./Hooks/useHeader.jsx";
import { useNavigate } from "react-router-dom";
import ReviewsIcon from "@mui/icons-material/Reviews";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import Person2Icon from "@mui/icons-material/Person2";
import logo from "../../Assets/Logos/logo.svg";
import "./Header.scss";
import SearchIcon from '@mui/icons-material/Search';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { FaUserAlt } from "react-icons/fa";
import { useAppDispatch } from "../../Redux/Store/Store.jsx";
import { isSearchedData } from "../../Redux/Reducers/SearchGstNumReducer.jsx";


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
    width: "240px"
  }
};

const Header = (props) => {
  const isVisibleHeader = useHeaderFooter();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const takeUserInfo = localStorage.getItem("userInfo");
  const getUserInfo = JSON.parse(takeUserInfo);
  const userName = getUserInfo?.userInfo?.data?.fName;

  const logoutHandler = () => {
    localStorage.clear();
    navigate("/");
  }

  let navItems = [];
  if (JSON.parse(localStorage.getItem('userInfo')) !== null) {
    if (getUserInfo?.userInfo?.data?.email !== undefined && getUserInfo !== null) {
      navItems = [
        "Home",
        "My Reviews",
        "My Business",
        "Our Business",
        userName
      ]
    }
  }
  else if (JSON.parse(localStorage.getItem('userInfo')) === null) {
    navItems = [
      "Home",
      "Log In"
    ]
  }
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const NavigationHome = () =>{
    localStorage.setItem("isSearched", false)
    navigate("/")
  }

  const handleRoute = (getVal) => {
    if (getVal === "Home") {
      navigate("/");
    } else if (getVal === "Business") {
      navigate("/business-result");
    } else if (getVal === "Log Out") {
      localStorage.clear();
      navigate("/");
      window.location.reload();
    } else if (getVal === "Log In") {
      navigate("/login");
    } else if (getVal === "My Reviews") {
      navigate("/my-reviews");
    } else if (getVal === "My Business") {
      navigate("/my-business");
    }
    //   else if (getVal === "Our Business") {
    //     navigate("/our-business");
    // } 
    else if (getVal === "User Profile") {
      navigate("/user-profile");
    }
  };
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <List>
        {navItems?.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton
              sx={{
                "&: hover": {
                  backgroundColor: colorConfigs.sidebar.hoverBg
                },
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
                ) : item === "Our Business" ? (
                  <>
                    <BusinessCenterIcon />
                    <ListItemText primary={item} className="ml-3" />
                  </>
                ) : (null)
                }
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding className="m-0 p-0">
          <ListItemButton
            sx={{
              "&: hover": {
                backgroundColor: colorConfigs.sidebar.hoverBg
              },
              backgroundColor: "unset",
              paddingX: "24px"
            }}
          >
            <ListItemIcon
              sx={{
                color: colorConfigs.sidebar.color
              }}
              className="d-block m-0 p-0"
            >
              <div className="d-flex pb-2" onClick={() => navigate('/user-profile')}>
                <Person2Icon />
                <ListItemText primary={'My Profile'} className="ml-3" />
              </div>
              <div className="d-flex pb-2" onClick={() => navigate('/change-password')}>
                <LockOpenIcon />
                <ListItemText primary={'Change Password'} className="ml-3" />
              </div>
              <div className="d-flex" onClick={logoutHandler}>
                <LogoutIcon />
                <ListItemText primary={'Logout'} className="ml-3" />
              </div>
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;
  return (
    <>
      <div className="header-container">
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar component="nav">
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                sx={{ mr: 2, display: { sm: "none" } }}
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
                <div className="d-flex h-100 justify-content-center">
                  <div className="logo-backgroung-sm" ></div>
                  <div className="logo-container" >
                    <img src={logo} className="logo" alt="logo" onClick={() => navigate('/')}/>
                  </div>
                </div>
              </IconButton>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
              >
                <div className="logo-backgroung" ></div>
                <div className="logo-container" >
                  <img src={logo} className="logo" alt="logo" onClick={NavigationHome} style={{cursor:"pointer"}}/>
                </div>
              </Typography>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                {navItems?.map((item) => (
                  <button
                    className={`btn-navigation  ${userName == item ? 'show-dropdown' : 'px-0'}`}
                    key={item}
                    sx={{ color: "#fff" }}
                    onClick={(event) => {
                      handleRoute(item);
                    }}
                  >
                    {item === userName ? (
                      <p className="m-0 d-flex"><FaUserAlt className="header-user-icon mr-2" /><span>{item}</span></p>
                    ) : (item)}
                    <div className="dropdown">
                      <ul className="dropdown-content">
                        <li className="dropdown-item px-3 py-1" onClick={() => navigate('/user-profile')}>
                          My Profile
                        </li>
                        <li className="dropdown-item px-3 py-1" onClick={() => navigate('/change-password')}>
                          Change Password
                        </li>
                        <li className="dropdown-item px-3 py-1" onClick={logoutHandler}>
                          Logout
                        </li>
                      </ul>
                    </div>
                  </button>
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
                keepMounted: true
              }}
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
      </div>

    </>
  );
};

export default Header;
