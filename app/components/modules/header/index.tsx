import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DehazeIcon from '@material-ui/icons/Dehaze';
import UserRegistrationModal from "@module/userRegistration";
import { useDispatch, connect } from 'react-redux';
import Link from "next/link";
import { showSuccess, updatePdpItem, updateSearchStatus } from "app/redux/actions";
import { useSelector } from 'react-redux';
import { windowRef } from "@util/window";
import { useCookies } from "react-cookie";
import { updateUserData } from "@context/actions/user";
import { useRouter } from 'next/router';
import ConfirmationModal from "@module/confirmationModal";
import { GENERIC_IMAGE_APP_KEY } from "@constant/common";
import CloseIcon from '@material-ui/icons/CloseOutlined';
import { getGenericImages, hex2rgb } from "@util/utils";
import Router from 'next/router';
import { googleLogout } from "@react-oauth/google";

const useStyles = makeStyles({
  list: {
    width: '100%',
  },
  fullList: {
    width: "auto",
  },
});

function IoIosArrowBack(props) {
  return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 512 512" height="1em" width="1em" {...props}><path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z" /></svg>;
}

function MainHeader({ storeData, storeMetaData }) {
  const [cookie, setCookie] = useCookies()
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  const dispatch = useDispatch();
  const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);
  const pdpItem = useSelector(state => state.pdpItem);
  const router = useRouter();
  const { configData } = useSelector(state => state.store ? state.store.storeData : null);
  const [showUserRegModalOnFirstLoad, setShowUserRegModalOnFirstLoad] = useState(configData?.storeConfig?.sparkConfig?.userConfig?.userRegPopupReq);
  const [openUserRegistrationModalOnBtnClick, setOpenUserRegistrationModalOnBtnClick] = useState(true);
  const [userData, setUserData] = useState(cookie['user']);
  const [showlogoutPopup, setShowLogoutPopup] = useState(false);
  const cartItems = useSelector(state => state.order.orderItems);
  const [cartItemQuantity, setCartItemQuantity] = useState(0);
  const genericImages = useSelector(state => state.genericImages);
  const [currentPageName, setCurrentPageName] = useState('');

  Router.events.on('routeChangeComplete', () => {
    if (pdpItem) {
      document.body.classList.remove("o-h")
      dispatch(updatePdpItem(null));//remove pdp from ui after back button press transition done
      console.log('routeChangeComplete')
    }
  });

  useEffect(() => {
    if (openDrawer) document.body.classList.add("o-h")
    else document.body.classList.remove("o-h")
  }, [openDrawer])


  const toggleDrawer = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenDrawer(openDrawer ? false : true);
  };


  function BiHomeSmile(props) {
    return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" {...props}><path d="M3,13h1v2v5c0,1.103,0.897,2,2,2h12c1.103,0,2-0.897,2-2v-5v-2h1c0.404,0,0.77-0.244,0.924-0.617 c0.155-0.374,0.069-0.804-0.217-1.09l-9-9c-0.391-0.391-1.023-0.391-1.414,0l-9,9c-0.286,0.286-0.372,0.716-0.217,1.09 C2.23,12.756,2.596,13,3,13z M12,4.414l6,6V15l0,0l0.001,5H6v-5v-3v-1.586L12,4.414z" /><path d="M12,18c3.703,0,4.901-3.539,4.95-3.689l-1.9-0.621C15.042,13.713,14.269,16,12,16c-2.238,0-3.02-2.221-3.051-2.316 L7.05,14.311C7.099,14.461,8.297,18,12,18z" /></svg>;
  }

  function FaTasks(props) {
    return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 600 600" height="1em" width="1em" {...props}><path d="M139.61 35.5a12 12 0 0 0-17 0L58.93 98.81l-22.7-22.12a12 12 0 0 0-17 0L3.53 92.41a12 12 0 0 0 0 17l47.59 47.4a12.78 12.78 0 0 0 17.61 0l15.59-15.62L156.52 69a12.09 12.09 0 0 0 .09-17zm0 159.19a12 12 0 0 0-17 0l-63.68 63.72-22.7-22.1a12 12 0 0 0-17 0L3.53 252a12 12 0 0 0 0 17L51 316.5a12.77 12.77 0 0 0 17.6 0l15.7-15.69 72.2-72.22a12 12 0 0 0 .09-16.9zM64 368c-26.49 0-48.59 21.5-48.59 48S37.53 464 64 464a48 48 0 0 0 0-96zm432 16H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z" /></svg>;
  }

  function BsPerson(props) {
    return <svg stroke="currentColor" fill="currentColor" strokeWidth={0.4} viewBox="0 0 16 16" height="1em" width="1em" {...props}><path fillRule="evenodd" d="M13 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM3.022 13h9.956a.274.274 0 00.014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 00.022.004zm9.974.056v-.002.002zM8 7a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0z" clipRule="evenodd" /></svg>;
  }

  function BiTask(props) {
    return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" {...props}><path d="M5,22h14c1.103,0,2-0.897,2-2V5c0-1.103-0.897-2-2-2h-2c0-0.553-0.447-1-1-1H8C7.447,2,7,2.447,7,3H5C3.897,3,3,3.897,3,5 v15C3,21.103,3.897,22,5,22z M5,5h2v2h10V5h2v15H5V5z" /><path d="M11 13.586L9.207 11.793 7.793 13.207 11 16.414 16.207 11.207 14.793 9.793z" /></svg>;
  }

  // function BiListCheck(props) {
  //   return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" {...props}><path strokeWidth={2} d="M12,20 L24,20 M12,12 L24,12 M12,4 L24,4 M1,19 L4,22 L9,17 M1,11 L4,14 L9,9 M9,1 L4,6 L1,3" /></svg>;
  // }

  function BiListCheck(props) {
    return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 19 19" height="1em" width="1em" {...props}><path d="M4 7H15V9H4zM4 11H15V13H4zM4 15H11V17H4zM19.299 12.292L14.999 16.583 13.707 15.292 12.293 16.707 14.999 19.411 20.711 13.708z" /></svg>;
  }

  function GoLocation(props) {
    return <svg stroke="currentColor" fill="currentColor" strokeWidth={0.4} viewBox="0 0 12 16" height="1em" width="1em" {...props}><path d="M6 0C2.69 0 0 2.5 0 5.5 0 10.02 6 16 6 16s6-5.98 6-10.5C12 2.5 9.31 0 6 0zm0 14.55C4.14 12.52 1 8.44 1 5.5 1 3.02 3.25 1 6 1c1.34 0 2.61.48 3.56 1.36.92.86 1.44 1.97 1.44 3.14 0 2.94-3.14 7.02-5 9.05zM8 5.5c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z" /></svg>;
  }

  function GrLogout(props) {
    return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" {...props}><path fill="none" strokeWidth={2} d="M13,9 L13,2 L1,2 L1,22 L13,22 L13,15 M22,12 L5,12 M17,7 L22,12 L17,17" /></svg>;
  }

  const list = (anchor) => {
    const NAV_LIST = [
      {
        title: 'Home',
        route: 'home',
        icon: <BiHomeSmile />,
        isVisible: true
      },
      {
        title: 'Order History',
        route: 'myorders',
        icon: <FaTasks />,
        isVisible: userData ? true : false
      },
      {
        title: 'Profile',
        route: 'profile',
        icon: <BsPerson />,
        isVisible: userData ? true : false
      },
      {
        title: 'Privacy Policy',
        route: 'privacy',
        icon: <BiTask />,
        isVisible: true
      },
      {
        title: 'Terms & conditions',
        route: 'terms',
        icon: <BiListCheck />,
        isVisible: true
      }, {
        title: 'Store Locator',
        route: 'store-locator',
        icon: <GoLocation />,
        isVisible: configData.showStoreLocator || false
      }
    ];
    return (<div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      onClick={(e) => toggleDrawer(e)}
      onKeyDown={(e) => toggleDrawer(e)}
    >
      <List>
        {NAV_LIST.map((navItem, index) => (
          <React.Fragment key={Math.random()}>
            {navItem.isVisible && <Link href={baseRouteUrl + navItem.route} shallow={true}>
              <ListItem button key={Math.random()} className="nav-wrap">
                <ListItemIcon className="nav-icon">
                  {navItem.icon}
                </ListItemIcon>
                <ListItemText className="nav-text" primary={navItem.title} />
              </ListItem>
            </Link>}
          </React.Fragment>
        ))}
      </List>
      {(userData ? true : false) &&
        <ListItem button onClick={() => setShowLogoutPopup(true)} className="nav-wrap">
          <ListItemIcon className="nav-icon">
            <GrLogout />
          </ListItemIcon>
          <ListItemText className="nav-text" primary="Logout" />
        </ListItem>}
    </div >)

  }

  useEffect(() => {
    if (baseRouteUrl && windowRef && windowRef().location) {
      const manifestElement = document.getElementById("manifest");
      const manifestString = JSON.stringify({
        ...{
          "display": "standalone",
          "background_color": "#ff0185",
          "theme_color": "#ff0185",
          "orientation": "portrait-primary",
          "icons": [
            {
              "src": `${windowRef().location.origin}/android-icon-36x36.png`,
              "sizes": "36x36",
              "type": "image\/png",
              "density": "0.75"
            },
            {
              "src": `${windowRef().location.origin}/android-icon-48x48.png`,
              "sizes": "48x48",
              "type": "image\/png",
              "density": "1.0"
            },
            {
              "src": `${windowRef().location.origin}/android-icon-72x72.png`,
              "sizes": "72x72",
              "type": "image\/png",
              "density": "1.5"
            },
            {
              "src": `${windowRef().location.origin}/android-icon-96x96.png`,
              "sizes": "96x96",
              "type": "image\/png",
              "density": "2.0"
            },
            {
              "src": `${windowRef().location.origin}/android-icon-144x144.png`,
              "sizes": "144x144",
              "type": "image\/png",
              "density": "3.0"
            },
            {
              "src": `${windowRef().location.origin}/android-icon-192x192.png`,
              "sizes": "192x192",
              "type": "image\/png",
              "density": "4.0"
            }, {
              "src": `${windowRef().location.origin}/apple-icon-60x60.png`,
              "sizes": "60x60",
              "type": "image\/png",
              "density": "2.0"
            },
            {
              "src": `${windowRef().location.origin}/apple-icon-57x57.png`,
              "sizes": "57x57",
              "type": "image\/png",
              "density": "3.0"
            },
            {
              "src": `${windowRef().location.origin}/apple-icon-72x72.png`,
              "sizes": "72x72",
              "type": "image\/png",
              "density": "4.0"
            }, {
              "src": `${windowRef().location.origin}/apple-icon-76x76.png`,
              "sizes": "76x76",
              "type": "image\/png",
              "density": "2.0"
            },
            {
              "src": `${windowRef().location.origin}/apple-icon-114x114.png`,
              "sizes": "114x114",
              "type": "image\/png",
              "density": "3.0"
            },
            {
              "src": `${windowRef().location.origin}/apple-icon-152x152.png`,
              "sizes": "152x152",
              "type": "image\/png",
              "density": "4.0"
            }, {
              "src": `${windowRef().location.origin}/favicon-16x16.png`,
              "sizes": "16x16",
              "type": "image\/png",
              "density": "2.0"
            },
            {
              "src": `${windowRef().location.origin}/favicon-32x32.png`,
              "sizes": "32x32",
              "type": "image\/png",
              "density": "3.0"
            },
            {
              "src": `${windowRef().location.origin}/favicon-96x96.png`,
              "sizes": "96x96",
              "type": "image\/png",
              "density": "4.0"
            }
          ]
        },
        short_name: configData.tenant || 'Respark',
        name: configData.store || 'Respark',
        start_url: `${baseRouteUrl}`,
      });

      manifestElement?.setAttribute(
        "href",
        "data:application/json;charset=utf-8," + encodeURIComponent(manifestString),
      );
    }
  }, [baseRouteUrl, windowRef]);

  useEffect(() => {
    if (cookie['grp']) {
      document.body.dataset.theme = cookie['grp'];
    }
  }, [])

  useEffect(() => {
    if (cookie['user']) {
      setUserData(cookie['user'])
    }
  }, [cookie])

  useEffect(() => {
    let currentRouteSTring = ('pagepath' in router.query) ? router.query.pagepath[0] : '';
    if (currentRouteSTring.includes('grp')) currentRouteSTring = 'home';
    if (!currentRouteSTring || currentRouteSTring == 'home' || currentRouteSTring == 'orderconfirmation' || currentRouteSTring == 'profile' || currentRouteSTring == 'privacy' || currentRouteSTring == 'terms' || currentRouteSTring == 'myorders' || currentRouteSTring == 'checkout') {
      setCurrentPageName(currentRouteSTring)
    } else setCurrentPageName('categories')
  }, [router])


  useEffect(() => {
    if (cartItems && cartItems.length && windowRef) {
      let qty = 0;
      cartItems.map((cartItem) => qty += cartItem.quantity)
      if (cartItemQuantity != qty) {
        setCartItemQuantity(qty);
        let element = document.getElementById('cart-item-count')
        if (element) {
          element.classList.add("shake")
          setTimeout(() => {
            element.classList.remove("shake")
          }, 1000);
        }
      }
    }
  }, [cartItems])

  useEffect(() => {
    //set app bg when gender change (so genericImages changes)
    let defaultWrapper = document.getElementById('default-wrapper');
    defaultWrapper && (defaultWrapper.style.backgroundImage = `url(/assets/${genericImages[GENERIC_IMAGE_APP_KEY]})`)
  }, [genericImages])

  const onLoginClose = (user) => {
    setUserData(user);
    setOpenUserRegistrationModalOnBtnClick(false);
    setShowUserRegModalOnFirstLoad(false);
    (user && openUserRegistrationModalOnBtnClick) && dispatch(showSuccess('Login successfully'))
  }

  const handleLogoutModalResponse = (status) => {
    if (status) {
      setCookie("user", {}, { //user registration fields
        path: "/",
        expires: new Date(new Date().setSeconds(1)),
        sameSite: true,
      })
      setUserData(null);
      dispatch(updateUserData(null));
      dispatch(showSuccess('Logout successfully'));
      googleLogout();
      router.push({ pathname: baseRouteUrl + 'home' }, '', { shallow: true });
    }
    setShowLogoutPopup(false);
  }

  const openSearchPage = () => {
    dispatch(updateSearchStatus(true));
  }

  return (
    <>
      <div className="mainheaderblock">
        {currentPageName != 'categories' ? <div className="logo">
          <Link href={baseRouteUrl + 'home'} shallow={true}>
            <img
              src={storeMetaData ? storeMetaData.logoPath : 'https://devourin.com/images/logo2.png'}
              title="logo"
              alt="logo"
            />
          </Link>
        </div> : <div onClick={() => router.push({ pathname: baseRouteUrl + 'home' }, '', { shallow: true })} className="logo back-navigation">
          <IoIosArrowBack />
        </div>}

        <div className="header-nav-wrap">
          <div className="icon-wrap">
            <img onClick={openSearchPage} src="/assets/Icons/search_icon.png" />
          </div>
          {(configData?.orderingOn && !configData?.storeOff && !configData?.readOnlyMenu) && <div className="icon-wrap cart-icon">
            {cartItems && cartItems.length != 0 && <div className="cart-item-count" id="cart-item-count">{cartItemQuantity}</div>}
            <img onClick={() => router.push({ pathname: baseRouteUrl + 'cart' }, '', { shallow: true })} src="/assets/Icons/cart_icon.png" />
          </div>}
          <div className="icon-wrap">
            <a href={`tel:+91 ${storeMetaData.phone1}`}>
              <img className="callimg" src="/assets/Icons/call_icon.png" />
            </a>
          </div>
          <div className="hamburger icon-wrap" onClick={(e) => toggleDrawer(e)}>
            <img src="/assets/Icons/hamburger_icon.png" />
          </div>
        </div>

        <Drawer className="hamburger-drawer" anchor={"right"} open={openDrawer} onClose={(e) => toggleDrawer(e)}>
          <div className="drawer-wrap">
            <div className="drawclose" onClick={(e) => toggleDrawer(e)}>
              <CloseIcon />
            </div>
            <div className="drawgraphic">
              <div className="drawer-display-img">
                <img src={`/assets/${genericImages?.hamburgerBg}`} />
              </div>
            </div>
            <div className="user-details">
              {userData ? <>
                <div className="name">{userData.firstName}</div>
                <div className="number">{userData ? userData.mobileNo : ''}</div>
              </> :
                <div onClick={() => {
                  setOpenUserRegistrationModalOnBtnClick(true);
                  setOpenDrawer(false);
                }}
                  className="name d-f-c">
                  <div className="login-btn">Sign up/Log in</div>
                </div>}
            </div>
            <div className="drawmenu">
              {list("right")}
            </div>
          </div>
        </Drawer>
      </div >
      <UserRegistrationModal
        fromPage={showUserRegModalOnFirstLoad ? "INITIAL_LOAD" : ((openUserRegistrationModalOnBtnClick || showUserRegModalOnFirstLoad) && !userData?.mobileNo && (windowRef && !pdpItem) ? 'HOME' : '')}
        handleResponse={(e) => onLoginClose(e)}
        isApppGrpChangeOnUserGdrChange={showUserRegModalOnFirstLoad ? true : false}
        open={(openUserRegistrationModalOnBtnClick || showUserRegModalOnFirstLoad) && !userData?.mobileNo && (windowRef && !pdpItem)}
        heading={showUserRegModalOnFirstLoad ? (configData?.storeConfig?.sparkConfig?.userConfig?.popupHeading || 'We will use your information to send offers and promotions') : 'Thank you for get back, lets access the best recommendation for you.'} />

      <ConfirmationModal
        openModal={showlogoutPopup}
        title={'Logout confirmation'}
        message={'Are you sure you want to logout?'}
        buttonText={'No'}
        secondaryButtonText={'Yes'}
        handleClose={(status) => handleLogoutModalResponse(status)}
      />
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    storeData: state?.store?.storeData,
    storeMetaData: state?.store?.storeMetaData
  }
}

export default connect(mapStateToProps)(MainHeader);
