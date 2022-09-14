import React, { useState, useEffect } from 'react';
import Header from '@module/header';
import StickyCart from '@module/stickyCart';
import PdpModal from '@module/pdpModal/pdpModal';
import { useSelector } from 'react-redux';
import Footer from '@module/footer';
import { useRouter } from 'next/router';
import ServicePdpModal from '@module/servicePdpModal';
import SliderDialog from '@module/sliderDialog';
import SearchPage from '@template/search';
import { PRODUCT } from '@constant/types';

type Props = {
  children: React.ReactNode;
};

const Default = ({ children }: Props) => {
  const router = useRouter();
  const state = useSelector(state => state);
  const [showFooter, setShowFooter] = useState(false);
  const { configData } = useSelector(state => state.store ? state.store.storeData : null);

  useEffect(() => {
    const currentRouteSTring = ('pagepath' in router.query) ? router.query.pagepath[0] : '';
    setShowFooter((!currentRouteSTring || currentRouteSTring == 'home' || currentRouteSTring == 'orderconfirmation' || currentRouteSTring == 'profile' || currentRouteSTring == 'privacy' || currentRouteSTring == 'terms' || currentRouteSTring == 'myorders' || currentRouteSTring == 'checkout'));
  }, [router])

  useEffect(() => {
    //set font style
    const currentFont = configData?.storeConfig?.sparkConfig?.fontStyle || "poppins";
    document.body.dataset.font = currentFont;
    document.documentElement.style.setProperty('--primary-font', currentFont, 'important');
  }, [configData])

  return (
    <div className="default clearfix" id="default-wrapper">
      <SliderDialog />
      <Header />
      {state.isItemSearchActive && <SearchPage />}
      <PdpModal />
      <ServicePdpModal />
      <div className="content clearfix default-wrapper">{children}</div>
      <StickyCart />
      {showFooter && <Footer />}
    </div>
  )
};

export default Default;
