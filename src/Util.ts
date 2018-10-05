export const nodeListToArray = (nodeList: NodeListOf<Element>) : HTMLElement[] => {
    return Array.prototype.slice.call(nodeList) as HTMLElement[];
}

export const tryGetValue = (element: HTMLElement): any => {
    var val = (element as any).value;
    return val;
}

export const getNumberFromAttrOrDefault = (element: HTMLElement, attrName: string, defaultValue: number): number => {
    return parseFloat(element.getAttribute(attrName) || defaultValue as any);
}

export const isNullOrEmpty = (value: any): boolean => {
    return value == null || value === "";
}
