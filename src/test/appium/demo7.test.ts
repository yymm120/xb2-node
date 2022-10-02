class UIScrollable {
    private a: string = "";

    constructor(selector?: string) {
        if (selector){
            this.a = selector;
        }else{
            this.a = "new UISelector()" + this.a;
        }
    }

    parse(){
        return this.a;
    }

}
class UISelector {
    private e: string = "";

    constructor(selector?: string) {
        if (selector){
            this.e = selector;
        }else{
            this.e = "new UISelector()" + this.e;
        }
    }

    parse(){
        return this.e;
    }

    private builder(key, value): UISelector{
        if (typeof value === 'string'){
            this.e = this.e + `.${key}("${value}")`;
        }else {
            this.e = this.e + `.${key}(${value})`;
        }
        return this;
    }

    text(text): UISelector {
        return this.builder("text", text);
    }

    textContains(text: string) {
        return this.builder("textContains", text);
    }

    textStartsWith(textStartsWith: string) {
        return this.builder("textStartsWith", textStartsWith);
    }

    textMatches(textMatches: string) {
        return this.builder("textMatches", textMatches);
    }

    description(description: string) {
        return this.builder("description", description);
    }


    className(className: string) {
        return this.builder("className", className);
    }


    resourceId(resourceId: string) {
        return this.builder("resourceId", resourceId);
    }

    classNameMatches(regex: string) {
        return this.builder("classNameMatches", regex);
    }

    descriptionMatches(regex: string) {
        return this.builder("descriptionMatches", regex);
    }


    descriptionStartsWith(desc: string) {
        return this.builder("descriptionStartsWith", desc);
    }

    descriptionContains(desc: string) {
        return this.builder("descriptionContains", desc);
    }

    resourceIdMatches(regex: string) {
        return this.builder("resourceIdMatches", regex);
    }

    instance(instance: number) {
        return this.builder("instance", instance);
    }

    enabled(val: boolean) {
        return this.builder("enabled", val);
    }

    focused(val: boolean) {
        return this.builder("focused", val);
    }

    focusable(val: boolean) {
        return this.builder("focusable", val);
    }

    scrollable(val: boolean) {
        return this.builder("scrollable", val);
    }

    selected(val: boolean) {
        return this.builder("selected", val);
    }

    checked(val: boolean) {
        return this.builder("checked", val);
    }

    clickable(val: boolean) {
        return this.builder("clickable", val);
    }

    checkable(val: boolean) {
        return this.builder("checkable", val);
    }

    longClickable(val: boolean) {
        return this.builder("longClickable", val);
    }

    packageName(name: string) {
        return this.builder("packageName", name);
    }

    packageNameMatches(regex: string) {
        return this.builder("packageNameMatches", regex);
    }
}


class AppSelector {
    private static location = "";

    static By = {
        xPath: (e: string) => {
            return `xpath=${e}`;
        },
        tag: (e: string) => {
            return `tag=${e}`;
        },
        name: (e: string) => {
            return `name=${e}`
        },
        uiSelector: (selector?: string) => {
            return new UISelector(selector);
        },
        id: (id) => {
            return `id=${id}`;
        },
    }
}

test("123", async () => {
    console.log(AppSelector.By.uiSelector().className("abc").instance(0).parse());
})