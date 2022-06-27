import {Selector} from "webdriverio";

export type Selectors = Selector | AppLocator


// customize app locator
export type AppLocator = {
    [key: string]: UISelector | Xpath
}

export type Xpath = {
    [key: string]: string
}



export type By  ={
    (s: {UISelector?: string,
     // use id locate <advice>
     accessibilityId?: string,
     resourceId?: string,
     // use attribute locate <advice>
     text?: string,
     className?: string,
     isClickable?: boolean,
     isDisplay?:boolean,
     // fuzzy locate
     index?: number,
     firstParent?: boolean,
     firstChild?: boolean,
     }): UISelector
}

let appBy: By = (...args) => {
    console.log(args);
    return new UISelector();
    // return parseUiSelector({})
}
appBy({accessibilityId: "accessibility", UISelector: "uiSelector"});


class UISelector{

}


let a: AppLocator ={
    // inputElement: By
}



/**
 * @see https://developer.android.com/reference/androidx/test/uiautomator/UiSelector
 * @param s
 */
function parseUiSelector(s: UISelector) {
    let flag: string = 'android=';
    let selector: string = 'new UiSelector()';
    for (let entry of Object.entries(s)) {
        if (entry[0] === 'UISelector'){
            selector = entry[1] as string;
            // log.info('selector = ', selector);
            break;
        }
        if (entry[0] === 'firstParent' || entry[0] === 'firstChild' || entry[0] === 'lastChild'){
            //
        }else{
            // className, index
            selector += `.${entry[0]}("${entry[1]}")`
        }
    }

}

