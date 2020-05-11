let _tags: Array<string>;
export const setTags = (tags: Array<string>): void => {
    _tags = tags;
};
export const getTags = (): Array<string> => _tags;