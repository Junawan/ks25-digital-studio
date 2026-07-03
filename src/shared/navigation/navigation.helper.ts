import { rootNavigation } from "./root-navigation";

import {

  liveAssistantNavigation,

} from "./live-assistant-navigation";

export function

getNavigation(

pathname: string

) {

  if (

    pathname.startsWith(

      "/live-assistant"

    )

  ) {

    return liveAssistantNavigation;

  }

  return rootNavigation;

}