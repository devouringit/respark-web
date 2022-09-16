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
        "start_url": storeData.url || '/',
        "display": "standalone",
        "background_color": theme_color || "#dee1ec",
        "theme_color": theme_color || "#dee1ec",
        "orientation": "standalone",
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
        ]
      },
    });
    console.log(manifestString)
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

      {/* <meta name="viewport" content="width=device-width,initial-scale=1" /> */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      <meta name="robots" content="index, follow" />
      <link rel="shortcut icon" type="image/png" href="/favicon.ico" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    </Head>
  );
}
