



interface Length {
    length: number;
}
interface Length1 {
    length1: number;

}
interface Dictionary<T = any> {
    [key: string]: T;
}

type StrDict = Dictionary<string>

type DictMember<T> = T extends Dictionary<infer V> ? V : never


function identity<T extends Length>(arg: T): T {
    console.log(arg.length); // 可以获取length属性
    return arg;
}

function identity2<T extends Length, Length1>(arg: T): T {
    console.log(arg.length); // 可以获取length属性
    return arg;
}
identity2("")