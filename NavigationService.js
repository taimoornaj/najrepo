import { NavigationActions } from '@react-navigation/native';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {

    NavigationActions.navigate({
      routeName,
      params,
    })

}

export default {
  navigate,
  setTopLevelNavigator,
};