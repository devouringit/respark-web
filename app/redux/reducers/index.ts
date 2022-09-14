import { combineReducers } from 'redux';
import { loader, activeGroup, currentPage, pdpItem, pdpItemStatus, isItemSearchActive, serverError, genericImages, whatsappTemplates } from '@reducer/common';
import { store } from '@reducer/store';
import { alert } from '@reducer/alert';
import { user } from '@reducer/user';
import { order } from '@reducer/order';
import { appointment } from '@reducer/appointment';

const rootReducer = combineReducers({
  store,
  activeGroup,
  loader,
  alert,
  currentPage,
  pdpItem,
  pdpItemStatus,
  isItemSearchActive,
  user,
  order,
  appointment,
  serverError,
  genericImages,
  whatsappTemplates
});

export default rootReducer;
