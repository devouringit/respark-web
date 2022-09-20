import Head from "next/head";
import { DEFAULT_TITLE_METATAG, DEFAULT_DESCRIPTION_METATAG, DEFAULT_IMAGE_METATAG, DEFAULT_SITENAME_METATAG, DEFAULT_KEYWORD_METATAG } from "@constant/defaultValues";
import { windowRef } from "@util/window";
export default function HeadMetaTags({ title, description, image, siteName, storeData }) {
  if (!storeData) storeData = {};
  const titleTagData = title || DEFAULT_TITLE_METATAG;
  const descriptionTagData = description || DEFAULT_DESCRIPTION_METATAG;
  const imageTagData = image || DEFAULT_IMAGE_METATAG;
  const siteNameTagData = siteName || DEFAULT_SITENAME_METATAG;
  const keywordsTagData = descriptionTagData + ' ' + DEFAULT_KEYWORD_METATAG;
  let manifestString: any = '';
  if (storeData?.configData?.storeConfig?.manifestConfig) {
    const theme_color = '';
    const manifestConfig = storeData.configData.storeConfig.manifestConfig;
    manifestString = JSON.stringify({
      ...{
        "name": `${storeData.tenant}, ${storeData.name}` || 'Respark',
        "short_name": `${storeData.tenant}` || 'Respark',
        "start_url": storeData.host.includes('localhost') ? `http://${storeData.host}` : `https://${storeData.host}` || '/',
        // "start_url": window.location.origin,
        "display": "standalone",
        "background_color": theme_color || "#dee1ec",
        "theme_color": theme_color || "#dee1ec",
        "orientation": "portrait",
        "description": storeData.description,
        "id": storeData.tenantId,
        "icons": [
          {
            "src": manifestConfig.icons['180'],
            "type": "image/png",
            "sizes": "180x180"
          },
          {
            "src": manifestConfig.icons['192'],
            "type": "image/png",
            "sizes": "192x192"
          },
          {
            "src": manifestConfig.icons['384'],
            "type": "image/png",
            "sizes": "384x384"
          },
          {
            "src": manifestConfig.icons['512'],
            "type": "image/png",
            "sizes": "512x512"
          },
          {
            "src": manifestConfig.icons['1024'],
            "type": "image/png",
            "sizes": "1024x1024"
          }
        ],
        "related_applications": [{
          "platform": "webapp",
          "url": storeData.host.includes('localhost') ? `http://${storeData.host}/manifest.json` : `https://${storeData.host}/manifest.json`
        }]
      },
    });
    // console.log(manifestString)
  }
  // const manifestElement = document.getElementById("manifest");
  // manifestElement?.setAttribute("href", "data:application/json;charset=utf-8," + encodeURIComponent(manifestString));

  return (
    <Head>
      <link rel="manifest" id="manifest" href={`data:application/json;charset=utf-8,${encodeURIComponent(manifestString)}`} />

      {/* Coomon meta tags */}
      <title>{titleTagData}</title>
      <meta name="title" key="title" content={titleTagData} />
      <meta name="description" key="description" content={descriptionTagData} />
      <meta name="keywords" key="keywords" content={keywordsTagData}
      />

      <meta name="application-name" content="Respark" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Respark" />
      <meta name="description" content="Best Respark in the world" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />

      {/* FB meta Tags */}
      {/* <meta property="og:url" content='www.devourin.com' key="ogurl" /> */}
      <meta property="og:site_name" content={siteNameTagData} key="ogsitename" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={titleTagData} key="ogtitle" />
      <meta property="og:description" content={descriptionTagData} key="ogdesc" />
      <meta property="og:image" content={imageTagData} key="ogimage" />

      {/* Twitter meta Tags */}
      <meta name="twitter:title" content={titleTagData} key="twittertitle" />
      <meta name="twitter:description" content={descriptionTagData} key="twitterdesc" />
      <meta name="twitter:image" content={imageTagData} key="twitterimage" />
      <meta name="twitter:site" content="Devourin Salon" key="twittersitename" />
      <meta name="twitter:creator" content="Devourin" />
      {/* application meta tags */}

      {/* <!-- apple splash screen images --> */}

      <link rel="apple-touch-startup-image" media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="splash_screens/12.9__iPad_Pro_landscape.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="splash_screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="splash_screens/10.9__iPad_Air_landscape.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="splash_screens/10.5__iPad_Air_landscape.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="splash_screens/10.2__iPad_landscape.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="splash_screens/iPhone_14_Pro_Max_landscape.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="splash_screens/iPhone_14_Pro_landscape.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="splash_screens/iPhone_11__iPhone_XR_landscape.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="splash_screens/12.9__iPad_Pro_portrait.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="splash_screens/10.9__iPad_Air_portrait.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="splash_screens/10.5__iPad_Air_portrait.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="splash_screens/10.2__iPad_portrait.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="splash_screens/iPhone_14_Pro_Max_portrait.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="splash_screens/iPhone_14_Pro_portrait.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="splash_screens/iPhone_11__iPhone_XR_portrait.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png" />
      {/* <meta name="viewport" content="width=device-width,initial-scale=1" /> */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      <meta name="robots" content="index, follow" />
      <link rel="shortcut icon" type="image/png" href="/favicon.ico" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    </Head>
  );
}
